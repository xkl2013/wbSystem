import React from 'react';
import { Icon, message } from 'antd';
import Input from '@/ant_components/BIInput';
import memoizeOne from 'memoize-one'
import { Tree } from 'antd';
import styles from './styles.less';

import { handleUserData, checkoutParentNode, checkoutChildren } from './_utils/utils'

const { TreeNode } = Tree;
const Search = Input.Search;


export interface Node {
    id: number | string,
    name: string,
    parent?: any,
    children?: any[],
    symbol?: string,
    userIcon?: string,

}
export interface Item {
    id: number | string,
    name: string,
    avatar?: string,
}
interface Props {
    searchType: string,
    value?: Item[],
    onChange: Function,
    data: any,
}
interface State {
    searchValue: string,
    expandedKeys: any[],
    autoExpandParent: boolean,
}


class RenderSearch extends React.Component<Props>{
    state: State = {
        searchValue: '',
        expandedKeys: [],
        autoExpandParent: true,
    }
    dataList: any[] = [];
    input: any = null;
    memoizeOneGetData = memoizeOne(handleUserData);
    memoizeOneGetParentData = memoizeOne(checkoutParentNode);
    public componentDidMount() {
        this.input && this.input.focus()
    }
    public componentWillReceiveProps(nextProps: any) {
        if (nextProps.searchType !== this.props.searchType && nextProps.searchType === 'org') {
            this.changeTab(this.state.searchValue);
        }
    }
    onExpand = (expandedKeys: any) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onChangeSearch = (e: MouseEvent) => {
        const current: any = e.currentTarget || {}
        const searchValue: string = current.value;
        this.setState({ searchValue });
    }
    changeTab = (searchValue: string) => {
        const expandedKeys = this.dataList
            .map((item: any) => {
                if (item.name.indexOf(searchValue) > -1) {
                    return this.checkoutIsParentNode(item) ? item.id : item.parent.id;
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({ expandedKeys, searchValue })
    }
    onSearchTreeUsers = (e: MouseEvent) => {
        const current: any = e.currentTarget || {}
        const searchValue: string = current.value;
        const expandedKeys = this.filterSearchNode(searchValue, this.dataList);
        this.setState({ expandedKeys, searchValue })
    }
    filterSearchNode = (str: string, data: any) => {
        return data
            .map((item: any) => {
                if (item.name.indexOf(str) > -1) {
                    return this.checkoutIsParentNode(item) ? item.id : item.parent.id;
                }
                return null;
            })
            .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    }
    onSelectItem = (obj: Node) => {
        const value = this.props.value || [];
        const { id, name, userIcon, symbol } = obj;
        if (this.props.onChange && symbol !== 'org') {
            const user = value.find(item => String(item.id) === String(obj.id));
            if (!user) {
                value.push({ id, name, avatar: userIcon })
                this.props.onChange(obj, value);
            }

        }
    }
    onSelectTree = (e: any, item: Node, isHasChildren: boolean) => {
        if (isHasChildren) return null;
        this.onSelectItem(item)
    }
    addGroupUsers = (obj: Node) => {
        const { children } = obj;
        const { value = [] } = this.props;
        const ops = Array.isArray(children) && children.length > 0 ? children : [obj];
        const saveData = checkoutChildren(ops);
        if (this.props.onChange) {
            this.props.onChange(obj, [...value, ...saveData]);
        }
    }
    checkoutIsParentNode = (item: Node) => {
        return !item.parent || (item.children && item.children.length > 0)
    }
    renderSearchTitle = (item: Node): any => {
        const { searchValue } = this.state;
        if (!item.name) return item.name;
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const title =
            index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                    <span>{item.name}</span>
                );
        return title;
    }
    renderSampleUserList = (data: any) => {
        const { searchValue } = this.state;
        const nodes = data.filter((item: any) => item.name.indexOf(searchValue) > -1);
        return nodes.map((item: any) => {
            const { value = [] } = this.props;
            const isChecked = value.some((ls: Item) => String(ls.id) === String(item.id));
            const title = this.renderSearchTitle(item);
            return (
                <li key={item.id} className={`${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <span>{title}</span>
                    {isChecked ? <span className={styles.chooseIcon}>
                        <Icon type="check" /></span> : null}
                </li>);
        })
    };
    renderAddOrgIcon = (item: Node, isParent: boolean | undefined) => {
        if (!isParent) return null;
        return <span className={styles.addOrgIcon} onClick={this.addGroupUsers.bind(this, item)}><Icon type="plus-circle" /></span>
    }
    renderTreeTitle = (title: any, item: Node) => {
        const { value = [] } = this.props;
        const isChecked = value.some((ls: Item) => String(ls.id) === String(item.id));
        const isHasChildren = item.children && item.children.length > 0;
        return (
            <div key={item.id} className={`${styles.treeTitle} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                onClick={(e) => this.onSelectTree(e, item, isHasChildren || false)}>
                <span>{title}</span>
                {this.renderAddOrgIcon(item, isHasChildren)}
                {isChecked ? <span className={styles.chooseIcon}>
                    <Icon type="check" /></span> : null}
            </div>
        );

    }
    renderTreeNodes = (data: any) => {
        return data.map((item: any) => {
            const title = this.renderSearchTitle(item);
            if (item.children) {
                return (

                    <TreeNode key={item.id} title={this.renderTreeTitle(title, item)}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={this.renderTreeTitle(title, item)} />;
        });
    }

    renderOrgTree = (data = []) => {
        if (this.props.searchType !== 'org') return null;
        const { expandedKeys, autoExpandParent, searchValue } = this.state;
        return (
            <div className={styles.searchInput}>
                <Search className={styles.inputStyle} placeholder="搜索组织用户" onChange={this.onSearchTreeUsers} value={searchValue} />
                <div className={styles.treeList}>
                    <Tree
                        blockNode={true}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                    >
                        {this.renderTreeNodes(data)}
                    </Tree>
                </div>


            </div>

        )
    }
    renderSearchInput = (data = []) => {
        const { searchValue } = this.state;
        if (this.props.searchType !== 'user') return null;
        return (
            <div className={styles.searchInput}>
                <Search className={styles.inputStyle} ref={(dom: any) => this.input = dom} placeholder="搜索用户" onChange={this.onChangeSearch} value={searchValue} />
                <div className={styles.allUserDes}>全部联系人</div>
                <ul className={styles.userList}>
                    {this.renderSampleUserList(data)}
                </ul>

            </div>
        )
    }
    render() {
        const { users = [], orgData = [], allNodes = [] } = this.memoizeOneGetData(this.props.data || []);
        this.dataList = allNodes;
        return (
            <div className={styles.searchBox}>
                {this.renderSearchInput(users)}
                {this.renderOrgTree(orgData)}
            </div>
        )
    }

}

export default RenderSearch;
