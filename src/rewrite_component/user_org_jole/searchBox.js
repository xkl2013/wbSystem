import React from 'react';
import Input from '@/ant_components/BIInput';
import { Tree } from 'antd';
import styles from './styles.less';
import RoleList from './search/role';
import UserList from './search/user';
import Department from './search/org';
const { TreeNode } = Tree;
const Search = Input.Search;
class RenderSearch extends React.Component {
    constructor() {
        super(...arguments);
        this.renderRoleList = () => {
            if (this.props.searchType !== 'role')
                return null;
            const pannelConfig = this.props.pannelConfig || {};
            let params = pannelConfig['role'] || {};
            params = { ...this.props, ...params };
            return React.createElement(RoleList, Object.assign({}, params));
        };
        this.renderUserList = () => {
            if (this.props.searchType !== 'user')
                return null;
            const pannelConfig = this.props.pannelConfig || {};
            let params = pannelConfig['user'] || {};
            params = { ...this.props, ...params };
            return React.createElement(UserList, Object.assign({}, params));
        };
        this.renderOrgTree = () => {
            if (this.props.searchType !== 'org')
                return null;
            const pannelConfig = this.props.pannelConfig || {};
            let params = pannelConfig['org'] || {};
            params = { ...this.props, ...params };
            return React.createElement(Department, Object.assign({}, params));
        };
    }
    render() {
        return (React.createElement("div", { className: styles.searchBox },
            this.renderUserList(),
            this.renderOrgTree(),
            this.renderRoleList()));
    }
}
export default RenderSearch;
