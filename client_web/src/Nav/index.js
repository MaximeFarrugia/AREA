import { Switch, Route, Redirect } from 'react-router-dom'

import ProtectedRoute from '../Common/Components/ProtectedRoute'
import Register from './Register'
import Login from './Login'
import Home from './Home'

const Nav = () => (
  <Switch>
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    <ProtectedRoute path="/" component={Home} />
    <Redirect to="/" />
  </Switch>
)

export default Nav
