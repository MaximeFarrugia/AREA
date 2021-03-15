import { useReducer } from 'react'
import { Link, useHistory } from 'react-router-dom'
import GoogleLogin from 'react-google-login'

import { Wrapper, Content, Title, Footer } from '../Register/Register.module.css'
import { GoogleClass, GoogleButton } from './Login.module.css'

import request from '../../Helpers/request'
import { AuthInput, AuthButton } from '../Register'

import { ReactComponent as Logo } from '../Register/logo.svg'

const reducer = (current, { name, value }) => ({ ...current, [name]: value })
const defaultState = () => ({ email: '', password: '' })

const Login = () => {
  const [state, dispatch] = useReducer(reducer, null, defaultState)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await request({
      endpoint: '/user/auth/login',
      method: 'post',
      data: {
        email: state.email,
        password: state.password,
      },
      doAlert: true,
    })
    if (res?.data?.token) {
      localStorage.setItem("authorization", res.data.token);
      history.push('/')
    }
  }

  const responseSuccesGoogle = async (response) => {
    const res = await request({
      endpoint: '/user/auth/googlelogin',
      method: 'post',
      data: {
        tokenId: response.tokenId,
      },
      doAlert: true,
    })
    if (res?.data?.token) {
      localStorage.setItem("authorization", res.data.token);
      history.push("/");
    }
  };

  const responseFailureGoogle = (response) => {
    console.log("Failure", response);
  };

  return (
    <div className={Wrapper}>
      <form className={Content} onSubmit={handleSubmit}>
        <div className={Title}>
          <h1>Sign In</h1>
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
        <AuthButton type="submit">SIGN IN</AuthButton>
        <div className={GoogleClass}>
          <p>Or Sign In with:</p>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_ID}
            onSuccess={responseSuccesGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={"single_host_origin"}
            buttonText=""
            className={GoogleButton}
          />
        </div>
        <div className={Footer}>
          <p>Not a member yet ?</p>
          <Link to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
