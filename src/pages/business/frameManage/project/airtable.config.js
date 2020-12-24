import React, { forwardRef } from 'react';
import { Input, Button } from 'antd';
// eslint-disable-next-line import/no-cycle
import businessConfig from '@/config/business';
// eslint-disable-next-line import/no-cycle
import { setOperateConfig } from '@/services/airTable';
import services from './services';

// 不可编辑
const CustomLink = forwardRef((props, ref) => {
    const valueArr = Array.isArray(props.value) ? props.value : [];
    const value = (valueArr[0] || {}).value;
    return <Input ref={ref} value={value} disabled />;
});
/**
 * setRebateFilter用于设置明细table,filter只过滤对应的项目
 */
const CustomLinkDetail = forwardRef((props, ref) => {
    const valueObj = Array.isArray(props.value) ? props.value[0] : {};
    if (!valueObj) return null;
    const { rowData = [] } = props;
    const setRebateFilter = async () => {
        const attr = businessConfig[33] || {};
        const projectObj = rowData.find((ls) => {
            return ls.colName === 'projectName';
        }) || {};
        const projectValueObj = Array.isArray(projectObj.cellValueList) ? projectObj.cellValueList[0] || {} : {};
        await setOperateConfig({
            tableId: attr.tableId,
            data: {
                filterList: [
                    {
                        colName: 'projectName',
                        colChsName: '项目名称',
                        operationCode: 'CONTAIN',
                        colValues: [{ value: projectValueObj.text, text: projectValueObj.text }],
                    },
                ],
            },
        });
        await window.g_history.push('/foreEnd/business/frameManage/rebate');
    };
    return (
        <div ref={ref} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Button type="link" onClick={setRebateFilter}>
                {valueObj.text}
            </Button>
        </div>
    );
});
// 兼容消息模块
const defaultConfig = {
    ...services,
    cellRender: ({ columnConfig, rowData }) => {
        const { columnName } = columnConfig || {};
        if (columnName === 'pointFlowCount') {
            CustomLink.Detail = (props) => {
                return <CustomLinkDetail rowData={rowData} {...props} />;
            };
            return { component: CustomLink };
        }
    },
    noDel: true,
    noEdit: true,
    noAdd: true,
};
export default defaultConfig;
