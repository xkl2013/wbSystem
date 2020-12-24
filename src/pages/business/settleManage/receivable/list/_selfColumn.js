import React from 'react';
import { getOptionName, thousandSeparatorFixed, dataMask4Number, toBusinessSaveParams } from '@/utils/utils';
import { CONTRACT_ARCHIVE_STATUS, SIFT_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import styles from './index.less';

const toPage = (path, params) => {
    const id = getOptionName(SIFT_TYPE, path);
    toBusinessSaveParams(id, params);
    window.open(path);
};
const goProgress = (val) => {
    // 点击进入项目费用确认详情
    window.open(`/foreEnd/business/project/contract/verify/detail?id=${val}`, '_blank');
};

function columnsFn(props) {

    const columns = [
        {
            title: '应收编码',
            dataIndex: 'projectingName1',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>2222334455</span>;
            },
        },
        {
            title: '项目名称',
            dataIndex: 'projectingName',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 150,
            render: (text) => {
                return <span style={{ whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '应收金额',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnMoney',
            render: text => 10000
        },
        {
            title: '应收时间',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnDate',
            render: (text) => {
                return '2020/20/2';
            }
        },
        {
            title: '负责人',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnDate13',
            render: (text) => {
                return '张三';
            }
        },
        {
            title: '负责人所属部门',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnDate2',
            render: (text) => {
                return '业务一部';
            }
        },
        {
            title: '应收状态',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnDate3',
            render: (text) => {
                return (
                    <span style={{ color: 'red' }}>延期</span>
                )
            }
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            dataIndex: 'contractReturnDate4',
            fixed: 'right',
            render: (text) => {
                return (
                    <a onClick={() => props.startApproval()}>延期审批</a>
                )
            }
        },
    ];
    return columns || [];
}

const value = '';

export { value, columnsFn };
