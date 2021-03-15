import { useState } from 'react'

import { Title, Areas } from './Area.module.css'

import useServices from '../../Common/Hooks/useServices'
import useConfigs from '../../Common/Hooks/useConfigs'
import Button from '../../Common/Components/Button'
import AreaModal from './AreaModal'
import Config from './Config'

const Area = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { services } = useServices()
  const { configs, refreshConfigs } = useConfigs()

  return (
    <div>
      <h1 className={Title}>Actions - Reactions</h1>
      <Button large onClick={() => setModalVisible(true)}>New AREA</Button>
      <div className={Areas}>
        {configs.map(config => (
          <Config
            key={config._id}
            config={config}
            services={services}
            onEdit={() => setModalVisible(config)}
            refreshConfigs={refreshConfigs}
          />
        ))}
      </div>
      {modalVisible && (
        <AreaModal
          onClickOutside={() => setModalVisible(false)}
          services={services}
          update={typeof modalVisible === 'boolean' ? false : modalVisible}
          refreshConfigs={refreshConfigs}
        />
      )}
    </div>
  )
}

export default Area
