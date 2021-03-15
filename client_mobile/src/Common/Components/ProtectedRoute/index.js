import { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Axios from 'axios'

const ProtectedRoute = ({ component: Component, ...props }) => {
  const [authenticated] = useState(localStorage.getItem('authorization'))

  const checkAuthenticated = async () => {
    const token = localStorage.getItem('authorization')
  
    try {
      const res = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/auth/authenticated`,
        null,
        {
          headers: {
            authorization: token || ''
          }
        }
      )
      if (!res.data) {
        localStorage.removeItem('authorization')
        window.location.pathname = '/login'
      }
    } catch (err) {
      localStorage.removeItem('authorization')
      window.location.pathname = '/login'
    }
  }

  useEffect(() => {
    checkAuthenticated()
  }, [])

  return (
    <Route {...props} render={(routeProps) => authenticated
      ? <Component {...routeProps} />
      : <Redirect to="/login" />}
    />
  )
}

export default ProtectedRoute
