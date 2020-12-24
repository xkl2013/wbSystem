/* eslint-disable */
// 库/框架
import React, { Component } from 'react';
// 组件
import { Modal, message, Affix } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import SearchView from '../SearchView';
import FormFilterBtn from '../form-FilterButton2';
import SelfPagination from '../SelfPagination';
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
import ButtonAuth, { checkPathname } from '@/components/AuthButton';
// import AdvancedSearch from '@/components/AdvancedSearch';
import IconFont from '@/components/CustomIcon/IconFont';

// 样式
import s from './index.less';
// 工具
import antiAssign from '../../utils/anti-assign';
import { DATE_FORMAT, PAGINATION } from '@/utils/constants';
import BISpin from '@/ant_components/BISpin';
import { getSift } from '@/services/comment';
import { getOptionName, replacePageNum } from '@/utils/utils';
import { SIFT_TYPE } from '@/utils/enum';
import storage from '@/utils/storage'; /* eslint-disable react/sort-comp */ // 关闭下划线变量检测 // 关闭方法排序检测 // 多维数组降维成一维数组

/* eslint-disable no-underscore-dangle */
function reduceDimension(arr) {
    return Array.prototype.concat.apply([], arr);
}

// userTree/orgTree数据转成{id,name}
function formatUser(obj) {
    let name = obj.label;
    if (typeof name !== 'string') {
        name = obj.label.props.children;
    }
    return { id: obj.value, name };
}

// associationSearch数据转成{id,name}
function formatAssociationSearch(obj) {
    if (Array.isArray(obj) && obj.length > 0) {
        return obj.map((item) => {
            return { id: item.value, name: item.label };
        });
    }
    return { id: obj.value, name: obj.label };
}

// id数组转成{id,name}
function formatArr(arr, options) {
    const temp = [];
    arr.map((key) => {
        temp.push({
            id: key,
            name: (
                options.find((item) => {
                    return String(item.id) === String(key);
                }) || {}
            ).name,
        });
    });
    return temp;
}

// radio转换
function formatRadioArr(key, options) {
    const temp = [];
    options.map((item) => {
        if (Number(item.id) === Number(key)) {
            temp.push({
                id: Number(item.id),
                name: item.name,
            });
        }
    });
    return temp;
}

// 日期数组转成{id,name}
function formatDateRange(arr) {
    const temp = [];
    arr.map((date, index) => {
        temp.push({ id: index, name: moment(date).format(DATE_FORMAT) });
    });
    return temp;
}

// 日期数组转成{id,name}
function formatDateTimeRange(arr) {
    const temp = [];
    arr.map((date, index) => {
        temp.push({ id: index, name: moment(date).format('YYYY-MM-DD hh:mm:ss') });
    });
    return temp;
}

// 日期转成{id,name}
function formatDate(date) {
    return { id: undefined, name: moment(date).format('YYYY-MM-DD') };
}

// 转换成区间
function formarRange(data) {
    return Object.keys(data)
        .map((item) => {
            return {
                id: item,
                name: data[item],
            };
        })
        .filter((item) => {
            return item.name && item.name !== data.type;
        });
}

// 日期区间格式化（时间部分为00:00:00-23:59:59）
function changeDateRange(props, changedValues, allValues) {
    const key = Object.keys(changedValues)[0];
    const cols = reduceDimension(props.searchCols);
    const col = cols.find((item) => {
        return item.key === key;
    });
    if (col && col.type === 'daterange' && Array.isArray(changedValues[key]) && changedValues[key].length > 0) {
        if (changedValues[key].length === 1) {
            allValues[key] = [moment(moment(changedValues[key][0]).format('YYYY-MM-DD 00:00:00'))];
        } else {
            allValues[key] = [
                moment(moment(changedValues[key][0]).format('YYYY-MM-DD 00:00:00')),
                moment(moment(changedValues[key][1]).format('YYYY-MM-DD 23:59:59')),
            ];
        }
    }
    return allValues;
}

function formatSelect(val, options) {
    if (Array.isArray(val) && val.length > 0) {
        return val.map((item) => {
            return {
                id: item,
                name: options.find((cItem) => {
                    return cItem.id === item;
                }).name,
            };
        });
    }
    if (Array.isArray(val) && val.length === 0) {
        return [];
    }
    return {
        id: val,
        name: options.find((item) => {
            return item.id === val;
        }).name,
    };
}

