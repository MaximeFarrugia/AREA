import { useState, useEffect } from 'react'

import request from '../../Helpers/request'

const useConfigs = () => {
  const [configs, setConfigs] = useState([])

  const refreshConfigs = async () => {
    const res = await request({
      endpoint: '/service/area/configs',
      headers: {
        authorization: localStorage.getItem('authorization') || ''
      }
    })
    setConfigs(res?.data?.configs)
  }

  useEffect(() => {
    refreshConfigs()
  }, [])

  return { configs, refreshConfigs, setConfigs }
}

export default useConfigs
