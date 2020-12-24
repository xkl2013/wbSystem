import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import styles from '../styles.less';
import { Node, Item } from '../index';
import { checkoutChildren, handleUserData } from '../_utils/utils';
import { getDepartmentListNoNum, getDepartmentList } from '@/services/api';
import avatarLogo from '@/assets/avatar.png';
import { Tree } from 'antd';
const { TreeNode } = Tree;

interface Props {
    value?: any,
    onChange?: Function,
    renderTitle?: Function,
    checkedKeys: string[],
    onCheck?: Function,
    checkable?: boolean,
    maxHeight?: number | undefined
}
//数据回显时应当将id拼成role+id
export default class UserList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);

    }
    update: any = true;
    state = {
        searchValue: '',
        expandedKeys: [],
        loading: false,
        dataList: []
    }
    componentDidMount() {
        const dataList = this.state.dataList || [];
        if (dataList.length > 0) return;
        this.update = true;
        this.getData();
    }
    componentWillUnmount() {
        this.update = false;
    }
    getData = async () => {
        if (!this.update) return;
        await this.setState({ loading: true });
        const response = await getDepartmentListNoNum();
        if (response && response.data) {
            const data = response.data ? [response.data] : [];
            const dataList = handleUserData(data)
            this.setState({
                dataList,
                expandedKeys: [dataList[0].id]
            })
        }
        await this.setState({ loading: false });
    }
    onExpand = (expandedKeys: any) => {
        this.setState({
            expandedKeys,
        });
    };
    onSelectItem = (obj: Node) => {
        const { id, name, symbol } = obj;
        const { value = [] } = this.props;
        if (this.props.onChange && symbol !== 'org') {
            value.push({ id, name })
            this.props.onChange(obj, value);
        }
    }

    addGroupUsers = (obj: Node) => {
        const { children } = obj;
        const { value = [] } = this.props;
        const ops = Array.isArray(children) && children.length > 0 ? children : [obj];
        const saveData = checkoutChildren(ops, value);
        if (this.props.onChange) {
            this.props.onChange(obj, [...value, ...saveData]);
        }
    }
    renderAddOrgIcon = (item: Node, isParent: boolean | undefined) => {
        if (!isParent) return null;
        return <span className={styles.addOrgIcon} onClick={this.addGroupUsers.bind(this, item)}>
            <Icon type="plus-circle" /></span>
    }
    onSelectTree = (e: any, item: Node, isHasChildren: boolean) => {
        if (isHasChildren) return null;
        this.onSelectItem(item)
    }
    onCheck = (checkedKeys: any, { checkedNodes }: any) => {
        if (this.props.onCheck) {
            const nodes = checkedNodes.filter((item: any) => (item.key || '').indexOf('org-name') < 0);
            const valueMap = nodes.map((item: any) => {
                return (item.props || {}).data || {}
            })
            this.props.onCheck(checkedKeys, valueMap)
        }
    }
    renderTreeTitle = (title: any, item: Node) => {
        const { value = [] } = this.props;
        if (this.props.renderTitle) {
            return this.props.renderTitle(title, item)
        }
        const isChecked = value.some((ls: Item) => String(ls.id) === String(item.id));
        const isHasChildren = item.children && item.children.length > 0;
        return (
            <div key={item.id} className={`${styles.treeTitle} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                onClick={(e) => this.onSelectTree(e, item, isHasChildren || false)}>
                {item.symbol === 'org' ? null : <Avatar src={item.avatar || avatarLogo} size="small" />}
                <span style={{ marginLeft: '5px' }}>{title}</span>
                {this.renderAddOrgIcon(item, isHasChildren)}
                {isChecked ? <span className={styles.chooseIcon}>
                    <Icon type="check" /></span> : null}
            </div>
        );

    }
    renderTreeNodes = (data: any) => {
        return data.map((item: any) => {
            const title = item.name;
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode key={String(item.id)} title={this.renderTreeTitle(title, item)} data={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={String(item.id)} title={this.renderTreeTitle(title, item)} data={item} />;
        });
    }
    renderOrgTree = (data = []) => {
        const { expandedKeys } = this.state;
        const maxHeight: number = this.props.maxHeight || 0;
        const style = maxHeight ? { height: maxHeight } : {}
        if (data.length === 0) return null;

        return (
            <div className={styles.searchInput}>
                <div className={styles.treeList} style={style}>
                    <Tree
                        checkable={this.props.checkable}
                        blockNode={true}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={true}
                        checkedKeys={this.props.checkedKeys}
                        onCheck={this.onCheck}
                    >
                        {this.renderTreeNodes(data)}
                    </Tree>
                </div>


            </div>

        )
    }
    render() {
        const { loading, dataList } = this.state;
        return (
            <Spin spinning={loading}>
                {this.renderOrgTree(dataList || [])}
            </Spin>
        )
    }
}
