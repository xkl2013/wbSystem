import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import PageDataView from '@/submodule/components/DataView';
import { getUserList as getAllUsers } from '@/services/globalSearchApi';
import storage from '@/utils/storage';
import { BLOGGER_SIGN_STATE } from '@/utils/enum';
import { str2intArr } from '@/utils/utils';
import styles from './index.less';
import { getStarNameList } from '../services';
import { columnsFn } from './_selfColumn';

@connect(({ talent_actor, loading }) => {
    return {
        actorListPage: talent_actor.actorListPage,
        loading: loading.effects['talent_actor/getStarList'],
    };
})
class ComList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        // const { pageDataView } = this.refs;
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = async (beforeFetch) => {
        const data = beforeFetch();
        if (data.starName) {
            data.starName = data.starName.label;
        }
        if (data.starSignStates) {
            data.starSignStates = str2intArr(data.starSignStates);
        }
        if (data.starManagerName) {
            data.starManagerName = data.starManagerName.label;
        }
        if (data.starDrumbeaterName) {
            data.starDrumbeaterName = data.starDrumbeaterName.label;
        }
        this.props.dispatch({
            type: 'talent_actor/getStarList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './actor/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './actor/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './actor/edit',
            query: {
                id: val,
            },
        });
    };

    goSchedule = (val) => {
        // 查看档期
        storage.setItem('actorSearchValue', { name: val.starName, id: val.starId });
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/schedule/actor',
        });
    };

    render() {
        const { actorListPage } = this.props;
        actorListPage.list = Array.isArray(actorListPage.list)
            ? actorListPage.list.map((item, index) => {
                return {
                    ...item,
                    index: index + 1,
                };
            })
            : [];
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={(pageDataView) => {
                    this.pageDataView = pageDataView;
                }}
                rowKey="starId"
                loading={this.props.loading}
                searchCols={[
                    [
                        {
                            key: 'starName',
                            placeholder: '请输入姓名',
                            className: styles.searchCol,
                            componentAttr: {
                                suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                request: (val) => {
                                    return getStarNameList({ pageNum: 1, pageSize: 300, starName: val });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'starId', label: 'starName' },
                            },
                            type: 'associationSearchFilter',
                        },
                        {
                            key: 'starManagerName',
                            placeholder: '请选择经理人',
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
                            key: 'starDrumbeaterName',
                            placeholder: '请选择宣传人',
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
                    ],
                ]}
                advancedSearchCols={[
                    [
                        {
                            key: 'starSignStates',
                            type: 'checkbox',
                            label: '签约状态',
                            options: BLOGGER_SIGN_STATE,
                        },
                    ],
                ]}
                btns={[
                    {
                        label: '新增',
                        onClick: this.addFn,
                        authority: '/foreEnd/business/talentManage/talent/actor/add',
                    },
                ]}
                fetch={this.fetchData}
                cols={columns}
                pageData={actorListPage}
            />
        );
    }
}

export default ComList;
