import React, { Component } from 'react';
import BIModal from '@/ant_components/BIModal';
import styles from './index.less';
import { message } from 'antd';
import { getOptionName } from '@/utils/utils';
import { checkPathname } from '@/components/AuthButton';
import FormTable from '@/components/FormTable';
import Approval from '../approval'
import { formatSelfCols } from './yingshouForm';
import { columnsFn } from './yingshouTable';
import {
    getContractReturns,
    delContractReturn,
    getCompanies,
    addContractReturn,
    editContractReturn,
    getCompaniesList,
} from '../../services';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contractReturns: [], // 回款列表
            contractReturnMoneyTotal: 0, // 回款列表所以回款金额总和
            companyList: [], // 公司列表
            companyBankNo: [],
            visible: false,
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        // 获取回款信息列表
        let id = this.props.id;
        if (!id) {
            return;
        }
        let result = await getContractReturns({ contractId: id });
        if (result && result.success) {
            let contractReturnMoneyTotal = 0;
            if (result.data && result.data.list) {
                result.data.list.map(item => {
                    contractReturnMoneyTotal += Number(item.contractReturnMoney);
                });
            }
            this.setState({
                contractReturns: (result.data && result.data.list) || [],
                contractReturnMoneyTotal,
            });
        }
        this.getCompaniesListFun(this.props);
    };
    getCompaniesListFun = async props => {
        // 获取公司全量信息
        let resultData = await getCompaniesList({
            pageNum: 1,
            pageSize: 9999,
        });
        if (resultData && resultData.success) {
            let companyList = (resultData.data && resultData.data.list) || [];
            let newList = companyList.map(item => ({
                ...item,
                value: item.companyId,
                label: item.companyName,
                isLeaf: false,
            }));
            this.getBankNum(newList);
        }
    };
    getCompaniesBank = async (id, targetOption) => {
        // 获取公司银行卡号
        let resultData = await getCompanies(id);
        if (resultData && resultData.success) {
            let companyBankList = (resultData.data && resultData.data.companyBankList) || [];
            let newList = companyBankList.map(item => ({
                ...item,
                label: item.companyBankNo,
                value: item.companyBankNo,
            }));
            targetOption.loading = false;
            targetOption.children = newList;
            this.setState({
                companyList: [...this.state.companyList],
            });
        }
    };

    del = e => {
        // 删除
        // this.delContractReturnFun(e.id);
    };
    startApproval = () => {
        this.setState({ visible: true })
    }
    delContractReturnFun = async id => {
        // 删除接口
        let result = await delContractReturn(id);
        if (result && result.success) {
            message.success(result.message);
            this.getData();
        }
    };
    submit = (type, data, close) => {
        // 提交
        let { contract: { contractId = '', contractCode = '' } = {} } = this.props.formData;
        let contractReturnRate = data.contractReturnRate / 100;
        let newData = {
            ...data,
            contractReturnRate,
            contractCode,
            contractId,
            contractReturnType: 1,
        };
        if (!this.checkContractReturnsTotal(data.id, data.contractReturnMoney)) {
            return;
        }
        if (type == 'add') {
            this.addContractReturnFun(newData, close);
        } else {
            this.editContractReturnFun(data.id, newData, close);
        }
    };
    addContractReturnFun = async (data, close) => {
        // 添加
        let result = await addContractReturn(data);
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };

    editContractReturnFun = async (id, data, close) => {
        // 编辑
        let result = await editContractReturn(id, data);
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };
    checkContractReturnsTotal = (id, num) => {
        // 判断当前回款金额总和
        let { contractReturns = [] } = this.state;
        let formDataObj = this.props.formData || {};
        let contractMoneyTotal =
            formDataObj.contract && Number(formDataObj.contract.contractMoneyTotal);
        let total = 0;
        if (id) {
            contractReturns = contractReturns.filter(item => item.id != id);
        }
        contractReturns.map(item => {
            total += Number(item.contractReturnMoney);
        });
        let maxNum = contractMoneyTotal - total;
        if (num > maxNum) {
            message.warn('当前实际回款金额最大为' + maxNum);
            return false;
        } else {
            return true;
        }
    };
    getCompaniesBankInit = async id => {
        // 获取公司银行卡号(回显使用)
        let resultData = await getCompanies(id);
        if (resultData && resultData.success) {
            let companyBankList = (resultData.data && resultData.data.companyBankList) || [];
            let newList = companyBankList.map(item => ({
                ...item,
                label: item.companyBankNo,
                value: item.companyBankNo,
            }));
            let arr = this.state.companyList.map(item => {
                if (item.companyId == id) {
                    item.children = newList;
                }
                return item;
            });
            this.setState({
                companyList: arr,
            });
        }
    };

    getBankNum = async newList => {
        const companyList = newList;
        const { formData } = this.props;
        const contractCompanyList = formData.contractCompanyList;
        if (contractCompanyList && contractCompanyList.length > 0) {
            // 客户+工作室排除
            const value = contractCompanyList[0].contractCompanyId;
            const res = await getCompanies(value);

            let index = 0;
            for (const iterator of companyList) {
                if (iterator.value === value) {
                    index = companyList.indexOf(iterator);
                    break;
                }
            }

            if (res && res.success && res.data) {
                res.data.companyBankList.map(item => {
                    item.label = item.companyBankNo;
                    item.value = item.companyBankNo;
                });
                companyList[index].children = res.data.companyBankList;
                this.setState({
                    companyList,
                    companyBankNo: [
                        res.data.companyBankList[0].companyId,
                        res.data.companyBankList[0].companyBankNo,
                    ],
                });
            }
        }
    };

    initForm = e => {
        // 初始化弹框数据
        if (e.companyId) {
            // 编辑
            this.getCompaniesBankInit(e.companyId);
        } else {
            // 新增
            e.companyBankNo = this.state.companyBankNo;
        }

        if (e.contractReturnRate) {
            e.contractReturnRate = e.contractReturnRate * 100;
        }
        return e;
    };

    render() {
        let { contractReturns, companyList, contractReturnMoneyTotal } = this.state;
        let getCompaniesBank = this.getCompaniesBank;
        let formDataObj = this.props.formData;
        let { currentIsCreater } = this.props;
        return (
            <div className={styles.detailPage1}>
                <div className={styles.tit}>应收账款信息</div>
                <FormTable
                    addBtnText="添加"
                    editBtnText="编辑"
                    disabled={
                        checkPathname('/foreEnd/business/project/contract/detail/backInfo/add') &&
                            contractReturnMoneyTotal < Number(formDataObj.contract.contractMoneyTotal)
                            ? false
                            : true
                    }
                    tableCols={columnsFn.bind(this, currentIsCreater)}
                    formCols={formatSelfCols.bind(this, {
                        companyList,
                        getCompaniesBank,
                        formDataObj,
                        contractReturnMoneyTotal,
                    })}
                    value={contractReturns}
                    initForm={this.initForm}
                    delCallback={this.del}
                    submitCallback={this.submit}
                    startApproval={this.startApproval}
                ></FormTable>
                <BIModal
                    title="发起审批"
                    visible={this.state.visible}
                    onOk={() => this.setState({ visible: false })}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Approval />
                </BIModal>
            </div>
        );
    }
}

export default Index;
