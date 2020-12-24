import React from 'react';
import { Icon, message, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from '../styles.less';
import { defaultConfig } from '../_utils/utils';
import { Node, Item } from '../searchBox';
import { getUserList } from '@/services/globalSearchApi';

interface Props {
    value?: any,
    onChange?: Function,
    isRealName?: boolean,
}
const Search = Input.Search;

const avatar = defaultConfig['user'].avatar;
export default class UserList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    state = {
        searchValue: '',
        userData: [],
        loading: false,
        dateType: 'user',
    }
    input: any = null;
    public componentDidMount() {
        this.input && this.input.focus();
        this.getUserData('');
    }
    getUserData = lodash.debounce(async (val: string) => {
        await this.setState({ loading: true });
        const params: any = {};
        if (this.props.isRealName) {
            params.userRealName = val
        } else {
            params.userChsName = val
        }
        const response = await getUserList(params);
        if (response && response.success) {
            const data = response.data || {};
            let userData = Array.isArray(data.list) ? data.list : [];
            this.setState({
                userData
            })
        }
        await this.setState({ loading: false });
    }, 400)
    onSelectItem = (obj: any) => {
        const { userId, userRealName, userChsName, userIcon } = obj;
        if (this.props.onChange) {
            const name = this.props.isRealName ? userRealName : userChsName
            const data: Item = { id: userId, name, avatar: userIcon, type: 'user', userList: [obj] };
            this.props.onChange(data, obj);
        }
    }
    onChangeSearch = (e: any) => {
        const value = e.currentTarget.value;
        this.getUserData(value)

    }
    onCheck = (obj: any) => {
        const { value = [] } = this.props;
        return value.some((ls: Item) => ls.type === this.state.dateType && String(ls.id) === String(obj.userId));
    }
    renderSampleUserList = () => {
        const { userData } = this.state;
        return userData.map((item: any, index: number) => {
            const { value = [] } = this.props;
            const isChecked = this.onCheck(item);
            return (
                <li key={index} className={`${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <Avatar src={item.userIcon || avatar} style={{ width: '24px', height: '24px' }} />
                    <span style={{ marginLeft: '10px' }}>{this.props.isRealName ? item.userRealName : item.userChsName}</span>
                    {isChecked ? <span className={styles.chooseIcon}>
                        <Icon type="check" /></span> : null}
                </li>);
        })
    };
    renderSearchInput = () => {
        return (
            <div className={styles.searchInput}>
                <Search className={styles.inputStyle} placeholder="搜索用户" onChange={this.onChangeSearch} ref={(dom: any) => this.input = dom} />
                <div className={styles.allUserDes}>全部联系人</div>
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
