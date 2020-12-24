import React from 'react';
import moment from 'moment';
import { getOptionName } from '@/utils/utils';
import { CONTRACT_PRI_TYPE, CONTRACT_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import { DATE_FORMAT } from '@/utils/constants';
import AuthButton from '@/components/AuthButton';
import styles from '../index.less';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractCode',
        },
        {
            title: '主子合同',
            dataIndex: 'contractCategory',
            render: (detail) => {
                return getOptionName(CONTRACT_PRI_TYPE, detail);
            },
        },
        {
            title: '合同类型',
            dataIndex: 'contractType',
            render: (detail) => {
                return getOptionName(CONTRACT_TYPE, detail);
            },
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '合同总金额',
            dataIndex: 'contractMoneyTotal',
            render: (text, record) => {
                if (Number(record.contractProjectType) === 4) {
                    return '';
                }
                return `${text}元`;
            },
        },
        {
            title: '相关艺人/博主',
            dataIndex: 'talents',
        },
        {
            title: '签约日期',
            dataIndex: 'contractSigningDate',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '负责人',
            dataIndex: 'contractHeaderName',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                // todo AuthButton
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/customer/thread/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.contractId);
                                }}
                            >
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
