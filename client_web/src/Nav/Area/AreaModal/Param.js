import { useState, useEffect } from 'react'

import { InputClass, SelectClass } from './AreaModal.module.css'

import request from '../../../Helpers/request'
import Input from '../../../Common/Components/Input'
import Select from '../../../Common/Components/Select'

import { TextContainer, Key, Value } from '../Config'

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
          authorization: localStorage.getItem('authorization') || ''
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
    <label htmlFor={`${reaction ? 're' : ''}action-param-${name}`}>
      {`${reaction ? 'Reaction' : 'Action'} param: ${name.replace(/_/g, ' ')}`}
      {!!options.length ? (
        <Select
          id={`${reaction ? 're' : ''}action-param-${name}`}
          className={SelectClass}
          value={value ? options.find(o => o.value === value) || value : null}
          options={options}
          onChange={v => onChange(v)}
        />
      ) : (
        <Input
          id={`${reaction ? 're' : ''}action-param-${name}`}
          className={InputClass}
          value={value || ''}
          onChange={({ target }) => onChange(target.value)}
          disabled={disabled}
        />
      )}
    </label>
  )
}

export default Param
