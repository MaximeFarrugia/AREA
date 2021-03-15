import { useState } from 'react'
import styled, { css } from 'styled-components'
import ReactSelect, { components } from 'react-select'

import Icon from '../Icon'

const StyledSelect = styled(ReactSelect)`
  border: 1px solid
    ${(props) => {
    if (props.focused) return '#9869c44d'
    if (props.errorMessage) return '#d90808'
    return '#e3e9f2'
  }};
  border-radius: 5px;
  font-weight: normal;
  font-size: 14px;

  ${props => props.errorMessage
    && css`
      & > div {
        background-color: #fef8f6;
      }
    `}
`

const StyledInput = styled.input`
  font-size: 12px;
  font-weight: 300;
  position: absolute;
  background-color: transparent;
  bottom: 0;
  left: 50%;
  width: 0px;
  height: 0px;
  cursor: default;
  border: none;
  &:focus {
    outline: none;
  }
`

const HelperSpan = styled.span`
  font-size: 12px;
  text-align: left;
  font-style: italic;
  font-weight: 300;
  margin: 5px 0 0 5px;
  & > * {
    font-size: 12px;
    text-align: left;
    font-style: italic;
    font-weight: 300;
    margin: 5px 0 0 5px;
  }
`
const ErrorSpan = styled.span`
  font-size: 14px;
  color: #d90808;
  margin-top: 5px;
`

const CheckIcon = styled(Icon)`
  position: absolute;
  right: 0;
  padding-right: 10px;
`

const CancelIcon = styled(Icon)`
  font-size: 16px;
  color: #7a7a7a;
`

const Option = ({ data, isSelected, ...props }) => (
  <components.Option {...props}>
    {data.customElement}
    {data.label}
    {isSelected && <CheckIcon>check</CheckIcon>}
  </components.Option>
)

const SingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    {data.customElement}
    {data.label}
  </components.SingleValue>
)

const MultiValueRemove = props => (
  <components.MultiValueRemove {...props}>
    <CancelIcon>cancel</CancelIcon>
  </components.MultiValueRemove>
)

const Select = ({
  className = '',
  isMulti = false,
  noOptionsMessage = '',
  value = '',
  required = false,
  helperText = '',
  errorMessage = '',
  onScroll = () => {},
  ...props
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <StyledSelect
        {...props}
        className={className}
        focused={focused}
        errorMessage={errorMessage}
        value={value}
        isMulti={isMulti}
        noOptionsMessage={() => noOptionsMessage || 'No results'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMenuScrollToBottom={() => onScroll()}
        components={{
          Option,
          SingleValue,
          MultiValueRemove,
        }}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'transparent',
          },
        })}
        styles={{
          control: base => ({
            ...base,
            minHeight: 'inherit',
            maxHeight: 'inherit',
            height: '100%',
            border: 'none',
            cursor: 'pointer',
            '& > div:first-child': {
              height: 'inherit',
              maxHeight: 'inherit',
              overflow: 'hidden',
            },
          }),
          menu: base => ({
            ...base,
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
          }),
          indicatorSeparator: base => ({
            ...base,
            display: 'none',
          }),
          placeholder: base => ({
            ...base,
            color: '#9b9b9b',
          }),
          option: (base, { isDisabled }) => ({
            ...base,
            minHeight: '35px',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: isDisabled ? '#9b9b9b' : '#444444',
            fontWeight: isDisabled ? 500 : 'normal',
            cursor: 'pointer',
            '&:hover': !isDisabled && {
              backgroundColor: '#ebf0ff',
            },
          }),
          singleValue: base => ({
            ...base,
            overflow: 'visible',
            fontSize: '14px',
            color: '#444444',
            fontWeight: 'normal',
            display: 'flex',
            alignItems: 'center',
          }),
          multiValue: styles => ({
            ...styles,
            height: '25px',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#444444',
            fontWeight: 'normal',
            backgroundColor: '#f3f3f3',
            display: 'flex',
            alignItems: 'center',
          }),
          multiValueRemove: styles => ({
            ...styles,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }),
        }}
      />
      <StyledInput
        required={required && (value === '' || (isMulti && !value.length))}
      />
      {helperText && <HelperSpan>{helperText}</HelperSpan>}
      {errorMessage && <ErrorSpan>{errorMessage}</ErrorSpan>}
    </div>
  )
}

export default Select