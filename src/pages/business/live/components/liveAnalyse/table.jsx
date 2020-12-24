/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import businessConfig from '@/config/business';
import { getGMVList } from '../../service';
// import Loading from '@/ant_components/BISpin';
import ApolloTable, { config as baseCompConfig } from '@/submodule/components/apolloTable';
// import ModalDetail from '../../detail';
import s from '../../session/index.less';
import { formateGMVData } from './_utils';

const Session = (props, ref) => {
    const config = businessConfig[49];
    let time = null;
    const {
        tableId,
        getColumnConfig,
        addOrUpdateDataSource,
        // getDetail,
        // delData,
        // interfaceName,
        // isShowComment,
        // commentSort,
        // name,
    } = config;
    const modalDetail = useRef(null);
    const [loading, setLoading] = useState([]);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        fetchColumns();
    }, []);
    const fetchColumns = async () => {
        const res = await getColumnConfig({ tableId });
        if (res && res.success && res.data) {
            const arr = Array.isArray(res.data) ? res.data : [];
            setColumns(arr);
        }
    };
    useEffect(() => {
        fetchDataSource({ pageNum: 1 });
        return unMount;
    }, []);
    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 200,
        total: 0,
    });

    const fetchDataSource = useCallback(
        async ({ pageNum }) => {
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
            };
            const res = await getGMVList({ tableId, liveId: props.liveId, data });
            if (res && res.success && res.data) {
                const { list, total } = res.data;
                const arr = Array.isArray(list) ? list : [];
                let newList = dataSource.concat(arr);
                if (data.pageNum === 1) {
                    newList = arr;
                }
                // newList = formateGMVData(newList, 5 * 60 * 1000);
                const newPageConfig = {
                    ...pageConfig,
                    pageNum: data.pageNum,
                    total,
                };
                setDataSource(newList);
                setPageConfig(newPageConfig);
            }
            await setLoading(false);
            onTimeRefresh();
        },
        [tableId, pageConfig],
    );
    const onTimeRefresh = () => {
        if (props.liveStatus !== 2) return;
        if (time) {
            clearTimeout(time);
        }
        time = setTimeout(async () => {
            fetchDataSource({ pageNum: 1 });
            props?.getLiveStatus();
        }, 5 * 60 * 1000);
    };
    const onRefresh = () => {
        fetchDataSource({ pageNum: 1 });
    };
    const unMount = () => {
        if (time) {
            clearTimeout(time);
        }
    };
    const onScroll = () => {
        if (pageConfig.pageNum * pageConfig.pageSize < pageConfig.total && !loading) {
            fetchDataSource({ pageNum: pageConfig.pageNum + 1 });
        }
    };
    const debounceScroll = _.debounce(onScroll, 400);

    const emitChangeCell = async ({ rowId, value }) => {
        const res = await addOrUpdateDataSource({ data: { tableId, id: rowId, value } });
        if (res && res.success) {
            fetchDataSource({ pageNum: 1 });
        }
    };

    // const onClickAddSession = useCallback(
    //     (data) => {
    //         if (modalDetail && modalDetail.current) {
    //             modalDetail.current.showModal({ tableId, ...data });
    //         }
    //     },
    //     [modalDetail, tableId],
    // );
    useImperativeHandle(ref, () => {
        // 第一个参数，要暴露给哪个(ref)？第二个参数要暴露出什么？
        return {
            onRefresh,
        };
    });
    return (
        <>
            <ApolloTable
                className={s.table}
                rowHeight={40}
                headerHeight={40}
                columns={columns}
                dataSource={dataSource}
                // dataSource={useMemo(() => {
                //     return formateGMVData(dataSource, 500000);
                // }, [dataSource])}
                showIndex={true}
                showExpand={false}
                cellEditable={false}
                emitChangeCell={emitChangeCell}
                onScroll={debounceScroll}
                loading={loading}
                loadComp={null}
                // loadComp={<Loading loadingClassName={s.loading} />}
            />
            {/* <ModalDetail
                ref={modalDetail}
                tableId={tableId}
                getData={fetchDataSource}
                interfaceName={interfaceName}
                commentSort={commentSort}
                name={name}
                isShowComment={isShowComment}
                getDetail={getDetail}
                getColumnConfig={getColumnConfig}
                addOrUpdateDataSource={addOrUpdateDataSource}
                delData={delData}
                noEdit={true}
                noDel={true}
            /> */}
        </>
    );
};

export default forwardRef(Session);
