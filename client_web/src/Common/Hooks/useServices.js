import { useState, useEffect } from 'react'

import request from '../../Helpers/request'

const useServices = () => {
  const [services, setServices] = useState([])

  const refreshServices = async () => {
    const res = await request({
      endpoint: '/service',
      headers: {
        authorization: localStorage.getItem('authorization') || ''
      }
    })
    setServices(res?.data?.services)
  }

  useEffect(() => {
    refreshServices()
  }, [])

  return { services, refreshServices, setServices }
}

export default useServices
