import React, { Component } from 'react';

import { Tree } from 'antd';

class DataTree extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 创建权限树DOM
    creatTreeDom = dataSource => {
        const { TreeNode } = Tree;
        const result = [];
        if (Array.isArray(dataSource) && dataSource.length > 0) {
            dataSource.map((item, index) => {
                result.push(
                    <TreeNode title={item.moduleName} key={item.moduleId}>
                        {this.creatTreeDom(item.children)}
                    </TreeNode>,
                );
            });
        }
        return result;
    };

    // 权限树选择方法
    onSelect = selectedKeys => {
        if (Array.isArray(selectedKeys) && selectedKeys.length > 0) {
            this.props.treeSelect(selectedKeys[0]);
        }
    };

    render() {
        const { dataSource } = this.props;
        return <Tree onSelect={this.onSelect}>{this.creatTreeDom(dataSource)}</Tree>;
    }
}
export default DataTree;
