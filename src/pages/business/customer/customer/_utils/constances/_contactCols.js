/**
 *@author   zhangwenshuai
 *@date     2019-08-07 21:20
 * */
/* eslint-disable */
import React from 'react';
import { SEX_TYPE, IS_OR_NOT } from '@/utils/enum';
import styles from '@/pages/business/feeManage/apply/index.less';
import { getOptionName } from '@/utils/utils';

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
            title: '姓名',
            dataIndex: 'contactName',
            key: 'contactName',
            editable: true,
            required: true,
            type: 'input',
            componentAttr: {
                maxLength: 10,
            },
            // width: 200,
        },
        {
            title: '关键决策人',
            dataIndex: 'decisioner',
            key: 'decisioner',
            editable: true,
            required: true,
            type: 'radio',
            width: 150,
            options: IS_OR_NOT,
            setFormat: (value) => {
                return value != undefined ? String(value) : value;
            },
            render: (text) => {
                return getOptionName(IS_OR_NOT, text);
            },
        },
        {
            title: '所属职位',
            dataIndex: 'position',
            key: 'position',
            editable: true,
            type: 'input',
            componentAttr: {
                maxLength: 10,
            },
            // width: 200,
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            editable: true,
            type: 'radio',
            width: 150,
            options: SEX_TYPE,
            setFormat: (value) => {
                return value != undefined ? String(value) : value;
            },
            render: (text) => {
                return getOptionName(SEX_TYPE, text);
            },
        },
        {
            title: '手机号码',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
            editable: true,
            // width: 200,
            componentAttr: {
                placeholder: '输入联系方式',
            },
            type: 'input',
        },
        {
            title: '微信号码',
            dataIndex: 'weixinNumber',
            key: 'weixinNumber',
            editable: true,
            // width: 200,
            type: 'input',
            componentAttr: {
                maxLength: 30,
            },
        },
        {
            title: '其他联系方式',
            dataIndex: 'otherNumber',
            key: 'otherNumber',
            editable: true,
            // width: 200,
            type: 'input',
            componentAttr: {
                maxLength: 30,
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
