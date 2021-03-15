import React, { useState, useEffect } from 'react'
import Styled from 'styled-components/native'
import { View, Text, TextInput } from 'react-native'

import request from '../../../Helpers/request'
import Select from '../../../Common/Components/Select'

const TextContainer = Styled.View`
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
`

const Key = Styled.Text`
  font-size: ${props => {
    if (props.large) return '20px'
    if (props.medium) return '15px'
    return '12px'
  }};
  font-weight: ${props => props.regular ? '400' : '500'};
  color: #9869c4;
  margin-right: 5px;
`

const Value = Styled.Text`
  font-size: ${props => {
    if (props.large) return '20px'
    if (props.medium) return '15px'
    return '12px'
  }};
  font-weight: ${props => props.regular ? '400' : '500'};
  color: #444444;
`

const Param = ({
  value,
  data,
  params,
  onChange = () => {},
  reaction = false,
  mutable = true
}) => {
  const [options, setOptions] = useState([])
  const [disabled, setDisabled] = useState(false)
  const { name, getOptions } = data

  useEffect(() => {
    (async () => {
      if (!getOptions) return
      setDisabled(true)
      const queries = params.filter(p => p.value).reduce(
        (acc, current) => (
          acc + `&${current.name}=${current.value.value || current.value}`
        ),
        ''
      )
      const res = await request({
        endpoint: getOptions + queries,
        headers: {
          authorization: global.authorization || ''
        }
      })
      if (res?.data?.options?.find(o => o.value === value)) {
        onChange(res?.data?.options?.find(o => o.value === value))
      } else if (
        value
        && !res?.data?.options?.find(
          o => o.label === value.label && o.value === value.value
        )
      ) {
        onChange(null)
      }
      setOptions(res?.data?.options || [])
      setDisabled(false)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  if (!mutable) {
    return (
      <TextContainer>
        <Key>{`${name.replace(/_/g, ' ')}:`}</Key>
        <Value regular>
          {value ? options.find(o => o.value === value)?.label || value : "N/A"}
        </Value>
      </TextContainer>
    )
  }

  return (
    <View>
      <Text>
        {`${reaction ? 'Reaction' : 'Action'} param: ${name.replace(/_/g, ' ')}`}
      </Text>
      {!!options.length ? (
        <Select
          value={value ? options.find(o => o.value === value) || value : null}
          options={options}
          onChange={v => onChange(v)}
        />
      ) : (
        <TextInput
          value={value || ''}
          placeholder="Value..."
          onChangeText={v => onChange(v)}
          disabled={disabled}
        />
      )}
    </View>
  )
}

export default Param
