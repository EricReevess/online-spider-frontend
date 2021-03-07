import React from 'react'
import { Layout } from 'antd'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/home/home'
//import Category from '../../views/category/category'
import User from '../../views/user/user'
import Role from '../../views/role/role'
import Bar from '../../views/charts/bar'
import Line from '../../views/charts/line'
import Pie from '../../views/charts/pie'
import UserData from '../../views/user-data/user-data'
// import tempMemoryUtil from '../../utils/tempMemoryUtil'

const { Content } = Layout
const ContentBody = () => {

 /* let history = useHistory()
  let location = useLocation()
  const { userInfo } = tempMemoryUtil
  const permissionMenus = userInfo.role.menus
  if(permissionMenus.indexOf(location.pathname) === -1 ){
    history.replace('/home')
    message.error('您无权访问此页面')
  }*/

  return (<Content>
    <div style={{ padding: 24, minHeight: 360 }}>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/user-data" component={UserData}/>
        <Route path="/user" component={User}/>
        <Route path="/role" component={Role}/>
        <Route path="/charts/bar" component={Bar}/>
        <Route path="/charts/line" component={Line}/>
        <Route path="/charts/pie" component={Pie}/>
        <Redirect to="/home"/>
      </Switch>
    </div>
  </Content>)

}

export default ContentBody
