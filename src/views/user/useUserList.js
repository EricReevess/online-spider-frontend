import { useCallback, useState } from 'react'
import { addUserRequest, deleteUserRequest, getUsersRequest } from '../../api'
import { message } from 'antd'

const useUserList = () => {
  const [pending, setPending] = useState(false)
  const [userList, setUserList] = useState([])

  const addUser = async (user) => {
    const {data:result} = await addUserRequest(user)
    if (result.status === 0){
      message.success('添加用户成功')
    } else {
      message.error('添加用户失败')
    }
  }
  const deleteUser = async (userId) => {
    const {data:result} = await deleteUserRequest(userId)
    if (result.status === 0){
      message.success('删除用户成功')
    } else {
      message.error('删除用户失败')
    }
  }
  const getUsers = useCallback(async () => {
    setPending(true)
    const {data:result} = await getUsersRequest()
    if (result.status === 0){
      setUserList(result.data)
      setPending(false)
    } else {
      message.error('获取用户列表失败')
    }
  },[addUser,deleteUser])
  return [userList, pending, getUsers, addUser, deleteUser]
}

export default useUserList()
