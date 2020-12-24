import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';
import UserList from './component/user';
import Department from './component/org';
import { checkoutChildren } from './_utils/utils';


export interface Node {
    id: number | string,
    name: string,
    parent?: any,
    children?: any[],
    symbol?: string,
    avatar: string
}
export interface Item {
    id: number | string,
    name: string,
}
interface Props {
    searchType: string,
    value?: Item[],
    onChange: Function,
    renderTitle?: Function,
    checkable?: boolean,
    renderAddOrgIcon?: Function,   //渲染部门节点后面的icon
    onClickIcon?: Function,         // 点击icon事件
    onCheck?: Function,
    checkedKeys?: string[],
}
const Search = Input.Search;

class RenderSearch extends React.Component<Props>{
    input: any = null;
    user: any = null
    state = {
        searchType: 'org',
        searchValue: '',
        checkedKeys: this.props.checkedKeys || [],
    }
    static checkoutChildren = checkoutChildren
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.checkedKeys) !== JSON.stringify(this.props.checkedKeys)) {
            this.setState({ checkedKeys: nextProps.checkedKeys })
        }
    }
    onChangeSearch = (e: any) => {
        const value = e.target.value;
        this.setState({ searchType: value ? 'user' : 'org' });
        if (this.user) {
            this.user.getUserData && value && this.user.getUserData(value);
        }
    }
    onCheck = (checkedKeys: string[], checkedKeysMap: any) => {
        if (this.props.onCheck) {
            this.props.onCheck(checkedKeys, checkedKeysMap)
        }
        this.setState({ checkedKeys })
    }
    renderUserList = () => {
        if (this.state.searchType !== 'user') return null;
        return <UserList {...this.props} checkedKeys={this.state.checkedKeys} onCheck={this.onCheck} ref={(dom: any) => this.user = dom} />
    }
    renderOrgTree = () => {
        if (this.state.searchType !== 'org') return null;
        return <Department {...this.props} checkedKeys={this.state.checkedKeys} onCheck={this.onCheck} />
    }
    render() {
        return (
            <>
                <div className={styles.searchInput}>
                    <Search className={styles.inputStyle}
                        allowClear placeholder="搜索用户"
                        onChange={this.onChangeSearch}
                        ref={(dom: any) => this.input = dom} />
                </div>
                <div className={styles.searchBox}>
                    {this.renderUserList()}
                    {this.renderOrgTree()}
                </div>
            </>
        )
    }

}

export default RenderSearch;