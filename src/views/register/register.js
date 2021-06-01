import React, { useState } from 'react'
import './register.less'
import 'font-awesome/css/font-awesome.css'
import { Redirect, useHistory } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import {
  UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined, PhoneOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import {  registerUserRequest } from '../../api'

const Register = ({ userInfo, login }) => {
  let history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(undefined)

  const handleSubmit = async values => {
    const { username, password, email, phone } = values
    const newUserInfo = {
      username, password, email, phone: phone || ''
    }
    const { data: result } = await registerUserRequest(newUserInfo)
    if (result.status === 0) {
      message.success(result.msg || '注册成功')
      history.replace('/login')
    } else {
      message.error(result.msg || '注册失败')
    }
  }

  const goLogin = () => {
    history.replace('/login')

  }

  if (userInfo && userInfo._id) {
    return <Redirect to="/"/>
  } else {
    return (<div className="login">
      <Form
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
      >
        <h1>注册账户</h1>
        <Form.Item
          name="username"
          initialValue={username}
          rules={[{
            required: true, message: '请输入用户名'
          }, {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/, message: '用户名必须为英文字母开头，长度为6-10位!'
          }]}
        >
          <Input
            value={username}
            prefix={<UserOutlined className="site-form-item-icon"/>}
            onChange={(event => {
              setUsername(event.target.value)
            })}
            placeholder="请输入用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          initialValue={password}
          rules={[{ required: true, message: '需要输入密码' }]}
        >
          <Input.Password
            value={password}
            prefix={<LockOutlined className="site-form-item-icon"/>}
            onChange={(event => {
              setPassword(event.target.value)
            })}
            iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item
          name="email"
          initialValue={email}
          rules={[{ required: true, message: '需要输入邮箱' }]}
        >
          <Input
            value={email}
            prefix={<MailOutlined className="site-form-item-icon"/>}
            onChange={(event => {
              setEmail(event.target.value)
            })}
            placeholder="请输入邮箱"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          initialValue={phone}
          rules={[{
            required: false, message: '需要输入电话号码'
          }, {
            pattern: /^\d{11}$/, message: '请输入正确的电话号码'
          }]}
        >
          <Input
            placeholder="请输入电话号码，可选"
            value={phone}
            prefix={<PhoneOutlined className="site-form-item-icon"/>}
            onChange={e => {
              setPhone(Number(e.target.value))
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="link" htmlType="button" onClick={goLogin}>
            已经有账号？立即登陆
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button">
            <strong>提交</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>)
  }
}

export default connect(state => ({ userInfo: state.userInfo }), { login })(Register)
