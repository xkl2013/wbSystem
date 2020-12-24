/*
 * @Author: your name
 * @Date: 2020-02-07 00:36:46
 * @LastEditTime: 2020-02-11 10:27:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/customer/thread/list/index.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/submodule/components/DataView';
import { columnsFn } from './selfColumn';
import styles from './index.less';
import { searchCols, formatSearchData, advancedSearchCols } from './searchCols';

@connect(({ admin_thread, loading }) => {
    return {
        companyListPage: admin_thread.companyListPage,
        admin_thread,
        loading: loading.effects['admin_thread/getTrailsList'],
    };
})
class Thread extends Component {
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
            type: 'admin_thread/getTrailsList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './thread/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './thread/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './thread/edit',
            query: {
                id: val,
            },
        });
    };

    renderTipsFn = () => {
        // eslint-disable-next-line react/no-unescaped-entities
        return <div className={styles.tips}>请到“商务客户/内容客户"中录入</div>;
    };

    render() {
        const { companyListPage, loading } = this.props;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={(dom) => {
                    this.pageDataView = dom;
                }}
                rowKey="trailId"
                loading={loading}
                searchCols={searchCols}
                advancedSearchCols={advancedSearchCols}
                // btns={[{ label: '新增', onClick: this.addFn, authority: '/foreEnd/business/customer/thread/add' }]}
                fetch={this.fetchData}
                cols={columns}
                pageData={companyListPage}
                tips={this.renderTipsFn()}
                tipsClassName={styles.tipsContainer}
            />
        );
    }
}

export default Thread;
