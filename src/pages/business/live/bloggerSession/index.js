/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { Modal } from 'antd';
import moment from 'moment';
import businessConfig from '@/config/business';
import { checkPathname } from '@/components/AuthButton';
import Loading from '@/ant_components/BISpin';
import ApolloTable from '@/submodule/components/apolloTable';
import FirstLink from '@/pages/business/live/session/linkPro';
import ModalDetail from '../detail';
import Analyse from '../components/liveAnalyse';
import s from './index.less';
import TalentManage from '../components/talentManage';
import Synergy from '@/components/Synergy';
import { commonFormatColumns } from '@/pages/business/live/utils';

const Session = (props) => {
    const {
        match: { isExact },
        children,
    } = props;
    if (!isExact) {
        return (
            <div id="liveAnalyse7">
                {children}
                <Analyse />
                <Synergy />
            </div>
        );
    }
    const config = businessConfig[44];
    const {
        tableId,
        getColumnConfig,
        getDataSource,
        addOrUpdateDataSource,
        getOperateConfig,
        setOperateConfig,
        setHideConfig,
        getDetail,
        delData,
        interfaceName,
        isShowComment,
        commentSort,
        name,
    } = config;
    const modalDetail = useRef(null);
    const talentManageRef = useRef(null);
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
    const [operateConfig, setOptConfig] = useState();
    useEffect(() => {
        fetchOperateConfig();
    }, []);
    const fetchOperateConfig = useCallback(async () => {
        const response = await getOperateConfig({ tableId });
        if (response && response.success && response.data) {
            const { filterList, groupList, sortList } = response.data;
            setOptConfig({
                filterConfig: filterList || [],
                groupConfig: groupList || [],
                sortConfig: sortList || [],
            });
            fetchDataSource({ pageNum: 1 });
        }
    }, [tableId]);

    const onChangeOperateConfig = useCallback(
        async (payload) => {
            const temp = _.cloneDeep(operateConfig);
            if (Array.isArray(payload)) {
                payload.map((item) => {
                    const { type, config } = item;
                    temp[type] = config;
                });
            } else {
                const { type, config } = payload;
                temp[type] = config;
            }
            const newConfig = {
                filterList: temp.filterConfig,
                groupList: temp.groupConfig,
                sortList: temp.sortConfig,
            };
            const response = await setOperateConfig({ tableId, data: newConfig });
            if (response && response.success) {
                setOptConfig(temp);
                fetchDataSource({ pageNum: 1 });
            }
        },
        [tableId, operateConfig],
    );

    const onChangeHideConfig = useCallback(
        async ({ config }) => {
            const data = {
                configType: 1, // 隐藏字段配置标识
                configAttr: JSON.stringify(config),
            };
            const response = await setHideConfig({ tableId, data });
            if (response && response.success) {
                fetchColumns();
            }
        },
        [tableId],
    );

    const [dataSource, setDataSource] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        pageNum: 1,
        pageSize: 30,
        total: 0,
    });

    const fetchDataSource = useCallback(
        async ({ pageNum }) => {
            await setLoading(true);
            const data = {
                pageNum: pageNum || pageConfig.pageNum,
                pageSize: pageConfig.pageSize,
            };
            const res = await getDataSource({ tableId, data });
            if (res && res.success && res.data) {
                const { list, total } = res.data;
                const arr = Array.isArray(list) ? list : [];
                let newList = dataSource.concat(arr);
                if (data.pageNum === 1) {
                    newList = arr;
                }
                const newPageConfig = {
                    ...pageConfig,
                    pageNum: data.pageNum,
                    total,
                };
                setDataSource(newList);
                setPageConfig(newPageConfig);
            }
            await setLoading(false);
        },
        [tableId, pageConfig, dataSource],
    );

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
            // const updateOldIndex = dataSource.findIndex((item) => {
            //     return Number(item.id) === Number(rowId);
            // });
            // if (updateOldIndex > -1) {
            //     // 更新操作，只处理内存数据
            //     const newDataSource = updateLineData(dataSource, { index: updateOldIndex, value });
            //     setDataSource(newDataSource);
            // } else {
            //     // 新增操作，重新获取列表
            //     fetchDataSource({ pageNum: 1 });
            // }
        }
    };
    const renderDetailCell = (data) => {
        const { columnConfig } = data;
        const { columnName = '' } = columnConfig || {};
        if (
            columnName === 'productSelectFirst' ||
            columnName === 'productSelectSecond' ||
            columnName === 'productSelectFinal' ||
            columnName === 'liveSort' ||
            columnName === 'liveCode'
        ) {
            return {
                detailComp: FirstLink,
            };
        }
    };

    const formatColumns = (columns) => {
        columns = commonFormatColumns(columns, config);
        columns.map((item) => {
            item.columnAttrObj = item.columnAttrObj || {};
            // if (item.columnName === 'liveTime') {
            //     item.columnAttrObj.disabledDate = (current) => {
            //         return current && current.isBefore(moment().format('YYYY-MM-DD'));
            //     };
            // }
            if (item.columnName === 'liveCode') {
                item.renderDetailCell = renderDetailCell;
                item.cellRenderProps = {
                    to: '/foreEnd/business/live/bloggerSession/first',
                };
            }
            if (item.columnName === 'productSelectFirst') {
                item.renderDetailCell = renderDetailCell;
                item.cellRenderProps = {
                    to: '/foreEnd/business/live/bloggerSession/first',
                };
            }
            if (item.columnName === 'productSelectSecond') {
                item.renderDetailCell = renderDetailCell;
                item.cellRenderProps = {
                    to: '/foreEnd/business/live/bloggerSession/second',
                };
            }
            if (item.columnName === 'productSelectFinal') {
                item.renderDetailCell = renderDetailCell;
                item.cellRenderProps = {
                    to: '/foreEnd/business/live/bloggerSession/final',
                };
            }
            if (item.columnName === 'liveSort') {
                item.renderDetailCell = renderDetailCell;
                item.cellRenderProps = {
                    to: '/foreEnd/business/live/bloggerSession/sorted',
                };
            }
            return item;
        });
        return columns;
    };

    const onClickAddSession = useCallback(
        (data) => {
            if (modalDetail && modalDetail.current) {
                modalDetail.current.showModal({ tableId, ...data });
            }
        },
        [modalDetail, tableId],
    );

    const onConfirmEdit = ({ action, callback }) => {
        if (action === 'edit') {
            Modal.confirm({
                title: '确认保存本次修改？',
                autoFocusButton: null,
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    callback();
                },
            });
        } else {
            callback();
        }
    };
    const onClickTalentManage = () => {
        talentManageRef?.current?.showInstance();
    };

    const { filterConfig, sortConfig, groupConfig } = operateConfig || {};
    return (
        <>
            <ApolloTable
                tableId={tableId}
                className={s.table}
                rowHeight={40}
                headerHeight={40}
                columns={useMemo(() => {
                    return formatColumns(columns);
                }, [columns])}
                dataSource={dataSource}
                showIndex={true}
                showExpand={onClickAddSession}
                cellEditable={checkPathname('/foreEnd/business/live/bloggerSession/edit')}
                emitChangeCell={emitChangeCell}
                onScroll={debounceScroll}
                loading={loading}
                loadComp={<Loading loadingClassName={s.loading} />}
                operateConfig={{
                    menusGroup: [
                        {
                            type: 'hide',
                            onChange: onChangeHideConfig,
                        },
                        {
                            type: 'filter',
                            value: filterConfig,
                            onChange: onChangeOperateConfig,
                        },
                        { type: 'sort', value: sortConfig, onChange: onChangeOperateConfig },
                    ],
                    buttonsGroup: [
                        {
                            label: '新增场次',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/add'),
                            onClick: onClickAddSession,
                        },
                        {
                            label: '主播管理',
                            type: 'primary',
                            hidden: !checkPathname('/foreEnd/business/live/bloggerSession/talentManage'),
                            onClick: onClickTalentManage,
                        },
                    ],
                }}
            />
            <ModalDetail
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
                emitChangeCell={emitChangeCell}
                formatColumns={formatColumns}
                noEdit={!checkPathname('/foreEnd/business/live/bloggerSession/edit')}
                noDel={!checkPathname('/foreEnd/business/live/bloggerSession/del')}
                presetProcessor={[
                    {
                        type: 'confirm',
                        func: onConfirmEdit,
                    },
                ]}
            />
            <TalentManage ref={talentManageRef} />
        </>
    );
};

export default Session;