function formatForm(formData, searchCols) {
    const cols = reduceDimension(searchCols);
    const result = [];
    Object.keys(formData).map((key) => {
        if (!formData[key]) {
            return;
        }
        const col = cols.find((item) => {
            return item.key === key;
        });
        if (col === undefined) return;
        let value;
        switch (col.type) {
            case 'radio':
                value = formatRadioArr(formData[key], col.options);
                break;
            case 'checkbox':
                value = formatArr(formData[key], col.options);
                break;
            case 'usertree':
                break;
            case 'orgtree':
                value = formatUser(formData[key]);
                break;
            case 'associationSearch':
                value = formatAssociationSearch(formData[key]);
                break;
            case 'daterange':
                value = formatDateRange(formData[key]);
                break;
            case 'daterangetime':
                value = formatDateTimeRange(formData[key]);
                break;
            case 'date':
                value = formatDate(formData[key]);
                break;
            case 'associationSearchFilter':
                value = formatAssociationSearch(formData[key]);
                break;
            case 'numberRange':
                value = formarRange(formData[key]);
                break;
            case 'select':
                value = formatSelect(formData[key], col.options);
                break;
            case 'tag':
                let tagVal = {};
                const tagTreeSelect = (val, options) => {
                    options.forEach((item) => {
                        if (item.value === val) {
                            tagVal = { id: item.id, name: item.title };
                        } else if (item.children && item.children.length) {
                            tagTreeSelect(val, item.children);
                        }
                    });
                    return tagVal;
                };
                value = tagTreeSelect(formData[key], col.componentAttr.treeData, tagVal);
                break;
            default:
                value = formData[key];
                break;
        }
        result.push({ key, value });
    });
    return result;
}

function removeItem(formData, removedItem) {
    const data = _.assign({}, formData);
    const item = data[removedItem.key];
    if (item.type === 'numberRange') {
        const clearObj = {};
        clearObj[removedItem.id] = undefined;
        const newObj = { ...data[removedItem.key], ...clearObj };
        data[removedItem.key] = newObj;
    } else if (Array.isArray(item)) {
        if (moment.isMoment(item[0])) {
            data[removedItem.key] = undefined;
            // item.splice(removeItem.id, 1);
        } else {
            const index = item.findIndex((t) => {
                return t.key || t.value
                    ? String(t.key) === String(removedItem.id) || String(t.value) === String(removedItem.id)
                    : String(t) === String(removedItem.id);
            });
            if (index > -1) {
                item.splice(index, 1);
            }
        }
    } else {
        data[removedItem.key] = undefined;
    }
    return data;
}

// 基础数据视图
export default class DataView extends Component {
    constructor(props) {
        super(props);
        const {
            pageData: { list, page },
            pagination,
        } = props;
        this.state = {
            searchForm: this.getDefaultSift(),
            pagination: {
                showTotal: (total) => {
                    return `共${total}条`;
                },
                pageSize: (pagination && pagination.pageSize) || PAGINATION.pageSize,
                total: (page && page.total) || PAGINATION.total,
                current: (page && page.current) || PAGINATION.current,
                onChange: (nextPage) => {
                    this.fetchPage(nextPage);
                    this.fetch();
                    window.history.replaceState({ pageNum: nextPage }, '', `?pageNum=${nextPage}`);
                },
                onShowSizeChange: this.fetchPageSize,
                showQuickJumper: true,
            },
            data: {
                origin: list || [],
                view: {
                    selectedData: [],
                    selectedDataKeys: [],
                },
            },
            loading: false,
            siftDataArr: [], // 快捷筛选数据列表
            currentSiftNum: 0,
        };
    }

    componentWillMount() {
        // this.getDefaultSift();
    }

