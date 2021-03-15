import styled, { css } from 'styled-components'

const StyledButton = styled.button`
  position: relative;
  padding: 8px 15px;
  font-weight: bold;
  font-size: ${(props) => {
    if (props.small) return '12px'
    if (props.large) return '16px'
    return '14px'
  }};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${(props) => {
    if (props.disabled) return '#9b9b9b4d'
    if (props.underline || props.invert) return 'transparent'
    if (props.redColor) return '#d908084d'
    return '#9869c44d'
  }};
  color: ${(props) => {
    if (props.disabled) return '#9b9b9b'
    if (props.redColor) return '#d90808'
    return '#9869c4'
  }}};
  border: 1px solid ${(props) => {
    if (props.checked) return 'transparent'
    if (props.isCheckable) return '#4444444d'
    if (props.invert) return '#9869c466'
    return 'transparent'
  }};
  border-radius: 5px;

  &:focus {
    outline: none;
  }
  &:hover {
    border-color: transparent;
    background-color: ${(props) => {
    if (props.disabled) return '#9b9b9b4d'
    if (props.underline) return 'transparent'
    if (props.redColor) return '#d9080866'
    return '#9869c466'
  }};
  }

  ${props => props.underline
    && css`
      &:after {
        position: absolute;
        content: '';
        background-color: ${props.disabled ? ' #9b9b9b4d' : '#9869c44d'};
        height: 2px;
        width: calc(100% - 30px);
        left: 15px;
        top: calc(100% - 8px);
      }
      &:hover:after {
        background-color: ${props.disabled ? ' #9b9b9b4d' : '#9869c44d'};
      }
    `}
`

const Button = ({
  className = '',
  underline = false,
  invert = false,
  disabled = false,
  small = false,
  large = false,
  redColor = false,
  ...props
}) => (
  <StyledButton
    type="button"
    {...props}
    className={className}
    disabled={disabled}
    small={small}
    large={large}
    underline={underline}
    invert={invert}
    redColor={redColor}
  />
)

export default Button