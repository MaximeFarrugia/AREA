import React, { useState } from 'react'
import Styled from 'styled-components/native'
import { View, Text, Alert } from 'react-native'

import request from '../../../Helpers/request'
import Button from '../../../Common/Components/Button'
import Param from '../AreaModal/Param'

const Wrapper = Styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  margin-bottom: 15px;
  margin-start: 15px;
  margin-end: 15px;
`

const Container = Styled.View`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`

const TextContainer = Styled.View`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
`

const ActionsContainer = Styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
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

const SIcon = Styled.View`
  width: 0;
  height: 0;
  border-left-color: transparent;
  border-left-width: 20px;
  border-right-color: transparent;
  border-right-width: 20px;
  border-top-color: #444444;
  border-top-width: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const Config = ({ config, onEdit, refreshConfigs }) => {
  const handleDelete = async () => {
    const res = await request({
      endpoint: '/service/area/delete',
      method: 'post',
      data: {
        configId: config._id,
      },
      headers: {
        authorization: global.authorization || ''
      },
      doAlert: true,
    })
    if (res) {
      refreshConfigs()
    }
  }
  
  return (
    <Wrapper>
      <Container>
        <TextContainer>
          <Key large>Service:</Key>
          <Value large>{config.action.service.name.replace(/_/g, ' ')}</Value>
        </TextContainer>
        <TextContainer>
          <Key medium>Action:</Key>
          <Value medium>{config.action.action.name.replace(/_/g, ' ')}</Value>
        </TextContainer>
        {config.action.params.map(param => (
          <Param
          key={param._id}
            mutable={false}
            data={param}
            params={config.action.params}
            value={param.value}
            />
        ))}
      </Container>
      <SIcon />
      <Container>
        <TextContainer>
          <Key large>Service:</Key>
          <Value large>{config.reaction.service.name.replace(/_/g, ' ')}</Value>
        </TextContainer>
        <TextContainer>
          <Key medium>Reaction:</Key>
          <Value medium>{config.reaction.reaction.name.replace(/_/g, ' ')}</Value>
        </TextContainer>
        {config.reaction.params.map(param => (
          <Param
          key={param._id}
          mutable={false}
          data={param}
          params={config.reaction.params}
          value={param.value}
          />
        ))}
      </Container>
      <ActionsContainer>
        <Button onPress={onEdit} style={{ marginRight: 10 }}>
          <Text>Edit</Text>
        </Button>
        <Button
          onPress={() => Alert.alert(
            'Delete AREA',
            'Are you sure ?', [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel'
              },
              {
                text: 'Delete',
                onPress: handleDelete,
              }
            ]
          )}
        >
          <Text>Delete</Text>
        </Button>
      </ActionsContainer>
    </Wrapper>
  )
}

export default Config