    componentDidMount() {
        this.getSiftData();
        replacePageNum('pageNum', this.state.current, this.fetchPage); // 当url里面有pageNum参数时，获取url里面的参数进行请求
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.pageData) !== JSON.stringify(nextProps.pageData)) {
            const { pagination, data } = this.state;
            const {
                pageData: { list, page },
            } = nextProps;
            const newPage =
                page.total > 0
                    ? {
                          current: page.pageNum,
                          total: page.total,
                      }
                    : {
                          current: PAGINATION.current,
                          total: PAGINATION.total,
                      };
            const newData = _.assign({}, data, {
                origin: list,
                view: {
                    selectedData: [],
                    selectedDataKeys: [],
                },
            });
            this.setState({
                pagination: _.assign({}, pagination, newPage),
                data: newData,
            });
        }
        const { loading } = nextProps;
        this.setState({
            loading: loading || false,
        });
    }

    getDefaultSetSift() {
        if (Array.isArray(this.props.searchCols)) {
            const newData = {};
            this.props.searchCols.map((item) => {
                item.map((col) => {
                    if (col.defaultValue) newData[col.key] = col.defaultValue;
                });
            });
            return newData;
        }
    }

    getDefaultSift() {
        const storageItem = storage.getItem(`businessType-${getOptionName(SIFT_TYPE, window.location.pathname)}`);
        const siftStorage = this.rebackDate(storageItem) || {};
        let result = {};
        let status = false;
        if (JSON.stringify(siftStorage) === '{}') {
            result = this.getDefaultSetSift();
        } else {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in siftStorage) {
                // eslint-disable-next-line no-prototype-builtins
                if (siftStorage.hasOwnProperty(key)) {
                    const element = siftStorage[key];
                    if (Array.isArray(element) && element.length === 0) {
                        result = this.getDefaultSetSift();
                    } else {
                        status = true;
                    }
                }
            }
        }
        if (status) {
            result = siftStorage;
        }
        return result;
    }

    async getSiftData() {
        const res = await getSift({
            businessType: getOptionName(SIFT_TYPE, window.location.pathname),
        });
        if (res && res.success === true) {
            const data = res.data || {};
            const siftData = data.queryLabelList || [];
            this.setState({
                siftDataArr: siftData,
            });
        } else {
            message.error(res && res.message);
        }
    }

    // eslint-disable-next-line react/sort-comp
    _beforeFetch() {
        const { searchForm, pagination } = this.state;

        return _.assign({}, searchForm, {
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
        });
    }

    _afterFetch(data, selectedData, selectedDataKeys) {
        const { pagination } = this.state;
        const newPagination = _.assign({}, pagination, data.page);
        this.setState({
            pagination: newPagination,
            data: {
                origin: data.list,
                view: {
                    selectedData: selectedData || [],
                    selectedDataKeys: selectedDataKeys || [],
                },
            },
        });
    }

    _afterDel() {
        this.fetch();
        message.success('操作成功');
    }

    fetch() {
        const { beforeFetch, fetch, afterFetch } = this.props;
        let onBeforeFetch = beforeFetch;
        if (typeof onBeforeFetch !== 'function') {
            onBeforeFetch = this._beforeFetch.bind(this);
        }
        let onAfterFetch = afterFetch;
        if (typeof onAfterFetch !== 'function') {
            onAfterFetch = this._afterFetch.bind(this);
        }
        storage.setItem(
            `businessType-${getOptionName(SIFT_TYPE, window.location.pathname)}`,
            this.changeData(this.state.searchForm),
        );
        if (typeof fetch === 'function') {
            fetch(onBeforeFetch, onAfterFetch);
        }
    }

    search() {
        const { beforeSearch } = this.props;
        window.history.replaceState({ pageNum: 1 }, '', `?pageNum=${1}`);
        if (typeof beforeSearch === 'function') {
            beforeSearch();
        }
        this.state.pagination.current = 1;
        this.fetch();
    }

    // 翻页功能
    fetchPage = (current) => {
        this.state.pagination.current = current;
        // this.fetch();
    };

    // 改变页码功能
    fetchPageSize = (current, pageSize) => {
        this.state.pagination.current = 1;
        this.state.pagination.pageSize = pageSize;
        this.fetch();
    };

    rebackDate = (data) => {
        const reg = /^(\d{4})-(\d{2})-(\d{2})$/;
        // eslint-disable-next-line no-restricted-syntax
        for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(key)) {
                if (Array.isArray(data[key])) {
                    data[key].map((item) => {
                        if (reg.test(item)) {
                            data[key][0] = moment(moment(data[key][0]).format('YYYY-MM-DD 00:00:00'));
                            data[key][1] = moment(moment(data[key][1]).format('YYYY-MM-DD 23:59:59'));
                        }
                    });
                }
            }
        }
        return data;
    };

    changeSearchForm(index) {
        // 点击筛选更新选中条件
        let result = {};
        if (index === 0) {
            result = {};
        } else {
            const siftDataArr = Array.isArray(this.state.siftDataArr) ? this.state.siftDataArr : [];
            const obj =
                siftDataArr.find((item) => {
                    return item.queryLabelId === index;
                }) || {};
            try {
                result = JSON.parse(obj.queryLabelValue);
                result = this.rebackDate(result);
            } catch (e) {
                console.warn(e);
            }
        }
        this.setState(
            {
                searchForm: result,
                currentSiftNum: index,
            },
            () => {
                this.search();
            },
        );
    }

    changeData = (changeData) => {
        const data = _.cloneDeep(changeData);
        // eslint-disable-next-line no-restricted-syntax
        for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(key)) {
                if (Array.isArray(data[key])) {
                    data[key].map((item) => {
                        if (item instanceof moment) {
                            data[key][0] = moment(data[key][0]).format('YYYY-MM-DD');
                            data[key][1] = moment(data[key][1]).format('YYYY-MM-DD');
                        }
                    });
                }
            }
        }
        return data;
    };

    // 更改查询条件
    _changeSearchForm = (props, changedValues, allValues) => {
        const newData = changeDateRange(props, changedValues, allValues);
        this.setState({
            searchForm: newData,
            currentSiftNum: 0,
        });
    };

    // 渲染搜索栏
    _renderSearchForm = () => {
        const { searchCols } = this.props;
        const { searchForm } = this.state;
        return (
            <SearchView
                searchForm={searchForm}
                searchCols={searchCols}
                search={this.search}
                onChangeParams={this._changeSearchForm}
            />
        );
    };

    // 清空搜索条件
    _onReset = () => {
        this.setState(
            {
                searchForm: {},
            },
            () => {
                this.fetch();
            },
        );
    };

    // 删除指定搜索条件
    _onRemoveItem = (values) => {
        const { searchForm } = this.state;
        const formData = removeItem(searchForm, values);
        this.setState(
            {
                searchForm: formData,
                currentSiftNum: 0,
            },
            () => {
                this.fetch();
            },
        );
    };

    siftCallBack() {
        // 更新自定义筛选标签
        this.getSiftData();
    }

    // 渲染查询条件按钮组件
    _renderFilterBtn = () => {
        const { searchCols } = this.props;
        const { searchForm, siftDataArr, currentSiftNum } = this.state;
        const chooseItems = formatForm(searchForm, searchCols);
        return (
            <FormFilterBtn
                siftDataArr={siftDataArr}
                searchForm={JSON.stringify(this.changeData(searchForm))}
                chooseItems={chooseItems}
                currentSiftNum={currentSiftNum}
                onSubmit={this.search.bind(this)}
                onResert={this._onReset.bind(this)}
                onRemoveItem={this._onRemoveItem.bind(this)}
                siftCallBack={this.siftCallBack.bind(this)}
                changeSearchForm={this.changeSearchForm.bind(this)}
            />
        );
    };

    // 渲染顶部tips
    _renderTips() {
        const { tips } = this.props;
        if (tips) {
            return (
                <div className={s.tips}>
                    {tips}
                    {this._renderBtns()}
                </div>
            );
        }
        return this._renderBtns();
    }

    // 渲染操作按钮栏
    _renderBtns() {
        let { btns } = this.props;
        if (btns == null || btns.length <= 0) return null;
        return (
            <div className={s.row}>
                {btns.map((item, i) => {
                    return this.renderBtn(item, i);
                })}
            </div>
        );
    }

    renderBtn = (btn, i) => {
        const { label, authority, noAuthDisplay = 'hidden', download, iconBtnSrc = 'iconxinzeng', type } = btn;
        const {
            data: {
                view: { selectedData },
            },
        } = this.state;
        let disabled = false;
        if (authority !== undefined) {
            if (!checkPathname(authority)) {
                if (noAuthDisplay === 'hidden') {
                    return null;
                } else if (noAuthDisplay === 'disabled') {
                    disabled = true;
                }
            }
        }
        if (type === 'download' && typeof download === 'function') {
            return download(disabled);
        }
        if (type === 'multiple') {
            disabled = selectedData.length === 0;
        }
        const style = {
            marginLeft: '10px',
        };
        if (i === 0) {
            style.marginRight = '0';
        }
        return (
            <BIButton
                style={style}
                key={i}
                className={s.btn}
                disabled={disabled}
                type="primary"
                ghost
                onClick={this.clickBtn.bind(this, btn)}
                {...antiAssign(btn, 'label,onClick,type,iconBtnSrc,authority,noAuthDisplay,download')}
            >
                {iconBtnSrc !== 'none' && <IconFont className={s.iconCls} type={iconBtnSrc} />}
                <span className={s.titleCls}>{label}</span>
            </BIButton>
        );
    };

    clickBtn = (btn) => {
        const { onClick } = btn;
        const {
            data: {
                view: { selectedData },
            },
        } = this.state;
        if (typeof onClick === 'function') {
            onClick({ data: selectedData });
        }
    };

    // 渲染表格组件
    _renderData() {
        const {
            isMultiple,
            cols,
            rowKey,
            rowSelectionConfig,
            expandedRowRender,
            expandIcon,
            scroll,
            expandedRowKeys,
            onExpandedRowsChange,
        } = this.props;
        const { data } = this.state;
        let rowSelection = null;
        if (isMultiple) {
            rowSelection = {
                selectedRowKeys: data.view.selectedDataKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.state.data.view.selectedDataKeys = selectedRowKeys;
                    this.state.data.view.selectedData = selectedRows;
                    this.forceUpdate();
                },
            };
        }
        if (rowSelectionConfig) {
            rowSelection = rowSelectionConfig;
        }
        const commonProps = {
            className: s.table,
            rowKey,
            rowSelection,
            columns: cols,
            dataSource: data.origin,
            expandIcon,
            onExpandedRowsChange,
            expandedRowRender,
            pagination: false,
            bordered: false,
        };
        const _props = expandedRowKeys ? { ...commonProps, expandedRowKeys } : commonProps;
        return scroll ? <BITable {..._props} scroll={scroll} /> : <BITable {..._props} />;
    }

    // 渲染分页组件
    _renderPagination = () => {
        const { pagination } = this.state;
        return pagination.total > 20 ? <SelfPagination {...this.props.pagination} {...pagination} /> : null;
    };

    formSiftData = (data) => {
        // 格式化快捷筛选数据
        const result = [];
        data.map((item) => {
            const queryLabelConditions = [];
            item.queryLabelConditions.map((cItem) => {
                queryLabelConditions.push({
                    queryLabelKey: cItem.queryLabelKey,
                    queryLabelValue: cItem.queryLabelValue,
                    queryLabelControlType: cItem.queryLabelControlType,
                });
            });
            result.push({
                queryLabelName: item.queryLabelName,
                queryLabelConditions,
                queryLabelControlType: item.queryLabelControlType,
            });
        });
        return result;
    };

    // 高级搜索
    // renderAdvanced = () => {
    //     const {} = this.props;
    //     return null;
    //     // return <AdvancedSearch />;
    // };

    renderForm = () => {
        const { searchCols } = this.props;
        if (!Array.isArray(searchCols) || searchCols.length === 0) {
            return null;
        }
        return (
            <>
                <div className={s.formWrap}>
                    {/* 筛选条件 */}
                    {this._renderSearchForm()}
                    {/* 高级搜索 */}
                    {/* {advancedStatus ? this.renderAdvanced() : null} */}
                    {/* 已选条件、搜索按钮 */}
                    {this._renderFilterBtn()}
                </div>
                <div className={s.split} />
            </>
        );
    };

    render() {
        const { style } = this.props;
        const { loading } = this.state;
        return (
            <div className={s.view} style={style}>
                <BISpin spinning={loading}>
                    {this.renderForm()}
                    <div className={s.tableWrap}>
                        {this._renderTips()}
                        {this._renderData()}
                        {this._renderPagination()}
                        {this.props.children}
                    </div>
                </BISpin>
            </div>
        );
    }
}
