
import React, { Component } from 'react';
import Modal from './modal'
import './index.less';
import {message} from 'antd'
import BIButton from "@/ant_components/BIButton";

import {saveCustomization, updateCustomization, getCustomizationDetail} from '../../services'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, // 1-添加  2-详情  3-编辑
            visible: false, // 是否显示
            checkedKeys:[], // 树节点选中key
            viewUserList:[], // 可查看人list
            rangeUserList:[], // 查看范围list
            id: null, // 详情ID
            confirmLoading: false, // 确定loading

        }
    }
    showModal = (type, id) => { // 展示modal
        if(type == 1) { // 添加
            this.setState({
                type,
                checkedKeys:[],
                viewUserList:[],
                rangeUserList:[],
                id: null,
                visible: true,
                confirmLoading: false
            })
        } else {
            this.getDetail(type, id)
        }
    }
    getDetail = async (type, id) => { // 获取详情
        let res = await getCustomizationDetail(id)
        if(res && res.success && res.data) {
            let {id, businessSpecialId, businessSpecialName, businessSpecialType, businessSepcialIcon, dataCustomizationScopeList, dataCustomizationModuleList} =  res.data || {}
            let viewUserList = [{
                avatar: businessSepcialIcon,
                id: businessSpecialId,
                name: businessSpecialName,
                type: this.changeNum(businessSpecialType)
            }]
            let rangeUserList = dataCustomizationScopeList.map(item => {
                return {
                    avatar: item.businessSepcialIcon,
                    id: item.dataScopeBusinessId,
                    name: item.dataScopeBusinessName,
                    type: this.changeNum(item.dataScopeBusinessType)
                }
            })
            let checkedKeys = dataCustomizationModuleList.map(item => item.dataMouduleId)

            this.setState({
                type,
                id,
                viewUserList,
                rangeUserList,
                checkedKeys,
                visible: true,
                confirmLoading: false
            })
        }
    }
    titleText = () => { // title 展示
        let type = this.state.type
        if(type == 1) {
            return '添加定制盘'
        } else if (type == 2) {
            return '详情'
        } else if (type == 3) {
            return '编辑'
        }
    }
    onCheckFun = (checkedKeys) => { // 树节点 check 事件
        this.setState({
            checkedKeys
        })
    }
    viewUserListOnChange = list => { // 可查看人 change 事件
        this.setState({
            viewUserList: list
        })
    }
    rangeUserListOnChange = list => { // 查看范围 change 事件
        this.setState({
            rangeUserList: list
        })
    }

    onCancel = () => { // 取消
        this.setState({
            visible: false
        })
    }
    changeType = type => { // 转换类型 1:用户 2:角色 3:部门
        switch (type) {
            case 'user':
                return 1
            case 'role':
                return 2
            case 'org':
                return 3
            default:
                break;
        }
    }
    changeNum = num => { // 转换类型 1:用户 2:角色 3:部门
        switch (num) {
            case 1:
                return 'user'
            case 2:
                return 'role'
            case 3:
                return 'org'
            default:
                break;
        }
    }
    onOk = async () => { // 确定
        let {checkedKeys, viewUserList, rangeUserList, id, type} = this.state
        if(!viewUserList || viewUserList.length == 0) {
            message.warning('请添加可查看人')
            return
        } else if(!checkedKeys || checkedKeys.length == 0) {
            message.warning('请选择查看模块')
            return
        } else if(!rangeUserList || rangeUserList.length == 0) {
            message.warning('请添加查看范围')
            return
        }
        await this.setState({
            confirmLoading: true
        })
        let businessSpecialId = viewUserList[0].id
        let businessSpecialType = this.changeType(viewUserList[0].type)
        let dataCustomizationScopeList = rangeUserList.map(item => {
            return {
                dataCustomizationId: id,
                dataScopeBusinessId: item.id,
                dataScopeBusinessType: this.changeType(item.type)
            }
        })
        let dataCustomizationModuleList = checkedKeys.map(item => {
            return {
                dataCustomizationId: id,
                dataMouduleId: item
            }
        })
        let obj = {
            businessSpecialId,
            businessSpecialType,
            dataCustomizationScopeList,
            dataCustomizationModuleList
        }
        let result
        if(type == 1) { // 添加
            result = await saveCustomization(obj)
        } else if (type == 3) { // 编辑
            result = await updateCustomization(id, obj)
        }

        if(result && result.success) {
            message.success('保存成功')
            this.setState({
                visible: false,
                confirmLoading: false
            })
            this.props.updateList()
        } else {
            this.setState({
                confirmLoading: false
            })
        }

    }
    footerBtn = () => { // 底部按钮
        if(this.state.type == 2) {
            return null
        } else {
            return [
                    <BIButton onClick = {this.onCancel}>取消</BIButton>,
                    <BIButton
                        type="primary"
                        style={{marginLeft:'20px'}}
                        loading = {this.state.confirmLoading}
                        onClick = {this.onOk}
                    >确定</BIButton>
            ]
        }
    }
    render() {
        let {visible, type,checkedKeys, viewUserList, rangeUserList} = this.state

        return (
            <Modal
                type = {type}
                visible = {visible}
                title = {this.titleText()}
                centered
                destroyOnClose
                bodyStyle = {{padding:'5px 24px'}}
                onCancel = {this.onCancel}
                dataTree = {this.props.dataTree}
                checkedKeys = {checkedKeys}
                onCheckFun = {this.onCheckFun}
                viewUserList = {viewUserList}
                viewUserListOnChange = {this.viewUserListOnChange}
                rangeUserList = {rangeUserList}
                rangeUserListOnChange = {this.rangeUserListOnChange}
                footer = {this.footerBtn()}
            />
        );
    }
}

export default Index;
