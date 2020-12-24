/**
 *@author   zhangwenshuai
 *@date     2019-08-07 21:03
 * */
/* eslint-disable */
import React from 'react';
import { trimSting } from '@/utils/utils';
import { getUserList as getInnerUserList, getCustomerBusiness } from '@/services/globalSearchApi';
import styles from '@/pages/business/feeManage/apply/index.less';
import { getIndustryList } from '@/pages/business/customer/customer/services';

async function changeCustomerIndustryId(table, args) {
    const [id, key, val, force, ops] = args;
    const { customerIndustryId, customerIndustryName } = ops || {};
    table.changeState(
        id,
        key,
        {
            ...val,
            customerIndustryName,
            customerIndustryId,
        },
        true,
    );
}

export const EditTableCoumn = (editable, table) => {
    const cols = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            editable: false,
            render: (text) => {
                return text + 1;
            },
        },
        {
            title: '品牌名称或服务品牌名称',
            dataIndex: 'businessName',
            key: 'businessName',
            editable: true,
            required: true,
            type: 'associationSearchFilter',
            componentAttr: {
                request: (record, val) => {
                    return getCustomerBusiness({ businessName: val || '', pageSize: 50, pageNum: 1 });
                },
                initDataType: 'onfocus',
                fieldNames: { value: 'id', label: 'businessName' },
                onChange: (...arg) => {
                    return changeCustomerIndustryId(table, arg);
                },
            },
            getFormat: (value = {}, form) => {
                if (value.value) {
                    form.id = Number(value.value);
                }
                form.businessName = value.label ? trimSting(value.label) : value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value || undefined;
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.businessName || value, value: form.id || undefined };
            },
        },
        {
            title: '所属行业',
            dataIndex: 'customerIndustryName',
            key: 'customerIndustryName',
            editable: true,
            required: true,
            width: 160,
            type: 'associationSearch',
            componentAttr: {
                request: async (record, val) => {
                    const response = await getIndustryList();
                    if (response && response.success && response.data) {
                        return {
                            success: true,
                            data: {
                                list: response.data,
                            },
                        };
                    }
                },
                fieldNames: { value: 'id', label: 'desc' },
                disabled: (record) => {
                    return !!record.id;
                },
            },
            getFormat: (value = {}, form) => {
                form.customerIndustryId = value.value ? Number(value.value) : value.value;
                form.customerIndustryName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value || undefined;
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.customerIndustryName, value: form.customerIndustryId };
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return table.delTableLine(record);
                            }}
                        >
                            {' '}
                            删除
                        </span>
                    </div>
                );
            },
        },
    ];
    if (!editable) {
        cols.pop();
    }
    return cols || [];
};
