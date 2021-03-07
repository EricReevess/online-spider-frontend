import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import UserDataList from './user-data-list'
import UserDataDetail from './user-data-detail'

const UserData = () => {

  return (
      <Switch>
        <Route exact path="/user-data" component={UserDataList}/>
        <Route path="/user-data/detail" component={UserDataDetail}/>
        <Redirect to="/user-data"/>
      </Switch>

    )

}

export default UserData
