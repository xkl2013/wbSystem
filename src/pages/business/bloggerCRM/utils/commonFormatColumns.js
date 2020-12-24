/* eslint-disable */
import React from 'react';
import { WithHistory } from '../components';
import { getDepartmentList, getToken } from '@/services/api';
import { approvalBusinessData, getSearchList } from '@/services/globalSearchApi';
import { dictionaryTree } from '@/services/dictionary';
import { config as baseCompConfig } from '@/submodule/components/apolloTable';
import IconFont from '@/components/CustomIcon/IconFont';
import s from '@/pages/business/live/session/index.less';
import { mobileReg } from '@/utils/reg';

const getCellClass = ({ columnConfig, columnData, record }) => {
    if (record.isLocked) {
        return s.readonly;
    }
    if (columnConfig.readOnlyFlag) {
        return s.readonly;
    }
    if (columnData && columnData.dynamicCellConfigDTO && columnData.dynamicCellConfigDTO.readonlyFlag) {
        return s.readonly;
    }
};
export const commonFormatColumns = (columns, config) => {
    columns.map((item) => {
        item.columnAttrObj = item.columnAttrObj || {};
        if (Number(item.columnType) === 3) {
            item.columnAttrObj.getDetail = async ({ rowId }) => {
                const { tableId, getDetail } = config;
                const res = await getDetail({
                    tableId,
                    rowId,
                });
                if (res && res.success && res.data) {
                    const allData = res.data.rowData.find((temp) => {
                        return temp.colName === item.columnName;
                    });
                    return allData && allData.cellValueList;
                }
            };
        }
        if (Number(item.columnType) === 4 || Number(item.columnType) === 26) {
            item.columnAttrObj.data = getToken;
        }
        if (Number(item.columnType) === 13 || Number(item.columnType) === 15) {
            const { apiService, url, type } = item.columnAttrObj;
            const { tableId } = config;
            if (url) {
                item.columnAttrObj.request = (val) => {
                    const data = {
                        searchText: val,
                        businessType: type,
                    };
                    return getSearchList({
                        prefix: apiService,
                        url,
                        data,
                    });
                };
            } else {
                item.columnAttrObj.request = (val) => {
                    const data = {
                        name: val,
                        fieldValueName: type,
                    };
                    data.paramsJson = JSON.stringify({ tableId });
                    return approvalBusinessData(data);
                };
            }
        }
        if (Number(item.columnType) === 14) {
            item.columnAttrObj.request = async (data) => {
                const res = await getDepartmentList(data);
                if (res && res.success && res.data) {
                    return [res.data];
                }
            };
        }
        if (Number(item.columnType) === 17) {
            item.columnAttrObj.request = async (id) => {
                const res = await dictionaryTree(id, {});
                if (res && res.success && res.data) {
                    return res.data;
                }
            };
        }
        const iconConfig = baseCompConfig[item.columnType] || baseCompConfig['1'];
        item.icon = () => {
            return <IconFont type={iconConfig.icon} />;
        };
        item.cellClassName = getCellClass;
        return item;
    });
    return columns;
};
export const filterFormatColumns = (columns, config) => {
    columns = commonFormatColumns(columns, config);
    let history = 0;
    columns.map((item) => {
        delete item.renderDetailCell;
        if (!history && item.showStatus && item.hideScope.indexOf('LIST') === -1) {
            item.renderDetailCell = () => {
                return { detailComp: WithHistory };
            };
            history = 1;
        }
        if (item.columnName === 'phone') {
            item.columnAttrObj.rules = [
                {
                    pattern: mobileReg,
                    message: '请输入正确的手机号',
                },
            ];
        }
        return item;
    });
    return columns;
};
