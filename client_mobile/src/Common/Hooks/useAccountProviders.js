import { useState, useEffect } from 'react'

import request from '../../Helpers/request'

const useAccountProviders = () => {
  const [accountProviders, setAccountProviders] = useState([])

  const refreshAccountProviders = async () => {
    const res = await request({
      endpoint: '/accountProvider',
      headers: {
        authorization: global.authorization || ''
      }
    })
    setAccountProviders(res?.data?.accountProviders)
  }

  useEffect(() => {
    refreshAccountProviders()
  }, [])

  return { accountProviders, refreshAccountProviders, setAccountProviders }
}

export default useAccountProviders
