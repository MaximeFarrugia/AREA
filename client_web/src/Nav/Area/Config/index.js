import { useState } from 'react'
import Styled from 'styled-components'

import {
  Wrapper as ModalWrapper,
  Title as ModalTitle,
  ButtonWrapper
} from '../AreaModal/AreaModal.module.css'

import request from '../../../Helpers/request'
import useWindowDimensions from '../../../Common/Hooks/useWindowDimensions'
import Icon from '../../../Common/Components/Icon'
import Button from '../../../Common/Components/Button'
import Modal from '../../../Common/Components/Modal'
import Param from '../AreaModal/Param'

const Wrapper = Styled.div`
  display: flex;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  align-items: ${props => props.column ? 'center' : 'flex-start'};
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;
`

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`

export const TextContainer = Styled.div`
  margin-bottom: 10px;
  display: flex;
`

export const Key = Styled.p`
  font-size: ${props => {
    if (props.large) return '20px'
    if (props.medium) return '15px'
    return '12px'
  }};
  font-weight: ${props => props.regular ? '400' : '500'};
  color: #9869c4;
  margin-right: 5px;
`

export const Value = Styled.p`
  font-size: ${props => {
    if (props.large) return '20px'
    if (props.medium) return '15px'
    return '12px'
  }};
  font-weight: ${props => props.regular ? '400' : '500'};
  color: #444444;
`

const ActionsContainer = Styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background-color: #9869c4;
  border-radius: 5px;
`

const ActionIcon = Styled(Icon)`
  font-size: 18px;
  cursor: pointer;
  margin: 5px;
  color: #ffffff;
`

const SIcon = Styled(Icon)`
  font-size: 48px;
  margin: auto 0;
`

const Config = ({ config, services, onEdit, refreshConfigs }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { width } = useWindowDimensions()

  const handleDelete = async () => {
    const res = await request({
      endpoint: '/service/area/delete',
      method: 'post',
      data: {
        configId: config._id,
      },
      headers: {
        authorization: localStorage.getItem('authorization') || ''
      },
      doAlert: true,
    })
    if (res) {
      setModalVisible(false)
      refreshConfigs()
    }
  }
  
  return (
    <Wrapper column={width <= 768}>
      <ActionsContainer>
        <ActionIcon onClick={onEdit}>edit</ActionIcon>
        <ActionIcon onClick={() => setModalVisible(true)}>delete</ActionIcon>
      </ActionsContainer>
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
      <SIcon>
        {width <= 768 ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
      </SIcon>
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
      {!!modalVisible && (
        <Modal className={ModalWrapper} onClickOutSide={() => setModalVisible(false)}>
          <h1 className={ModalTitle}>Are you sure ?</h1>
          <div className={ButtonWrapper}>
            <Button large underline onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button large redColor onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>
      )}
    </Wrapper>
  )
}

export default Config
