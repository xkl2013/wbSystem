import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from '../styles.less';
import { defaultConfig } from '../_utils/utils';

interface Props {
    value?: any,
    onChange?: Function,
    instanceName?: string,
    request?: Function,
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
        if (this.props.request) {
            let userData = await this.props.request(val);
            userData = Array.isArray(userData) ? userData : [];
            this.setState({ userData })
        }
        await this.setState({ loading: false });
    }, 400)
    onSelectItem = (obj: any) => {
        const { id, name, avatar } = obj;
        if (this.props.onChange) {
            const data: any = { id, name, avatar, };
            this.props.onChange(data, obj);
        }
    }
    onChangeSearch = (e: any) => {
        const value = e.currentTarget.value;
        this.getUserData(value)

    }
    onCheck = (obj: any) => {
        const { value = [] } = this.props;
        return value.some((ls: any) => String(ls.id) === String(obj.id));
    }
    renderSampleUserList = () => {
        const { userData } = this.state;
        return userData.map((item: any, index: number) => {
            const isChecked = this.onCheck(item);
            return (
                <li key={index} className={`${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <Avatar src={item.avatar || 'https://static.mttop.cn/admin/avatar.png'} style={{ width: '24px', height: '24px' }} />
                    <span style={{ marginLeft: '10px' }}>{item.name}</span>
                    {isChecked ? <span className={styles.chooseIcon}>
                        <Icon type="check" /></span> : null}
                </li>);
        })
    };
    renderSearchInput = () => {
        return (
            <div className={styles.searchInput}>
                <Search className={styles.inputStyle} placeholder={`搜索${this.props.instanceName}`} onChange={this.onChangeSearch} ref={(dom: any) => this.input = dom} />
                <div className={styles.allUserDes}>全部{this.props.instanceName}</div>
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
