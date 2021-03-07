import React from 'react'
import './login.less'
import 'font-awesome/css/font-awesome.css'
import { Redirect,useHistory } from 'react-router-dom'
import { Form, Input, Button, Checkbox } from 'antd'
import {
  UserOutlined, LockOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'

const Login = ({userInfo, login}) => {

  let history = useHistory()
  const handleSubmit = loginInfo => {
    login(loginInfo)

  }
  const goRegister = () => {
    history.replace('/register')
  }
  if (userInfo && userInfo._id) {
    return <Redirect to="/"/>
  } else {
    return (<div className="login">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <h1>登陆在线爬虫</h1>
        <Form.Item
          name="username"
          rules={[{
            required: true, message: '请输入用户名'
          }, {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/, message: '用户名必须为英文字母开头，长度为6-10位!'
          }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon"/>}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{
            required: true, message: '请输入密码!'
          }]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon"/>}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          <Button type="link" htmlType="button" onClick={goRegister}>
            注册账号
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button">
            <strong>登陆</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>)
  }


}
export default connect(
  state => ({userInfo: state.userInfo }),
  {login}
)(Login)
