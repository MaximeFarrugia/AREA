import { useState, useReducer } from 'react'

import {
  Wrapper,
  Title,
  Data,
  Actions,
  Reactions,
  SelectClass,
  ButtonWrapper,
} from './AreaModal.module.css'

import request from '../../../Helpers/request'
import Modal from '../../../Common/Components/Modal'
import Button from '../../../Common/Components/Button'
import Select from '../../../Common/Components/Select'
import Param from './Param'

const reducer = (current, { name, value }) => ({ ...current, [name]: value })

const init = ({ update = {}, services }) => {
  const { action, reaction } = update
  return {
    action: {
      service: action
        ? {
          label: action.service.name.replace(/_/g, ' '),
          value: action.service._id
        }
        : null,
      action: action
        ? {
          label: action.action.name.replace(/_/g, ' '),
          value: action.action._id
        }
        : null,
      params: action?.params || [],
    },
    reaction: {
      service: reaction
        ? {
          label: reaction.service.name.replace(/_/g, ' '),
          value: reaction.service._id
        }
        : null,
      reaction: reaction
        ? {
          label: reaction.reaction.name.replace(/_/g, ' '),
          value: reaction.reaction._id
        }
        : null,
      params: reaction?.params || [],
    },
  }
}

const AreaModal = ({
  onClickOutside,
  services,
  update = false,
  refreshConfigs,
}) => {
  const [disabled, setDisabled] = useState(false)
  const [state, dispatch] = useReducer(reducer, { update, services }, init)
  const { action, reaction } = state

  const handleSumbit = async () => {
    setDisabled(true)
    const res = await request({
      endpoint: `/service/area/${update ? 'update' : 'create'}`,
      method: 'post',
      data: {
        configId: update ? update._id : undefined,
        action: {
          service: action.service.value,
          action: action.action.value,
          params: action.params.reduce(
            (acc, current) => ({
              ...acc,
              [current.name]: current.value?.value || current.value
            }),
            {}
          ),
        },
        reaction: {
          service: reaction.service.value,
          reaction: reaction.reaction.value,
          params: reaction.params.reduce(
            (acc, current) => ({
              ...acc,
              [current.name]: current.value?.value || current.value
            }),
            {}
          ),
        },
      },
      headers: {
        authorization: localStorage.getItem('authorization') || ''
      },
      doAlert: true,
    })
    setDisabled(false)
    if (res) {
      onClickOutside()
      refreshConfigs()
    }
  }

  const getCleanActionParams = (value) => {
    const params = services
      .find(({ _id }) => _id === action?.service?.value)?.actions
      .find(({ _id }) => _id === value)?.params
    return params
  }

  const getCleanReactionParams = (value) => {
    const params = services
      .find(({ _id }) => _id === reaction?.service?.value)?.reactions
      .find(({ _id }) => _id === value)?.params
    return params
  }

  return (
    <Modal className={Wrapper} onClickOutSide={onClickOutside}>
      <h1 className={Title}>{`${update ? 'Update' : 'Create'} AREA`}</h1>
      <div className={Data}>
        <div className={Actions}>
          <label htmlFor="action-service">
            Action Service
            <Select
              id="action-service"
              className={SelectClass}
              value={action.service}
              options={services
                .filter(({ actions }) => actions.length)
                .map(s => ({ label: s.name, value: s._id }))
              }
              onChange={value => {
                dispatch({
                  name: 'action',
                  value: { ...init({ services }).action, service: value }
                })
              }}
            />
          </label>
          {!!action.service && (
            <label htmlFor="action-action">
              Action
              <Select
                id="action-action"
                className={SelectClass}
                value={action.action}
                options={services
                  .find(({ _id }) => _id === action.service.value).actions
                  .map(s => ({ label: s.name.replace(/_/g, ' '), value: s._id }))
                }
                onChange={value => {
                  dispatch({
                    name: 'action',
                    value: { ...action, action: value, params: getCleanActionParams(value.value) }
                  })
                }}
              />
            </label>
          )}
          {!!action.action && action.params.map(data => (
            <Param
              key={`action-param-${data.name}`}
              data={data}
              value={data.value || null}
              params={action.params}
              onChange={v => {
                dispatch({
                  name: 'action',
                  value: {
                    ...action,
                    params: action.params.reduce(
                      (acc, current) => [
                        ...acc,
                        current.name === data.name
                          ? { ...data, value: v }
                          : current
                      ],
                      []
                    )
                  }
                })
              }}
            />
          ))}
        </div>
        <div className={Reactions}>
          <label htmlFor="reaction-service">
            Reaction Service
            <Select
              id="reaction-service"
              className={SelectClass}
              value={reaction.service}
              options={services
                .filter(({ reactions }) => reactions.length)
                .map(s => ({ label: s.name, value: s._id }))
              }
              onChange={value => {
                dispatch({
                  name: 'reaction',
                  value: { ...init({ services }).reaction, service: value }
                })
              }}
            />
          </label>
          {!!reaction.service && (
            <label htmlFor="reaction-reaction">
              Reaction
              <Select
                id="reaction-reaction"
                className={SelectClass}
                value={reaction.reaction}
                options={services
                  .find(({ _id }) => _id === reaction.service.value).reactions
                  .map(s => ({ label: s.name.replace(/_/g, ' '), value: s._id }))
                }
                onChange={value => {
                  dispatch({
                    name: 'reaction',
                    value: { ...reaction, reaction: value, params: getCleanReactionParams(value.value) }
                  })
                }}
              />
            </label>
          )}
          {!!reaction.reaction && reaction.params.map(data => (
            <Param
              key={`reaction-param-${data.name}`}
              data={data}
              value={data.value || null}
              params={reaction.params}
              onChange={v => {
                dispatch({
                  name: 'reaction',
                  value: {
                    ...reaction,
                    params: reaction.params.reduce(
                      (acc, current) => [
                        ...acc,
                        current.name === data.name
                          ? { ...data, value: v }
                          : current
                      ],
                      []
                    )
                  }
                })
              }}
              reaction
            />
          ))}
        </div>
      </div>
      <div className={ButtonWrapper}>
        <Button large underline onClick={onClickOutside}>Cancel</Button>
        <Button
          large
          onClick={handleSumbit}
          disabled={disabled
            || !action.service
            || !action.action
            || !reaction.service
            || !reaction.reaction
            || !action.params.every(p => p.value)
            || !reaction.params.every(p => p.value)
          }
        >
          Validate
        </Button>
      </div>
    </Modal>
  )
}

export default AreaModal
