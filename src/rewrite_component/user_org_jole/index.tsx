import React from 'react';
import { Icon } from 'antd';
import { toChinesNum } from '@/utils/utils';
import ChooseBox from './chooseBox';
import RenderSearch, { Item } from './searchBox';
import styles from './styles.less';
import { lstat } from 'fs';

interface Props {
    defaultSearchType?: string,
    isShowChoose?: boolean,
    onChange?: Function,
    value?: any,
    isRealName?: boolean,   // 是否使用真名
    length?: number,        // 选择数量
    isRepeat?: boolean,     // 选择数据是否重复
    pannelConfig?: {         // 设置选择控件属性,可单独设置,设置属性及显示多少
        org: {
            chooseType?: 'user' | 'org',  // 在组织里面可选择用户
            renderPannel?: Function,
        },
        user: {
            renderPannel?: Function,
        },
        role: {
            renderPannel?: Function,
            isDepartment?: boolean,  // 是否显示部门主管
        }
    }
}
interface State {
    searchType: string,
    value: Item[] | undefined,
    tabList: { id: string, name: string, defaultAvatar: string }[],
    length?: number,    // 选择数据的数据
}
const defaultPannelConfig = {
    org: {
        chooseType: 'user',
    },
    user: {},
}
export default class DropDown extends React.Component<Props, State> {
    state: State = {
        searchType: this.props.defaultSearchType || 'user',
        value: [],
        tabList: [{ id: 'user', name: '用户', defaultAvatar: '' }, { id: 'org', name: '组织', defaultAvatar: '' }, { id: 'role', name: '角色', defaultAvatar: '' }],
    }
    public componentDidMount() {
        this.initUser(this.props.value);

    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initUser(nextProps.value);
        }
    }
    public initUser = (data = []) => {
        const isRepeat = this.props.isRepeat;
        const newData = data.map((item: any, index: number) => {
            return isRepeat ? { ...item, uid: index + 1, type: item.type || 'user' } : { ...item, type: item.type || 'user' }
        });
        this.formaterTagList();
        this.setState({ value: newData })
    }
    formaterTagList = () => {
        const pannelConfig: any = this.props.pannelConfig || defaultPannelConfig;
        const keys = Object.keys(pannelConfig);
        if (keys.length === 0) return;
        const tabList = this.state.tabList.filter((item: any) => pannelConfig[item.id]);
        this.setState({ tabList })
    }
    public changeSearchType = (searchType: string) => {
        this.setState({ searchType })
    }
    onCheckIndex = (obj: Item) => {
        const value = this.state.value || [];
        return value.findIndex((ls: Item) => ls.type === obj.type && String(ls.id) === String(obj.id));
    }
    private willChange = (data: Item, originValue = this.state.value) => {
        let value = originValue || [];
        const length = this.props.length;
        const isRepeat = this.props.isRepeat;
        const index = this.onCheckIndex(data);
        if (isRepeat) {
            // 判断长度进行操作
            length === value.length && value.splice(0, 1);
            value = [...value, { ...data, uid: this.addDataUid(value) }];
        } else {
            if (index >= 0) {
                value.splice(index, 1)
            } else {
                length === value.length && value.splice(0, 1);
                value = [...value, data];
            }
        }
        return value
    }
    public addGroupUsers = (data: Item[]) => {
        let newValue: any = this.state.value || [];
        data.forEach((ls: Item) => {
            if (this.props.isRepeat) {
                newValue.push(ls)
            } else if (this.onCheckIndex(ls) < 0) {
                newValue.push(ls)
            } else return;
        });
        this.onPropsChange(newValue);
    }
    public onChange = (data: Item) => {
        const value = data.type === 'department' ? this.addDartment(data) : this.willChange(data);
        this.onPropsChange(value);
    }
    private onPropsChange = (data: Item[]) => {
        const length = this.props.length || data.length;
        const value = data.slice(0, length);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({ value });

    }
    addDartment = (data: Item) => {
        let value = this.state.value || [];
        let departmentId = 0;
        return [...value, data].map((item: Item) => {
            if (item.type === 'department') {
                departmentId += 1;
                return {
                    ...item,
                    id: departmentId,
                    name: `${toChinesNum(departmentId)}级主管`
                }
            }
            return item
        })
    }
    private addDataUid = (data: Item[]) => {   // 对于可重复添加数据进行处理

        return Math.max.apply(null, data.map((item: Item) => item.uid || 0)) + 1
    }
    public remove = (obj: Item) => {
        const { value = [] } = this.state;
        const index = value.findIndex((item: any) => item.id === obj.id && item.type === obj.type);
        index >= 0 && value.splice(index, 1);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({ value });
    }
    public removeAll = () => {
        if (this.props.onChange) {
            this.props.onChange([]);
        }
        this.setState({ value: [] });
    }
    public render() {
        const { searchType, tabList } = this.state;
        const value = this.state.value || [];
        return (
            <div className={styles.panleContainer}>
                <div className={styles.leftBox}>
                    <div className={styles.tagsCotainer}>
                        {tabList.map((item: any, index: number) => <div key={item.id}>
                            {index === 0 ? null : <span className={styles.tabSplit} key={index}>|</span>}
                            <span className={`${styles.tab} ${searchType === item.id ? styles.selectTab : ''}`} onClick={this.changeSearchType.bind(this, item.id)}>{item.name}</span>
                        </div>)}
                    </div>
                    <RenderSearch
                        searchType={searchType}
                        value={value}
                        onChange={this.onChange}
                        isRealName={this.props.isRealName}
                        addGroupUsers={this.addGroupUsers}
                        pannelConfig={this.props.pannelConfig || defaultPannelConfig}
                        addDartment={this.addDartment}
                    />

                </div>
                <div className={styles.maddleSplit}><Icon type="right" style={{ fontSize: '16px' }} /></div>
                <div className={styles.rightBox}>
                    <div className={styles.rightBoxHeader}>
                        <span className={styles.chooseTitle}>已选择成员({this.props.length ? value.length + '/' + this.props.length : value.length})</span>
                        <span className={styles.chooseClear} onClick={this.removeAll}>清空</span>
                    </div>
                    <div className={styles.chooseBox}>
                        <ChooseBox userData={value} remove={this.remove} />
                    </div>

                </div>

            </div>
        )
    }
}
