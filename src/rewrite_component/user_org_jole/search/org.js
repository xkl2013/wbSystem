import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import styles from '../styles.less';
import { checkoutChildren, handleUserData } from '../_utils/utils';
import { getDepartmentListNoNum } from '@/services/api';
import avatarLogo from '@/assets/avatar.png';
import { Tree } from 'antd';
const { TreeNode } = Tree;
const Search = Input.Search;
//数据回显时应当将id拼成role+id
export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            expandedKeys: [],
            loading: false,
            dataList: [],
            dateType: 'org',
            chooseType: 'org',
        };
        this.getData = async () => {
            await this.setState({ loading: true });
            const response = await getDepartmentListNoNum();
            if (response && response.data) {
                const data = response.data ? [response.data] : [];
                const dataList = handleUserData(data);
                this.setState({
                    dataList,
                    expandedKeys: [String(dataList[0].id)]
                });
            }
            await this.setState({ loading: false });
        };
        this.onExpand = (expandedKeys) => {
            this.setState({
                expandedKeys,
            });
        };
        this.onSelectItem = (obj) => {
            if (this.props.onChange) {
                const data = {
                    id: obj.id,
                    name: this.returnNodeName(obj),
                    type: obj.symbol,
                    avatar: '',
                };
                this.props.onChange(data, obj);
            }
        };
        this.addGroupUsers = (obj) => {
            const { children } = obj;
            const ops = Array.isArray(children) && children.length > 0 ? children : [obj];
            const saveData = checkoutChildren(ops);
            if (this.props.addGroupUsers) {
                const userList = saveData.map((item) => ({
                    id: item.userId,
                    name: this.returnNodeName(item),
                    type: item.symbol,
                    avatar: item.userIcon,
                }));
                this.props.addGroupUsers(userList);
            }
        };
        this.renderAddOrgIcon = (item, isParent) => {
            if (!isParent || this.props.chooseType === 'org')
                return null;
            return React.createElement("span", { className: styles.addOrgIcon, onClick: this.addGroupUsers.bind(this, item) },
                React.createElement(Icon, { type: "plus-circle" }));
        };
        this.onSelectTree = (e, item, isHasChildren) => {
            if (this.props.chooseType !== 'org' && isHasChildren)
                return null;
            this.onSelectItem(item);
        };
        this.onCheck = (obj) => {
            const { value = [] } = this.props;
            return value.some((ls) => ls.type === obj.symbol && String(ls.id) === String(obj.id));
        };
        this.renderTreeTitle = (title, item) => {
            const isChecked = this.onCheck(item);
            const isHasChildren = item.children && item.children.length > 0;
            return (React.createElement("div", { key: item.id, className: `${styles.treeTitle} ${isChecked ? styles.hasCheckedUserItem : ''}`, onClick: (e) => this.onSelectTree(e, item, isHasChildren || false) },
                item.symbol === 'org' ? null : React.createElement(Avatar, { src: item.avatar || avatarLogo, style: { width: '24px', height: '24px', marginRight: '5px' } }),
                React.createElement("span", null, title),
                this.renderAddOrgIcon(item, isHasChildren),
                isChecked ? React.createElement("span", { className: styles.chooseIcon },
                    React.createElement(Icon, { type: "check" })) : null));
        };
        this.returnNodeName = (obj) => {
            const { isRealName = true } = this.props;
            const { symbol } = obj;
            if (symbol === 'org') {
                return obj.departmentName;
            }
            else {
                return isRealName ? obj.userRealName : obj.userChsName;
            }
        };
        this.renderTreeNodes = (data) => {
            return data.map((item) => {
                const title = this.returnNodeName(item);
                if (item.children && item.children.length > 0) {
                    return (React.createElement(TreeNode, { key: item.id, title: this.renderTreeTitle(title, item) }, this.renderTreeNodes(item.children)));
                }
                return item.symbol !== 'org' && this.props.chooseType === 'user' ? React.createElement(TreeNode, { key: item.id, title: this.renderTreeTitle(title, item) }) : null;
            });
        };
        this.renderOrgTree = (data = []) => {
            const { expandedKeys } = this.state;
            return (React.createElement("div", { className: styles.searchInput },
                React.createElement("div", { className: styles.treeList },
                    React.createElement(Tree, { blockNode: true, onExpand: this.onExpand, expandedKeys: expandedKeys, autoExpandParent: true }, this.renderTreeNodes(data)))));
        };
    }
    componentDidMount() {
        const dataList = this.state.dataList || [];
        if (dataList.length > 0)
            return;
        this.getData();
    }
    render() {
        const { loading, dataList } = this.state;
        return (React.createElement(Spin, { spinning: loading }, this.renderOrgTree(dataList || [])));
    }
}
