/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Select, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import PageDataView, { formatSelect } from '@/submodule/components/DataView';
import { columnsFn } from './_selfColumn';
import styles from './index.less';
import IconFont from '@/components/CustomIcon/IconFont';
import { getProjectList, getAppointment } from '../services';
import { THROW_PLATFORM, THROW_CHANNEL, THROW_TYPE_TOTAL, THROW_STATUS, IS_OR_NOT } from '@/utils/enum';
import { getTalentList } from '@/services/globalSearchApi';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import { DATETIME_FORMAT } from '@/utils/constants';
import DownLoad from '@/components/DownLoad';
import BIButton from '@/ant_components/BIButton';

@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        treeData: throw_manage.treeData,
        generalizeList: throw_manage.generalizeList,
        dictionariesList: throw_manage.dictionariesList,
        appointment: throw_manage.appointment,
        loading: loading.effects['throw_manage/getGeneralizeList'],
    };
})
class Establish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchData: {}, // 筛选数据
        };
    }

    componentDidMount() {
        this.fetch();
        this.props.dispatch({
            type: 'throw_manage/getTagsSearchTree',
        });
        this.props.dispatch({
            type: 'throw_manage/getDictionariesList',
            payload: { parentId: 283 },
        });
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
        // 投放状态
        if (data.putStatuses != undefined && data.putStatuses.length > 0) {
            data.putStatuses = str2intArr(data.putStatuses);
        }
        // 推广日期
        if (data.tgrq && data.tgrq.length) {
            data.queryBeginPopularizeDate = moment(data.tgrq[0]).format(DATETIME_FORMAT);
            data.queryEndPopularizeDate = moment(data.tgrq[1]).format(DATETIME_FORMAT);
        }
        // 项目名称
        if (!_.isEmpty(data.projectName)) {
            data.projectName = data.projectName.label;
        }
        // 分组
        if (!_.isEmpty(data.groupList)) {
            data.groupList = str2intArr(data.groupList);
        }
        delete data.tgrq;
        if (!_.isEmpty(data.tagParamDto)) {
            const tagArr = data.tagParamDto.split('-');
            const tagId = Number(tagArr[0]);
            const parentId = 0;
            const channel = Number(tagArr[2]);
            data.tagParamDto = { tagId, parentId, channel };
        }
        if (data.isAssociatedContract) {
            data.isAssociatedContract = Number(data.isAssociatedContract);
        }
        this.setState({
            searchData: data,
        });

        this.props.dispatch({
            type: 'throw_manage/getGeneralizeList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            // 新增
            pathname: '/foreEnd/business/talentManage/throwManage/add',
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

    editData = (val) => {
        // 编辑
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/throwManage/edit',
            query: {
                id: val,
            },
        });
    };

    getAppointment = (payload) => {
        // 获取履约义务列表
        this.props.dispatch({
            type: 'throw_manage/getAppointment',
            payload,
        });
    };

    cleanAppointment = () => {
        // 清除履约义务列表
        this.props.dispatch({
            type: 'throw_manage/cleanAppointment',
        });
    };

    getDefaultDate = () => {
        // 获取前90天日期，用于推广日期筛选默认值
        const todayTimes = +new Date();
        const startDayTimes = todayTimes - 90 * 24 * 60 * 60 * 1000;
        const end = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        const start = moment(new Date(startDayTimes)).format('YYYY-MM-DD 00:00:00');
        return [moment(start), moment(end)];
    };
    initPageSearchView = async ({ searchForm }) => {
        const projectVal = searchForm.projectName;
        if (projectVal && projectVal.value) {
            this.getAppointment(projectVal.value);
        }
    };
    downloadFn = () => {
        // 导出
        return (
            <DownLoad
                loadUrl="/crmApi/popularize/export"
                params={{ method: 'post', data: this.state.searchData }}
                fileName={() => {
                    return '投放列表.xlsx';
                }}
                textClassName={styles.floatRight}
                text={
                    <BIButton className={styles.btn}>
                        <IconFont type="iconliebiaoye-daochu" />
                        {/* <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" /> */}
                        导出
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    // tip 展示
    _renderTips = (data) => {
        //  const list = data.list;
        const arr = [
            { title: '投放数量', value: 'total', unVal: '' },
            { title: '投放金额', value: 'putAmount', unVal: '' },
            { title: '涨粉量', value: 'autoFansUpCount', unVal: '' },
            { title: '单价粉丝成本', value: 'autoFansPrice', unVal: '' },
        ];
        const arrDom = [];
        arr.map((item, index) => {
            if (index === 0) {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>={data.page.total}
                    </span>,
                );
            } else {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>={thousandSeparatorFixed(data[item.value])}
                    </span>,
                );
            }
        });
        return (
            <Popover
                content={
                    <div className={styles.popoverWrap}>
                        合计：
                        {arrDom}
                    </div>
                }
                placement="topLeft"
            >
                <div className={styles.tips}>
                    合计：
                    {arrDom}
                </div>
            </Popover>
        );
    };

    render() {
        const { generalizeList, treeData, dictionariesList, appointment } = this.props;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref="pageDataView"
                    rowKey="id"
                    loading={this.props.loading}
                    initView={this.initPageSearchView}
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
                                        return getTalentList({
                                            pageNum: 1,
                                            pageSize: 100,
                                            talentName: val,
                                        });
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
                                key: 'projectName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入项目名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getProjectList({
                                            projectName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                            projectBaseType: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'projectingId', label: 'projectingName' },
                                    onChangeParams: async (currentVal, allVals) => {
                                        // 清除履约义务
                                        return { ...allVals, projectAppointmentId: undefined };
                                    },
                                },
                            },
                        ],
                        [
                            {
                                key: 'projectAppointmentId',
                                checkOption: {},
                                placeholder: '请选择履约义务',
                                className: styles.searchCls,
                                type: 'select',
                                options: this.props.appointment,
                                componentAttr: {
                                    onFocus: () => {
                                        const { pageDataView } = this.refs;
                                        const searchForm = pageDataView.state.searchForm || {};
                                        const projectVal = searchForm.projectName;
                                        if (!projectVal || !projectVal.value) {
                                            message.warn('请先选择项目');
                                            this.cleanAppointment();
                                            return;
                                        }
                                        return this.getAppointment(projectVal.value);
                                    },
                                },
                                // getFormat: (value, form) => {
                                //     form.projectAppointmentId = Number(value);
                                //     return form;
                                // },
                                // setFormat: (value) => {
                                //     return String(value);
                                // },
                            },
                            {
                                key: 'tagParamDto',
                                type: 'tag',
                                placeholder: '投放标签',
                                className: styles.searchCls,
                                componentAttr: {
                                    treeData,
                                    value: this.state.value,
                                    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
                                },
                            },
                            {},
                        ],
                    ]}
                    advancedSearchCols={[
                        [
                            {
                                key: 'tgrq',
                                label: '推广日期',
                                type: 'daterange',
                                placeholder: ['推广开始日期', '推广结束日期'],
                                className: styles.dateRangeCls,
                                defaultValue: this.getDefaultDate(),
                            },
                        ],
                        [
                            {
                                key: 'isAssociatedContract',
                                type: 'select',
                                label: '已同步合同',
                                options: IS_OR_NOT,
                            },
                        ],
                        [
                            {
                                key: 'putStatuses',
                                type: 'checkbox',
                                label: '投放状态',
                                options: THROW_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'groupList',
                                type: 'checkbox',
                                label: '所属分组',
                                options: dictionariesList,
                            },
                        ],
                        [
                            {
                                key: 'accountPlatforms',
                                type: 'checkbox',
                                label: '账号平台',
                                options: THROW_PLATFORM,
                            },
                        ],
                        [
                            {
                                key: 'putChannels',
                                type: 'checkbox',
                                label: '投放渠道',
                                options: THROW_CHANNEL,
                            },
                        ],
                        [
                            {
                                key: 'putTypes',
                                type: 'checkbox',
                                label: '投放类型',
                                options: THROW_TYPE_TOTAL,
                            },
                        ],
                    ]}
                    btns={[
                        {
                            label: '新增',
                            onClick: this.addFn,
                            authority: '/foreEnd/business/talentManage/throwManage/add',
                        },
                        {
                            label: '导出',
                            download: this.downloadFn,
                            type: 'download',
                            authority: '/foreEnd/business/talentManage/throwManage/export',
                        },
                    ]}
                    fetch={this._fetch}
                    cols={columns}
                    tips={this._renderTips(generalizeList)}
                    pageData={generalizeList}
                />
            </div>
        );
    }
}

export default Establish;
