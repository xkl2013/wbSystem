'use strict';
//库/框架
import React, {Component} from 'react';
//组件
import {Select, Button, Input, DatePicker, Checkbox} from 'antd';
import FormFilterButton from '@/components/formFilterButton';
//样式
import s from './index.less';
//工具
//基础搜索组件
export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {},
    };
  }

  componentDidMount() {
    this._initSearch();
  }

  _initSearch() {
    const {searchCols} = this.props;
    let searchForm = {};
    if (Array.isArray(searchCols)) {
      searchCols.map(row => {
        row.map(col => {
          const {defaultValue, key} = col;
          if (key != null) {
            if (col.hasOwnProperty('defaultValue')) {
              searchForm[key] = defaultValue;
            }
          }
        })
      });
      this.setState({searchForm});
    }
  }

  getInstance = () => {
    return this.state.searchForm;
  }

  _renderSearch() {
    const {search} = this.props;
    return (
      <div
        className={s.searchBtnWrap}
      >
        <Button
          className={s.searchBtn}
          type="primary"
          onClick={search.bind(this)}
        >
          搜索
        </Button>
      </div>
    );
  }

  _renderItem = (col) => {
    const {searchForm} = this.state;
    const {key, type, placeholder, options, format, showTime, style} = col;
    if (!key) {
      return null;
    }
    switch (type) {
      case 'select':
        return (
          <Select
            style={style}
            value={searchForm[key]}
            onChange={(value) => {
              this.state.searchForm[key] = value;
              this.forceUpdate();
            }}
            size="large"
            placeholder={placeholder}
          >
            {
              Array.isArray(options) && options.map(option => {
                return (
                  <Select.Option
                    value={option.id}
                  >
                    {option.name}
                  </Select.Option>
                );
              })
            }
          </Select>
        );
      case 'date':
        return (
          <DatePicker
            value={searchForm[key]}
            onChange={(value) => {
              this.state.searchForm[key] = value;
              this.forceUpdate();
            }}
            size="large"
            placeholder={placeholder}
            showTime={showTime || false}
            format={format || "YYYY-MM-DD"}
          />
        );
      case 'checkbox':
        return (
          <Checkbox.Group
            value={searchForm[key]}
            onChange={(value) => {
              this.state.searchForm[key] = value;
              this.forceUpdate();
            }}
          >
            {options.map(option => (
              <Checkbox value={option.id} key={option.id}>
                {option.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      default:
        return (
          <Input
            value={searchForm[key]}
            onChange={(e) => {
              if (e.target.value == '') {
                delete this.state.searchForm[key];
              } else {
                this.state.searchForm[key] = e.target.value;
              }
              this.forceUpdate();
            }}
            placeholder={placeholder}
          />
        );
    }
  }

  _renderCol = (col) => {
    const {label, searchBtn} = col;
    if (!!label) {
      return <div className={s.colInner}>
        <div className={s.label}>{label}:</div>
        <div className={s.itemWrap}>
          <div className={s.itemContent}>
            {this._renderItem(col)}
          </div>
          {searchBtn ? this._renderSearch() : null}
        </div>
      </div>
    } else {
      return <div className={s.colInner}>
        <div className={s.itemWrap}>
          <div className={s.itemContent}>
            {
              this._renderItem(col)
            }
          </div>
          {searchBtn ? this._renderSearch() : null}
        </div>
      </div>
    }
  }

  _renderRow = (arr, index) => {
    let len = arr.length;
    let colClass = s.colWrap;
    if (len > 1) {
      colClass += ' ' + s[`_${len}`];
    }
    return <div className={s.rowWrap} key={index}>
      {
        arr.map((col, index) => {
          return (
            <div className={colClass} key={index}>
              {
                this._renderCol(col)
              }
            </div>
          )
        })
      }
    </div>
  }

  render() {
    const {style, searchCols} = this.props;
    return (
      <div className={s.view} style={style}>
        {
          searchCols.map((arr, index) => {
            return this._renderRow(arr, index);
          })
        }
        {
          <FormFilterButton onSubmit={this.onSubmit} onResert={this.onResert} onRemoveItem={this.onRemoveItem}/>
        }
      </div>
    );
  }
}
