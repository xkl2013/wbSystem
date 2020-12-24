import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from '../styles.less';
import { Node, Item } from '../searchBox';
import { getRoleList } from '@/services/globalSearchApi';
import { defaultConfig } from '../_utils/utils';
import avatarLogo from '@/assets/avatar.png';

interface Props {
    value?: any,
    onChange?: Function,
    renderPannel?: Function,
    isDepartment?: boolean,
}
const Search = Input.Search;
const avatar = defaultConfig['role'].avatar;

export default class UserList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    state = {
        searchValue: '',
        roleData: [],
        loading: false,
        dateType: 'role',
    }
    input: any = null;
    public componentDidMount() {
        this.input && this.input.focus();
        this.getUserData('');
    }
    getUserData = lodash.debounce(async (roleName: string) => {
        await this.setState({ loading: true });
        const response = await getRoleList({ roleName });
        if (response && response.success) {
            let roleData = Array.isArray(response.data) ? response.data : [];
            this.setState({
                roleData
            })
        }
        await this.setState({ loading: false });
    }, 400)
    addDeparment = () => {
        if (this.props.onChange) {
            const data = { id: '', name: '', type: 'department', userList: [], avatar: '' }
            this.props.onChange(data);
        }
    }
    onSelectItem = (obj: any) => {
        if (this.props.onChange) {
            const data = { id: obj.roleId, name: obj.roleName, type: 'role', userList: obj.userList }
            this.props.onChange(data, obj);
        }
    }
    onCheck = (obj: any) => {
        const { value = [] } = this.props;
        return value.some((ls: Item) => ls.type === this.state.dateType && String(ls.id) === String(obj.roleId));
    }
    onChangeSearch = (e: any) => {
        const value = e.currentTarget.value;
        this.getUserData(value)
    }
    renderSampleUserList = () => {
        const { roleData } = this.state;
        if (this.props.renderPannel) return this.props.renderPannel(roleData);
        return roleData.map((item: any) => {
            const { value = [] } = this.props;
            const isChecked = this.onCheck(item);
            return (
                <li key={item.roleId} className={`${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <Avatar src={item.roleIcon || avatar} style={{ width: '24px', height: '24px' }} />
                    <span style={{ marginLeft: '10px' }}>{item.roleName}</span>
                    {isChecked ? <span className={styles.chooseIcon}>
                        <Icon type="check" /></span> : null}
                </li>);
        })
    };
    renderDepartment = () => {
        return (
            <span style={{ marginLeft: '15px', color: '#5C99FFFF', cursor: 'pointer' }} onClick={this.addDeparment}>部门主管</span>
        )
    }
    renderSearchInput = () => {
        const { isDepartment } = this.props;
        return (
            <div className={styles.searchInput}>
                <Search className={styles.inputStyle} placeholder="搜索角色" onChange={this.onChangeSearch} ref={(dom: any) => this.input = dom} />
                <div className={styles.allUserDes}>{isDepartment ? this.renderDepartment() : '全部角色'}</div>
                <ul className={styles.userList}>
                    {this.renderSampleUserList()}
                </ul>

            </div>
        )
    }
    render() {
        const { loading } = this.state;
        return (
            <Spin spinning={loading}>
                {this.renderSearchInput()}
            </Spin>
        )
    }
}
