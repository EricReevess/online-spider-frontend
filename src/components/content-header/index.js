import React, { useCallback, useEffect, useState } from 'react'
import { Button, Layout, Modal } from 'antd'
import formattedDateUtil from '../../utils/formattedDateUtil'
import { cancel } from '../../api'
import './index.less'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
const { Header } = Layout


const ContentHeader = ({ logout,navTitle,userInfo }) => {

  const [localDate] = useState(formattedDateUtil(new Date()))

  const [visible, setVisible] = useState(false)

  const confirmLogout = () => {
    setVisible(true)
  }
  const handleOk = () => {
    logout()
    setVisible(false)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const initWeatherInfo = useCallback(()=> {
  },[])

  useEffect(() => {
    initWeatherInfo()
    if (cancel){
      console.log('cancel')
      cancel()
    }
  }, [initWeatherInfo])
  return (
    <Header
      className="content-header">
      <div className="content-header-left">
        <span className="nav-text">{navTitle}</span>
      </div>
      <div className="content-header-right">
        <span className="header-text">
          {localDate}
        </span>
        <span className="header-text">欢迎, { userInfo.username || undefined}</span>
        <Button type="primary" onClick={confirmLogout}>登出</Button>
        <Modal
          title="登出"
          okText="确定"
          cancelText="取消"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>确定要退出登录吗？</p>
        </Modal>
      </div>
    </Header>)

}

export default connect(
  state => ({navTitle:state.navTitle,userInfo:state.userInfo}),
  {logout}
)(ContentHeader)

