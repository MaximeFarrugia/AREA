import React, { useState } from 'react'
import { parseUrl } from 'query-string'
import { Actions } from 'react-native-router-flux'
import { WebView } from 'react-native-webview'

import request from '../../../Helpers/request'

const Authorization = ({ uri: url }) => {
  const [uri, setUri] = useState(url)

  const handleChange = async (e) => {
    const backendUrl = global.backendUrl.replace(/(https?:\/\/)/, '')
    if (e.url.includes('localhost:8080')) {
      setUri(e.url.replace('localhost:8080', backendUrl))
    } else if (e.url.includes('localhost:8081')) {
      setUri('')
      const { query: { data } } = parseUrl(e.url)
      if (!data) {
        Actions.reset('home')
        return
      }

      await request({
        endpoint: '/accountProvider/auth/save',
        method: 'post',
        data: { data },
        headers: {
          authorization: global.authorization || ''
        }
      })
      Actions.reset('home')
    }
  }

  return !!uri && (
    <WebView
      source={{ uri }}
      onNavigationStateChange={handleChange}
    />
  )
}

export default Authorization
