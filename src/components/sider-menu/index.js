import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu,Layout } from 'antd'
import * as Icon from '@ant-design/icons'
import './index.less'
import { Link } from 'react-router-dom'
import menuList from '../../config/menu-config'
import { connect } from 'react-redux'
import { setNavTitle } from '../../redux/actions'

const { SubMenu, Item } = Menu
const { Sider } = Layout

const SiderMenu = ({setNavTitle,userInfo}) => {
  let location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const defaultOpenKey = location.pathname.match(/\/\w+/) ? location.pathname.match(/\/\w+/)[0] : '/home'
  const selectedKey = location.pathname

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }


  const hasAuth = (item) => {
    const {path,isPublic} = item
    const menus = userInfo.role.menus
    if (isPublic || menus.indexOf(path) !== -1){
      return true
    } else if (item.children) {
      return !!item.children.find(item => menus.indexOf(item.path) !== -1)
    }
    return false
  }

  const getMenus = (menuList) => {
    return menuList.reduce((pre, item) => {
      if (hasAuth(item)){
        if (!item.children) {
          if (item.path === selectedKey){
            setNavTitle(item.title)
          }
          pre.push((
            <Item icon={React.createElement(Icon[item.icon])}
                  key={item.path}>
              <Link to={item.path} onClick={() => setNavTitle(item.title)}>
                {item.title}
              </Link>
            </Item>
          ))
        } else {
          pre.push((
            <SubMenu key={item.path} icon={React.createElement(Icon[item.icon])} title={item.title}>
              {getMenus(item.children)}
            </SubMenu>
          ))
        }

      }
      return pre

    },[])
  }



  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo">
        {collapsed ? React.createElement(Icon['FundOutlined'])  : 'Online Spider'}
      </div>
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        focusable
        defaultOpenKeys={[defaultOpenKey]}
        mode="inline">
        {getMenus(menuList)}
      </Menu>
    </Sider>)
}


export default connect(
  state => ({userInfo: state.userInfo }),
  {setNavTitle}
)(SiderMenu)
