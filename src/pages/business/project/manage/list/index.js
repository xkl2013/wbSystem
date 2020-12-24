/*
 * @Author: your name
 * @Date: 2020-02-07 00:36:46
 * @LastEditTime: 2020-02-10 22:56:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/project/manage/list/index.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/submodule/components/DataView';
import { columnsFn } from './selfColumn';
import styles from './index.less';
import { searchCols, formatSearchData, advancedSearchCols } from './searchCols';

@connect(({ business_project_manage, loading }) => {
    return {
        business_project_manage,
        projectListPage: business_project_manage.projectListPage,
        loading: loading.effects['business_project_manage/getProjectList'],
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
        if (this.pageDataView) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        let data = beforeFetch();
        // 立项项目
        data.projectBaseType = 1;
        data = formatSearchData(data);
        this.props.dispatch({
            type: 'business_project_manage/getProjectList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/manage/add',
        });
    };

    checkData = (val) => {
        // 查看详情
        this.props.history.push({
            pathname: '/foreEnd/business/project/manage/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        // 编辑
        this.props.history.push({
            pathname: '/foreEnd/business/project/manage/edit',
            query: {
                id: val,
            },
        });
    };

    render() {
        const { projectListPage, loading } = this.props;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={(dom) => {
                        this.pageDataView = dom;
                    }}
                    rowKey="projectingId"
                    loading={loading}
                    searchCols={searchCols}
                    advancedSearchCols={advancedSearchCols}
                    btns={[{ label: '新增', onClick: this.addFn, authority: '/foreEnd/business/project/manage/add' }]}
                    fetch={this.fetchData}
                    cols={columns}
                    pageData={projectListPage}
                    scroll={{ x: 2000 }}
                />
            </div>
        );
    }
}

export default Establish;
