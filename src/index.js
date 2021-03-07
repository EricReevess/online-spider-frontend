import React from 'react'
import ReactDOM from 'react-dom'
import './assets/index.less'
import App from './App'
import localStorageUtil from './utils/localStorageUtil'
import tempMemoryUtils from './utils/tempMemoryUtil'
import { Provider } from 'react-redux'
import store from './redux'
const userInfo = localStorageUtil.getData('userInfo')
tempMemoryUtils.userInfo = userInfo

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('root'))
