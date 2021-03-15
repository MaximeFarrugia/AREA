import { useReducer } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Wrapper, Content, Title, Footer } from './Register.module.css'

import request from '../../Helpers/request'
import { ReactComponent as Logo } from './logo.svg'

const reducer = (current, { name, value }) => ({ ...current, [name]: value })
const defaultState = () => ({ email: '', password: '' })

export const AuthInput = styled.input`
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: none;
  padding: 10px 20px;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 40px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`

export const AuthButton = styled.button`
  font-size: 15px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 40px;

  &:focus {
    outline: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`

const Register = () => {
  const [state, dispatch] = useReducer(reducer, null, defaultState)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await request({
      endpoint: '/user/auth/register',
      method: 'post',
      data: {
        email: state.email,
        password: state.password,
      },
      doAlert: true,
    })
    if (res) history.push('/login')
  }

  return (
    <div className={Wrapper}>
      <form className={Content} onSubmit={handleSubmit}>
        <div className={Title}>
          <h1>Sign Up</h1>
          <Logo />
        </div>
        <AuthInput
          name="email"
          value={state.email || ''}
          onChange={({ target: { name, value } }) => dispatch({ name, value })}
          placeholder="Email"
          required
        />
        <AuthInput
          name="password"
          value={state.password || ''}
          onChange={({ target: { name, value } }) => dispatch({ name, value })}
          placeholder="Password"
          type="password"
          required
        />
        <AuthButton type="submit">SIGN UP</AuthButton>
        <div className={Footer}>
          <p>Already have an account ?</p>
          <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  )
}

export default Register
