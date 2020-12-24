/* eslint-disable import/no-cycle */
import React from 'react';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import {
    getColumnConfig as defaultGetColumnConfig,
    getDetail as defaultGetDetail,
    addOrUpdateDataSource as defaultAddOrUpdateDataSource,
    delData as defaultDelData,
} from '@/services/airTable';
import FormHelper from '@/utils/formHelper';
import storage from '@/utils/storage';
import Modal from './modal';
import { getOriginTableId } from '../index';
import styles from './styles.less';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            tableId: undefined,
            rowId: undefined,
            detailType: props.detailType || 'detailPage', // 页面状态（新增态、编辑态、详情态）
            data: [], // 处理过的数据
            rowData: [], // 原数据
            columnConfig: [], // 跟进内容表头
            historyColumnConfig: [], // 跟进记录表头（从属于跟进内容表头）
            historyList: [], // 跟进记录列表数据
            updateIng: false,
            title: '', // 弹框标题
            initType: '', // 弹框初始化类型（弹框调起时来源，add新增，edit编辑，detail详情）
        };
    }

    showModal = async ({ tableId, rowId, rowData, initType }) => {
        await this.getColumnConfig({ tableId });
        if (initType === 'add') {
            await this.showAddPage({ rowId, rowData });
            //  新增title从传过来的数据中取
            const title = this.getModalTitle(rowData);
            this.setState({
                visible: true,
                tableId,
                title,
                initType,
            });
        } else if (initType === 'edit') {
            // 展示详情时重新获取最新数据
            await this.showEditPage({ tableId, rowId });
            this.setState({
                visible: true,
                tableId,
                initType,
            });
            await this.getHistoryData({ tableId, rowId });
        } else {
            // 展示详情时重新获取最新数据
            await this.showDetailPage({ tableId, rowId });
            this.setState({
                visible: true,
                tableId,
                initType,
            });
            await this.getHistoryData({ tableId, rowId });
        }
    };

    // 新增页面
    showAddPage = async ({ rowId, rowData }) => {
        // 新增进入编辑页
        const initialData = this.getInitialData(rowData);
        const formData = this.formatData(initialData);
        const helperData = await FormHelper.getFormData({
            list: formData,
            initType: 'add',
            getLocalDataMethod: storage.getUserInfo,
        });
        await this.setState({
            rowId,
            rowData: [],
            detailType: 'addPage',
            data: helperData,
        });
    };

    // 编辑页面
    showEditPage = async ({ tableId = this.state.tableId, rowId }) => {
        const data = await this.getInstanceDetail({ tableId, rowId });
        const rowData = Array.isArray(data.rowData) ? data.rowData : [];
        const formData = this.formatData(rowData);
        const helperData = await FormHelper.getFormData({ list: formData, rowLocked: data.isLocked });
        const title = this.getModalTitle(rowData);
        await this.setState({
            rowId,
            rowData,
            detailType: 'editPage',
            data: helperData,
            title,
        });
    };

    // 详情页面
    showDetailPage = async ({ tableId = this.state.tableId, rowId }) => {
        const data = await this.getInstanceDetail({ tableId, rowId });
        const rowData = Array.isArray(data.rowData) ? data.rowData : [];
        const formData = this.formatData(rowData);
        const helperData = await FormHelper.getFormData({ list: formData, rowLocked: data.isLocked });
        const title = this.getModalTitle(rowData);
        await this.setState({
            rowId,
            rowData,
            detailType: 'detailPage',
            data: helperData,
            title,
        });
    };

    getInitialData = (rowData) => {
        const { historyColumnConfig } = this.state;
        const temp = [];
        historyColumnConfig.forEach((item) => {
            if (item.addHistoryEchoFlag) {
                const cellData = rowData.find((itemData) => {
                    return itemData.colName === item.columnName;
                });
                temp.push(cellData);
            }
        });
        return temp;
    };

    getHistoryData = async ({ tableId, rowId }) => {
        const { getHistoryData } = this.props;
        const data = {
            pageNum: 1,
            pageSize: 10000,
        };
        const response = await getHistoryData({ tableId, rowId, data });
        if (response && response.success && response.data) {
            const historyList = Array.isArray(response.data.list) ? response.data.list : [];
            this.setState({ historyList });
        }
    };

    hideForm = () => {
        const { onClose } = this.props;
        this.setState({
            visible: false,
        });
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    getInstanceDetail = async ({ rowId, tableId }) => {
        const { getDetail } = this.props;
        let func = defaultGetDetail;
        if (typeof getDetail === 'function') {
            func = getDetail;
        }
        const response = await func({ tableId, rowId });
        if (response && response.success) {
            return response.data || {};
        }
    };

    // 获取弹框标题
    getModalTitle = (rowData) => {
        const { historyColumnConfig } = this.state;
        const titleCol = historyColumnConfig.find((item) => {
            return item.historyDetailTitleFlag; // 弹框标题字段标志
        });
        if (!titleCol) {
            return '';
        }
        const titleData = rowData.find((item) => {
            return item.colName === titleCol.columnName;
        });
        const title = titleData.cellValueList
            .map((item) => {
                return item.text;
            })
            .join(',');
        return title;
    };

    getColumnConfig = async ({ tableId }) => {
        const { getColumnConfig } = this.props;
        let func = defaultGetColumnConfig;
        if (typeof getColumnConfig === 'function') {
            func = getColumnConfig;
        }
        const response = await func({ tableId: getOriginTableId(tableId) });
        if (response && response.success) {
            const columns = Array.isArray(response.data) ? response.data : [];
            const historyColumnConfig = [];
            const columnConfig = columns.map((item) => {
                const newItem = {
                    ...item,
                    key: item.columnName,
                    dataIndex: item.columnName,
                    title: item.columnChsName,
                    type: item.columnType,
                    entity: item.entityFlag,
                };
                if (item.historyShowFlag || item.historyDetailTitleFlag || item.historyTitleFlag) {
                    historyColumnConfig.push(newItem);
                }
                return newItem;
            });
            this.setState({ columnConfig, historyColumnConfig });
        }
    };

    addOrUpdateDataSource = async (value) => {
        const { tableId, rowId, detailType, initType } = this.state;
        const { addOrUpdateDataSource, getData, appendData } = this.props;
        await this.setState({ updateIng: true });
        let func = defaultAddOrUpdateDataSource;
        if (typeof addOrUpdateDataSource === 'function') {
            func = addOrUpdateDataSource;
        }
        if (detailType === 'addPage') {
            func = appendData;
        }
        const response = await func({ tableId, data: { id: rowId, value } });
        if (response && response.success) {
            // 更新列表数据
            if (typeof getData === 'function') {
                getData({ isClean: true });
            }
            if (detailType === 'addPage') {
                message.success('新增成功');
                if (initType === 'add') {
                    this.hideForm();
                    return;
                }
            } else {
                message.success('更新成功');
            }
            // 更新单条数据详情
            this.showDetailPage({ tableId, rowId: response.data });
            // 更新跟进记录列表数据
            this.getHistoryData({ tableId, rowId });
        }
        await this.setState({ updateIng: false });
    };

    updateData = ({ data }) => {
        const result = [];
        data.value.map((item) => {
            if (item.cellValueList) {
                result.push(item);
            }
        });
        this.addOrUpdateDataSource(result);
    };

    delData = () => {
        const { tableId, rowId } = this.state;
        const { delData, getData } = this.props;
        let func = defaultDelData;
        if (typeof delData === 'function') {
            func = delData;
        }
        BIModal.confirm({
            title: '确认要删除该条数据吗？',
            autoFocusButton: null,
            onOk: async () => {
                const response = await func({ tableId, data: { id: rowId } });
                if (response && response.success) {
                    message.success('删除成功');
                    if (typeof getData === 'function') {
                        getData({ isClean: true });
                    }
                    this.setState({ visible: false, detailType: 'detailPage' });
                }
            },
        });
    };

    // 单行编辑表单所需数据格式化
    formatData = (rowData) => {
        const { historyColumnConfig } = this.state;
        const temp = [];
        historyColumnConfig.forEach((item) => {
            const value = rowData.find((itemData) => {
                return itemData.colName === item.key;
            });
            temp.push({
                ...item,
                value: (value && value.cellValueList) || [{ text: '', value: '' }],
                type: item.columnType,
                dynamicCellConfigDTO: value && value.dynamicCellConfigDTO,
            });
        });
        return temp;
    };

    changeParams = async (changedKey, changedValue, originValue) => {
        const { data } = this.state;
        const helperData = await FormHelper.getFormData({
            list: data,
            changedKey,
            changedValue,
            originValue,
        });
        this.setState({
            data: helperData,
        });
    };

    render() {
        const {
            tableId,
            rowId,
            visible,
            updateIng,
            detailType,
            rowData,
            data,
            historyList,
            columnConfig,
            historyColumnConfig,
            title,
            initType,
        } = this.state;
        const { maskClosable, name, columnConfigCallback } = this.props;
        const isHideHistory = detailType === 'addPage' && initType === 'add';
        return (
            visible && (
                <Modal
                    visible={visible}
                    loading={updateIng}
                    className={styles.historyModal}
                    width={isHideHistory ? 580 : 920}
                    isShowHistory={!isHideHistory} // 是否展示历史
                    name={title || name}
                    maskClosable={maskClosable || false}
                    title={null}
                    footer={null}
                    onCancel={this.hideForm}
                    handleCancel={isHideHistory ? this.hideForm : this.showDetailPage}
                    handleSubmit={this.updateData}
                    handleDelete={this.delData}
                    modalDetailType={3}
                    detailType={detailType}
                    data={data}
                    rowData={rowData}
                    tableId={tableId}
                    rowId={rowId}
                    changeParams={this.changeParams}
                    columnConfig={columnConfig}
                    historyColumnConfig={historyColumnConfig}
                    historyList={historyList}
                    showAddPage={this.showAddPage}
                    showEditPage={this.showEditPage}
                    isShowDelBtn={detailType === 'editPage'}
                    columnConfigCallback={columnConfigCallback}
                />
            )
        );
    }
}
