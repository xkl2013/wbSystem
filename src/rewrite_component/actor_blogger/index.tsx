import React from 'react';
import { Icon } from 'antd';
import ChooseBox from './chooseBox';
import RenderSearch from './search';
import { Item } from './searchBox';
import styles from './styles.less';
import lodash from 'lodash';

interface Props {
    defaultSearchType?: string;
    isShowChoose?: boolean;
    onChange?: Function;
    value?: any;
    isRealName?: boolean; // 是否使用真名
    length?: number; // 选择数量
    isRepeat?: boolean; // 选择数据是否重复
    panelConfig?: any;
}
interface State {
    searchType: string;
    value: Item[] | undefined;
    length?: number; // 选择数据的数据
}
const defaultPanelConfig = {
    actor: { id: 'actor', name: '艺人', talentType: 0, defaultAvatar: 'https://static.mttop.cn/admin/avatar.png' },
    blogger: { id: 'blogger', name: '博主', talentType: 1, defaultAvatar: 'https://static.mttop.cn/admin/avatar.png' },
};

export default class DropDown extends React.Component<Props, State> {
    state: State = {
        searchType: this.props.defaultSearchType || 'blogger',
        value: [],
    };
    public componentDidMount() {
        this.initUser(this.props.value);
    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initUser(nextProps.value);
        }
    }
    public initUser = (data = []) => {
        const newData = data.map((item: any) => {
            return { ...item };
        });
        this.setState({ value: newData });
    };

    public changeSearchType = (searchType: string) => {
        this.setState({ searchType });
    };
    onCheckIndex = (obj: any) => {
        const { value } = this.state;
        return value.findIndex((ls: any) => String(ls.id) === String(obj.id));
    };
    private willChange = (obj: any) => {
        const { value } = this.state;
        const { length } = this.props;
        const index = this.onCheckIndex(obj);
        if (index >= 0) {
            value.splice(index, 1);
        } else {
            length === value.length && value.splice(0, 1);
            value.push(obj);
        }
        return value;
    };
    public onChange = (obj: any) => {
        let newList = this.willChange(obj);
        newList = lodash.cloneDeep(newList);
        if (this.props.onChange) {
            this.props.onChange(newList);
        }
        this.setState({ value: newList });
    };
    public onSortList = (list: any) => {
        const newList = lodash.cloneDeep(list);
        if (this.props.onChange) {
            this.props.onChange(newList);
        }
        this.setState({ value: newList });
    }
    public remove = (obj: any) => {
        this.onChange(obj);
    };
    public removeAll = () => {
        if (this.props.onChange) {
            this.props.onChange([]);
        }
        this.setState({ value: [] });
    };
    public render() {
        const { searchType } = this.state;
        const { request, panelConfig } = this.props;
        const value = this.state.value || [];
        const currPanelConfig = panelConfig || defaultPanelConfig;
        const tabList = Object.values(currPanelConfig);
        const currPanel = currPanelConfig[searchType];
        return (
            <div className={styles.panelContainer}>
                <div className={styles.leftBox}>
                    {/* <div className={styles.tagsContainer}> */}
                    {/* {tabList.map((item: any, index: number) => (
                            <div key={item.id}>
                                {index === 0 ? null : (
                                    <span className={styles.tabSplit} key={index}>
                                        |
                                    </span>
                                )}
                                <span
                                    className={`${styles.tab} ${searchType === item.id ? styles.selectTab : ''}`}
                                    onClick={this.changeSearchType.bind(this, item.id)}
                                >
                                    {item.name}
                                </span>
                            </div>
                        ))} */}
                    {/* </div> */}
                    <div className={styles.searchBox}>
                        <RenderSearch
                            value={value}
                            onChange={this.onChange}
                            panelConfig={currPanel}
                            request={request}
                        />
                    </div>
                </div>
                <div className={styles.middleSplit}>
                    <Icon type="right" />
                </div>
                <div className={styles.rightBox}>
                    <div className={styles.rightBoxHeader}>
                        <span className={styles.chooseTitle}>
                            已选择成员({this.props.length ? value.length + '/' + this.props.length : value.length})
                            <span className={styles.drugWordTip}>
                                (可拖动姓名进行排序)
                            </span>

                        </span>
                        <span className={styles.chooseClear} onClick={this.removeAll}>
                            清空
                        </span>
                    </div>
                    <div className={styles.chooseBox}>
                        <ChooseBox
                            userData={value}
                            panelConfig={currPanel}
                            onSortList={this.onSortList}
                            onChange={this.props.onChange}
                            remove={this.remove} />
                    </div>
                </div>
            </div>
        );
    }
}
