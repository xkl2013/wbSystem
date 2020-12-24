'use strict';
//库/框架
import React, {Component} from 'react';
//组件
import {Modal, Select, Button, Input, Table, DatePicker, message} from 'antd';
import SearchView from '../search-view';
import BITable from '@/ant_components/BITable';
//样式
import s from './index.less';
//工具
import antiAssign from '../../utils/anti-assign';
import _ from 'lodash';
//基础数据视图
export default class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {},
      lastSearchForm: {},
      data: {
        origin: [],
        view: {
          selectedData: [],
          selectedDataKeys: [],
        }
      },
    };
  }

  _beforeFetch() {
    const {searchView} = this.refs;
    if (searchView != null) {
      return searchView.getInstance();
    }
  }

  _afterFetch(data, selectedData, selectedDataKeys) {
    this.setState({
      data: {
        origin: data,
        view: {
          selectedData: selectedData || [],
          selectedDataKeys: selectedDataKeys || []
        }
      },
    });
  }

  _afterDel() {
    this.fetch();
    message.success('操作成功');
  }

  fetch() {
    const {beforeFetch, fetch, afterFetch} = this.props;
    let onBeforeFetch = beforeFetch;
    (typeof onBeforeFetch != 'function') && (onBeforeFetch = this._beforeFetch.bind(this));
    let onAfterFetch = afterFetch;
    (typeof onAfterFetch != 'function') && (onAfterFetch = this._afterFetch.bind(this));
    if (typeof fetch == 'function') {
      fetch(onBeforeFetch, onAfterFetch);
    }
  }

  search() {
    const {beforeSearch} = this.props;
    (typeof beforeSearch == 'function') && (beforeSearch());
    this.fetch();
  }

  del(label, onClick) {
    label = typeof label == 'string' ? label : '删除';
    onClick = typeof onClick == 'function' ? onClick : null;
    const {data: {view: {selectedData}}} = this.state;
    if (selectedData.length <= 0) {
      message.error(`请选择要${label}的记录`);
      return;
    }
    Modal.confirm({
      title: `确认${label}`,
      content: `确认${label}选中的${selectedData.length}条记录`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {del, afterDel} = this.props;
        let onAfterDel = afterDel;
        (typeof onAfterDel != 'function') && (onAfterDel = this._afterDel.bind(this));
        if (del == true && onClick) {
          onClick(selectedData, onAfterDel);
        } else {
          (typeof del == 'function') && (del(selectedData, onAfterDel));
        }
      }
    });
  }

  _renderSearch() {
    const {searchCols} = this.props;
    if (searchCols == null || searchCols.length <= 0) return null;
    return (
      <SearchView ref="searchView" searchCols={searchCols} search={this.search.bind(this)}/>
    );
  }

  _renderBtns() {
    let {btns, del} = this.props;
    if (btns == null || btns.length <= 0) return null;
    if (typeof del == 'function') {
      btns = btns.concat([{label: '删除', onClick: this.del.bind(this)}]);
    }
    return (
      <div
        className={s.row}
      >
        {
          btns.map((item, i) => {
            const {label, onClick} = item;
            let style = {};
            if (i == 0) {
              style.marginRight = '0';
            }
            return (
              <Button
                key={i}
                className={s.btn}
                style={style}
                type="primary"
                onClick={item.type == 'del' ? this.del.bind(this, label, onClick) : onClick}
                {...antiAssign(item, 'label,onClick,type')}
              >
                {label}
              </Button>
            );
          })
        }
      </div>
    );
  }

  _renderData() {
    const {del, cols, pagination, rowKey} = this.props;
    const {data} = this.state;
    let rowSelection = null;
    if (del == true || typeof del == 'function') {
      rowSelection = {
        selectedRowKeys: data.view.selectedDataKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.state.data.view.selectedDataKeys = selectedRowKeys;
          this.state.data.view.selectedData = selectedRows;
          this.forceUpdate();
        }
      };
    }
    return (
      <BITable
        className={s.table}
        rowKey={rowKey}
        rowSelection={rowSelection}
        columns={cols}
        dataSource={data.origin}
        // bordered={true}
        //scroll={{ x: '150%' }}
        pagination={pagination ? pagination : false}
      />
    );
  }

  render() {
    const {style} = this.props;
    return (
      <div className={s.view} style={style}>
        {this._renderSearch()}
        {this._renderBtns()}
        {this._renderData()}
        {this.props.children}
      </div>
    );
  }
}
