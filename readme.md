## 介绍
umi，中文可发音为乌米，是一个可插拔的企业级 react 应用框架。umi 以路由为基础的，支持类 next.js 的约定式路由，以及各种进阶的路由功能，并以此进行功能扩展，比如支持路由级的按需加载。然后配以完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

简单来说

* roadhog 是基于 webpack 的封装工具，目的是简化 webpack 的配置
* umi 可以简单地理解为 roadhog + 路由，思路类似 next.js/nuxt.js，辅以一套插件机制，目的是通过框架的方式简化 React 开发
* dva 目前是纯粹的数据流，和 umi 以及 roadhog 之间并没有相互的依赖关系，可以分开使用也可以一起使用

本项目我们采取了 umi + dva 的搭配形式架构。

## 创建项目
更多内容参看[umi官方文档](https://umijs.org/zh/guide/getting-started.html#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)

**环境准备**

*安装node*
```
// 确保 node 版本是 8.10 或以上
$ node -v         
8.1x
```

*使用yarn安装*
```
// 先全局安装yarn
$ sudo npm i yarn -g        
yarn -v


// 然后全局安装 umi，并确保版本是 2.0.0 或以上
$ sudo yarn global add umi
umi -v
2.0.0
```

*使用npm安装*
```
// 全局安装 umi，并确保版本是 2.0.0 或以上
$ sudo npm i umi -g
umi -v
2.0.0
```
## 使用

```bash
$ git clone [git地址]          //将项目clone至本地
$ cd [项目目录]
$ npm i
$ npm start || umi start    // 任选一种启动项目
```

## 目录及约定

```
.
|-- dist/                              // 默认的 build 输出目录
|-- config/
    |-- config.js                      // umi 配置入口
    |-- plugins.js                     // umi 配置。插件配置
    |-- routes.js                      // umi 配置。路由和权限配置
    |-- webpack.js                     // umi 配置  webpack
|-- src/                               // 源码目录
    |-- assets/                        // 静态文件
    |-- components/                    // 自定义组件
    |-- ant_component/                 // 二次封装antd的组件
    |-- layouts/                       // 全局布局
        |-- BaseLayout/                // 基础layout,涉及前台及前台权限
        |-- ConsoleLayout/             // 控制台layout,涉及控制台及控制台权限
        |-- LoginLayout/               // 登录layout,涉及登录模块
        |-- ExceptionLayout/           // 涉及异常报错

    |-- models/                        // 全局models
    |-- pages/                         // 页面目录
        |-- .umi/                      // dev 临时目录
        |-- page1                      // 页面 1，每个页面以文件夹为单位
            |-- component              // 页面独立组件(根据业务具体配置)
            |-- index.js               // 页面 1 入口文件
            |-- model.js               // 页面 1 model文件
            |-- service.js             // 页面 1 service层
            |-- style.css              // 页面 1 style
    |-- services/                      // 全局service层
    |-- global.less                     // 全局样式文件。此文件不走 css modules，且会自动被引入，在这里写全局样式，以及做样式覆盖
    |-- global.js                      // 全局js文件。此文件会在入口文件的最前面被自动引入，在这里加载补丁，做一些初始化的操作等
|-- utils/                             // 工具。所有为项目服务的，与业务无关的，工具代码，底层封装
    |-- themes/                        // ant design 重定义文件。初始化项目时，基于项目UI重定义并扩展ant design样式
    |-- constant.js                    // 静态数据和全局配置
    |-- request.js                     // 网络请求配置。使用umi-request，一个基于 fetch 封装的请求库
    |-- storage.js                     // localStorage 操作 
    |-- utils.js                       // 各种工具方法
```


## 项目自定义组件文档


## 相关技术

* [umi框架](https://umijs.org/zh/guide/)
* [dva数据流方案](https://dvajs.com/guide/#%E7%89%B9%E6%80%A7)
* [ant design UI框架](https://ant.design/docs/react/introduce-cn)
* [umi-request 网络请求库](http://npm.taobao.org/package/umi-request)
* [eslint 代码规范](https://eslint.org/)

## 全局注意事项
* 动态url使用{id},同时将上送id,使用sting,number,array,等数据使用API_IDS字段进行上送
