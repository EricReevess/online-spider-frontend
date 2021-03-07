const menuConfig = [
  {
    title:'在线爬取',
    path:'/home',
    key:'/home',
    icon:'HomeOutlined',
    isPublic:true
  },
  {
    title:'我的数据',
    path:'/user-data',
    key:'/user-data',
    icon:'ShopOutlined',
  },
  {
    title:'用户管理',
    path:'/user',
    key:'/user',
    icon:'TeamOutlined',

  },
  {
    title:'角色管理',
    path:'/role',
    key:'/role',
    icon:'UserOutlined',
  },
  {
    title:'统计图表',
    path:'/charts',
    key:'/charts',
    icon:'AreaChartOutlined',
    children:[
      {
        title:'柱状图',
        path:'/charts/bar',
        key:'/charts/bar',
        icon:'BarChartOutlined',
      },
      {
        title:'折线图',
        path:'/charts/line',
        key:'/charts/line',
        icon:'LineChartOutlined',

      },
      {
        title:'饼图',
        path:'/charts/pie',
        key:'/charts/pie',
        icon:'PieChartOutlined',

      }
    ]
  }

]
export default menuConfig
