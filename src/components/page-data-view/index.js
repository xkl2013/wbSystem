'use strict';
//库/框架
import React, { Component } from 'react';
//组件
import { message } from 'antd';
import DataView from '../data-view';
import antiAssign from '../../utils/anti-assign';
import _ from 'lodash';

export default class PageDataView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                showTotal: total => `共${total}条`,
                pageSize: props.pageSize || 50,
                total: 0,
                current: 1,
                onChange: nextPage => {
                    this.fetchPage(nextPage);
                },
            },
        };
    }

    _beforeFetch() {
        let data = {};
        const { dataview } = this.refs;
        const { pagination } = this.state;
        if (dataview != null) {
            data = dataview._beforeFetch();
        }
        return _.assign(data, {
            pageSize: pagination.pageSize,
            page: pagination.current,
        });
    }

    _afterFetch(data) {
        this.state.pagination.pageSize = parseInt(data.page.numPerPage);
        this.state.pagination.current = parseInt(data.page.pageNum);
        this.state.pagination.total = parseInt(data.page.totalCount);
        const { dataview } = this.refs;
        if (dataview != null) {
            dataview._afterFetch(data.list);
        }
    }

    _beforeSearch() {
        this.state.pagination.current = 1;
    }

    _afterDel() {
        this.fetchPage(1);
        message.success('操作成功');
    }

    fetchPage(page) {
        this.state.pagination.current = page;
        this.fetch();
    }

    fetch() {
        const { dataview } = this.refs;
        if (dataview != null) {
            dataview.fetch();
        }
    }

    getInstance() {
        return this.refs && this.refs.dataview;
    }

    render() {
        return (
            <DataView
                ref="dataview"
                beforeFetch={this._beforeFetch.bind(this)}
                afterFetch={this._afterFetch.bind(this)}
                beforeSearch={this._beforeSearch.bind(this)}
                afterDel={this._afterDel.bind(this)}
                pagination={this.state.pagination}
                {...antiAssign(
                    this.props,
                    'beforeFetch,afterFetch,beforeSearch,afterDel,pagination',
                )}
            />
        );
    }
}
