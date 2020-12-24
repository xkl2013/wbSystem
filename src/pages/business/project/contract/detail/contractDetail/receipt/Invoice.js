import React, { Component } from 'react';
import { message } from 'antd';
import styles from './index.less';

import { getOptionName } from '@/utils/utils';
import { checkPathname } from '@/components/AuthButton';

import FormTable from '@/components/FormTable';

import { formatSelfCols } from './invoiceForm';
import { columnsFn } from './invoiceTable';
import {
    getContractInvoices,
    delContractInvoices,
    getCompaniesList,
    addContractInvoice,
    editContractInvoice,
} from '../../services';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contractInvoice: [], // 发票列表
            companyList: [], // 公司列表
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        // 获取发票信息列表
        const id = this.props.id;
        if (!id) {
            return;
        }
        const result = await getContractInvoices({ contractId: id });
        if (result && result.success) {
            this.setState({
                contractInvoice: (result.data && result.data.list) || [],
            });
        }

        const resultData = await getCompaniesList({
            pageNum: 1,
            pageSize: 9999,
        });
        if (resultData && resultData.success) {
            const companyList = (resultData.data && resultData.data.list) || [];
            const newList = companyList.map((item) => {
                return {
                    ...item,
                    id: item.companyId,
                    name: item.companyName,
                };
            });
            this.setState({
                companyList: newList,
            });
        }
    };

    del = (e) => {
        // 删除
        this.delContractInvoicesFun(e.id);
    };

    delContractInvoicesFun = async (id) => {
        // 删除接口
        const result = await delContractInvoices(id);
        if (result && result.success) {
            message.success(result.message);
            this.getData();
        }
    };

    submit = (type, data, close) => {
        // 提交
        const { contract: { contractId = '', contractCode = '' } = {} } = this.props.formData;
        const contractInvoiceCompanyName = getOptionName(this.state.companyList, data.contractInvoiceCompanyId);
        const { contractInvoiceTaxRate, contractInvoiceMoneyTotal } = data;
        // if (data.contractInvoiceType == 0) {
        //     // 普票
        //     contractInvoiceTaxRate = 0;
        //     // contractInvoiceTaxMoney = 0;
        //     contractInvoiceMoneyTotal = data.contractInvoiceMoney;
        // }
        const newData = {
            ...data,
            contractInvoiceCompanyName,
            contractCode,
            contractId,
            contractInvoiceTaxRate,
            // contractInvoiceTaxMoney,
            contractInvoiceMoneyTotal,
        };
        if (type === 'add') {
            this.addContractInvoiceFun(newData, close);
        } else {
            this.editContractInvoiceFun(data.id, newData, close);
        }
    };

    addContractInvoiceFun = async (data, close) => {
        // 添加
        const result = await addContractInvoice(data);
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };

    editContractInvoiceFun = async (id, data, close) => {
        // 编辑
        const result = await editContractInvoice(id, data);
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };

    initForm = (e) => {
        // 初始化弹框数据
        const { formData } = this.props;
        const contractCompanyList = formData.contractCompanyList;
        if (!e.id) {
            e.contractInvoiceType = 1;
            if (contractCompanyList && contractCompanyList.length > 0) {
                e.contractInvoiceCompanyId = contractCompanyList[0].contractCompanyId;
                e.contractInvoiceCompanyName = contractCompanyList[0].contractCompanyName;
            }
        }
        return e;
    };

    render() {
        const { contractInvoice, companyList } = this.state;
        const { currentIsCreater } = this.props;
        const formDataObj = this.props.formData;
        return (
            <div className={styles.detailPage1}>
                <div className={styles.tit}>发票管理</div>
                <FormTable
                    addBtnText="添加"
                    editBtnText="编辑"
                    disabled={!checkPathname('/foreEnd/business/project/contract/detail/receivables/add')}
                    tableCols={columnsFn.bind(this, currentIsCreater)}
                    formCols={formatSelfCols.bind(this, { companyList, formDataObj })}
                    value={contractInvoice}
                    initForm={this.initForm}
                    delCallback={this.del}
                    submitCallback={this.submit}
                />
            </div>
        );
    }
}

export default Index;
