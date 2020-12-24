
import React, { Component } from 'react';
import { Tree } from 'antd';
import styles from './index.less';
import _ from 'lodash'
const { TreeNode } = Tree;


class Index extends Component {
    constructor(props) {
        super(props);
    }
    onCheck = (selKey,e) => { // 树节点 check 事件
        let {checked, node:{props} = {}} = e
        let key = Number(props.eventKey)
        let checkedKeys = this.props.checkedKeys || []
        let parentsKeys = this.getParentsIds(key, this.props.dataTreeShow)
        let childKes = this.getChildIds(key, this.props.dataTreeShow)
        let newArr = []
        if (checked) {
            newArr = _.uniq([key, ...checkedKeys, ...parentsKeys, ...childKes])
        } else {
            newArr = _.difference(checkedKeys, [key, ...childKes])
        }
        this.props.onCheckFun(newArr)
    }
    getParentsIds = (currentId,treeData) => { // 根据ID 获取直系父ID集合
        let arr = []
        function getParentsIdsFunc(data) {
            for (let i = 0; i < data.length; i++) {
                let temp = data[i]
                if (temp.moduleId == currentId) {
                    // arr.push(temp.moduleId);
                    return 1
                }
                if (temp && temp.children && temp.children.length > 0) {
                    let t = getParentsIdsFunc(temp.children)
                    if (t == 1) {
                        arr.push(temp.moduleId)
                        return 1
                    }
                }
            }
        }
        getParentsIdsFunc(treeData)
        return arr
    }
    getChildIds = (currentId,treeData) => { // 根据ID 获取直系子ID集合
        let arr = []
        function getChildIdsFunc(data) {
            data.map(item => {
                if(item.moduleId == currentId || arr.includes(item.moduleId)) {
                    if(item.children && item.children.length > 0) {
                        item.children.map(i => {
                            arr.push(i.moduleId)
                        })
                    }
                }
                if(item.children && item.children.length > 0) {
                    getChildIdsFunc(item.children)
                }
            })
        }
        getChildIdsFunc(treeData)
        return arr
    }
    renderTreeNodes = data => data.map(item => { // 子节点
        if (item.children && item.children.length > 0) {
            return (
                <TreeNode title={item.moduleName} key={item.moduleId}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.moduleName} key={item.moduleId} />;
    });

    render() {
        return (
            <div className = {styles.treeHeight}>
                <Tree
                    checkable
                    checkStrictly
                    defaultExpandAll
                    disabled = {this.props.type == 2 ? true : false}
                    selectable = {false}
                    checkedKeys = {this.props.checkedKeys}
                    onCheck = {this.onCheck}
                >
                    {this.renderTreeNodes(this.props.dataTreeShow)}
                </Tree>
            </div>
        );
    }
}

export default Index;
