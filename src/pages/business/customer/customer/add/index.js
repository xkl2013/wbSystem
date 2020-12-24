import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import RepeatPeopleTable from '../component/repeatPeopleTable';
import { formatCols } from '../_utils/constances';

@connect(({ customer_customer, loading }) => {
    return {
        customer_customer,
        addCustomerBtnLoading: loading.effects['customer_customer/addCustomer'],
        addAgentCustomerBtnLoading: loading.effects['customer_customer/addAgentCustomer'],
    };
})
class CreateTrails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            repeatTableVisible: false,
            repeatData: [],
        };
    }

    customSubmit = (values) => {
        const { formData } = this.state;
        const temp = _.assign({}, formData, values);
        const holdData = _.cloneDeep(temp);
        const newData = {};
        if (temp.customerBusinesses) {
            newData.customerBusinesses = temp.customerBusinesses;
            delete temp.customerBusinesses;
        }
        if (temp.customerContacts) {
            newData.customerContacts = temp.customerContacts;
            delete temp.customerContacts;
        }
        if (temp.customerHeaders) {
            newData.customerHeaders = !Array.isArray(temp.customerHeaders)
                ? temp.customerHeaders
                : temp.customerHeaders.map((item) => {
                    return {
                        customerParticipantId: item.customerParticipantId,
                        customerParticipantName: item.customerParticipantName,
                    };
                });
            delete temp.customerHeaders;
        }
        newData.customer = temp;
        const newParam = {
            ...formData,
            ...holdData,
        };
        this.setState({
            formData: newParam,
        });
        this.props.dispatch({
            type: 'customer_customer/addCustomer',
            payload: {
                data: newData,
                cb: this.submitCallback,
            },
        });
    };

    agentCustomerSubmit = (values) => {
        const { formData } = this.state;
        const temp = _.assign({}, formData, values);
        const holdData = _.cloneDeep(temp);
        const newData = {};
        if (temp.customerBusinesses) {
            newData.customerBusinesses = temp.customerBusinesses;
            delete temp.customerBusinesses;
        }
        if (temp.customerContacts) {
            newData.customerContacts = temp.customerContacts;
            delete temp.customerContacts;
        }
        if (temp.customerHeaders) {
            newData.headers = !Array.isArray(temp.customerHeaders)
                ? temp.customerHeaders
                : temp.customerHeaders.map((item) => {
                    return {
                        customerParticipantId: item.customerParticipantId,
                        customerParticipantName: item.customerParticipantName,
                    };
                });
            delete temp.customerHeaders;
        }
        if (temp.customers) {
            newData.customers = [];
            temp.customers.map((item) => {
                const newItem = {};
                newItem.customerBusinesses = [item];
                newItem.customer = item;
                newData.customers.push(newItem);
            });
            delete temp.customers;
        }
        newData.agentCustomer = temp;
        const newParam = {
            ...formData,
            ...holdData,
        };
        this.setState({
            formData: newParam,
        });
        this.props.dispatch({
            type: 'customer_customer/addAgentCustomer',
            payload: {
                data: newData,
                cb: this.submitCallback,
            },
        });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        const temp = _.assign({}, formData, values);
        if (Number(temp.customerTypeId) === 0) {
            this.customSubmit(values);
        } else if (Number(temp.customerTypeId) === 1 || Number(temp.customerTypeId) === 2) {
            this.agentCustomerSubmit(values);
        } else {
            message.error('公司类型不存在');
        }
    };

    submitCallback = (result) => {
        if (result && result.success) {
            if (result.code === '201' && Array.isArray(result.data)) {
                // 客户联系人重复数据展示
                this.setState({ repeatData: result.data, repeatTableVisible: true });
            } else {
                this.handleCancel();
            }
        }
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    closeRepeatTable = () => {
        this.setState({ repeatTableVisible: false });
        this.handleCancel();
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

    render() {
        const { addCustomerBtnLoading, addAgentCustomerBtnLoading } = this.props;
        const { formData } = this.state;
        const cols = formatFormCols(
            formatCols({
                formData,
                changeSelfForm: this.changeSelfForm,
            }),
        );
        return (
            <>
                <FormView
                    wrappedComponentRef={(dom) => {
                        this.formView = dom;
                    }}
                    cols={cols}
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    formData={formData}
                    btnWrapStyle={{
                        marginTop: '20px',
                    }}
                    loading={addCustomerBtnLoading || addAgentCustomerBtnLoading}
                />
                {/* 重复数据展示 */}
                <RepeatPeopleTable
                    visible={this.state.repeatTableVisible}
                    repeatData={this.state.repeatData}
                    onCancel={this.closeRepeatTable}
                />
            </>
        );
    }
}

export default CreateTrails;
