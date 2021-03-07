import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './views/login/login'
import Admin from  './views/admin/admin'
import Home from './views/home/home'
import Register from './views/register/register'


export default function App() {

    return (
      /*配置react路由*/
      <BrowserRouter>
        {/*配置切换路由*/}
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/" component={Admin}/>
          <Route path="/home" component={Home}/>
        </Switch>
      </BrowserRouter>
    )
}

