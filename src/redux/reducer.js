import  {combineReducers} from 'redux'
import cookie from 'react-cookies'
import localStorageUtil from '../utils/localStorageUtil'
import { LOGOUT, SET_NAV_TITLE, SET_USER_INFO } from './action-types'

const initNavTitle = ''
const initUserInfo = localStorageUtil.getData('userInfo') || {}
const navTitle = (state=initNavTitle, action) => {
  switch (action.type) {
    case SET_NAV_TITLE:
      return action.data
    default:
      return state
  }
}


const userInfo = (state =initUserInfo, action ) => {
  switch (action.type) {
    case SET_USER_INFO:
      return action.data
    case LOGOUT:
      localStorageUtil.removeData('userInfo')
      cookie.remove('uid')
      return {}
    default:
      return state
  }
}
export default combineReducers({
  navTitle,
  userInfo
})
