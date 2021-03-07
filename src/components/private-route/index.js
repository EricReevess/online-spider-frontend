import React from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom'
import tempMemoryUtil from '../../utils/tempMemoryUtil'
import { message } from 'antd'


/*if(permissionMenus.indexOf(location.pathname) === -1 ){
  history.replace('/home')
  message.error('您无权访问此页面')
}*/
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
