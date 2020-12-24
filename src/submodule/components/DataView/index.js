// 库/框架
import React from 'react';
// 第三方库
import { Modal, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';
// ant_components 组件
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
// 自定义组件
import SearchView from '@/submodule/components/SearchView';
import FormFilterBtn from '@/components/form-FilterButton2';
import SelfPagination from '@/components/SelfPagination';
import ButtonAuth from '@/components/AuthButton';
import IconFont from '@/components/CustomIcon/IconFont';
// 样式
// 工具
import antiAssign from '@/utils/anti-assign';
import { DATE_FORMAT, PAGINATION } from '@/utils/constants';
import BISpin from '@/ant_components/BISpin';
import { getSift } from '@/services/comment';
import { getOptionName, replacePageNum } from '@/utils/utils';
import { SIFT_TYPE } from '@/utils/enum';
import storage from '@/utils/storage'; /* eslint-disable react/sort-comp */ // 关闭下划线变量检测 // 关闭方法排序检测 // 多维数组降维成一维数组
import styles from './index.less';

/**
 *
 * @param {initView} fun 用于数据初始化之后的数据处理,每个自控可单独处理回调
 */
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
    const cols = reduceDimension([...(props.searchCols || []), ...(props.advancedSearchCols || [])]);
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

export function formatSelect(val, options) {
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
    const selectObj = options.find((item) => {
        return item.id === val;
    }) || {};
    return selectObj;
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
export default class DataView extends React.Component {
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
                    window.history.replaceState(
                        { pageNum: nextPage },
                        '',
                        `${window.location.search && window.location.search.indexOf('?pageNum') < 0 ? `${window.location.search}&` : '?'}pageNum=${nextPage}`,
                    );
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

    async componentDidMount() {
        await this.getSiftData();
        await this.initView();
        replacePageNum('pageNum', this.state.current, this.state.pagination.onChange); // 当url里面有pageNum参数时，获取url里面的参数进行请求
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.pageData) !== JSON.stringify(nextProps.pageData)) {
            const { pagination, data } = this.state;
            const {
                pageData: { list, page },
            } = nextProps;
            const newPage = page.total > 0
                ? {
                    current: page.pageNum,
                    total: page.total,
                }
                : {
                    current: PAGINATION.current,
                    total: PAGINATION.total,
                };
            const newData = _.assign({}, data, { origin: list });
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

    initView = () => { // 该方法用于回调子空间的initView方法,只会执行一次
        const { initView } = this.props;
        const { searchForm } = this.state;
        if (initView) {
            initView({ searchForm, instance: this, form: this.props.form });
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

    fetch = () => {
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

    del(label, onClick, type) {
        label = typeof label === 'string' ? label : '删除';
        onClick = typeof onClick === 'function' ? onClick : null;
        if (type === 'download') {
            // onClick();
            return;
        }

        const {
            data: {
                view: { selectedData },
            },
        } = this.state;
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
                const { del, afterDel } = this.props;
                let onAfterDel = afterDel;
                if (typeof onAfterDel !== 'function') {
                    onAfterDel = this._afterDel.bind(this);
                }
                if (del === true && onClick) {
                    onClick(selectedData, onAfterDel);
                } else if (typeof del === 'function') {
                    del(selectedData, onAfterDel);
                }
            },
        });
    }

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
            const obj = siftDataArr.find((item) => {
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

    filterSubComChangeParams = (key) => {
        const { searchCols, advancedSearchCols } = this.props;
        const sumSearchCols = [...(searchCols || []), ...(advancedSearchCols || [])];
        let fn = null;
        if (!Array.isArray(sumSearchCols)) return null;
        const filterFun = (data) => {
            if (data.key === key && Object.prototype.toString(data) === '[object Object]') {
                const componentAttr = data.componentAttr || {};
                const onChangeParams = componentAttr.onChangeParams;
                if (onChangeParams && typeof onChangeParams === 'function') {
                    fn = onChangeParams;
                    return;
                }
            }
            if (Array.isArray(data)) {
                data.map((ls) => { return filterFun(ls); });
            }
        };
        filterFun(sumSearchCols);
        return fn;
    }

    // 更改查询条件
    _changeSearchForm = async (props, changedValues, allValues) => {
        let newData = changeDateRange(props, changedValues, allValues);
        // 回调配置项里面changeParams方法
        const onChangeParams = this.filterSubComChangeParams(Object.keys(changedValues)[0]);
        if (onChangeParams) {
            newData = await onChangeParams(changedValues, newData) || newData;
        }
        await this.setState({
            searchForm: newData,
            currentSiftNum: 0,
        });
    };

    // 渲染搜索栏
    _renderSearchForm = () => {
        const { searchCols, advancedSearchCols } = this.props;
        const { searchForm } = this.state;
        if (searchCols === null || searchCols.length <= 0) return null;
        return (
            <SearchView
                searchForm={searchForm}
                searchCols={searchCols}
                advancedSearchCols={advancedSearchCols}
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
    _onRemoveItem = async (values) => {
        const { searchForm } = this.state;
        let formData = removeItem(searchForm, values);
        // 回调配置项里面changeParams方法
        const onChangeParams = this.filterSubComChangeParams(values.key);
        if (onChangeParams) {
            const obj = {};
            obj[values.key] = undefined;
            formData = await onChangeParams(obj, formData) || formData;
        }
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
        let { searchCols, advancedSearchCols } = this.props;
        searchCols = [...(searchCols || []), ...(advancedSearchCols || [])];
        const { searchForm, siftDataArr, currentSiftNum } = this.state;
        if (searchCols === null || searchCols.length <= 0) return null;
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
        const { tips, tipsClassName } = this.props;
        if (tips) {
            return (
                <div className={`${styles.tips} ${tipsClassName}`}>
                    {tips}
                    {this._renderBtns()}
                </div>
            );
        }
        return this._renderBtns();
    }

    // 渲染操作按钮栏
    _renderBtns() {
        const { del } = this.props;
        let { btns } = this.props;
        if (btns == null || btns.length <= 0) return null;
        if (typeof del === 'function') {
            btns = btns.concat([{ label: '删除', onClick: this.del.bind(this) }]);
        }
        return (
            <div className={styles.row}>
                {btns.map((item, i) => {
                    const {
                        label, onClick, authority, download, iconBtnSrc, type,
                    } = item;
                    const style = {
                        marginLeft: '10px',
                    };
                    if (i === 0) {
                        style.marginRight = '0';
                    }
                    return (
                        <ButtonAuth key={i} authority={authority}>
                            {type === 'download' ? (
                                download()
                            ) : (
                                    <BIButton
                                        style={style}
                                        key={i}
                                        className={styles.btn}
                                        onClick={item.type === 'del' ? this.del.bind(this, label, onClick) : onClick}
                                        {...antiAssign(item, 'label,onClick,type,iconBtnSrc')}
                                    >
                                        {iconBtnSrc && iconBtnSrc !== '' ? (
                                            <IconFont className={styles.iconCls} type={iconBtnSrc} />
                                        ) : (
                                                <IconFont className={styles.iconCls} type="iconxinzeng" />
                                            )}
                                        <span className={styles.titleCls}>{label}</span>
                                    </BIButton>
                                )}
                        </ButtonAuth>
                    );
                })}
            </div>
        );
    }

    // 渲染表格组件
    _renderData() {
        const {
            del,
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
        if (del === true || typeof del === 'function') {
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
            className: styles.table,
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
        const pageSize = this.props.pagination && this.props.pagination.pageSize;
        return pagination.total > (pageSize || 20)
            ? <SelfPagination {...this.props.pagination} {...pagination} />
            : null;
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

    render() {
        const { style, hideForm, tips, selfCom, selfTableWrap } = this.props;
        const { loading } = this.state;
        return (
            <div className={styles.view} style={style}>
                <BISpin spinning={loading}>
                    {hideForm ? null : (
                        <>
                            <div className={styles.formWrap}>
                                {/* 筛选条件 */}
                                {selfCom || null}
                                {this._renderSearchForm()}
                                {/* 高级搜索 */}
                                {/* {advancedStatus ? this.renderAdvanced() : null} */}
                                {/* 已选条件、搜索按钮 */}
                                {this._renderFilterBtn()}
                            </div>
                            <div className={styles.split} />
                        </>
                    )}
                    <div className={classNames(styles.tableWrap, selfTableWrap)}>
                        {tips ? this._renderTips() : this._renderBtns()}
                        {this._renderData()}
                        {this._renderPagination()}
                        {this.props.children}
                    </div>
                </BISpin>
            </div>
        );
    }
}
