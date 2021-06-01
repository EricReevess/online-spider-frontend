import React, { useEffect, useState } from 'react'
import { Button, Card, Input, message, Modal, Space, Table, Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { addRoleRequest, cancel, deleteRoleRequest, getRolesRequest, updateRoleRequest } from '../../api'
import menuConfig from '../../config/menu-config'
import localStorageUtil from '../../utils/localStorageUtil'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

const Role = ({userInfo, logout}) => {
  const [roleList, setRoleList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [addRoleVisible, setAddRoleVisible] = useState(false)
  const [addRoleValue, setAddRoleValue] = useState('')
  const [addRoleLoading, setAddRoleLoading] = useState(false)
  const [updateRoleVisible, setUpdateRoleVisible] = useState(false)
  const [updateRoleLoading, setUpdateRoleLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState('')
  const [deleteVisible, setDeleteVisible] = useState(false)
  // 列头信息
  const columns = [{
    title: '角色名称', dataIndex: 'name', key: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text) => (text ? new Date(text).toLocaleString('zh-TW') : '')
  }, {
    title: '授权时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
    render: (text) => (text ? new Date(text).toLocaleString() : '')
  }, {
    title: '授权人', dataIndex: 'auth_name', key: 'auth_name'
  }, {
    title: '操作', key: 'action', render: (text, render) => (<Space size="middle">
      <Button onClick={() => {
        setUpdateRoleVisible(true)
        setCurrentRole(render)
      }}>更改权限</Button>
      <Button onClick={() => {
        deleteRole(render)
      }}>删除</Button>
    </Space>), width: 100
  }]
  const title = (<div>
      <Button
        type="primary"
        style={{ marginRight: '10px' }}
        onClick={() => {
          setAddRoleVisible(true)
        }}>
        <PlusOutlined/>
        创建角色
      </Button>
    </div>)

  const deleteRole = (render) => {
    setDeleteVisible(true)
    setCurrentRole(render)
  }

  const handleDeleteOk =  () => {
    deleteRoleRequest(currentRole._id).then(result => {
      if (result.data.status === 0){
        message.success('角色删除成功')
        getRoleList()
      } else {
        message.error(result.data.msg)
      }
      setDeleteVisible(false)
    })
    
  }

  const onCheck = (checkedKeys) => {
    setCurrentRole(prevState => ({
      ...prevState,
      menus:checkedKeys
    }))

  }

  const getRoleList = async () => {
    setTableLoading(true)
    const { data: result } = await getRolesRequest()
    if (result.status === 0) {
      setRoleList(result.data)
    } else {
      message.error('获取角色数据失败')
    }
    setTableLoading(false)
  }

  const handleAddRole = async () => {
    setAddRoleLoading(true)
    const roleName = addRoleValue.trim()
    if(!!roleName){
      const { data: result } = await addRoleRequest(addRoleValue.trim())
      if (result.status === 0) {
        getRoleList()
        message.success('角色添加成功')
      } else {
        message.error('角色添加失败')
      }
      setAddRoleLoading(false)
      setAddRoleVisible(false)
      setAddRoleValue('')
    } else {
      message.warn('输入不能为空')
    }
  }

  const handleUpdateRole = async () => {
    setUpdateRoleLoading(true)
    setCurrentRole(currentRole)
    const auth_name = localStorageUtil.getData('userInfo').username
    const { data: result } = await updateRoleRequest({ ...currentRole,auth_name })
    if (result.status === 0) {
      if (currentRole._id === userInfo.role_id){
        logout()
        message.info('当前用户角色权限更新，请重新登录')
      } else {
        message.success('更新角色权限成功')
        getRoleList()
      }
    } else {
      message.error('更新角色权限失败，请重试')
    }
    setUpdateRoleLoading(false)
    setUpdateRoleVisible(false)
  }
  const handleAddCancel = () => {
    setAddRoleVisible(false)
    setAddRoleValue('')
  }
  const handleUpdateCancel = () => {
    setUpdateRoleVisible(false)
  }


  useEffect(() => {
    getRoleList()
    return () => {
      if (cancel){
        cancel()
      }
    }
  }, [])


  return (<Card title={title}
  >
    <Table
      loading={tableLoading}
      bordered
      rowKey="_id"
      dataSource={roleList}
      columns={columns}
      pagination={{ position: ['bottomCenter'], defaultPageSize: 10, showQuickJumper: true }}
    />
    <Modal
      title="创建角色"
      visible={addRoleVisible}
      confirmLoading={addRoleLoading}
      okText="提交"
      cancelText="取消"
      onOk={handleAddRole}
      onCancel={handleAddCancel}
    >
      <Input
        required
        value={addRoleValue}
        onChange={(e) => setAddRoleValue(e.target.value)}
        addonBefore={<span>角色名：</span>}
        placeholder="请输入角色"
      />
    </Modal>
    <Modal
      title="确定删除"
      visible={deleteVisible}
      okText="确定"
      cancelText="取消"
      onOk={handleDeleteOk}
      onCancel={() => {setDeleteVisible(false)}}
    >
      <p>确定要删除该用户吗？</p>
    </Modal>
    <Modal
      title={`更改角色 ${currentRole.name} 的权限`}
      visible={updateRoleVisible}
      confirmLoading={updateRoleLoading}
      okText="提交"
      cancelText="取消"
      onOk={handleUpdateRole}
      onCancel={handleUpdateCancel}
    >
      <Tree
        checkable
        selectable={false}
        defaultExpandedKeys={['/products','/charts']}
        checkedKeys={currentRole.menus}
        onCheck={onCheck}
        treeData={menuConfig}
      />
    </Modal>
  </Card>)

}

export default connect(
  state => ({userInfo:state.userInfo}),
  {logout}
)(Role)
