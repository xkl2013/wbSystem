import React from 'react';
import { Tree, Spin } from 'antd';

const { TreeNode } = Tree;

class TreeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultCheckedKeys: [],
        };
    }

    getInitKeys = (data) => {
        let initData = [];
        const newData = Array.isArray(data) ? data : [];
        newData.forEach((item) => {
            if (item.menuDisplayed) {
                initData.push(item.menuId);
            }
            if (item.children) {
                initData = [...initData, ...this.getInitKeys(item.children)];
            }
        });
        return initData;
    };

    componentWillReceiveProps(next) {
        if (this.props.dataSource !== next.dataSource) {
            const defaultCheckedKeys = this.getInitKeys(next.dataSource);
            this.setState({ defaultCheckedKeys });
        }
    }

    onCheck = (checkedKeys) => {
        const checked = checkedKeys.checked || [];
        this.setState({
            defaultCheckedKeys: checked,
        });
        this.props.onCheck(checked);
    };

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.menuName} key={item.menuId} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.menuId} title={item.menuName} {...item} selectedKeys />;
        });
    };

    render() {
        const { disabled, dataSource, loading } = this.props;
        const { defaultCheckedKeys } = this.state;
        return (
            <Spin spinning={loading}>
                {dataSource && dataSource.length ? (
                    <Tree
                        checkable
                        checkStrictly={true}
                        disabled={disabled}
                        checkedKeys={defaultCheckedKeys}
                        onCheck={this.onCheck}
                        defaultExpandAll={true}
                    >
                        {this.renderTreeNodes(dataSource || [])}
                    </Tree>
                ) : null}
            </Spin>
        );
    }
}

export default TreeComponent;
