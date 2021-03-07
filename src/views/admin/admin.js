import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import SiderNav from '../../components/sider-menu'
import { Layout, message } from 'antd'
import ContentHeader from '../../components/content-header'
import ContentBody from '../../components/content-body'
import ContentFooter from '../../components/content-footer'
import './admin.less'
import { connect } from 'react-redux'

const Admin = ({userInfo}) => {
  let history = useHistory()

  const logout = () => {
    message.warn('您已经退出登录了')
    history.replace('/login')
  }



  if (!userInfo || !userInfo._id) {
    return <Redirect to="/login"/>
  }

  return (<Layout className="main-layout">
    <SiderNav />
    <Layout className="main-content">
      <ContentHeader logout={logout}/>
      <ContentBody />
      <ContentFooter/>
    </Layout>
  </Layout>)

}

export default connect(
  state => ({userInfo: state.userInfo }),
  {}
)(Admin)
