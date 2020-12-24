import React from 'react';
import { TreeSelect, Icon, message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIInput from '@/ant_components/BIInput';

import styles from './index.less';

const { SHOW_ALL, TreeNode } = TreeSelect;

// 自定义标题
class TitleMessage extends React.Component {
    handleClick(type, e) {
        e.stopPropagation();
        const { nodeKeys } = this.props;
        this.props.clickOperate(nodeKeys, type);
    }

    render() {
        const { nodeKeys, name } = this.props;
        return (
            <>
                <span className={styles.tagNameCls}>{name}</span>
                {nodeKeys.added ? (
                    <>
                        <span className={styles.addBtnCls} onClick={this.handleClick.bind(this, 'add')}>
                            <Icon type="plus" />
                            新增标签
                        </span>
                    </>
                ) : null}
                {nodeKeys.deleteor ? (
                    <>
                        <span className={styles.delBtnCls} onClick={this.handleClick.bind(this, 'del')}>
                            <Icon type="close" />
                        </span>
                    </>
                ) : null}
            </>
        );
    }
}

class TreeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || [],
            tagsTreeData: [],
            visible: false,
            tagName: '',
        };
    }

    componentWillReceiveProps(next) {
        if (this.props !== next) {
            this.setState({ tagsTreeData: next.tagsTreeData, value: next.value || [] });
        }
    }

    onChange = (value) => {
        this.props.onChange(value);
        this.setState({ value });
    };

    // 操作自定义按钮
    clickOperate = (val, type) => {
        if (type === 'add') {
            this.setState({ visible: true, id: val.id });
        } else if (type === 'del') {
            this.props.deleteTags(val);
        } else {
            // console.warn('type不存在');
        }
    };

    // 新增标签成功以后的回调
    appendTags = (obj = []) => {
        const { value } = this.state;
        this.props.onChange(obj.concat(value));
        this.setState({ value: obj.concat(value) });
    };

    // 弹框中的输入框
    onChangeInput = (e) => {
        const tagName = e.currentTarget.value;
        this.setState({ tagName });
    };

    onCancel = () => {
        this.setState({ visible: false, tagName: '' });
    };

    onOk = () => {
        const { id, tagName } = this.state;
        // eslint-disable-next-line no-unused-expressions
        tagName ? this.props.addTags(id, tagName, this.appendTags, this.onCancel) : message.warn('请输入标签名');
    };

    // 渲染树
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children.length) {
                return (
                    <TreeNode
                        title={<TitleMessage name={item.title} clickOperate={this.clickOperate} nodeKeys={item} />}
                        key={item.id}
                        value={item.id}
                    >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    title={<TitleMessage name={item.title} clickOperate={this.clickOperate} nodeKeys={item} />}
                    key={item.id}
                    value={item.id}
                />
            );
        });
    };

    render() {
        const { tagsTreeData, visible, tagName } = this.state;
        const tProps = {
            showSearch: true,
            blockNode: false,
            treeNodeFilterProp: 'title',
            allowClear: true,
            value: this.state.value,
            onChange: this.onChange,
            treeCheckable: true,
            treeDefaultExpandAll: true,
            treeCheckStrictly: true,
            showCheckedStrategy: SHOW_ALL,
            searchPlaceholder: '请选择',
            style: { width: 270 },
        };
        return (
            <div className={styles.container}>
                <TreeSelect {...tProps}>{this.renderTreeNodes(tagsTreeData)}</TreeSelect>
                <BIModal visible={visible} title="自定义标签" onOk={this.onOk} onCancel={this.onCancel} width={320}>
                    <BIInput onChange={this.onChangeInput} value={tagName} placeholder="请输入标签名" maxLength={20} />
                </BIModal>
            </div>
        );
    }
}

export default TreeComponent;
