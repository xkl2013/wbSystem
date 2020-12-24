import React from 'react';
import moment from 'moment';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';
import { renderTxt } from '@/utils/hoverPopover';
import { FEE_TYPE } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';

export const baseColumn = [
    {
        title: '项目编号',
        key: 'projectCode',
        align: 'center',
        render: (text) => {
            return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
        },
    },
    {
        title: '项目名称',
        key: 'projectName',
        align: 'center',
    },
    {
        title: '合同编号',
        key: 'projectContractCode',
        align: 'center',
        render: (text) => {
            return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
        },
    },
    {
        title: '合同名称',
        key: 'projectContractName',
        align: 'center',
    },
    {
        title: '艺人/博主',
        key: 'talentName',
        align: 'center',
    },
];

export const expenseDetail = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (...argu) => {
            return argu[1].name ? argu[1].name : argu[2] + 1;
        },
    },
    {
        title: '艺人/博主',
        dataIndex: 'talentName',
        align: 'center',
    },
    {
        title: '费用类型',
        dataIndex: 'reimburseFeeTypeName',
        align: 'center',
    },
    {
        title: '费用实际承担方',
        dataIndex: 'reimburseFeeTrulyTakerId',
        align: 'center',
        render: (text) => {
            return getOptionName(FEE_TYPE, text);
        },
    },
    {
        title: '金额',
        dataIndex: 'reimburseApply',
        align: 'center',
        render: (text) => {
            return `${thousandSeparatorFixed(text)}`;
        },
    },
    {
        title: '费用发生日期',
        dataIndex: 'feeProduceTime',
        align: 'center',
        render: (d) => {
            return d && moment(d).format(DATE_FORMAT);
        },
    },
];

export const confirmResult = [
    {
        title: '确认人',
        dataIndex: 'endUserAvatar',
        align: 'center',
        render: (d, record) => {
            return record.endUserName || '';
        },
    },
    {
        title: '操作结果',
        dataIndex: 'endStatus',
        align: 'center',
        render: (text) => {
            return text === 0 ? '未完结' : '已完结';
        },
    },
    {
        title: '操作时间',
        dataIndex: 'endTime',
        align: 'center',
        render: (d) => {
            return d && moment(d).format(DATETIME_FORMAT);
        },
    },
];
