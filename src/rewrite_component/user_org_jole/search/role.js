import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from '../styles.less';
import { getRoleList } from '@/services/globalSearchApi';
import { defaultConfig } from '../_utils/utils';
const Search = Input.Search;
const avatar = defaultConfig['role'].avatar;
export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            roleData: [],
            loading: false,
            dateType: 'role',
        };
        this.input = null;
        this.getUserData = lodash.debounce(async (roleName) => {
            await this.setState({ loading: true });
            const response = await getRoleList({ roleName });
            if (response && response.success) {
                let roleData = Array.isArray(response.data) ? response.data : [];
                this.setState({
                    roleData
                });
            }
            await this.setState({ loading: false });
        }, 400);
        this.addDeparment = () => {
            if (this.props.onChange) {
                const data = { id: '', name: '', type: 'department', userList: [], avatar: '' };
                this.props.onChange(data);
            }
        };
        this.onSelectItem = (obj) => {
            if (this.props.onChange) {
                const data = { id: obj.roleId, name: obj.roleName, type: 'role', userList: obj.userList };
                this.props.onChange(data, obj);
            }
        };
        this.onCheck = (obj) => {
            const { value = [] } = this.props;
            return value.some((ls) => ls.type === this.state.dateType && String(ls.id) === String(obj.roleId));
        };
        this.onChangeSearch = (e) => {
            const value = e.currentTarget.value;
            this.getUserData(value);
        };
        this.renderSampleUserList = () => {
            const { roleData } = this.state;
            if (this.props.renderPannel)
                return this.props.renderPannel(roleData);
            return roleData.map((item) => {
                const { value = [] } = this.props;
                const isChecked = this.onCheck(item);
                return (React.createElement("li", { key: item.roleId, className: `${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`, onClick: this.onSelectItem.bind(this, item) },
                    React.createElement(Avatar, { src: item.roleIcon || avatar, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { marginLeft: '10px' } }, item.roleName),
                    isChecked ? React.createElement("span", { className: styles.chooseIcon },
                        React.createElement(Icon, { type: "check" })) : null));
            });
        };
        this.renderDepartment = () => {
            return (React.createElement("span", { style: { marginLeft: '15px', color: '#5C99FFFF', cursor: 'pointer' }, onClick: this.addDeparment }, "\u90E8\u95E8\u4E3B\u7BA1"));
        };
        this.renderSearchInput = () => {
            const { isDepartment } = this.props;
            return (React.createElement("div", { className: styles.searchInput },
                React.createElement(Search, { className: styles.inputStyle, placeholder: "\u641C\u7D22\u89D2\u8272", onChange: this.onChangeSearch, ref: (dom) => this.input = dom }),
                React.createElement("div", { className: styles.allUserDes }, isDepartment ? this.renderDepartment() : '全部角色'),
                React.createElement("ul", { className: styles.userList }, this.renderSampleUserList())));
        };
    }
    componentDidMount() {
        this.input && this.input.focus();
        this.getUserData('');
    }
    render() {
        const { loading } = this.state;
        return (React.createElement(Spin, { spinning: loading }, this.renderSearchInput()));
    }
}
