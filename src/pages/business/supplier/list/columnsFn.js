import React from 'react';
import moment from 'moment';
import { getOptionName } from '@/utils/utils';
import { TAX_TYPE, SUPPLIER_TYPE } from '@/utils/enum';
import BITable from '@/ant_components/BITable';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';
import { DATETIME_FORMAT } from '@/utils/constants';
import styles from './index.less';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '供应商名称',
            dataIndex: 'supplierName',
            width: 160,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '供应商编码',
            dataIndex: 'supplierCode',
            width: 190,
        },
        {
            title: '供应商类型',
            dataIndex: 'supplierType',
            width: 100,
            render: (text) => {
                return getOptionName(SUPPLIER_TYPE, text);
            },
        },
        {
            title: '佣金比例',
            dataIndex: 'supplierBrokerage',
            render: (text) => {
                return text !== null && `${(Number(text) * 100).toFixed(0)}%`;
            },
        },
        {
            title: '税率',
            dataIndex: 'supplierVatRate',
            render: (text) => {
                return text !== null && `${(Number(text) * 100).toFixed(0)}%`;
            },
        },
        {
            title: '税务资质',
            dataIndex: 'supplierTaxType',
            render: (text) => {
                return getOptionName(TAX_TYPE, text);
            },
        },
        {
            title: '填写人',
            dataIndex: 'supplierCreatedBy',
        },
        {
            title: '填写时间',
            dataIndex: 'supplierCreatedAt',
            render: (text) => {
                return text && moment(text).format(DATETIME_FORMAT);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/supplier/edit">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editData(record.supplierId);
                                }}
                            >
                                编辑
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/supplier/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.supplierId);
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

// 获取table列表头
export function columnsChildFn(e) {
    const columns = [
        {
            title: '银行账号',
            dataIndex: 'supplierBankNo',
            width: 160,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text, 20)}</span>;
            },
        },
        {
            title: '开户行',
            dataIndex: 'supplierBankName',
            width: 190,
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '开户行编码',
            dataIndex: 'supplierBankCode',
        },
        {
            title: '开户地',
            dataIndex: 'supplierBankCity',
        },
        {},
        {},
        {},
        {},
    ];
    return <BITable rowKey="supplierBankId" columns={columns} dataSource={e.supplierBankVoList} pagination={false} />;
}
