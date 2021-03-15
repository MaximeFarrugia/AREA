import Navbar from './Navbar'
import { useHistory, Switch, Route, Redirect } from 'react-router-dom'

import { Wrapper, LogoutClass, Content } from './Home.module.css'

import Area from '../Area'
import Settings from '../Settings'
import { ReactComponent as Logout } from './logout.svg'

const Home = () => {
  const { push } = useHistory()

  return (
    <div className={Wrapper}>
      <Logout
        className={LogoutClass}
        onClick={() => {
          localStorage.removeItem('authorization')
          push('/login')
        }}
      />
      <Navbar />
      <div className={Content}>
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Area {...props} />}
          />
          <Route
            path="/settings"
            render={props => <Settings {...props} />}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  )
}

export default Home
