/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import PageDataView from '@/submodule/components/DataView';
import { BLOGGER_TYPE, BLOGGER_SIGN_STATE, BLOGGER_RECOMMEND_STATE } from '@/utils/enum';
import { getUserList as getAllUsers, getTalentAccountList } from '@/services/globalSearchApi';
import { str2intArr } from '@/utils/utils';
import storage from '@/utils/storage';
import { columnsFn } from './_selfColumn';
import Recommend from './Recommend';
import InitData from './InitData';
import styles from './index.less';
import { getBloggerNicknameList, updateBloggersRecommendList } from '../services';

@connect(({ talent_blogger, loading }) => {
    return {
        bloggerListPage: talent_blogger.bloggerListPage,
        dictionariesList: talent_blogger.dictionariesList,
        loading: loading.effects['talent_blogger/getBloggerList2'],
    };
})
class ComList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
        this.props.dispatch({
            type: 'talent_blogger/getDictionariesList',
            payload: { parentId: 283 },
        });
    }

    fetch = () => {
        // const { pageDataView } = this.refs;
        if (this.pageDataView !== null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = async (beforeFetch) => {
        const data = beforeFetch();
        if (data.bloggerNickName) {
            data.bloggerNickName = data.bloggerNickName.label;
        }
        if (data.bloggerProducerName) {
            data.bloggerProducerName = data.bloggerProducerName.label;
        }
        if (data.bloggerAccount) {
            data.bloggerAccount = data.bloggerAccount.label;
        }
        if (data.bloggerSignStates) {
            data.bloggerSignStates = str2intArr(data.bloggerSignStates);
        }
        if (data.bloggerTypeString) {
            data.bloggerTypeString = data.bloggerTypeString.join(',');
            if (!data.bloggerTypeString) {
                delete data.bloggerTypeString;
            }
        }
        if (Array.isArray(data.bloggerRecommendTypeList) && data.bloggerRecommendTypeList.length > 0) {
            data.bloggerRecommendTypeList = data.bloggerRecommendTypeList.map((item) => {
                return item.split('').join(',');
            });
        } else {
            data.bloggerRecommendTypeList = ['1', '2', '3', '1,2'];
        }
        // KPI
        if (data.bloggerSaturationLevel) {
            // eslint-disable-next-line
            data.bloggerSaturationLevelMin =
                (data.bloggerSaturationLevel.min && Number(data.bloggerSaturationLevel.min) / 100) || 0;
            // eslint-disable-next-line
            data.bloggerSaturationLevelMax =
                data.bloggerSaturationLevel.max && Number(data.bloggerSaturationLevel.max / 100);
            delete data.bloggerSaturationLevel;
        }

        // eslint-disable-next-line max-len
        data.bloggerSortType = (storage.getItem('bloggerSortType') && storage.getItem('bloggerSortType').bloggerSortType) || 3;
        this.props.dispatch({
            type: 'talent_blogger/getBloggerList2',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './blogger/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './blogger/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './blogger/edit',
            query: {
                id: val,
            },
        });
    };

    goSchedule = (val) => {
        // 查看档期
        storage.setItem('bloggerSearchValue', { name: val.bloggerNickName, id: val.bloggerId });
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/schedule/blogger',
        });
    };

    changeQuarterTarget = async (e, record) => {
        // 修改季度目标
        const val = e.target.value;
        if (Number(val) === 0 && val !== '0.00') {
            return;
        }
        const data = {
            bloggerRecommendList: [
                {
                    bloggerQuarterMoney: Number(val) * 10000,
                    id: record.id,
                },
            ],
        };
        const response = await updateBloggersRecommendList(data);
        if (response && response.success) {
            message.success('设置成功');
            this.fetch();
        }
    };

    recommendMth = () => {
        // 博主推荐
        // eslint-disable-next-line
        this.recommendRef && this.recommendRef.initData();
    };

    changeSortType = () => {
        // 修改排序

        // eslint-disable-next-line max-len
        let bloggerSortType = (storage.getItem('bloggerSortType') && storage.getItem('bloggerSortType').bloggerSortType) || 3;
        if (bloggerSortType === 3) {
            bloggerSortType = 1;
        } else {
            // eslint-disable-next-line no-plusplus
            bloggerSortType++;
        }
        storage.setItem('bloggerSortType', { bloggerSortType });
        this.pageDataView.search();
    };

    initDataBloggerData = () => {
        // 初始化博主数据
        this.initDataRef && this.initDataRef.initData();
    };

    btns = () => {
        const { userId } = storage.getUserInfo();
        const arr = [
            {
                label: '博主推荐',
                onClick: this.recommendMth,
                authority: '/foreEnd/business/talentManage/talent/blogger/recommend',
            },
            {
                label: '新增',
                onClick: this.addFn,
                authority: '/foreEnd/business/talentManage/talent/blogger/add',
            },
        ];
        if (Number(userId) === 165) {
            // 只有张雷有权限
            arr.unshift({
                label: '初始化数据',
                onClick: this.initDataBloggerData,
                authority: '/foreEnd/business/talentManage/talent/blogger/add',
            });
        }
        return arr;
    };

    render() {
        const columns = columnsFn(this);
        const { bloggerListPage, dictionariesList } = this.props;
        bloggerListPage.list = Array.isArray(bloggerListPage.list)
            ? bloggerListPage.list.map((item, index) => {
                return { ...item, index: index + 1 };
            })
            : [];
        return (
            <>
                <PageDataView
                    ref={(pageDataView) => {
                        this.pageDataView = pageDataView;
                    }}
                    rowKey="bloggerId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'bloggerNickName',
                                placeholder: '请输入昵称',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                    request: (val) => {
                                        return getBloggerNicknameList({
                                            pageNum: 1,
                                            pageSize: 300,
                                            bloggerNickName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'bloggerId', label: 'bloggerNickName' },
                                },
                                type: 'associationSearchFilter',
                            },
                            {
                                key: 'bloggerProducerName',
                                placeholder: '请输入制作人',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                    request: (val) => {
                                        return getAllUsers({ userChsName: val, pageSize: 100, pageNum: 1 });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                },
                                type: 'associationSearchFilter',
                            },
                            {
                                key: 'bloggerAccount',
                                placeholder: '请输入博主账号',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                    request: (val) => {
                                        return getTalentAccountList({
                                            accountName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                            talentType: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: {
                                        value: 'accountId',
                                        label: 'accountName',
                                    },
                                },
                                type: 'associationSearchFilter',
                            },
                        ],
                    ]}
                    advancedSearchCols={[
                        [
                            {
                                key: 'bloggerGroupIds',
                                type: 'checkbox',
                                label: '所属分组',
                                options: dictionariesList,
                            },
                        ],
                        [
                            {
                                key: 'bloggerSignStates',
                                type: 'checkbox',
                                label: '签约状态',
                                options: BLOGGER_SIGN_STATE,
                            },
                        ],
                        [{ key: 'bloggerTypeString', label: '博主类型', type: 'checkbox', options: BLOGGER_TYPE }],
                        [
                            {
                                key: 'bloggerRecommendTypeList',
                                label: '推荐类型',
                                type: 'checkbox',
                                options: BLOGGER_RECOMMEND_STATE,
                            },
                        ],
                        [
                            {
                                key: 'bloggerSaturationLevel',
                                label: 'KPI',
                                placeholder: '请输入',
                                type: 'numberRange',
                                componentAttr: {
                                    tailNode: '%',
                                },
                            },
                        ],
                        // [
                        //     {
                        //         key: 'bloggerSortType',
                        //         label: 'KPI排序',
                        //         type: 'radio',
                        //         options: ORDER_BY,
                        //         defaultValue: '1',
                        //     },
                        // ],
                    ]}
                    btns={this.btns()}
                    fetch={this.fetchData}
                    cols={columns}
                    pageData={bloggerListPage}
                />
                <Recommend
                    ref={(dom) => {
                        this.recommendRef = dom;
                    }}
                    refresh={this.fetch}
                />
                <InitData
                    ref={(dom) => {
                        this.initDataRef = dom;
                    }}
                    refresh={this.fetch}
                />
            </>
        );
    }
}

export default ComList;
