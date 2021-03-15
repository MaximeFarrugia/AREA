import React from 'react'
import Styled from 'styled-components/native'
import { Actions } from 'react-native-router-flux'

import request from '../../../Helpers/request'

const Container = Styled.View`
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  flex: 1 1 190px;
  margin-top: 20px;
  margin-start: 10px;
  margin-end: 10px;
`

const AccountProviderName = Styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom-color: #444444;
  border-bottom-width: 1px;
  margin-bottom: 20px;
`

const AccountProviderButton = Styled.TouchableOpacity`
  background-color: #9869c44d;
  border-radius: 5px;
  padding: 5px 10px;
  border: none;
  color: #9869c4;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
`

const AccountProviderStatus = Styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Text = Styled.Text`
  font-size: ${props => props.large ? '20px' : '16px'};
  font-weight: ${props => props.bold ? '700' : '400'};
  margin-left: ${props => props.padded ? '5px' : 0};
  color: ${props => props.color || '#444444'};
`

const AccountProviderCard = ({ accountProvider, refreshAccountProviders }) => {
  const { id, name, connected, path } = accountProvider

  const handleClick = async () => {
    if (!connected) {
      Actions.authorization({ uri: `${global.backendUrl}${path}` })
    } else {
      await request({
        endpoint: '/accountProvider/auth/disconnect',
        method: 'post',
        data: { id },
        headers: {
          authorization: global.authorization || ''
        }
      })
      await refreshAccountProviders()
    }
  }

  return (
    <Container>
      <AccountProviderName>
        <Text large>{name}</Text>
        <AccountProviderButton onPress={handleClick}>
          <Text>{connected ? 'Disconnect' : 'Connect'}</Text>
        </AccountProviderButton>
      </AccountProviderName>
      <AccountProviderStatus connected={connected}>
        <Text bold>Status :</Text>
        <Text color={connected ? '#00a6a6' : '#d90808'} padded>
          {connected ? 'connected' : 'not connected'}
        </Text>
      </AccountProviderStatus>
    </Container>
  )
}

export default AccountProviderCard
