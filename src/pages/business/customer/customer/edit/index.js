import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { formatCols } from '../_utils/constances';
import RepeatPeopleTable from '../component/repeatPeopleTable';

@Watermark
@connect(({ customer_customer, loading }) => {
    return {
        customerDetailData: customer_customer.CustomerDetailData,
        editCustomerBtnLoading: loading.effects['customer_customer/updateCustomer'],
        editAgentCustomerBtnLoading: loading.effects['customer_customer/updateAgentCustomer'],
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

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.customerDetailData !== nextProps.customerDetailData) {
            this.handleFormData(nextProps.customerDetailData);
        }
    }

    getData = () => {
        // 获取详情
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'customer_customer/getCustomerDetailData',
            payload: {
                id: query && query.id,
            },
        });
    };

    handleFormData = (customerDetailData = this.props.customerDetailData) => {
        const customers = [];
        if (Array.isArray(customerDetailData.clientCustomers)) {
            customerDetailData.clientCustomers.map((item) => {
                customers.push({
                    ...item.customer,
                });
            });
        }
        this.setState({
            formData: {
                ...customerDetailData.currentCustomer,
                customers,
                customerContacts: customerDetailData.customerContacts,
                customerBusinesses: customerDetailData.customerBusinesses,
                customerHeaders: customerDetailData.customerHeaders,
            },
        });
    };

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
        if (temp.currentCustomer) {
            delete temp.currentCustomer;
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
            type: 'customer_customer/updateCustomer',
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
            type: 'customer_customer/updateAgentCustomer',
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

    closeRepeatTable = () => {
        this.setState({ repeatTableVisible: false });
        this.handleCancel();
    };

    handleCancel = () => {
        this.props.history.replace('/foreEnd/business/customer/customer');
    };

    // 表单修改自身数据
    changeSelfForm = (values, key) => {
        if (key === 'customerTypeId') {
            this.formView.props.form.resetFields();
        }
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        const newData = _.assign({}, formData, form, values);
        this.setState({
            formData: newData,
        });
    };

    render() {
        const { editCustomerBtnLoading, editAgentCustomerBtnLoading } = this.props;
        const { formData } = this.state;
        const cols = formatFormCols(
            formatCols(
                {
                    formData,
                    changeSelfForm: this.changeSelfForm,
                },
                'edit',
            ),
        );

        return (
            <>
                <FormView
                    wrappedComponentRef={(fv) => {
                        this.formView = fv;
                    }}
                    cols={cols}
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    formData={formData}
                    btnWrapStyle={{
                        marginTop: '20px',
                    }}
                    loading={editCustomerBtnLoading || editAgentCustomerBtnLoading}
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
