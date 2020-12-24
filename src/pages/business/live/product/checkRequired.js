import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import s from './checkRequired.less';

// 检测单元格是否为空
const checkNull = (cellValueList) => {
    // 没有值、空数组、数组有一个原生且元素中text、value都是空，三种情况都视为空数据
    return (
        !cellValueList
        || cellValueList.length === 0
        || (cellValueList.length === 1 && !cellValueList[0].text && !cellValueList[0].value)
    );
};
// 获取所选条目中有未完整填写的条目
export const getLostRows = ({ selectedRows, dataSource, columnsMap }) => {
    const result = [];
    selectedRows.map((item) => {
        const lostCols = [];
        const lost = {};
        const data = dataSource.find((temp) => {
            return Number(temp.id) === Number(item.id);
        });
        if (data) {
            data.rowData.map((temp) => {
                const config = columnsMap[temp.colName];
                // 必填字段为空
                if (config.requiredFlag && checkNull(temp.cellValueList)) {
                    lostCols.push(temp.colName);
                }
            });
            if (lostCols.length > 0) {
                lost.lostCols = lostCols;
                lost.rowId = item.id;
                result.push(lost);
            }
        }
    });
    return result;
};
const getCellText = (rowData, columnName) => {
    const data = rowData.find((item) => {
        return item.colName === columnName;
    });
    if (!data || !Array.isArray(data.cellValueList)) {
        return '';
    }
    const textArr = data.cellValueList.map((item) => {
        return item.text;
    });
    return textArr.join(',');
};
const getRowData = (rowId, dataSource) => {
    return dataSource.find((item) => {
        return Number(item.id) === Number(rowId);
    });
};
const CheckRequired = (props, ref) => {
    const { selectedRows, lostRows, dataSource, toEdit } = props;
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };
    const hideModal = () => {
        setVisible(false);
    };
    useImperativeHandle(ref, () => {
        return {
            showModal,
        };
    });
    // const lostRows = getLostRows({ selectedRows, dataSource, columnsMap });
    return (
        <Modal
            wrapClassName={s.modalWrap}
            visible={visible}
            title="请补充下列必填字段"
            onCancel={hideModal}
            footer={null}
            maskClosable={false}
        >
            {selectedRows.map((item) => {
                const rowData = getRowData(item.id, dataSource);
                if (rowData) {
                    const businessBrandText = getCellText(rowData.rowData, 'businessBrand');
                    const productNameText = getCellText(rowData.rowData, 'productName');
                    const unfinished = lostRows.find((temp) => {
                        return Number(temp.rowId) === Number(item.id);
                    });
                    return (
                        <div className={s.row}>
                            <div className={s.text}>{`${businessBrandText}-${productNameText}:`}</div>
                            {unfinished ? (
                                <div
                                    className={s.edit}
                                    onClick={() => {
                                        toEdit({
                                            rowId: unfinished.rowId,
                                            filterCols: unfinished.requiredColumnNameList,
                                        });
                                    }}
                                >
                                    去补充
                                </div>
                            ) : (
                                <div className={s.finish}>
                                    <IconFont type="iconquerenduigougouhao" />
                                </div>
                            )}
                        </div>
                    );
                }
            })}
        </Modal>
    );
};
export default forwardRef(CheckRequired);
