import React from 'react';
import { Icon, Spin } from 'antd';
import { connect } from 'dva';
import ChooseBox, { Item } from './chooseBox';
import RenderSearch from './searchBox';

import styles from './styles.less';

interface Props {
    isShowChoose?: boolean,
    dispatch?: any,
    isloading?: boolean,
    departmentsList?: any,
    onChange?: Function,
    value?: any,
}
interface State {
    searchType: string,
    value: Item[] | undefined,
}
@connect(({ admin_global, loading }: any) => ({
    departmentsList: admin_global.departmentsList,
    isloading: loading.effects['admin_global/getDepartmentList']
}))
export default class DropDown extends React.Component<Props, State> {
    state: State = {
        searchType: 'user',
        value: [],
    }
    public componentDidMount() {
        this.props.dispatch({
            type: 'admin_global/getDepartmentList',
        });
        this.initUser(this.props.value);

    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initUser(nextProps.value);
        }
    }
    public initUser = (data = []) => {
        const value = data.map((item: any) => ({
            id: item.id || item.userId || null,
            name: item.name || item.userChsName || ''
        })).filter((item: any) => item && item.id);
        this.setState({ value })
    }
    public changeSearchType = (searchType: string) => {
        this.setState({ searchType })
    }
    public onChange = (obj: Item, originValue: any[]) => {
        const value = originValue.filter((item, i, self) => item && self.findIndex(ls => item.id === ls.id) === i);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({ value });
    }
    public remove = (obj: Item) => {
        const { value = [] } = this.state;
        const index = value.findIndex((item: any) => item.id === obj.id);
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
        const { searchType, value = [] } = this.state;
        const { departmentsList, isloading } = this.props;
        return (
            <div className={styles.panleContainer}>
                <div className={styles.leftBox}>
                    <div className={styles.tagsCotainer}>
                        <span className={`${styles.tab} ${searchType === 'user' ? styles.selectTab : ''}`} onClick={this.changeSearchType.bind(this, 'user')}>用户</span>
                        <span className={styles.tabSplit}>|</span>
                        <span className={`${styles.tab} ${searchType === 'org' ? styles.selectTab : ''}`} onClick={this.changeSearchType.bind(this, 'org')}>组织</span>
                    </div>
                    <Spin spinning={isloading}>
                        <RenderSearch searchType={searchType} value={value} onChange={this.onChange} data={departmentsList} />
                    </Spin>

                </div>
                <div className={styles.maddleSplit}><Icon type="right" style={{ fontSize: '16px' }} /></div>
                <div className={styles.rightBox}>
                    <div className={styles.rightBoxHeader}>
                        <span className={styles.chooseTitle}>已选择成员({value.length})</span>
                        <span className={styles.chooseClear} onClick={this.removeAll}>清空</span>
                    </div>
                    <div className={styles.chooseBox}>
                        <ChooseBox userData={value} remove={this.remove}></ChooseBox>
                    </div>

                </div>

            </div>
        )
    }
}
