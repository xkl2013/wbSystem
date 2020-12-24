import { getOptionName } from '@/utils/utils';
import { TAX_TYPE, SUPPLIER_TYPE } from '@/utils/enum';

export const LabelWrap1 = [
    [
        {
            key: 'supplierName',
            label: '供应商名称',
        },
        {
            key: 'supplierType',
            label: '供应商类型',
            render: (detail) => {
                return getOptionName(SUPPLIER_TYPE, detail.supplierType);
            },
        },

        {
            key: 'supplierBrokerage',
            label: '佣金比例',
            render: (detail) => {
                if (detail.supplierBrokerage !== null) return `${(Number(detail.supplierBrokerage) * 100).toFixed(0)}%`;
            },
        },
        {
            key: 'supplierVatRate',
            label: '税率',
            render: (detail) => {
                if (detail.supplierVatRate !== null) return `${(Number(detail.supplierVatRate) * 100).toFixed(0)}%`;
            },
            // render: (detail) => {
            //     return getOptionName(SUPPLIER_RATE, detail.supplierVatRate);
            // },
        },
    ],
    [
        {
            key: 'supplierTaxType',
            label: '税务资质',
            render: (detail) => {
                return getOptionName(TAX_TYPE, detail.supplierTaxType);
            },
        },

        {
            label: '供应商编码',
            key: 'supplierCode',
        },
        {},
        {},
    ],
];
export const LabelWrap2 = [
    {
        title: '银行账号',
        dataIndex: 'supplierBankNo',
        align: 'center',
    },
    {
        title: '开户行',
        dataIndex: 'supplierBankName',
        align: 'center',
    },
    {
        title: '开户行编码',
        dataIndex: 'supplierBankCode',
    },
    {
        title: '开户地',
        dataIndex: 'supplierBankCity',
        align: 'center',
    },
];
export const LabelWrap3 = [
    [
        {
            key: 'supplierCreatedBy',
            label: '填写人',
        },
        {
            key: 'supplierCreatedAt',
            label: '填写时间',
        },
        {},
        {},
    ],
];
export default {
    LabelWrap1,
    LabelWrap2,
    LabelWrap3,
};
