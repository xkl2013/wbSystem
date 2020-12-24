import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import FormView from '@/components/FormView';
import { formatCols } from '../_utils/constances';
import { formatFormCols } from '@/utils/utils';
import { accAdd } from '@/utils/calculate';
import Notice from '../../../components/noticers';
import { formaterNoticersData } from '../_utils/formaterNoticerData';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({ business_fee_apply, loading }) => {
    return {
        formData: business_fee_apply.formData,
        editBtnLoading: loading.effects['business_fee_apply/editApply'],
    };
})
class Edit extends Component {
    constructor(props) {
        super(props);
        this.formView = React.createRef();
        this.state = {
            formData: {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            const { applicationProjectVoList } = nextProps.formData;
            const temp = _.assign({}, nextProps.formData);
            const projectVoList = [];
            const normalVoList = [];

            if (Array.isArray(applicationProjectVoList)) {
                applicationProjectVoList.map((item) => {
                    if (item.applicationProjectType === 1) {
                        normalVoList.push(item);
                    } else if (item.applicationProjectType === 2) {
                        projectVoList.push(item);
                    }
                });
            }
            temp.applicationProjectVoList = projectVoList;
            temp.applicationNormalVoList = normalVoList;
            temp.applicationCheques = [
                {
                    applicationChequesType: temp.applicationChequesType,
                    applicationChequesId: temp.applicationChequesId,
                    applicationChequesName: temp.applicationChequesName,
                    applicationChequesSettlementWay: temp.applicationChequesSettlementWay,
                    applicationChequesBankAccountNo: temp.applicationChequesBankAccountNo,
                    applicationChequesBankAccountName: temp.applicationChequesBankAccountName,
                    applicationChequesBankAddress: temp.applicationChequesBankAddress,
                    applicationChequesBankCity: temp.applicationChequesBankCity,
                },
            ];
            temp.applicationPay = [
                {
                    applicationPayCompanyId: temp.applicationPayCompanyId,
                    applicationPayCompanyName: temp.applicationPayCompanyName,
                    applicationPayBankAddress: temp.applicationPayBankAddress,
                    applicationPayBankAcountNo: temp.applicationPayBankAcountNo,
                },
            ];
            this.setState(
                {
                    formData: temp,
                },
                () => {
                    this.changeParentForm('applicationProjectVoList', projectVoList);
                    this.changeParentForm('applicationNormalVoList', normalVoList);
                    if (temp.applicationCheques && temp.applicationCheques[0].applicationChequesType === 3) {
                        this.onChangeParams(
                            {
                                applicationCheques: temp.applicationCheques,
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
            type: 'business_fee_apply/getApplyDetail',
            payload: {
                id: query && (query.oldApplicationId || query.id),
            },
        });
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
        const { query } = this.props.location;
        if (query && query.oldApplicationId) {
            payload.data.originalApplicationId = query.oldApplicationId;
            payload.cb = () => {
                this.props.history.replace('/foreEnd/business/feeManage/apply');
            };
            payload.data.resubmit = Number(query.resubmitEnum);
            this.props.dispatch({
                type: 'business_fee_apply/resubmitApply',
                payload,
            });
            return;
        }
        this.props.dispatch({
            type: 'business_fee_apply/editApply',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
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

    // 修改父表单数据
    changeParentForm = (key, value) => {
        const formView = this.formView.current;
        const form = formView.props.form.getFieldsValue();
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
                    && form.applicationNormalVoList.length > 0
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
                        /* eslint-disable */
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
                    form.applicationProjectVoList &&
                    form.applicationProjectVoList.length > 0 &&
                    form.applicationProjectVoList[form.applicationProjectVoList.length - 1].index
                ) {
                    total = accAdd(
                        normalTotal,
                        form.applicationProjectVoList[form.applicationProjectVoList.length - 1].applicationFeeApply,
                    );
                } else if (
                    form.applicationProjectVoList &&
                    form.applicationProjectVoList.length > 0 &&
                    !form.applicationProjectVoList[form.applicationProjectVoList.length - 1].index
                ) {
                    // debugger;
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
                        /* eslint-disable */
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
                if (temp.applicationCheques && temp.applicationCheques[0].applicationChequesType === 3) {
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
            <div>
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
            </div>
        );
    }
}

export default Edit;
