import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import useServices from '../../Common/Hooks/useServices'
import useConfigs from '../../Common/Hooks/useConfigs'
import Button from '../../Common/Components/Button'
import Config from './Config'
import { Actions } from 'react-native-router-flux'

const Home = () => {
  const { services } = useServices()
  const { configs, refreshConfigs } = useConfigs()

  return (
    <ScrollView>
    <View style={styles.back}>
      <Text style={styles.title}>Actions - Reactions</Text>
      <Button
        large
        onPress={() => Actions.reset('settings')}
        style={{ marginBottom: 10, marginStart: 10, marginEnd: 315}}
              >
        <Text>Settings</Text>
      </Button>
      <Button
        large
        onPress={() => Actions.reset('areaModal', { services, update: false, refreshConfigs })}
        style={{marginTop: -45, marginStart: 115, marginEnd: 198}}
      >
        <Text>New AREA</Text>
      </Button>
      <View style={styles.areas}>
        {configs.map(config => (
          <Config
            key={config._id}
            config={config}
            services={services}
            onEdit={() => Actions.reset('areaModal', { services, update: config, refreshConfigs })}
            refreshConfigs={refreshConfigs}
          />
        ))}
      </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  back: {
    height: '100%',
    backgroundColor: '#eeeeee',
  },
  title: {
    fontWeight:"bold",
    fontSize:30,
    color:'#444444',
    margin: 10,
  },
  areas: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 50,
  }
})

export default Home
