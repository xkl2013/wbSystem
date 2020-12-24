import React from 'react';
import styles from './styles.less';

import UserList from './search/user';


export interface Node {
    id: number | string;
    name: string;
    parent?: any;
    children?: any[];
    symbol?: string;
    avatar: string;
}
export interface Item {
    id: number | string;
    name: string;
    type: 'actor' | 'blogger';
    uid?: number;
    avatar?: string;
    userList?: [{ id: string; name: string; avatar?: string }];
}
interface Props {
    searchType: string;
    value?: Item[];
    onChange: Function;
    isRealName?: boolean;
    addGroupUsers?: Function;
    pannelConfig?: any;
    addDartment?: Function;
}

class RenderSearch extends React.Component<Props> {
    renderUserList = () => {
        const { searchType } = this.props;
        if (searchType !== 'actor' && searchType !== 'blogger') return null;
        const pannelConfig = this.props.pannelConfig || {};
        let params = pannelConfig[searchType] || {};
        params = { ...this.props, ...params };
        return <UserList {...params} />;
    };
    render() {
        return <div className={styles.searchBox}>{this.renderUserList()}</div>;
    }
}

export default RenderSearch;
