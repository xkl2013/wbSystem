/*
 * @Author: your name
 * @Date: 2020-02-07 00:36:46
 * @LastEditTime: 2020-02-10 22:58:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/project/establish/list/index.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/submodule/components/DataView';
import { columnsFn } from './selfColumn';
import styles from './index.less';
import { searchCols, formatSearchData, advancedSearchCols } from './searchCols';

@connect(({ establish, loading }) => {
    return {
        establish,
        projectListPage: establish.projectListPage,
        loading: loading.effects['establish/getProjectList'],
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
        data = formatSearchData(data);
        this.props.dispatch({
            type: 'establish/getProjectList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/establish/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/establish/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/establish/edit',
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
                    btns={[
                        { label: '新增', onClick: this.addFn, authority: '/foreEnd/business/project/establish/add' },
                    ]}
                    fetch={this.fetchData}
                    cols={columns}
                    pageData={projectListPage}
                />
            </div>
        );
    }
}

export default Establish;
