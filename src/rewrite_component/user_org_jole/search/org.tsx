import React from 'react';
import { Icon, message, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import styles from '../styles.less';
import { Node, Item } from '../searchBox';
import { checkoutChildren, handleUserData } from '../_utils/utils';
import { getDepartmentList, getDepartmentListNoNum } from '@/services/api';
import avatarLogo from '@/assets/avatar.png';
import { Tree } from 'antd';
const { TreeNode } = Tree;

interface Props {
    value?: any,
    onChange?: Function,
    isRealName?: boolean,
    addGroupUsers?: Function,
    chooseType: 'user' | 'org'
}
const Search = Input.Search;
//数据回显时应当将id拼成role+id
export default class UserList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    state = {
        searchValue: '',
        expandedKeys: [],
        loading: false,
        dataList: [],
        dateType: 'org',
        chooseType: 'org',    // 选择数据类型,默认是org,如果是user的话,只能选择用户头像,且不可选组织
    }
    componentDidMount() {
        const dataList = this.state.dataList || [];
        if (dataList.length > 0) return;
        this.getData();
    }
    getData = async () => {
        await this.setState({ loading: true });
        const response = await getDepartmentListNoNum();
        if (response && response.data) {
            const data = response.data ? [response.data] : [];
            const dataList = handleUserData(data)
            this.setState({
                dataList,
                expandedKeys: [String(dataList[0].id)]
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
        if (this.props.onChange) {
            const data = {
                id: obj.id,
                name: this.returnNodeName(obj),
                type: obj.symbol,
                avatar: '',
            }
            this.props.onChange(data, obj);
        }
    }
    addGroupUsers = (obj: any) => {
        const { children } = obj;
        const ops = Array.isArray(children) && children.length > 0 ? children : [obj];
        const saveData = checkoutChildren(ops);
        if (this.props.addGroupUsers) {
            const userList = saveData.map((item: any) => ({
                id: item.userId,
                name: this.returnNodeName(item),
                type: item.symbol,
                avatar: item.userIcon,
            }))
            this.props.addGroupUsers(userList);
        }
    }
    renderAddOrgIcon = (item: Node, isParent: boolean | undefined) => {
        if (!isParent || this.props.chooseType === 'org') return null;
        return <span className={styles.addOrgIcon} onClick={this.addGroupUsers.bind(this, item)}><Icon type="plus-circle" /></span>
    }
    onSelectTree = (e: any, item: Node, isHasChildren: boolean) => {
        if (this.props.chooseType !== 'org' && isHasChildren) return null;
        this.onSelectItem(item)
    }
    onCheck = (obj: any) => {
        const { value = [] } = this.props;
        return value.some((ls: any) => ls.type === obj.symbol && String(ls.id) === String(obj.id));
    }
    renderTreeTitle = (title: any, item: Node) => {
        const isChecked = this.onCheck(item);
        const isHasChildren = item.children && item.children.length > 0;
        return (
            <div key={item.id} className={`${styles.treeTitle} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                onClick={(e) => this.onSelectTree(e, item, isHasChildren || false)}>
                {item.symbol === 'org' ? null : <Avatar src={item.avatar || avatarLogo} style={{ width: '24px', height: '24px', marginRight: '5px' }} />}
                <span>{title}</span>
                {this.renderAddOrgIcon(item, isHasChildren)}
                {isChecked ? <span className={styles.chooseIcon}>
                    <Icon type="check" /></span> : null}
            </div>
        );

    }
    returnNodeName = (obj: any) => {
        const { isRealName = true } = this.props;
        const { symbol } = obj;
        if (symbol === 'org') {
            return obj.departmentName
        } else {
            return isRealName ? obj.userRealName : obj.userChsName;
        }
    }
    renderTreeNodes = (data: any) => {
        return data.map((item: any) => {
            const title = this.returnNodeName(item);
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode key={item.id} title={this.renderTreeTitle(title, item)}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return item.symbol !== 'org' && this.props.chooseType === 'user' ? <TreeNode key={item.id} title={this.renderTreeTitle(title, item)} /> : null;
        });
    }
    renderOrgTree = (data = []) => {
        const { expandedKeys } = this.state;
        return (
            <div className={styles.searchInput}>
                <div className={styles.treeList}>
                    <Tree
                        blockNode={true}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={true}
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
