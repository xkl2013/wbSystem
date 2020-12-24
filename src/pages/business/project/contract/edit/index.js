/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import { calcWeight } from '../services';
import { formatFormCols } from '@/utils/utils';
import { accMul } from '@/utils/calculate';
import Notice from '@/pages/business/components/noticers';
import { formaterNoticersData } from '../../_utils/formaterNoticerData';
import { Watermark } from '@/components/watermark';
import { initContract } from '@/pages/business/project/contract/utils/initOptions';
import { form4submit, detail2form } from '@/pages/business/project/contract/utils/transferData';

@Watermark
@connect(({ business_project_contract, loading }) => {
    return {
        business_project_contract,
        formData: business_project_contract.formData,
        editBtnLoading: loading.effects['business_project_contract/editContract'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData || {},
            platformData: [], // 下单平台
            cooperationProduct: [], // 合作产品
            cooperationIndustry: [], // 合作行业
            cooperationBrand: [], // 合作品牌
        };
    }

    componentDidMount() {
        this.getContractDetail();
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '重新发起合同',
            },
        });
        this.initData();
    }

    async componentWillReceiveProps(nextProps) {
        const { formData } = this.props;
        if (JSON.stringify(formData) !== JSON.stringify(nextProps.formData)) {
            const newData = await detail2form(nextProps.formData);
            this.setState({
                formData: newData,
            });
        }
    }

    initData = () => {
        initContract((data) => {
            this.setState(data);
        });
    };

    getContractDetail = () => {
        const { query } = this.props.location;
        if (query && (query.id || query.oldContractId)) {
            this.props.dispatch({
                type: 'business_project_contract/getContractDetail',
                payload: {
                    id: query.oldContractId || query.id,
                },
            });
        }
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        // 合并state跟form数据
        const mergeData = _.assign({}, formData, values);
        const newData = form4submit(mergeData);
        this.setState({
            formData: mergeData,
        });
        const { query } = this.props.location;
        if (!query) {
            return;
        }
        const { id, oldContractId, resubmitEnum } = query;
        if (oldContractId) {
            newData.oldContractId = oldContractId;
        }
        const payload = {
            data: newData,
            cb: this.handleCancel,
        };
        if (oldContractId) {
            if (Number(resubmitEnum) === 2) {
                this.props.dispatch({
                    type: 'business_project_contract/reCommit',
                    payload,
                });
                return;
            }
            this.props.dispatch({
                type: 'business_project_contract/reCommitByEdit',
                payload,
            });
            return;
        }
        if (id) {
            payload.id = id;
        }
        this.props.dispatch({
            type: 'business_project_contract/addContract',
            payload,
        });
    };

    handleCancel = () => {
        const { history } = this.props;
        if (history.length > 1) {
            history.goBack();
        } else {
            // 路由栈中只有一条时，返回列表页
            history.replace('/foreEnd/business/project/contract');
        }
    };
    // 修改父表单数据
    changeParentForm = async (key, value) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        const temp = {};
        temp[key] = value;
        const newData = _.assign({}, formData, form, temp);
        this.setState({
            formData: newData,
        });
    };

    // 表单修改自身数据
    changeSelfForm = (values, force = false) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let newData = {};
        if (force) {
            // 强制修改时直接用传过来的数据
            newData = values;
        } else {
            _.assign(newData, formData, form, values);
        }
        this.setState(
            {
                formData: newData,
            },
            () => {
                // this.onChangeParams(this.state.formData);
            },
        );
    };

    changeBudgets = (values) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        // 保留线索自带原始数据
        const newTemp = {};
        if (Array.isArray(form.contractBudgetList)) {
            const arr = [];
            values.projectBudgets &&
                values.projectBudgets.map((item) => {
                    const temp = form.contractBudgetList.find((one) => {
                        return one.talentId === item.talentId;
                    });
                    if (temp) {
                        arr.push(temp);
                    } else {
                        arr.push(item);
                    }
                });
            newTemp.contractBudgetList = arr;
        }
        const newData = _.assign({}, formData, form, newTemp);
        this.setState({
            formData: newData,
        });
    };

    onChangeParams = async (current, allValue) => {
        const allData = await formaterNoticersData({ formData: allValue });
        const currentValue = await formaterNoticersData({ formData: current });
        Notice.onPushAllData(currentValue.slice(), allData.slice());
    };

    render() {
        const { formData, platformData, cooperationProduct, cooperationIndustry, cooperationBrand } = this.state;
        const { editBtnLoading } = this.props;
        const newFormData = {
            ...formData,
            platformData,
            cooperationProduct,
            cooperationIndustry,
            cooperationBrand,
        };
        const cols = formatFormCols(
            formatCols({
                formData: newFormData,
                changeParentForm: this.changeParentForm,
                changeSelfForm: this.changeSelfForm,
                changeBudgets: this.changeBudgets,
                form: this.formView,
            }),
        );
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    return (this.formView = fv);
                }}
                cols={cols}
                formData={newFormData}
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

export default CreateUser;
