import React, { useReducer, useEffect, MutableRefObject, useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import IconFont from '@/submodule/components/CustomIcon/IconFont';
import BISpin from '@/submodule/ant_components/BISpin';
import SearchForm from './_components/searchForm';
import Table from './_components/table';

// 样式
import styles from './index.less';
import { DataViewContext, } from './context';
import { initState, reducer, effect } from './DataViewReducer';

interface Props {
    style?: any,
    hideForm?: boolean, // 是否隐藏搜索表单,默认false
    tips?: any
    children?: any,
    initView?: Function | undefined
    beforeFetch?: Function | undefined
    fetch?: Function | undefined
    afterFetch?: Function | undefined
    loading?: boolean
    tableCon?: any
    searchCols: any
    btns?: any

}
interface State {
    loading: boolean;
}


const DataView = (props: Props, ref: Ref<any>) => {
    let registerFun: any = {
        fetch: _fetch
    }
    const testRef: MutableRefObject<any> = useRef();
    const { style, hideForm, tips } = props;
    const [state, dispatch, effectDispatch] = effect(useReducer(reducer, initState), registerFun);
    const initView = async () => {
        const { initView } = props;
        if (initView) {
            await initView(state);
        }
        await effectDispatch({
            type: 'initData',
        })
    }
    useEffect(() => {
        initView()
    }, [])

    const _beforeFetch = (params: any) => {
        const { pagination = {}, searchForm = {} } = params || {};
        const newSearchForm = searchForm === null ? {} : { ...state.searchForm, ...(searchForm || {}) }  // 手动清空
        return Object.assign({}, newSearchForm, {
            pageSize: state.pagination.pageSize,
            pageNum: state.pagination.pageNum,
        }, (pagination || {}));
    }
    const _afterFetch = (params: any) => {
        const { dataSource = [], pagination = {} } = params || {}
        return {
            pagination: { ...state.pagination, ...(pagination || {}) },
            dataSource: Array.isArray(dataSource) ? dataSource.slice() : [],
        }
    }
    async function _fetch(params = {}) {
        const { beforeFetch, fetch, afterFetch } = props;
        const onBeforeFetch: Function = beforeFetch && typeof beforeFetch === 'function' ? beforeFetch : _beforeFetch;
        const onAfterFetch: Function = afterFetch && typeof afterFetch === 'function' ? afterFetch : _afterFetch;
        if (typeof fetch === 'function') {
            const res = await fetch(onBeforeFetch.bind(null, params), dispatch);
            const { dataSource = [], pagination = {}, searchForm = {} } = res || {};
            return await onAfterFetch({
                dataSource,
                pagination: {
                    ...(params.pagination || {}), ...pagination,
                    searchForm: { ...(params.searchForm || {}), ...searchForm }
                }
            })
        }
    }
    useImperativeHandle(ref, () => {//第一个参数，要暴露给哪个(ref)？第二个参数要暴露出什么？
        return {
            fetch: effectDispatch.bind(null, { type: 'onSearch' })
        }
    });
    const _renderBtns = () => {
        if (props.btns && props.btns.length > 0) {
            return (<div className={styles.row}>
                {props.btns.map((item: any, i: number) => {
                    const { label, onClick, authority, download, iconBtnSrc, type } = item;
                    const style: any = {
                        marginLeft: '10px',
                    };
                    if (i === 0) {
                        style.marginRight = '0';
                    }
                    return (
                        // <ButtonAuth key={i} authority={authority}>
                        <Button
                            style={style}
                            key={i}
                            className={styles.btn}
                            onClick={onClick}
                        >
                            {iconBtnSrc && iconBtnSrc !== '' ? (
                                <IconFont className={styles.iconCls} type={iconBtnSrc} />
                            ) : (
                                    <IconFont className={styles.iconCls} type="iconxinzeng" />
                                )}
                            <span className={styles.titleCls}>{label}</span>
                        </Button>

                        // </ButtonAuth>
                    );
                })}
            </div>)
        }

    }
    return (
        <div className={styles.view} style={style}>

            <DataViewContext.Provider value={[state, dispatch, effectDispatch]}>
                <BISpin spinning={props.loading}>
                    {hideForm ? null : (
                        <>
                            <div className={styles.formWrap}>
                                {/* 基本筛选条件 */}
                                <SearchForm searchCols={props.searchCols} ref={testRef} />
                            </div>
                            <div className={styles.split} />
                        </>
                    )}
                    <div className={styles.tableWrap}>
                        {_renderBtns()}
                        <Table {...props.tableCon} fetch={_fetch} />
                        {props.children}
                    </div>
                </BISpin>
            </DataViewContext.Provider>
        </div>
    )
}
export default forwardRef(DataView)