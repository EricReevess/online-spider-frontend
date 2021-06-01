import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom'
import tempMemoryUtil from '../../utils/tempMemoryUtil'

const PrivateRoute = ({ component: Component, ...rest }) => {
  let location = useLocation()
  const { userInfo } = tempMemoryUtil
  const permissionMenus = userInfo.role.menus
  return(
    <Route
      {...rest}
      render={props =>
        permissionMenus.indexOf(location.pathname) !== -1 ?
          (
            <Component {...props} />
          )
          : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  )
}

export default PrivateRoute
