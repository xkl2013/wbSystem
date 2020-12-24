/**
 *@author   zhangwenshuai
 *@date     2019-08-07 21:03
 * */
/* eslint-disable */
import React from 'react';
import { getUserList } from '@/services/globalSearchApi';
import styles from '@/pages/business/feeManage/apply/index.less';

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
            title: '负责人',
            dataIndex: 'customerParticipantId',
            key: 'customerParticipantId',
            editable: true,
            required: true,
            type: 'associationSearch',
            componentAttr: {
                request: (record, val) => {
                    return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                },
                initDataType: 'onfocus',
                fieldNames: { value: 'userId', label: 'userChsName' },
                allowClear: true,
            },
            getFormat: (value = {}, form) => {
                form.customerParticipantId = value.value;
                form.customerParticipantName = value.label;
                form.customerParticipantDepartment = value.employeeDepartmentName;
                form.customerParticipantParentDepartment = value.employeeParentDepartmentName;
                return form;
            },
            setFormat: (value = {}, form) => {
                if (!value) return value || undefined;
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.customerParticipantName, value: form.customerParticipantId };
            },
        },
        {
            title: '负责人所属部门',
            dataIndex: 'customerParticipantDepartment',
            editable: false,
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
