import React from 'react';
import { Icon, Spin, Avatar } from 'antd';
import lodash from 'lodash';
import styles from '../styles.less';
import { Node, Item } from '../index';
import { getUserList } from '@/services/globalSearchApi';
import avatarLogo from '@/assets/avatar.png';
import CheckGroup from '@/ant_components/BICheckbox';

interface Props {
    value?: any,
    onChange?: Function,
    renderTitle?: Function,
    checkable?: boolean,
    checkedKeys?: string[],
    onCheck?: Function,
    labelInValue?: boolean,
}

export default class UserList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    state = {
        searchValue: '',
        userData: [],
        loading: false,
        checkedKeys: [],
    }
    input: any = null;
    update: any = true;
    checkOrgNodes: string[] = [];
    public componentDidMount() {
        this.input && this.input.focus();
        this.update = true;
        this.getUserData('');
        this.formateUserValue()
    }
    UNSAFE_componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.checkedKeys) !== JSON.stringify(this.props.checkedKeys)) {
            this.formateUserValue(nextProps.checkedKeys);
        }
    }
    componentWillUnmount() {
        this.update = false;
    }
    formateUserValue = (values = this.props.checkedKeys) => {
        if (!this.props.checkable) return;
        if (!Array.isArray(values)) return;
        const checkedKeys: string[] = []
        values.forEach((item: string) => {
            item.indexOf('org-name') < 0 ? checkedKeys.push(item) : this.checkOrgNodes.push(item)
        })
        this.setState({ checkedKeys })
    }
    onCheck = (checkedKeys: string[]) => {
        if (this.props.onCheck) {
            const { userData } = this.state;
            const value = [...this.checkOrgNodes, ...checkedKeys];
            let valueMap: any[] = value;
            if (this.props.labelInValue) {
                valueMap = value.map(item => {
                    return userData.find((ls: any) => item.indexOf('org-name') < 0 && Number(ls.userId) === Number(item)) || {}
                })
            }

            this.props.onCheck(value, valueMap);
        }
        this.setState({ checkedKeys })
    }
    getUserData = lodash.debounce(async (userChsName: string) => {
        if (!this.update) return
        await this.setState({ loading: true });
        const response = await getUserList({ userChsName });
        if (response && response.success) {
            const data = response.data || {};
            let userData = Array.isArray(data.list) ? data.list : [];
            userData = userData.map((item: any) => ({
                ...item,
                id: item.userId,
                name: item.userChsName,
                dataType: 'user',
            }));
            this.setState({
                userData
            })
        }
        await this.setState({ loading: false });
    }, 400)
    onSelectItem = (obj: Node) => {
        const { id, name, symbol } = obj;
        const { value = [] } = this.props;
        if (this.props.onChange && symbol !== 'org') {
            value.push({ id, name })
            this.props.onChange(obj, value);
        }
    }
    onChangeSearch = (e: any) => {
        const value = e.currentTarget.value;
        this.getUserData(value)

    }
    renderChecBoxUser = () => {
        const { userData } = this.state;
        return <CheckGroup onChange={this.onCheck} value={this.state.checkedKeys}>
            {userData.map((item: any) => (<CheckGroup.Checkbox value={String(item.id)} key={String(item.id)}>
                <li key={item.id} className={`${styles.userItem}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    {this.props.renderTitle ? this.props.renderTitle(item.name, item) : (<>
                        <Avatar src={item.avatar || avatarLogo} size="small" />
                        <span style={{ marginLeft: '10px' }}>{item.name}</span>
                    </>)}

                </li>
            </CheckGroup.Checkbox>))}
        </CheckGroup>
    }
    renderSampleUserList = () => {
        if (this.props.checkable) {
            return this.renderChecBoxUser();
        }
        const { userData } = this.state;
        return userData.map((item: any) => {
            const { value = [] } = this.props;
            if (this.props.renderTitle) {
                return this.props.renderTitle(item.name, item)
            }
            const isChecked = value.some((ls: Item) => String(ls.id) === String(item.id));
            return (
                <li key={item.id} className={`${styles.userItem} ${isChecked ? styles.hasCheckedUserItem : ''}`}
                    onClick={this.onSelectItem.bind(this, item)}
                >
                    <Avatar src={item.avatar || avatarLogo} />
                    <span style={{ marginLeft: '10px' }}>{item.name}</span>
                    {isChecked ? <span className={styles.chooseIcon}>
                        <Icon type="check" /></span> : null}
                </li>);
        })
    };
    renderSearchInput = () => {
        return (
            <div>
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
