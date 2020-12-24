/**
 *@author   zhangwenshuai
 *@date     2019-08-07 21:03
 * */
/* eslint-disable */
import React from 'react';
import { COMPANY_MODE, COMPANY_PROERTY, MAIN_BUSINESS, THREAD_LEVEL } from '@/utils/enum';
import { getUserList as getInnerUserList, getCustomerBusiness, getCustomerList } from '@/services/globalSearchApi';
import styles from '@/pages/business/feeManage/apply/index.less';
import { getCustomerDetail, getIndustryList } from '@/pages/business/customer/customer/services';
import { getOptionName } from '@/utils/utils';

async function changeCustomerName(table, args) {
    const [id, key, val, force, ops] = args;
    const {
        customerPropId,
        customerPropName,
        customerIndustryId,
        customerIndustryName,
        customerScaleId,
        customerScaleName,
        customerCityId,
        customerCityName,
        customerProvinceId,
        customerProvinceName,
        customerRemark,
    } = ops || {};
    table.changeState(
        id,
        key,
        {
            ...val,
            customerPropId: customerPropId ? String(customerPropId) : customerPropId,
            customerPropName,
            customerIndustryId,
            customerIndustryName,
            customerScaleId: customerScaleId && customerScaleId !== 0 ? String(customerScaleId) : customerScaleId,
            customerScaleName,
            customerCityId,
            customerCityName,
            customerProvinceId,
            customerProvinceName,
            customerRemark,
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
            title: '公司名称',
            dataIndex: 'customerName',
            key: 'customerName',
            editable: true,
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请输入公司名称',
                    },
                ],
            },
            type: 'associationSearch',
            componentAttr: {
                request: (record, val) => {
                    return getCustomerList({
                        customerTypeIdList: [0, 2],
                        customerName: val || '',
                    });
                },
                initDataType: 'onfocus',
                fieldNames: { value: 'id', label: 'customerName' },
                onChange: (...arg) => {
                    return changeCustomerName(table, arg);
                },
            },
            getFormat: (value = {}, form) => {
                if (value.value) {
                    form.id = Number(value.value);
                }
                form.customerName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value || undefined;
                return { label: form.customerName || value, value: form.id || undefined };
            },
        },
        {
            title: '公司性质',
            dataIndex: 'customerPropId',
            key: 'customerPropId',
            editable: true,
            placeholder: '请选择',
            type: 'select',
            options: COMPANY_PROERTY,
            componentAttr: {
                disabled: true,
            },
            getFormat: (value, form) => {
                form.customerPropId = Number(value);
                form.customerPropName = getOptionName(COMPANY_PROERTY, value);
                return form;
            },
            setFormat: (value) => {
                return value ? String(value) : value;
            },
        },
        {
            title: '公司规模',
            dataIndex: 'customerScaleId',
            key: 'customerScaleId',
            editable: true,
            placeholder: '请选择',
            type: 'select',
            options: COMPANY_MODE,
            componentAttr: {
                disabled: true,
            },
            getFormat: (value, form) => {
                form.customerScaleId = Number(value);
                form.customerScaleName = getOptionName(COMPANY_MODE, value);
                return form;
            },
            setFormat: (value) => {
                return value ? String(value) : value;
            },
        },
        {
            title: '主营行业',
            dataIndex: 'customerIndustryId',
            key: 'customerIndustryId',
            editable: true,
            placeholder: '请选择',
            type: 'associationSearch',
            componentAttr: {
                request: async (val) => {
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
                disabled: true,
                fieldNames: { value: 'id', label: 'desc' },
            },
            getFormat: (value, form) => {
                form.customerIndustryId = Number(value.value);
                form.customerIndustryName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value || undefined;
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return {
                    label: form.customerIndustryName,
                    value: form.customerIndustryId,
                };
            },
        },
        // {
        //     title: '品牌名称',
        //     dataIndex: 'businessName',
        //     key: 'businessName',
        //     editable: true,
        //     type: 'associationSearchFilter',
        //     componentAttr: {
        //         request: (record, val) => {
        //             let data = {businessName: val || '', "pageSize": 50, "pageNum": 1};
        //             if (record.id) {
        //                 data.customerId = record.id;
        //             }
        //             return getCustomerBusiness(data)
        //         },
        //         fieldNames: {value: 'id', label: 'businessName'}
        //     },
        //     getFormat: (value = {}, form) => {
        //         if (value.value) {
        //             form.id = Number(value.value);
        //         }
        //         form.businessName = value.label;
        //         return form;
        //     },
        //     setFormat: (value, form) => {
        //         if (value.label || value.value || value.value === 0) {
        //             return value;
        //         }
        //         return {label: form.businessName || value, value: form.id || undefined};
        //     }
        // },
        {
            title: '公司地区',
            dataIndex: 'customerProvinceId',
            key: 'customerProvinceId',
            editable: true,
            type: 'selectCity',
            componentAttr: { placeholder: '请选择', disabled: true },
            getFormat: (value, form) => {
                const l = value.label.split('/');
                const v = value.value.split('/');
                form.customerProvinceId = v[0];
                form.customerProvinceName = l[0];
                form.customerCityId = v[1];
                form.customerCityName = l[1];
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value || undefined;
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return {
                    label: form.customerCityName
                        ? `${form.customerProvinceName}/${form.customerCityName}`
                        : form.customerProvinceName,
                    value: form.customerCityId
                        ? `${form.customerProvinceId}/${form.customerCityId}`
                        : form.customerProvinceId,
                };
            },
        },
        // {
        //     title: '备注',
        //     dataIndex: 'customerRemark',
        //     key: 'customerRemark',
        //     editable: true,
        //     type: 'textarea',
        //     componentAttr: {maxLength: 140, placeholder: '请输入'}
        // },
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
