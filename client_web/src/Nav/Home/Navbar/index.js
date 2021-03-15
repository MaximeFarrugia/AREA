import { Link, matchPath, useLocation } from 'react-router-dom'
import Styled from 'styled-components'

import { Wrapper, LogoClass } from './Navbar.module.css'

import { ReactComponent as Logo } from './res/logo.svg'
import { ReactComponent as Home } from './res/home.svg'
import { ReactComponent as Settings } from './res/settings.svg'

const NavButton = Styled(Link)`
  background-color: ${props => props.selected ? 'rgba(152, 105, 196, 0.5)' : 'transparent'};
  border-radius: 15px;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: background-color .2s ease-in-out;
  margin-bottom: 10px;

  &:hover {
    background-color: rgba(152, 105, 196, 0.7);
  }
  &:focus {
    outline: none;
  }
  & > :first-child {
    margin-right: 25px;
  }
`

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <div className={Wrapper}>
      <Link className={LogoClass} to="/">
        <Logo />
        <h1>AREA</h1>
      </Link>
      <NavButton
        to="/"
        selected={matchPath(pathname, { path: '/', exact: true })}
      >
        <Home />
        Home
      </NavButton>
      <NavButton
        to="/settings"
        selected={matchPath(pathname, { path: '/settings', exact: true })}
      >
        <Settings />
        Settings
      </NavButton>
    </div>
  )
}

export default Navbar
