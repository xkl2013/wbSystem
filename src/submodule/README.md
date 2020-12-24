# 通用组件仓库描述\

## 目录说明

* and_components    组件库为复写antd组件,所有属性均使用透传值antd组件
* components        组件为项目成员贡献组件,多用于通用业务
* utils             为通用方法类,
* layout            为项目沉淀出框架层样式组件

## 子模块的添加
* 本厂库作为主项目的submodule使用,在使用时,在项目中规范使用submodule目录作为该子模块的根目录
* 切换至项目根目录
* git submodule add <submoduleURL> <submodulePATH> 我们约定 'git submodule add http://apollo.mttop.cn/gitlab/web_component/submodule.git  src/submodule'
* 执行成功后 git status会看到项目中修改了.gitmodules，并增加了一个新文件（为刚刚添加的路径）即src下多了一个submodule的文件
* git diff --cached查看修改内容可以看到增加了子模块，并且新文件下为子模块的提交hash摘要
* git commit提交即完成子模块的添加

## 子模块的使用

* 克隆下来主项目后,默认子模块下无任何内容. 需要在项目根目录执行如下命令完成子模块的下载
* git submodule init
* git submodule update    或者使用一部命令(git submodule update --init --recursive)

## 字模块的更新
* 在项目中,切换至子模块,必须手动git pull更新再能获取最新的提交
* 若在项目中对子模块更新,使用git add

## 子模块删除
* rm -rf 子模块目录 删除子模块目录及源码
* vi .gitmodules 删除项目目录下.gitmodules文件中子模块相关条目
* vi .git/config 删除配置项中子模块相关条目
* rm .git/module/* 删除模块下的子模块目录，每个子模块对应一个目录，注意只删除对应的子模块目录即可


