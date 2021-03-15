import React, { useState, useReducer } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import request from '../../../Helpers/request'
import Button from '../../../Common/Components/Button'
import Select from '../../../Common/Components/Select'
import { Actions } from 'react-native-router-flux'
import Param from './Param'

const reducer = (current, { name, value }) => ({ ...current, [name]: value })

const init = ({ update = {} }) => {
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
  services,
  update = false,
  refreshConfigs,
}) => {
  const [disabled, setDisabled] = useState(false)
  const [state, dispatch] = useReducer(reducer, { update }, init)
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
        authorization: global.authorization || ''
      },
      doAlert: false,
    })
    setDisabled(false)
    await refreshConfigs()
    Actions.reset('home')
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
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        {`${update ? 'Update' : 'Create'} AREA`}
      </Text>
      <View>
        <View>
          <View style={styles.label}>
            <Text style={styles.labelText}>Action Service</Text>
            <Select
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
          </View>
          {!!action.service && (
            <View style={styles.label}>
              <Text style={styles.labelText}>Action</Text>
              <Select
                value={action.action}
                options={services
                  .find(({ _id }) => _id === action.service.value).actions
                  .map(s => ({ label: s.name.replace(/_/g, ' '), value: s._id }))
                }
                onChange={value => {
                  dispatch({
                    name: 'action',
                    value: { ...action, action: value, params: getCleanActionParams(value?.value) }
                  })
                }}
              />
            </View>
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
        </View>
        <View style={styles.reactions}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Reaction Service</Text>
            <Select
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
          </View>
          {!!reaction.service && (
            <View style={styles.label}>
              <Text style={styles.labelText}>Reaction</Text>
              <Select
                value={reaction.reaction}
                options={services
                  .find(({ _id }) => _id === reaction.service.value).reactions
                  .map(s => ({ label: s.name.replace(/_/g, ' '), value: s._id }))
                }
                onChange={value => {
                  dispatch({
                    name: 'reaction',
                    value: { ...reaction, reaction: value, params: getCleanReactionParams(value?.value) }
                  })
                }}
              />
            </View>
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
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button large underline onPress={() => Actions.reset('home')}>
          <Text>Cancel</Text>
        </Button>
        <Button
          large
          onPress={handleSumbit}
          disabled={disabled
            || !action.service
            || !action.action
            || !reaction.service
            || !reaction.reaction
            || !action.params.every(p => p.value)
            || !reaction.params.every(p => p.value)
          }
        >
          <Text>Validate</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: '#eeeeee',
    height: '100%',
  },
  title: {
    fontWeight: '700',
    color: '#444444',
    fontSize: 32,
    marginBottom: 20,
  },
  reactions: {
    marginTop: 50,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 42,
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  }
})

export default AreaModal
