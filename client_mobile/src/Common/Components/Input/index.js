import { useState, forwardRef, useEffect } from 'react'
import styled from 'styled-components'
import Icon from '../Icon'

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => (props.errorMessage ? '#fef8f6' : '#ffffff')};
  border: 1px solid
    ${(props) => {
    if (props.errorMessage) return '#d90808'
    if (props.focused) return '#9869c44d'
    return '#e3e9f2'
  }};
  border-radius: 5px;
`

const StyledInput = styled.input`
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  padding: 0 10px;
  width: 100%;
  height: inherit;
  min-height: inherit;
  font-style: normal;
  font-weight: normal;
  &::placeholder {
    color: #444444;
  }
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #ececec;
    color: #9b9b9b;
    cursor: not-allowed;
  }
`

const StyledIcon = styled(Icon)`
  position: relative;
  padding-right: 10px;
  color: #9b9b9b;
  cursor: pointer;
`

const HelperSpan = styled.span`
  margin-top: 5px;
  text-align: left;
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  & > * {
    margin-top: 0px;
    text-align: left;
    font-size: 12px;
    font-style: italic;
    font-weight: 300;
  }
`
const ErrorSpan = styled.span`
  font-size: 14px;
  color: #d90808;
  margin-top: 5px;
`

const Input = forwardRef(
  (
    {
      className = '',
      containerClass = '',
      helperText = null,
      icon = '',
      onIconClick = null,
      errorMessage = '',
      onFocus = () => {},
      onBlur = () => {},
      delay = 0,
      value = '',
      onChange = () => {},
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false)
    const [delayedValue, setDelayedValue] = useState(value || '')
    const [timer, setTimer] = useState(null)

    useEffect(() => {
      setDelayedValue(value)
    }, [value])

    return (
      <InputContainer className={containerClass}>
        <InputWrapper
          errorMessage={errorMessage}
          focused={focused}
          className={className}
        >
          <StyledInput
            {...props}
            ref={ref}
            value={delay ? delayedValue : value}
            autoComplete="off"
            onFocus={(e) => {
              if (onFocus) onFocus(e)
              setFocused(true)
            }}
            onBlur={(e) => {
              if (onBlur) onBlur(e)
              setFocused(false)
            }}
            onChange={(e) => {
              setDelayedValue(e.target.value)
              if (delay > 0) {
                e.persist()
                clearTimeout(timer)
                setTimer(setTimeout(() => onChange(e), delay))
              } else {
                onChange(e)
              }
            }}
          />
          {icon && (
            <StyledIcon className={onIconClick} onClick={onIconClick}>
              {icon}
            </StyledIcon>
          )}
        </InputWrapper>
        {helperText && <HelperSpan>{helperText}</HelperSpan>}
        {errorMessage && <ErrorSpan>{errorMessage}</ErrorSpan>}
      </InputContainer>
    )
  },
)

export default Input