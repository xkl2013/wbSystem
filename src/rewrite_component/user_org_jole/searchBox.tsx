import React from 'react';
import { Icon, message } from 'antd';
import Input from '@/ant_components/BIInput';
import memoizeOne from 'memoize-one'
import { Tree } from 'antd';
import styles from './styles.less';

import { handleUserData, checkoutParentNode, checkoutChildren } from './_utils/utils'
import RoleList from './search/role';
import UserList from './search/user';
import Department from './search/org'

const { TreeNode } = Tree;
const Search = Input.Search;


export interface Node {
    id: number | string,
    name: string,
    parent?: any,
    children?: any[],
    symbol?: string,
    avatar: string,
}
export interface Item {
    id: number | string,
    name: string,
    type: 'user' | 'org' | 'role' | 'department',
    uid?: number,
    avatar?: string,
    userList?: [{ id: string, name: string, avatar?: string }]
}
interface Props {
    searchType: string,
    value?: Item[],
    onChange: Function,
    isRealName?: boolean,
    addGroupUsers?: Function,
    pannelConfig?: any,
    addDartment?: Function,
}


class RenderSearch extends React.Component<Props>{
    renderRoleList = () => {
        if (this.props.searchType !== 'role') return null;
        const pannelConfig = this.props.pannelConfig || {};
        let params = pannelConfig['role'] || {}
        params = { ...this.props, ...params };
        return <RoleList {...params} />
    }
    renderUserList = () => {
        if (this.props.searchType !== 'user') return null;
        const pannelConfig = this.props.pannelConfig || {};
        let params = pannelConfig['user'] || {}
        params = { ...this.props, ...params };
        return <UserList {...params} />
    }
    renderOrgTree = () => {
        if (this.props.searchType !== 'org') return null;
        const pannelConfig = this.props.pannelConfig || {};
        let params = pannelConfig['org'] || {}
        params = { ...this.props, ...params };
        return <Department {...params} />
    }
    render() {
        return (
            <div className={styles.searchBox}>
                {this.renderUserList()}
                {this.renderOrgTree()}
                {this.renderRoleList()}
            </div>
        )
    }

}

export default RenderSearch;
