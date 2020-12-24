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
import styles from './styles.less';
// eslint-disable-next-line import/no-cycle
import Modal from './modal';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            rowId: undefined,
            historyGroupId: undefined,
            data: [],
            rowData: [],
            columnConfig: [],
            tableId: undefined,
            updateIng: false,
            detailType: props.detailType || 'detailPage',
            detailData: {}, // 该条数据的详情信息
            filterCols: null, // 过滤表头
        };
    }

    showModal = async ({ tableId, rowId, rowData, filterCols }) => {
        // 此方法需传递instanceId ,用于非此实例模块调用
        await this.getColumnConfig({ tableId, filterCols });
        if (!rowId) {
            // 新增进入编辑页
            const formData = this.formatData(rowData || []);
            const helperData = await FormHelper.getFormData({
                list: formData,
                initType: 'add',
                getLocalDataMethod: storage.getUserInfo,
            });
            await this.setState({
                visible: true,
                data: helperData,
                tableId,
                rowId: undefined,
                rowData: rowData || [],
                detailType: 'addPage',
            });
        } else {
            // 展示详情时重新获取最新数据
            const res = await this.getInstanceDetailFunc({ tableId, rowId });
            if (res && res.success) {
                await this.setState({
                    visible: true,
                    tableId,
                    rowId,
                    rowData: [],
                    data: {},
                    detailType: 'detailPage',
                });
                await this.getInstanceDetail({ tableId, rowId });
            }
        }
    };

    showInstanceModal = ({ rowId, rowData, columnConfig, tableId }) => {
        // 此方法不需传递instanceId ,用于实例模块调用
        this.setState({ rowId, rowData, columnConfig, tableId }, () => {
            this.setState({ visible: true, detailType: rowId ? 'detailPage' : 'editPage' });
        });
    };

    hideForm = () => {
        const { onClose } = this.props;
        this.setState({
            visible: false,
            detailType: 'detailPage',
            filterCols: null,
        });
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    goEdit = (detailType) => {
        const { tableId, rowId } = this.state;
        this.setState({ detailType });
        this.getInstanceDetail({ tableId, rowId });
    };

    getInstanceDetailFunc = async ({ rowId, tableId }) => {
        const { getDetail } = this.props;
        let func = defaultGetDetail;
        if (typeof getDetail === 'function') {
            func = getDetail;
        }
        const response = await func({ tableId, rowId });
        return response;
    };

    getInstanceDetail = async ({ rowId, tableId }) => {
        const response = await this.getInstanceDetailFunc({ tableId, rowId });
        if (response && response.success) {
            const data = response.data || {};
            const rowData = Array.isArray(data.rowData) ? data.rowData : [];
            const formData = this.formatData(rowData);
            const helperData = await FormHelper.getFormData({
                list: formData,
                rowLocked: data.isLocked,
                rowData: data,
            });
            this.setState({
                rowData,
                data: helperData,
                tableId,
                rowId,
                groupId: data.groupId,
                detailData: data,
                historyGroupId: data.historyGroupId,
            });
        }
    };

    getColumnConfig = async ({ tableId, filterCols }) => {
        const { getColumnConfig, formatColumns } = this.props;
        let func = defaultGetColumnConfig;
        if (typeof getColumnConfig === 'function') {
            func = getColumnConfig;
        }
        const response = await func({ tableId });
        if (response && response.success) {
            const columns = Array.isArray(response.data) ? response.data : [];
            let columnConfig = columns.map((item) => {
                return {
                    ...item,
                    key: item.columnName,
                    dataIndex: item.columnName,
                    title: item.columnChsName,
                    type: item.columnType,
                    entity: item.entityFlag,
                };
            });
            if (typeof formatColumns === 'function') {
                columnConfig = formatColumns(columnConfig);
            }
            if (filterCols && filterCols.length > 0) {
                columnConfig = columnConfig.filter((item) => {
                    return filterCols.includes(item.columnName);
                });
                this.setState({ filterCols });
            }
            this.setState({ columnConfig });
        }
    };

    addOrUpdateDataSource = async ({ result: value, ...others }) => {
        const { tableId, rowId } = this.state;
        console.log('tableId: ', tableId);
        const { addOrUpdateDataSource, getData } = this.props;
        await this.setState({ updateIng: true });
        let func = defaultAddOrUpdateDataSource;
        if (typeof addOrUpdateDataSource === 'function') {
            func = addOrUpdateDataSource;
        }
        const response = await func({ tableId, data: { tableId, id: rowId, value }, ...others });
        if (response && response.success) {
            if (!rowId) {
                message.success('新增成功');
                this.hideForm();
            } else {
                message.success('更新成功');
                // 更新单条数据详情
                this.getInstanceDetail({ tableId, rowId });
                this.setState({ detailType: 'detailPage' });
            }
            // 更新列表数据
            if (typeof getData === 'function') {
                getData({ pageNum: 1, editRowId: response.data });
            }
        }
        await this.setState({ updateIng: false });
    };

    updateData = ({ data, ...others }) => {
        const { presetProcessor } = this.props;
        const { detailType } = this.state;
        const result = [];
        data.value.map((item) => {
            if (item.cellValueList) {
                if (item.cellValueList.length === 0) {
                    item.cellValueList.push({ text: '', value: '' });
                }
                result.push(item);
            }
        });
        if (presetProcessor) {
            const processor = presetProcessor[0];
            if (processor.type === 'confirm') {
                processor.func({
                    action: detailType === 'addPage' ? 'add' : 'edit',
                    callback: () => {
                        this.addOrUpdateDataSource({ result, ...others });
                    },
                });
            } else {
                processor.func();
                this.addOrUpdateDataSource({ result, ...others });
            }
        } else {
            this.addOrUpdateDataSource({ result, ...others });
        }
    };

    // 单字段即时更新
    onEmitChange = async (val) => {
        const { emitChangeCell } = this.props;
        const { tableId, rowId } = this.state;
        const res = await emitChangeCell({ rowId, value: val });
        if (res && res.success) {
            // 表单编辑后导致该数据被删除时，直接关闭弹窗
            if (res.operateType === 'del') {
                this.hideForm();
                return;
            }
        }
        this.getInstanceDetail({ tableId, rowId });
    };

    hideEditBtn = () => {
        const { noEdit } = this.props;
        const { detailData } = this.state;
        const customCheckLocked = (record = {}) => {
            // 临时用于是否可编辑cell的处理,在KOL刊例审核中时不能编辑
            return record.isLocked || record.approvalStatus === 1 || record.approvalStatus === 5;
        };
        return noEdit || customCheckLocked(detailData);
    };

    delData = () => {
        const { tableId, rowId } = this.state;
        const { delData, getData, delLabel } = this.props;
        let func = defaultDelData;
        if (typeof delData === 'function') {
            func = delData;
        }
        BIModal.confirm({
            title: `确认要${delLabel || '删除'}该条数据吗？`,
            autoFocusButton: null,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const response = await func({ tableId, data: { tableId, ids: [rowId] } });
                if (response && response.success) {
                    message.success(`${delLabel || '删除'}成功`);
                    if (typeof getData === 'function') {
                        getData({ pageNum: 1 });
                    }
                    this.setState({ visible: false, detailType: 'detailPage' });
                }
            },
        });
    };

    // 单行编辑表单所需数据格式化
    formatData = (rowData) => {
        const { columnConfig } = this.state;
        const temp = [];
        columnConfig.forEach((item) => {
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
            rowId,
            visible,
            updateIng,
            detailType,
            rowData,
            data,
            groupId,
            historyGroupId,
            filterCols,
        } = this.state;
        const {
            name,
            isShowComment,
            hasGroup,
            maskClosable,
            interfaceName,
            commentSort,
            noDel,
            tableId,
            columnConfigCallback,
            cellRender,
            delLabel,
        } = this.props;
        // 是否展示删除按钮
        let isShowDelBtn = !noDel && !!rowId && !filterCols;
        if (hasGroup && groupId === rowId) {
            isShowDelBtn = false;
        }
        return (
            visible && (
                <Modal
                    visible={visible}
                    loading={updateIng}
                    className={styles.editFormModal}
                    style={{ maxWidth: isShowComment && !!rowId && !filterCols ? '1536px' : '1152px' }}
                    width={isShowComment && !!rowId && !filterCols ? '80%' : '60%'}
                    isShowComment={isShowComment && !!rowId && !filterCols} // 是否展示评论
                    interfaceName={interfaceName} // 评论类型
                    commentSort={commentSort} // 评论排序
                    hasGroup={hasGroup} // 是否分组拆分
                    name={name}
                    maskClosable={maskClosable || false}
                    title={null}
                    footer={null}
                    onCancel={this.hideForm}
                    handleCancel={this.hideForm}
                    handleSubmit={this.updateData}
                    handleDelete={this.delData}
                    modalDetailType={3}
                    detailType={detailType}
                    goEdit={this.goEdit}
                    isShowDelBtn={isShowDelBtn}
                    data={data}
                    rowData={rowData}
                    tableId={tableId}
                    rowId={rowId}
                    historyGroupId={historyGroupId}
                    changeParams={this.changeParams}
                    hideEditBtn={this.hideEditBtn()}
                    columnConfigCallback={columnConfigCallback}
                    cellRender={cellRender}
                    delLabel={delLabel}
                    getInstanceDetail={this.getInstanceDetail}
                    onEmitChange={detailType !== 'addPage' ? this.onEmitChange : null}
                    hideOperateBtn={detailType !== 'addPage'}
                />
            )
        );
    }
}
