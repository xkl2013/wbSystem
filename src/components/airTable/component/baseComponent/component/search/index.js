import React from 'react';
import { message } from 'antd';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Search from '@/components/associationSearch';
import { approvalBusinessData } from '@/services/globalSearchApi';
import s from './index.less';

/**
 *
 * @param {disableOptions} props  不可编辑数据
 */
export default function (props) {
    const {
        value = [], maxCount, onChange, isMultiple, paramsJson = {}, type, tableId, columnConfig = {},
    } = props;
    const { columnAttrObj = {} } = columnConfig;
    const disableOptions = Array.isArray(columnAttrObj.disableOptions) ? columnAttrObj.disableOptions : [];
    const changeValue = (...arg) => {
        const currentValue = arg[0] || [];
        if (maxCount && maxCount <= value.length && currentValue.length > value.length) {
            message.warn(`最多选择${maxCount}`);
            return;
        }
        const hasDisableOptions = disableOptions.filter((item) => {
            return !!currentValue.find((ls) => {
                return ls.value === item.value;
            });
        });
        if (hasDisableOptions.length !== disableOptions.length) {
            message.warn('该数据不可操作');
            return;
        }
        if (typeof onChange === 'function') {
            onChange(...arg);
        }
    };
    if (tableId) {
        paramsJson.tableId = tableId;
    }
    return (
        <div className={s.searchContainer}>
            <Search
                mode={isMultiple ? 'multiple' : false}
                maxCount={2}
                request={(val) => {
                    return approvalBusinessData({
                        name: val,
                        fieldValueName: type,
                        paramsJson: JSON.stringify(paramsJson),
                    });
                }}
                fieldNames={{ value: 'fieldValueValue', label: 'fieldValueName' }}
                {...props}
                onChange={changeValue}
                initDataType="onfocus"
            />
        </div>
    );
}
