import { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { parse } from 'query-string'

import { Title, AccountProviders } from './Settings.module.css'

import request from '../../Helpers/request'
import useAccountProviders from '../../Common/Hooks/useAccountProviders'
import AccountProviderCard from '../../Common/Components/AccountProviderCard'

const Settings = () => {
  const { accountProviders, refreshAccountProviders } = useAccountProviders()
  const { search } = useLocation()
  const { replace } = useHistory()

  useEffect(() => {
    (async () => {
      const { data } = parse(search)
      if (!data) return

      await request({
        endpoint: '/accountProvider/auth/save',
        method: 'post',
        data: { data },
        headers: {
          authorization: localStorage.getItem('authorization') || ''
        }
      })
      await refreshAccountProviders()
      replace('/settings')
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div>
      <h1 className={Title}>Account providers :</h1>
      <div className={AccountProviders}>
        {accountProviders.map((accountProvider) => (
          <AccountProviderCard
            key={accountProvider.name}
            accountProvider={accountProvider}
          />
        ))}
      </div>
    </div>
  )
}

export default Settings
