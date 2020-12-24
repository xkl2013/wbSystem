/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/submodule/components/DataView';
import { columnsFn } from './_selfColumn';
import styles from './index.less';
import { THROW_PLATFORM, THROW_CHANNEL, THROW_TYPE_TOTAL, THROW_STATUS } from '@/utils/enum';
import { getTalentList, getProjectList } from '@/services/globalSearchApi';
import { str2intArr } from '@/utils/utils';
import { DATETIME_FORMAT } from '@/utils/constants';

@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        analysisList: throw_manage.analysisList,
        loading: loading.effects['throw_manage/getAnalysisList'],
    };
})
class Establish extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        const { pageDataView } = this.refs;
        if (pageDataView != null) {
            pageDataView.fetch();
        }
    };

    _fetch = (beforeFetch) => {
        const data = beforeFetch();
        // Talent 名称
        if (data.talentName != undefined) {
            data.talentName = data.talentName.label;
        }
        // 项目 名称
        if (data.projectId != undefined) {
            data.projectId = data.projectId.key;
        }
        // 账号平台
        if (data.accountPlatforms != undefined && data.accountPlatforms.length > 0) {
            data.accountPlatforms = str2intArr(data.accountPlatforms);
        }
        // 投放渠道
        if (data.putChannels != undefined && data.putChannels.length > 0) {
            data.putChannels = str2intArr(data.putChannels);
        }
        // 投放类型
        if (data.putTypes != undefined && data.putTypes.length > 0) {
            data.putTypes = str2intArr(data.putTypes);
        }
        // 推广日期
        if (data.tgrq && data.tgrq.length) {
            data.queryBeginPopularizeDate = moment(data.tgrq[0]).format(DATETIME_FORMAT);
            data.queryEndPopularizeDate = moment(data.tgrq[1]).format(DATETIME_FORMAT);
            delete data.tgrq;
        }
        // 投放金额范围
        if (data.tfjeStart) {
            data.putAmountTo = data.tfjeStart.max === '' ? undefined : +data.tfjeStart.max;
            data.putAmountFrom = data.tfjeStart.min === '' ? undefined : +data.tfjeStart.min;
            delete data.tfjeStart;
        }
        // 粉丝量
        if (data.fslStart) {
            data.fansCountTo = data.fslStart.max === '' ? undefined : +data.fslStart.max;
            data.fansCountFrom = data.fslStart.min === '' ? undefined : +data.fslStart.min;
            delete data.fslStart;
        }
        this.props.dispatch({
            type: 'throw_manage/getAnalysisList',
            payload: data,
        });
    };

    checkData = (val) => {
        // 查看
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/throwManage/detail',
            query: {
                id: val,
            },
        });
    };

    render() {
        const { analysisList } = this.props;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref="pageDataView"
                    rowKey="id"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'popularizeContent',
                                placeholder: '请输入推广内容',
                                className: styles.searchCls,
                                componentAttr: {
                                    maxLength: 50,
                                },
                            },
                            {
                                key: 'talentName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入Talent名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getTalentList({ pageNum: 1, pageSize: 100, talentName: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: {
                                        value: (val) => {
                                            return `${val.talentId}_${val.talentType}`;
                                        },
                                        label: 'talentName',
                                    },
                                },
                            },
                            {
                                key: 'projectId',
                                className: styles.searchCls,
                                placeholder: '请输入项目名称',
                                type: 'associationSearch',
                                componentAttr: {
                                    request: (val) => {
                                        return getProjectList({ projectName: val, pageSize: 50, pageNum: 1 });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'projectId', label: 'projectName' },
                                },
                            },
                        ],
                    ]}
                    advancedSearchCols={[
                        [
                            {
                                key: 'accountPlatforms',
                                type: 'checkbox',
                                label: '账号平台',
                                options: THROW_PLATFORM,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: THROW_PLATFORM.find((item) => {
                                                return item.id == tax;
                                            }).name,
                                        });
                                    });
                                    return result;
                                },
                                setFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push(tax.id);
                                    });
                                    return result;
                                },
                                getFormat: (value) => {
                                    return value.join(',');
                                },
                            },
                        ],
                        [
                            {
                                key: 'putChannels',
                                type: 'checkbox',
                                label: '投放渠道',
                                options: THROW_CHANNEL,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: THROW_CHANNEL.find((item) => {
                                                return item.id == tax;
                                            }).name,
                                        });
                                    });
                                    return result;
                                },
                                setFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push(tax.id);
                                    });
                                    return result;
                                },
                                getFormat: (value) => {
                                    return value.join(',');
                                },
                            },
                        ],
                        [
                            {
                                key: 'putTypes',
                                type: 'checkbox',
                                label: '投放类型',
                                options: THROW_TYPE_TOTAL,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: THROW_TYPE_TOTAL.find((item) => {
                                                return item.id == tax;
                                            }).name,
                                        });
                                    });
                                    return result;
                                },
                                setFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push(tax.id);
                                    });
                                    return result;
                                },
                                getFormat: (value) => {
                                    return value.join(',');
                                },
                            },
                        ],
                        [
                            {
                                key: 'tgrq',
                                label: '推广日期',
                                type: 'daterange',
                                placeholder: ['推广开始日期', '推广结束日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'tfjeStart',
                                label: '投放金额范围',
                                placeholder: '请输入',
                                type: 'numberRange',
                            },
                        ],
                        [
                            {
                                key: 'fslStart',
                                label: '粉丝量',
                                placeholder: '请输入',
                                type: 'numberRange',
                            },
                        ],
                    ]}
                    fetch={this._fetch}
                    cols={columns}
                    pageData={analysisList}
                />
            </div>
        );
    }
}

export default Establish;
