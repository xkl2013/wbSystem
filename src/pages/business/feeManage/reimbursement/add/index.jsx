import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import _ from 'lodash';
import { formatFormCols } from '@/utils/utils';
import { accAdd } from '@/utils/calculate';
import storage from '@/utils/storage';
import { getUserDetail } from '@/services/globalDetailApi';
import { message } from 'antd';
import { formatCols } from '../_utils/constances';
import Notice from '../../../components/noticers';
import { formaterNoticersData } from '../_utils/formaterNoticerData';

@connect(({ business_fee_reimburse, loading }) => {
    return {
        business_fee_reimburse,
        addBtnLoading: loading.effects['business_fee_reimburse/addReimburse'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        const info = storage.getItem('add_fee_info');
        const data = info ? info.formData : {};
        this.state = {
            formData: {
                ...data,
                reimburseCurrency: '1',
            },
        };
    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo = async () => {
        const { formData } = this.state;
        const userInfo = storage.getUserInfo();
        const response = await getUserDetail(userInfo.userId);
        if (response && response.success && response.data) {
            const user = response.data.user || {};
            const company = response.data.company || {};
            const department = response.data.department || {};
            this.setState(
                {
                    formData: _.assign({}, formData, {
                        reimburseReportUserId: user.userId,
                        reimburseReportUserName: user.userRealName,
                        reimburseReportUserCode: user.userCode,
                        reimburseReportUserCompanyId: company.companyId,
                        reimburseReportUserCompanyName: company.companyName,
                        reimburseReportUserCompanyCode: company.companyCode,
                        reimburseReportUserDeptId: department.departmentId,
                        reimburseReportUserDeptName: department.departmentName,
                        reimburseReportUserDeptCode: department.departmentCode,
                        reimburseReimbureUserId: user.userId,
                        reimburseReimbureUserName: user.userRealName,
                        reimburseReimbureUserCode: user.userCode,
                        reimburseReimbureUserCompanyId: company.companyId,
                        reimburseReimbureUserCompanyName: company.companyName,
                        reimburseReimbureUserCompanyCode: company.companyCode,
                        reimburseReimbureUserDeptId: department.departmentId,
                        reimburseReimbureUserDeptName: department.departmentName,
                        reimburseReimbureUserDeptCode: department.departmentCode,
                        reimburseCheques: [
                            {
                                reimburseChequesType: 3,
                                reimburseChequesId: user.userId,
                                reimburseChequesName: user.userRealName,
                                reimburseChequesSettlementWay: '1',
                                reimburseChequesBankAccountNo: user.employeeBankCard,
                                reimburseChequesBankAccountName: user.userRealName,
                                reimburseChequesBankAddress: user.employeeBankAddress,
                                reimburseChequesBankCity: user.employeeBankArea,
                            },
                        ],
                    }),
                },
                () => {
                    if (Array.isArray(this.state.formData.reimburseCheques)) {
                        this.onChangeParams(
                            {
                                reimburseCheques: [
                                    {
                                        reimburseChequesType: 3,
                                        reimburseChequesId: user.userId,
                                        reimburseChequesName: user.userRealName,
                                        reimburseChequesSettlementWay: '1',
                                        reimburseChequesBankAccountNo: user.employeeBankCard,
                                        reimburseChequesBankAccountName: user.userRealName,
                                        reimburseChequesBankAddress: user.employeeBankAddress,
                                        reimburseChequesBankCity: user.employeeBankArea,
                                    },
                                ],
                            },
                            this.state.formData,
                        );
                    }
                },
            );
        }
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
        const payload = {
            data: temp,
            cb: this.handleCancel,
        };
        this.setState({
            formData: holdData,
        });
        this.props.dispatch({
            type: 'business_fee_reimburse/addReimburse',
            payload,
        });
        storage.removeItem('add_fee_info');
    };

    handleCancel = () => {
        this.props.history.goBack();
        storage.removeItem('add_fee_info');
    };

    // 表单修改自身数据
    changeSelfForm = (values) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        const newData = _.assign({}, formData, form, values);
        this.setState({
            formData: newData,
        });
    };

    // 内部表格修改父表单数据
    changeParentForm = (key, value) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let temp = {};
        if (key === 'reimburseProjects' || key === 'reimburseNormals') {
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
            if (key === 'reimburseProjects') {
                value.map((item) => {
                    if (!item.index) {
                        projectApplyTotal = accAdd(projectApplyTotal, item.reimburseFeeApply);
                        projectReimburseTotal = accAdd(projectReimburseTotal, item.reimbursePayApply);
                        reimburseIncludeTaxFee = accAdd(reimburseIncludeTaxFee, Number(item.reimburseIncludeTaxFee));
                        reimburseNoTaxFee = accAdd(reimburseNoTaxFee, Number(item.reimburseNoTaxFee || 0));
                        reimburseTax = accAdd(reimburseTax, Number(item.reimburseTax || 0));
                    }
                });
                if (form.reimburseNormals && form.reimburseNormals[form.reimburseNormals.length - 1].index) {
                    applyTotal = accAdd(
                        projectApplyTotal,
                        form.reimburseNormals[form.reimburseNormals.length - 1].reimburseFeeApply,
                    );
                    reimburseTotal = accAdd(
                        projectReimburseTotal,
                        form.reimburseNormals[form.reimburseNormals.length - 1].reimbursePayApply,
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
                        value[value.length - 1] = totalCount;
                    } else {
                        value.push(totalCount);
                    }
                }
            } else if (key === 'reimburseNormals') {
                value.map((item) => {
                    if (!item.index) {
                        normalApplyTotal = accAdd(normalApplyTotal, item.reimburseFeeApply);
                        normalReimburseTotal = accAdd(normalReimburseTotal, item.reimbursePayApply);
                        reimburseIncludeTaxFee = accAdd(reimburseIncludeTaxFee, Number(item.reimburseIncludeTaxFee));
                        reimburseNoTaxFee = accAdd(reimburseNoTaxFee, Number(item.reimburseNoTaxFee || 0));
                        reimburseTax = accAdd(reimburseTax, Number(item.reimburseTax || 0));
                    }
                });
                if (form.reimburseProjects && form.reimburseProjects[form.reimburseProjects.length - 1].index) {
                    applyTotal = accAdd(
                        normalApplyTotal,
                        form.reimburseProjects[form.reimburseProjects.length - 1].reimburseFeeApply,
                    );
                    reimburseTotal = accAdd(
                        normalReimburseTotal,
                        form.reimburseProjects[form.reimburseProjects.length - 1].reimbursePayApply,
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
        const newData = _.assign({}, formData, form, temp);
        this.setState(
            {
                formData: newData,
            },
            () => {
                if (form.reimburseCheques[0].reimburseChequesType === 3) {
                    this.onChangeParams(form, this.state.formData);
                } else {
                    this.onChangeParams();
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
        const { addBtnLoading } = this.props;
        const cols = formatFormCols(
            formatCols({
                formData,
                changeParentForm: this.changeParentForm,
                changeSelfForm: this.changeSelfForm,
            }),
        );
        return (
            <div>
                <FormView
                    wrappedComponentRef={(dom) => {
                        this.formView = dom;
                    }}
                    cols={cols}
                    formData={formData}
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    btnWrapStyle={{
                        marginTop: '20px',
                    }}
                    loading={addBtnLoading}
                />
            </div>
        );
    }
}

export default CreateUser;
