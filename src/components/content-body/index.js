import React from 'react'
import { Layout } from 'antd'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/home/home'
import User from '../../views/user/user'
import Role from '../../views/role/role'
import Bar from '../../views/charts/bar'
import Line from '../../views/charts/line'
import Pie from '../../views/charts/pie'
import UserData from '../../views/user-data/user-data'
import './content-body.less'
const { Content } = Layout
const ContentBody = () => {

  return (<Content>
    <div className="content-body">
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/user-data" component={UserData}/>
        <Route path="/user" component={User}/>
        <Route path="/role" component={Role}/>
        <Redirect to="/home"/>
      </Switch>
    </div>
  </Content>)

}

export default ContentBody
