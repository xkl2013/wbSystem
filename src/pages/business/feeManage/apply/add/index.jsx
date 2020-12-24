import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import _ from 'lodash';
import { getUserDetail } from '@/services/globalDetailApi';
import { accAdd } from '@/utils/calculate';
import storage from '@/utils/storage';
import { message } from 'antd';
import { formatCols } from '../_utils/constances';
import Notice from '../../../components/noticers';
import { formaterNoticersData } from '../_utils/formaterNoticerData';

@connect(({ business_fee_apply, loading }) => {
    return {
        business_fee_apply,
        addBtnLoading: loading.effects['business_fee_apply/addApply'],
    };
})
class Add extends Component {
    constructor(props) {
        super(props);
        const info = storage.getItem('add_fee_info');
        const data = info ? info.formData : {};
        this.state = {
            formData: {
                ...data,
                applicationCurrency: '1',
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
                        applicationUserId: user.userId,
                        applicationUserName: user.userRealName,
                        applicationUserCode: user.userCode,
                        applicationApplyCompanyId: company.companyId,
                        applicationApplyCompanyName: company.companyName,
                        applicationApplyCompanyCode: company.companyCode,
                        applicationApplyDeptId: department.departmentId,
                        applicationApplyDeptName: department.departmentName,
                        applicationApplyDeptCode: department.departmentCode,
                        applicationCheques: [
                            {
                                applicationChequesType: 3,
                                applicationChequesId: user.userId,
                                applicationChequesName: user.userRealName,
                                applicationChequesSettlementWay: '1',
                                applicationChequesBankAccountNo: user.employeeBankCard,
                                applicationChequesBankAccountName: user.userRealName,
                                applicationChequesBankAddress: user.employeeBankAddress,
                                applicationChequesBankCity: user.employeeBankArea,
                            },
                        ],
                    }),
                },
                () => {
                    if (Array.isArray(this.state.formData.applicationCheques)) {
                        this.onChangeParams(
                            {
                                applicationCheques: [
                                    {
                                        applicationChequesType: 3,
                                        applicationChequesId: user.userId,
                                        applicationChequesName: user.userRealName,
                                        applicationChequesSettlementWay: '1',
                                        applicationChequesBankAccountNo: user.employeeBankCard,
                                        applicationChequesBankAccountName: user.userRealName,
                                        applicationChequesBankAddress: user.employeeBankAddress,
                                        applicationChequesBankCity: user.employeeBankArea,
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

    handleSubmit = async (values) => {
        const { formData } = this.state;
        const temp = _.assign({}, formData, values);
        const holdData = _.cloneDeep(temp);
        temp.applicationProjectVoList = temp.applicationProjectVoList || [];
        if (temp.applicationProjectVoList.length > 1) {
            temp.applicationProjectVoList.pop();
        }
        if (temp.applicationNormalVoList && temp.applicationNormalVoList.length > 1) {
            temp.applicationNormalVoList.pop();
            temp.applicationProjectVoList = temp.applicationProjectVoList.concat(temp.applicationNormalVoList);
            delete temp.applicationNormalVoList;
        }
        if (temp.applicationProjectVoList.length === 0) {
            message.error('项目费用或日常费用至少填一条');
            return;
        }
        if (temp.applicationCheques) {
            _.assign(temp, { ...temp.applicationCheques[0] });
            delete temp.applicationCheques;
        }
        if (temp.applicationPay) {
            _.assign(temp, { ...temp.applicationPay[0] });
            delete temp.applicationPay;
        }
        temp.attachments = temp.attachments || [];
        temp.applicationNoticerList = Notice.getNoticeData() || [];
        const payload = {
            data: temp,
            cb: this.handleCancel,
        };
        this.setState({
            formData: holdData,
        });
        this.props.dispatch({
            type: 'business_fee_apply/addApply',
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

    // 修改父表单数据
    changeParentForm = (key, value) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let temp = {};
        if (key === 'applicationProjectVoList' || key === 'applicationNormalVoList') {
            let total = 0;
            let projectTotal = 0;
            let normalTotal = 0;
            if (key === 'applicationProjectVoList') {
                value.map((item) => {
                    if (!item.index) {
                        projectTotal = accAdd(projectTotal, item.applicationFeeApply);
                    }
                });
                if (
                    form.applicationNormalVoList
                    && form.applicationNormalVoList[form.applicationNormalVoList.length - 1].index
                ) {
                    total = accAdd(
                        projectTotal,
                        form.applicationNormalVoList[form.applicationNormalVoList.length - 1].applicationFeeApply,
                    );
                } else {
                    total = projectTotal;
                }
                const totalCount = {
                    index: '合计',
                    applicationFeeApply: projectTotal,
                };
                if (value.length > 0) {
                    if (value[value.length - 1].index !== undefined) {
                        value[value.length - 1] = totalCount;
                    } else {
                        value.push(totalCount);
                    }
                }
            } else if (key === 'applicationNormalVoList') {
                value.map((item) => {
                    if (!item.index) {
                        normalTotal = accAdd(normalTotal, item.applicationFeeApply);
                    }
                });
                if (
                    form.applicationProjectVoList
                    && form.applicationProjectVoList[form.applicationProjectVoList.length - 1].index
                ) {
                    total = accAdd(
                        normalTotal,
                        form.applicationProjectVoList[form.applicationProjectVoList.length - 1].applicationFeeApply,
                    );
                } else {
                    total = normalTotal;
                }
                const totalCount = {
                    index: '合计',
                    applicationFeeApply: normalTotal,
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
                applicationApplyTotalFee: total,
            };
        }
        temp[key] = value;
        const newData = _.assign({}, formData, form, temp);
        this.setState(
            {
                formData: newData,
            },
            () => {
                if (form.applicationCheques[0].applicationChequesType === 3) {
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

export default Add;
