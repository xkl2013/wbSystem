import React, { Component } from 'react';
import FlexDetail from '@/components/flex-detail';
import styles from './index.less';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import moment from 'moment';
import { COMPANYS_TYPE, TAX_TYPE } from '@/utils/enum';
import BITable from '@/ant_components/BITable';
import { DATE_FORMAT } from '@/utils/constants';
import { connect } from 'dva';

const columns = [
    {
        title: '帐户名',
        dataIndex: 'companyName',
    },
    {
        title: '开户行',
        dataIndex: 'companyBankName',
    },
    {
        title: '银行卡号',
        dataIndex: 'companyBankNo',
    },
    {
        title: '帐户类型',
        dataIndex: 'companyBankIsReimbursement',
        render: text => {
            return text === 1 ? '报销专户' : '';
        },
    },
    {
        title: '备注',
        dataIndex: 'companyBankRemark',
    },
];
const LabelWrap = [
    [
        { key: 'companyName', label: '公司名称' },
        { key: 'companyCode', label: '公司编码' },
        {
            key: 'companyTaxType',
            label: '税务资质',
            render: detail => {
                return getOptionName(TAX_TYPE, detail.companyTaxType);
            },
        },
        {
            key: 'companyTaxRate',
            label: '税率',
            render: detail => {
                return detail.companyTaxType == 0 ? '6%' : '3%';
            },
        },
    ],
    [
        {
            key: 'companyType',
            label: '公司类型',
            render: detail => {
                return getOptionName(COMPANYS_TYPE, detail.companyType);
            },
        },
        { key: 'companyTaxpayerNumber', label: '纳税人识别号' },
        { key: 'companyCodeShort', label: '编码简称' },
        { key: 'companyLegalPerson', label: '法人代表' },
    ],
    [
        {
            key: 'companyRegisterCapital',
            label: '注册资本',
            render: detail => {
                return (
                    detail.companyRegisterCapital &&
                    `${thousandSeparatorFixed(detail.companyRegisterCapital)}元`
                );
            },
        },
        {
            key: 'companyCreatedAt',
            label: '成立时间',
            render: detail => {
                return (
                    detail.companyCreatedAt && moment(detail.companyCreatedAt).format(DATE_FORMAT)
                );
            },
        },
        { key: 'companyRegisterAddress', label: '注册地址' },
        { key: 'companyOfficeAddress', label: '办公地址' },
    ],
    [
        // {key: 'companyBankName', label: '开户行'},
        // {key: 'companyBankCardNumber', label: '银行帐号（报销专用）'},
        {
            key: 'companyBusinessFrom',
            label: '营业期限',
            render: record => {
                return (
                    record.companyBusinessFrom &&
                    record.companyBusinessTo &&
                    moment(record.companyBusinessFrom).format(DATE_FORMAT) +
                        '至' +
                        moment(record.companyBusinessTo).format(DATE_FORMAT)
                );
            },
        },
        { key: 'companyUserTotal', label: '员工数' },
        {
            key: 'companyAttachedTaxRate',
            label: '附加税比例',
            render: detail => {
                if (detail.companyAttachedTaxRate == 0) {
                    return '0%';
                }
                return (
                    detail.companyAttachedTaxRate &&
                    `${(Number(detail.companyAttachedTaxRate) * 100).toFixed(2)}%`
                );
            },
        },
        {},
    ],
];
const LabelWrap1 = [
    [
        {
            key: 'companyBankList',
            render: detail => {
                return (
                    <BITable
                        className={styles.detailTableWrap}
                        rowKey='companyBankId'
                        bordered={true}
                        columns={columns}
                        dataSource={detail.companyBankList || []}
                        pagination={false}
                    />
                );
            },
        },
    ],
];

@connect(({ admin_company, loading }) => ({
    formData: admin_company.formData,
}))
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            this.setState({
                detail: nextProps.formData,
            });
        }
    }

    getData = () => {
        const { query } = this.props.location;
        let id = query && query.id;
        this.props.dispatch({
            type: 'admin_company/getCompanyDetail',
            payload: {
                id,
            },
        });
    };

    render() {
        const { detail } = this.state;
        return (
            <div className={styles.detailPage}>
                <FlexDetail LabelWrap={LabelWrap} detail={detail} title='基本信息' />
                <FlexDetail LabelWrap={LabelWrap1} detail={detail} title='银行帐号' />
            </div>
        );
    }
}

export default Detail;
