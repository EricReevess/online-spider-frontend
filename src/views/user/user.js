import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Button, Table, Modal, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { cancel, deleteUserRequest, getUsersRequest } from '../../api'
import UserAddUpdate from './user-add-update'

const User = () => {
  const userRef = useRef(null)
  const [userList, setUserList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  // 列头信息
  const columns = [{
    title: '用户名', dataIndex: 'username', key: 'username',
  }, {
    title: '邮箱', dataIndex: 'email', key: 'email',
  }, {
    title: '电话', dataIndex: 'phone', key: 'phone'
  }, {
    title: '注册时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text) => (text ? new Date(text).toLocaleString() : '')
  }, {
    title: '所属角色',
    dataIndex: 'role_id',
    key: 'role_id',
    render: text =>{
      let role = roleList.find(item => item._id === text)
      if (roleList.length){
        if (role){
          return role.name
        } else {
          return null
        }
      }
    }

  }, {
    title: '操作', key: 'action', render: (text, render) => (<Space size="middle">
      <Button onClick={() => {
        updateUserInfo(render)
      }}>修改
      </Button>
      <Button onClick={() => {
        deleteUserInfo(render._id)
      }}>删除
      </Button>
    </Space>), width: 200
  }]
  const title = (<div>
    <Button
      type="primary"
      onClick={() => {
        addUserInfo()
      }}>
      <PlusOutlined/>
      创建用户
    </Button>
  </div>)

  const getUserList = async () => {
    setTableLoading(true)
    const { data: result } = await getUsersRequest()
    if (result.status === 0) {
      setUserList(result.data.users)
      setRoleList(result.data.roles)
    } else {
      message.error('获取用户列表失败')
    }
    setTableLoading(false)
  }

  const drawerClose = () => {
    setDrawerVisible(false)

  }

  const addUserInfo = () => {
    setDrawerVisible(true)
    userRef.current.setSubmitType('add')
    userRef.current.setUserInfo({})
  }

  const updateUserInfo = (render) => {
    setDrawerVisible(true)
    userRef.current.setSubmitType('update')
    userRef.current.setUserInfo(render)

  }

  const deleteUserInfo = (id) => {
    setCurrentUserId(id)
    setModalVisible(true)
  }

  const handleDeleteOk = () => {
    deleteUserRequest(currentUserId).then(result => {
      if(result.data.status === 0) {
        message.success('删除成功')
      } else{
        message.error('删除失败，请重试')
      }
    })
    setModalVisible(false)
    getUserList()
  }

  const initUserList = useCallback(() => {
    getUserList()
  }, [])

  useEffect(() => {
    initUserList()
    return () => {
      if (cancel){
        cancel()
      }
    }
  },[initUserList])

  return (<Card title={title}
  >
    <Table
      loading={tableLoading}
      bordered
      rowKey="_id"
      dataSource={userList}
      columns={columns}
      pagination={{ position: ['bottomCenter'], defaultPageSize: 10, showQuickJumper: true }}
    />
    <UserAddUpdate
      ref={userRef}
      drawerVisible={drawerVisible}
      onClose={drawerClose}
      confirmLoading={confirmLoading}
      getUserList={getUserList}
      roleList={roleList}
      setConfirmLoading={value => setConfirmLoading(value) }
    />
    <Modal
      title="确定删除"
      visible={modalVisible}
      okText="确定"
      cancelText="取消"
      onOk={handleDeleteOk}
      confirmLoading={confirmLoading}
      onCancel={() => {setModalVisible(false)}}
    >
      <p>确定要删除该用户吗？</p>
    </Modal>
  </Card>)

}


export default User
