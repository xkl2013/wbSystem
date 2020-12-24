import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from '../styles.less';
import { defaultConfig } from '../_utils/utils';
import { getUserList } from '@/services/globalSearchApi';
const Search = Input.Search;
const avatar = defaultConfig['user'].avatar;
export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            userData: [],
            loading: false,
            dateType: 'user',
        };
        this.input = null;
        this.getUserData = lodash.debounce(async (val) => {
            await this.setState({ loading: true });
            const params = {};
            if (this.props.isRealName) {
                params.userRealName = val;
            }
            else {
                params.userChsName = val;
            }
            const response = await getUserList(params);
            if (response && response.success) {
                const data = response.data || {};
                let userData = Array.isArray(data.list) ? data.list : [];
                this.setState({
                    userData
                });
            }
            await this.setState({ loading: false });
        }, 400);
        this.onSelectItem = (obj) => {
            const { userId, userRealName, userChsName, userIcon } = obj;
            if (this.props.onChange) {
                const name = this.props.isRealName ? userRealName : userChsName;
                const data = { id: userId, name, avatar: userIcon, type: 'user', userList: [obj] };
                this.props.onChange(data, obj);
            }
        };
        this.onChangeSearch = (e) => {
            const value = e.currentTarget.value;
            this.getUserData(value);
        };
        this.onCheck = (obj) => {
            const { value = [] } = this.props;
            return value.some((ls) => ls.type === this.state.dateType && String(ls.id) === String(obj.userId));
        };
        this.renderSampleUserList = () => {
            const { userData } = this.state;
            return userData.map((item, index) => {
                const { value = [] } = this.props;
                const isChecked = this.onCheck(item);
                return (React.createElement("li", { key: index, className: `${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`, onClick: this.onSelectItem.bind(this, item) },
                    React.createElement(Avatar, { src: item.userIcon || avatar, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { marginLeft: '10px' } }, this.props.isRealName ? item.userRealName : item.userChsName),
                    isChecked ? React.createElement("span", { className: styles.chooseIcon },
                        React.createElement(Icon, { type: "check" })) : null));
            });
        };
        this.renderSearchInput = () => {
            return (React.createElement("div", { className: styles.searchInput },
                React.createElement(Search, { className: styles.inputStyle, placeholder: "\u641C\u7D22\u7528\u6237", onChange: this.onChangeSearch, ref: (dom) => this.input = dom }),
                React.createElement("div", { className: styles.allUserDes }, "\u5168\u90E8\u8054\u7CFB\u4EBA"),
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
