import { LOGOUT, SET_NAV_TITLE, SET_USER_INFO } from './action-types'
import { loginRequest } from '../api'
import { message } from 'antd'
import localStorageUtil from '../utils/localStorageUtil'
import cookie from 'react-cookies'
const setNavTitle = (title) => ({
  type: SET_NAV_TITLE, data: title
})

const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO, data: userInfo
})
const logout = () => ({
  type: LOGOUT
})


const login = (loginInfo) => async (dispatch) => {
  const { data: responseData } = await loginRequest(loginInfo)
  if (responseData.status === 0) {
    message.success('登陆成功！')
    localStorageUtil.saveData('userInfo', responseData.data)
    console.log(cookie.load('uid'))
    dispatch(setUserInfo(responseData.data))
  } else {
    message.warning('账号或者密码错误！')
  }
}

export {
  setNavTitle,
  login,
  logout
}
