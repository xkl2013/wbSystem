import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';

import BIDatePicker from '@/ant_components/BIDatePicker';
import AssociationSearch from '@/components/associationSearch';
import { getTalentAccountList } from '@/services/globalSearchApi';
import moment from 'moment';
import { columnsFn } from './_selfColumn';
import styles from './index.less';

@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        totalList: throw_manage.totalList,
        loading: loading.effects['throw_manage/getTotalList'],
    };
})
class TableCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selTab: 1, // 1-微博 2-抖音
            dateValue: '', // 日期
            accountName: '', // talent账号
            data: {
                // 请求数据
                accountPlatform: 1,
                statisticsTimeFrom: null,
                statisticsTimeTo: null,
                talentAccountNo: null,
            },
        };
    }

    componentDidMount() {
        if (this.pageDataView !== null) {
            this.pageDataView.fetch();
        }
    }

    tabChange = (type) => {
        // tab切换
        if (type !== this.state.selTab) {
            const data = {
                accountPlatform: type,
                statisticsTimeFrom: null,
                statisticsTimeTo: null,
                talentAccountNo: null,
            };
            this.setState(
                {
                    selTab: type,
                    dateValue: '',
                    accountName: '',
                    data,
                },
                this.getData,
            );
        }
    };

    dateValueChange = (date) => {
        const stateData = this.state.data;
        // 日期选择
        const DATE_START = 'YYYY-MM-DD 00:00:00';
        const DATE_END = 'YYYY-MM-DD 23:59:59';
        const start = (date[0] && moment(date[0]).format(DATE_START)) || null;
        const end = (date[1] && moment(date[1]).format(DATE_END)) || null;
        const data = { ...stateData, statisticsTimeFrom: start, statisticsTimeTo: end };
        this.setState(
            {
                dateValue: date,
                data,
            },
            this.getData,
        );
    };

    talentNameChange = (v) => {
        const stateData = this.state.data;
        // talent 选择
        const data = { ...stateData, talentAccountNo: v.accountUuid || null };
        this.setState(
            {
                accountName: v,
                data,
            },
            this.getData,
        );
    };

    getData = () => {
        // 初始化数据，页码归1
        if (this.pageDataView !== null) {
            this.pageDataView.search();
        }
    };

    fetchFn = (beforeFetch) => {
        let data = beforeFetch();
        data = { ...data, ...this.state.data };
        this.props.dispatch({
            type: 'throw_manage/getTotalList',
            payload: data,
        });
    };

    render() {
        const { selTab, dateValue, accountName } = this.state;
        const { totalList } = this.props;
        const columns = columnsFn();
        return (
            <div className={styles.wrap}>
                <div className={styles.titleWrap}>
                    <div className={styles.titleWrapLeft}>
                        <span
                            className={`${styles.titleCls} ${Number(selTab) === 1 ? styles.titleClsSel : ''}`}
                            onClick={() => {
                                return this.tabChange(1);
                            }}
                        >
                            微博累计投放
                        </span>
                        <span
                            className={`${styles.titleCls} ${Number(selTab) === 2 ? styles.titleClsSel : ''}`}
                            onClick={() => {
                                return this.tabChange(2);
                            }}
                        >
                            抖音累计投放
                        </span>
                    </div>
                    <div className={styles.titleWrapRight}>
                        <AssociationSearch
                            className={styles.associationSearch}
                            request={(val) => {
                                return getTalentAccountList({
                                    pageNum: 1,
                                    pageSize: 100,
                                    accountName: val,
                                    platform: selTab,
                                });
                            }}
                            initDataType="onfocus"
                            fieldNames={{
                                value: (val) => {
                                    return `${val.accountId}_${val.accountId}`;
                                },
                                label: 'accountName',
                            }}
                            value={accountName}
                            placeholder="请输入talent账号"
                            onChange={this.talentNameChange}
                        />
                        <BIDatePicker.BIRangePicker
                            className={styles.dateCls}
                            placeholder={['起始时间', '截止时间']}
                            value={dateValue}
                            onChange={this.dateValueChange}
                        />
                    </div>
                </div>
                <div className={styles.contentWrap}>
                    <PageDataView
                        ref={(e) => {
                            this.pageDataView = e;
                        }}
                        rowKey={(r, i) => {
                            return i;
                        }}
                        hideForm={true}
                        loading={this.props.loading}
                        fetch={this.fetchFn}
                        cols={columns}
                        pageData={totalList}
                    />
                </div>
            </div>
        );
    }
}

export default TableCom;
