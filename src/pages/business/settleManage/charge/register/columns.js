import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';

const columns = [
    {
        dataIndex: 'index',
        title: '序号',
        render: (text, record, index) => {
            return index + 1;
        },
        fixed: 'left',
        width: 60,
        align: 'center',
    },
    {
        dataIndex: 'receiptDate',
        title: '收款日期',
        width: '10%',
        render: (text, record) => {
            return record.parseResult ? moment(text).format(DATE_FORMAT) : text;
        },
    },
    {
        dataIndex: 'receiptAmount',
        title: '收款金额',
        width: '10%',
    },
    {
        dataIndex: 'customerText',
        title: '客户名称',
        width: '20%',
    },
    {
        dataIndex: 'companyText',
        title: '公司名称',
        width: '20%',
    },
    {
        dataIndex: 'receiptAccountNo',
        title: '收款账号',
        width: '10%',
    },
    {
        dataIndex: 'digest',
        title: '摘要',
    },
    {
        dataIndex: 'parseResultDesc',
        title: '解析结果',
        fixed: 'right',
        width: 150,
        align: 'center',
        render: (text, record) => {
            return <span style={{ color: record.parseResult ? '#2C3F53' : '#FF5363' }}>{text}</span>;
        },
    },
];
export default columns;
