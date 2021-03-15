import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux'

import Button from '../../Common/Components/Button'
import useAccountProviders from '../../Common/Hooks/useAccountProviders'
import AccountProviderCard from '../../Common/Components/AccountProviderCard'

const Settings = () => {
  const { accountProviders, refreshAccountProviders } = useAccountProviders()

  return (
    <View style={styles.back}>
      <Text style={styles.logo}>Account providers :</Text>
      <Button
        large
        onPress={() => Actions.reset('home')}
        style={{ marginBottom: 10, marginStart: 10, marginEnd: 330}}
      >
        <Text>Home</Text>
      </Button>
      <Button
        large
        onPress={() => {
          global.authorization = ''
          Actions.reset('login')
        }}
        style={{marginTop: -45, marginStart: 100, marginEnd: 230}}
      >
        <Text>Log out</Text>
      </Button>
      <View >
        {accountProviders.map((accountProvider) => (
          <AccountProviderCard 
            key={accountProvider.name}
            accountProvider={accountProvider}
            refreshAccountProviders={refreshAccountProviders}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  back: {
    backgroundColor: '#eeeeee',
    height: '100%',
  },
  logo: {
    fontWeight:"bold",
    fontSize:30,
    color:'#444444',
    margin: 10,
  },
});

export default Settings
