## 项目描述

1. 基于前后台分离的在线爬虫SPA，包括前端pc端以及后台服务，本人负责前端部分
2. 前端使用react + react-router-dom + redux + ant design UI以及 axios ，使用ES6 语法，以及babel语法转换以及webpack按需打包
3. 后端使用 Node + Express + MongoDB
4. 采用 模块化，组件化，工程化的模式开发

## 技术选型

前台数据展现：

* react 全家桶
* ant design UI
* ECharts

后台服务

* node
* mongoDB
* mongoose
* blueimp-md5

前后台交互

* ajax请求：axios、jsonp、async await、promise
* 接口测试：postman

项目构建，工程化

* webpack
* create-react-app

## 项目基本结构

src  
  |— api ajax请求模块，封装的axios  
  |— assets 静态资源  
  |— components 子组件    
  |— views 路由组件  
  |— App.js 项目根组件  
  |— index.js 项目打包入口文件  
  |— config-overrides.js webpack按需打包配置文件  
  |— custom-antd-theme.json antd UI 自定义主题配置文件  
  |— package.json 项目版本以及依赖库描述文件  
  
## 可用命令

启动项目：

### `npm start`

在开发模式下运行React App
访问 [http://localhost:3000](http://localhost:3000)

打包项目：

### `npm run build`


