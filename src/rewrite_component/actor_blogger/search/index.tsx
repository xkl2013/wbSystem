import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import classNames from 'classnames';
import Input from '@/ant_components/BIInput';
import lodash from 'lodash';
import styles from './styles.less';
import { defaultConfig } from '../_utils/utils';

interface Props {
    value?: any;
    onChange?: Function;
    instanceName?: string;
    request?: Function;
    panelConfig?: any;
}
const Search = Input.Search;

const avatar = defaultConfig['user'].avatar;
export default class UserList extends React.Component {
    state = {
        searchValue: '',
        userData: [],
        loading: false,
        loaded: 'init',
    };
    input: any = null;
    public componentDidMount() {
        this.input && this.input.focus();
        this.getUserData('');
    }
    componentWillReceiveProps(nextProps: any): void {
        if (this.props.panelConfig !== nextProps.panelConfig) {
            this.getUserData(this.state.searchValue);
        }
    }

    getUserData = lodash.debounce(async (val: string) => {
        await this.setState({ loading: true });
        if (this.props.request) {
            let userData = await this.props.request({ talentName: val });
            userData = Array.isArray(userData) ? userData : [];
            this.setState({ userData, loaded: userData.length > 0 ? 'has' : 'empty' });
        }
        await this.setState({ loading: false });
    }, 400);
    onSelectItem = (obj: any) => {
        if (this.props.onChange) {
            this.props.onChange(obj);
        }
    };
    onChangeSearch = (e: any) => {
        const value = e.currentTarget.value;
        this.getUserData(value);
    };
    onCheck = (obj: any) => {
        const { value = [] } = this.props;
        return value.some((ls: any) => String(ls.id) === String(obj.id));
    };
    renderSampleUserList = () => {
        const { userData, loaded } = this.state;
        const { panelConfig } = this.props;
        const { defaultAvatar } = panelConfig;
        if (loaded === 'empty') {
            return <div className={styles.empty}>暂无数据</div>;
        }
        return userData.map((item: any) => {
            const isChecked = this.onCheck(item);
            return (
                <li
                    key={item.id}
                    className={isChecked ? classNames(styles.userItem, styles.hasCheckedUserItem) : styles.userItem}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <Avatar className={styles.avatar} src={defaultAvatar} />
                    <span className={styles.userName}>{item.talentName}</span>
                    {isChecked && (
                        <span className={styles.chooseIcon}>
                            <Icon type="check" />
                        </span>
                    )}
                </li>
            );
        });
    };

    render() {
        const { loading } = this.state;
        const { panelConfig } = this.props;
        return (
            <div className={styles.searchInput}>
                <Search
                    className={styles.inputStyle}
                    placeholder={`请选择${panelConfig.name}`}
                    onChange={this.onChangeSearch}
                    ref={(dom: any) => (this.input = dom)}
                />
                <ul className={styles.userList}>
                    <Spin spinning={loading}>{this.renderSampleUserList()}</Spin>
                </ul>
            </div>
        );
    }
}
