import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import FormView from '@/components/FormView';
import { formatCols } from '../_utils/constances';
import { formatFormCols } from '@/utils/utils';
import { accAdd, accDiv, accMul, accSub } from '@/utils/calculate';
import Notice from '../../../components/noticers';
import { formaterNoticersData } from '../_utils/formaterNoticerData';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({ business_fee_reimburse, loading }) => {
    return {
        formData: business_fee_reimburse.formData,
        editBtnLoading: loading.effects['business_fee_reimburse/editReimburse'],
    };
})
class Edit extends Component {
    constructor(props) {
        super(props);
        this.formView = React.createRef();
        this.state = {
            formData: props.formData || {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            const { query } = this.props.location;
            const { reimburseProjects } = nextProps.formData;
            const temp = _.assign({}, nextProps.formData);
            const reimburseProjectList = [];
            const reimburseNormals = [];
            if (Array.isArray(reimburseProjects)) {
                reimburseProjects.map((item) => {
                    if (item.reimburseProjectType === 1) {
                        reimburseNormals.push(item);
                    } else if (item.reimburseProjectType === 2) {
                        reimburseProjectList.push(item);
                    }
                });
            }
            // 下推清空数据
            if (temp.reimburseSource === 2 && query && query.id) {
                // reimburseNormals = [];
                // reimburseProjectList = [];
                // 下推数据补全
                // let total = temp.reimburseFeePushDown;
                // let flag = total > 0 ? true : false;
                reimburseNormals.map((item) => {
                    const result = item;
                    result.reimburseIncludeTaxFee = result.reimburseFeeApply;
                    result.reimburseInvoiceType = '1';
                    result.reimburseTaxRate = '0.06';
                    result.reimburseTax = accDiv(
                        accMul(result.reimburseIncludeTaxFee, result.reimburseTaxRate),
                        accAdd(1, result.reimburseTaxRate),
                    ).toFixed(2);
                    result.reimburseNoTaxFee = accSub(result.reimburseIncludeTaxFee, result.reimburseTax).toFixed(2);
                    return result;
                });
                reimburseProjectList.map((item) => {
                    const result = item;
                    result.reimburseIncludeTaxFee = result.reimburseFeeApply;
                    result.reimburseInvoiceType = '1';
                    result.reimburseTaxRate = '0.06';
                    result.reimburseTax = accDiv(
                        accMul(result.reimburseIncludeTaxFee, result.reimburseTaxRate),
                        accAdd(1, result.reimburseTaxRate),
                    ).toFixed(2);
                    result.reimburseNoTaxFee = accSub(result.reimburseIncludeTaxFee, result.reimburseTax).toFixed(2);
                    return result;
                });
            }
            temp.reimburseProjects = reimburseProjectList;
            temp.reimburseNormals = reimburseNormals;
            temp.reimburseCheques = [
                {
                    reimburseChequesType: temp.reimburseChequesType,
                    reimburseChequesId: temp.reimburseChequesId,
                    reimburseChequesName: temp.reimburseChequesName,
                    reimburseChequesSettlementWay: temp.reimburseChequesSettlementWay,
                    reimburseChequesBankAccountNo: temp.reimburseChequesBankAccountNo,
                    reimburseChequesBankAccountName: temp.reimburseChequesBankAccountName,
                    reimburseChequesBankAddress: temp.reimburseChequesBankAddress,
                    reimburseChequesBankCity: temp.reimburseChequesBankCity,
                },
            ];
            temp.reimbursePay = [
                {
                    reimbursePayCompanyId: temp.reimbursePayCompanyId,
                    reimbursePayCompanyName: temp.reimbursePayCompanyName,
                    reimbursePayBankAddress: temp.reimbursePayBankAddress,
                    reimbursePayBankAcountNo: temp.reimbursePayBankAcountNo,
                },
            ];
            this.setState(
                {
                    formData: temp,
                },
                () => {
                    this.changeParentForm('reimburseProjects', reimburseProjectList);
                    this.changeParentForm('reimburseNormals', reimburseNormals);
                    if (temp.reimburseCheques && temp.reimburseCheques[0].reimburseChequesType === 3) {
                        this.onChangeParams(
                            {
                                reimburseCheques: temp.reimburseCheques,
                            },
                            this.state.formData,
                        );
                    } else {
                        this.onChangeParams();
                    }
                },
            );
        }
    }

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'business_fee_reimburse/getReimburseDetail',
            payload: {
                id: query && (query.oldReimburseId || query.id),
            },
        });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        const temp = _.assign({}, formData, values);
        const holdData = _.cloneDeep(temp);
        temp.reimburseProjects = temp.reimburseProjects || [];
        if (temp.reimburseProjects.length > 1) {
            temp.reimburseProjects.pop();
        }
        if (temp.reimburseNormals && temp.reimburseNormals.length > 1) {
            temp.reimburseNormals.pop();
            temp.reimburseProjects = temp.reimburseProjects.concat(temp.reimburseNormals);
            delete temp.reimburseNormals;
        }
        if (temp.reimburseProjects.length === 0) {
            message.error('项目费用或日常费用至少填一条');
            return;
        }
        if (temp.reimburseSource === 2) {
            let totalPayApply = 0;
            // reimburseTotalFee
            temp.reimburseProjects.map((item) => {
                if (item.reimbursePayApply === 0) {
                    totalPayApply = accAdd(totalPayApply, item.reimburseFeeApply);
                } else {
                    totalPayApply = accAdd(totalPayApply, item.reimbursePayApply);
                }
            });
            if (temp.reimburseTotalFee < temp.reimburseFeePushDown) {
                // if (totalPayApply < temp.reimburseFeePushDown) {
                message.error('报销总金额不能少于下推金额');
                this.setState({
                    formData: holdData,
                });
                return;
            }
        }
        if (temp.reimburseCheques) {
            _.assign(temp, { ...temp.reimburseCheques[0] });
            delete temp.reimburseCheques;
        }
        if (temp.reimbursePay) {
            _.assign(temp, { ...temp.reimbursePay[0] });
            delete temp.reimbursePay;
        }
        temp.attachments = temp.attachments || [];
        temp.reimburseNoticerList = Notice.getNoticeData() || [];
        // console.log('result', temp);
        if (Array.isArray(temp.reimburseProjects) && temp.reimburseProjects.length > 0) {
            if (
                temp.reimburseProjects.some((item) => {
                    return (
                        (item.reimburseFeeType === 26
                            || item.reimburseFeeType === 30
                            || item.reimburseFeeType === 99
                            || item.reimburseFeeType === 108
                            || item.reimburseFeeType === 73)
                        && (item.reimburseFeeActualTime === null || item.reimburseFeeActualTime === '')
                    );
                })
            ) {
                message.error('项目费用明细中有实际发生时间未填写');
                return false;
            }
        } else if (Array.isArray(temp.reimburseNormals) && temp.reimburseNormals.length > 0) {
            if (
                temp.reimburseNormals.some((item) => {
                    return (
                        (item.reimburseFeeType === 26
                            || item.reimburseFeeType === 30
                            || item.reimburseFeeType === 99
                            || item.reimburseFeeType === 108
                            || item.reimburseFeeType === 73)
                        && (item.reimburseFeeActualTime === null || item.reimburseFeeActualTime === '')
                    );
                })
            ) {
                message.error('日常费用明细中有实际发生时间未填写');
                return false;
            }
        }
        const payload = {
            data: temp,
            cb: this.handleCancel,
        };
        this.setState({
            formData: holdData,
        });
        const { query } = this.props.location;
        if (query && query.oldReimburseId) {
            payload.data.orginalReimburseId = query.oldReimburseId;
            payload.cb = () => {
                this.props.history.replace('/foreEnd/business/feeManage/reimbursement');
            };
            payload.data.resubmit = Number(query.resubmitEnum);
            this.props.dispatch({
                type: 'business_fee_reimburse/resubmitReimburse',
                payload,
            });
            return;
        }
        this.props.dispatch({
            type: 'business_fee_reimburse/editReimburse',
            payload,
        });
    };

    handleCancel = () => {
        if (this.props.history.length > 1) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/foreEnd/business/feeManage/reimbursement');
        }
    };

    // 表单修改自身数据
    changeSelfForm = (values) => {
        const formView = this.formView.current;
        const form = formView.props.form.getFieldsValue();
        const { formData } = this.state;
        const newData = _.assign({}, formData, form, values);
        this.setState({
            formData: newData,
        });
    };

    changePayApply = (key, value) => {
        let { reimburseNormals, reimburseProjects } = this.state.formData;
        const { reimburseSource, reimburseFeePushDown } = this.state.formData;
        if (reimburseSource === 2) {
            if (key === 'reimburseNormals') {
                reimburseNormals = value;
            } else if (key === 'reimburseProjects') {
                reimburseProjects = value;
            }
            let total = reimburseFeePushDown;
            let flag = total > 0;
            reimburseNormals.map((item) => {
                const result = item;
                if (!result.index) {
                    if (flag) {
                        total = accSub(total, result.reimburseFeeApply);
                        if (total <= 0) {
                            flag = false;
                        }
                        result.reimbursePayApply = total >= 0 ? 0 : -total;
                    } else {
                        result.reimbursePayApply = result.reimburseFeeApply;
                    }
                }
                return result;
            });
            if (Array.isArray(reimburseProjects)) {
                reimburseProjects.map((item) => {
                    const result = item;
                    if (!result.index) {
                        if (flag) {
                            total = accSub(total, result.reimburseFeeApply);
                            if (total <= 0) {
                                flag = false;
                            }
                            result.reimbursePayApply = total >= 0 ? 0 : -total;
                        } else {
                            result.reimbursePayApply = result.reimburseFeeApply;
                        }
                    }
                    return result;
                });
            }
        }
    };

    // 内部表格修改父表单数据
    changeParentForm = (key, value) => {
        const formView = this.formView.current;
        const form = formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let temp = {};
        if (key === 'reimburseProjects' || key === 'reimburseNormals') {
            this.changePayApply(key, value);
            // 报销申请
            let applyTotal = 0;
            let projectApplyTotal = 0;
            let normalApplyTotal = 0;
            // 报销付款
            let reimburseTotal = 0;
            let projectReimburseTotal = 0;
            let normalReimburseTotal = 0;
            // 税额
            let reimburseIncludeTaxFee = 0;
            let reimburseNoTaxFee = 0;
            let reimburseTax = 0;
            if (key === 'reimburseNormals') {
                value.map((item) => {
                    if (!item.index) {
                        normalApplyTotal = accAdd(normalApplyTotal, item.reimburseFeeApply);
                        normalReimburseTotal = accAdd(normalReimburseTotal, item.reimbursePayApply);
                        reimburseIncludeTaxFee = accAdd(reimburseIncludeTaxFee, Number(item.reimburseIncludeTaxFee));
                        reimburseNoTaxFee = accAdd(reimburseNoTaxFee, Number(item.reimburseNoTaxFee || 0));
                        reimburseTax = accAdd(reimburseTax, Number(item.reimburseTax || 0));
                    }
                });
                if (
                    form.reimburseProjects
                    && form.reimburseProjects.length > 0
                    && form.reimburseProjects[form.reimburseProjects.length - 1].index
                ) {
                    applyTotal = accAdd(
                        normalApplyTotal,
                        form.reimburseProjects[form.reimburseProjects.length - 1].reimburseFeeApply,
                    );
                    let totalPayApplyPr = 0;
                    form.reimburseProjects.map((item) => {
                        if (!item.index) {
                            totalPayApplyPr = accAdd(totalPayApplyPr, item.reimbursePayApply);
                        }
                    });

                    reimburseTotal = accAdd(normalReimburseTotal, totalPayApplyPr);
                    form.reimburseProjects[form.reimburseProjects.length - 1].reimbursePayApply = totalPayApplyPr;
                } else if (
                    form.reimburseProjects
                    && form.reimburseProjects.length > 0
                    && !form.reimburseProjects[form.reimburseProjects.length - 1].index
                ) {
                    applyTotal = accAdd(
                        normalApplyTotal,
                        form.reimburseProjects.reduce((prev, cur) => {
                            return cur.reimburseFeeApply + prev;
                        }, 0),
                    );
                    reimburseTotal = accAdd(
                        normalReimburseTotal,
                        form.reimburseProjects.reduce((prev, cur) => {
                            return cur.reimbursePayApply + prev;
                        }, 0),
                    );
                } else {
                    applyTotal = normalApplyTotal;
                    reimburseTotal = normalReimburseTotal;
                }
                const totalCount = {
                    index: '合计',
                    reimburseFeeApply: normalApplyTotal,
                    reimbursePayApply: normalReimburseTotal,
                    reimburseIncludeTaxFee,
                    reimburseNoTaxFee,
                    reimburseTax,
                };
                if (value.length > 0) {
                    if (value[value.length - 1].index !== undefined) {
                        /* eslint-disable */

                        value[value.length - 1] = totalCount;
                    } else {
                        value.push(totalCount);
                    }
                }
            } else if (key === 'reimburseProjects') {
                value.map((item) => {
                    if (!item.index) {
                        projectApplyTotal = accAdd(projectApplyTotal, item.reimburseFeeApply);
                        projectReimburseTotal = accAdd(projectReimburseTotal, item.reimbursePayApply);
                        reimburseIncludeTaxFee = accAdd(reimburseIncludeTaxFee, Number(item.reimburseIncludeTaxFee));
                        reimburseNoTaxFee = accAdd(reimburseNoTaxFee, Number(item.reimburseNoTaxFee || 0));
                        reimburseTax = accAdd(reimburseTax, Number(item.reimburseTax || 0));
                    }
                });
                if (
                    form.reimburseNormals &&
                    form.reimburseNormals.length > 0 &&
                    form.reimburseNormals[form.reimburseNormals.length - 1].index
                ) {
                    applyTotal = accAdd(
                        projectApplyTotal,
                        form.reimburseNormals[form.reimburseNormals.length - 1].reimburseFeeApply,
                    );
                    let totalPayApplyNo = 0;
                    form.reimburseNormals.map((item) => {
                        if (!item.index) {
                            totalPayApplyNo = accAdd(totalPayApplyNo, item.reimbursePayApply);
                        }
                    });
                    reimburseTotal = accAdd(projectReimburseTotal, totalPayApplyNo);
                    form.reimburseNormals[form.reimburseNormals.length - 1].reimbursePayApply = totalPayApplyNo;
                } else if (
                    form.reimburseNormals &&
                    form.reimburseNormals.length > 0 &&
                    !form.reimburseNormals[form.reimburseNormals.length - 1].index
                ) {
                    applyTotal = accAdd(
                        projectApplyTotal,
                        form.reimburseNormals.reduce((prev, cur) => {
                            return cur.reimburseFeeApply + prev;
                        }, 0),
                    );
                    reimburseTotal = accAdd(
                        projectReimburseTotal,
                        form.reimburseNormals.reduce((prev, cur) => {
                            return cur.reimbursePayApply + prev;
                        }, 0),
                    );
                } else {
                    applyTotal = projectApplyTotal;
                    reimburseTotal = projectReimburseTotal;
                }
                const totalCount = {
                    index: '合计',
                    reimburseFeeApply: projectApplyTotal,
                    reimbursePayApply: projectReimburseTotal,
                    reimburseIncludeTaxFee,
                    reimburseNoTaxFee,
                    reimburseTax,
                };
                if (value.length > 0) {
                    if (value[value.length - 1].index !== undefined) {
                        /* eslint-disable */

                        value[value.length - 1] = totalCount;
                    } else {
                        value.push(totalCount);
                    }
                }
            }

            temp = {
                reimburseTotalFee: applyTotal,
                reimburseTotalPayFee: reimburseTotal,
            };
        }
        temp[key] = value;
        const newData = _.assign({}, form, formData, temp);
        this.setState(
            {
                formData: newData,
            },
            () => {
                if (temp.reimburseCheques && temp.reimburseCheques[0].reimburseChequesType === 3) {
                    this.onChangeParams(temp, this.state.formData);
                } else {
                    this.onChangeParams({}, this.state.formData);
                }
            },
        );
    };

    onChangeParams = async (current, allValue) => {
        const allData = await formaterNoticersData({ formData: allValue });
        const currentValue = await formaterNoticersData({ formData: current });
        Notice.onPushAllData(currentValue.slice(), allData.slice());
    };

    render() {
        const { formData } = this.state;
        const { editBtnLoading } = this.props;
        const cols = formatFormCols(
            formatCols({
                formData,
                changeParentForm: this.changeParentForm,
                changeSelfForm: this.changeSelfForm,
            }),
        );
        return (
            <FormView
                wrappedComponentRef={this.formView}
                cols={cols}
                formData={formData}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
            />
        );
    }
}

export default Edit;
