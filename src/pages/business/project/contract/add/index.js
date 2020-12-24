/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import { formatFormCols } from '@/utils/utils';
import { calcWeight, getAuthorizedContractDetail, getContractDetail } from '../services';
import { accMul } from '@/utils/calculate';
import BITable from '@/ant_components/BITable';
import Notice from '@/pages/business/components/noticers';
import { formaterNoticersData } from '../../_utils/formaterNoticerData';
import { initContract } from '../utils/initOptions';
import { form4submit, primaryDetail2childForm } from '../utils/transferData';
import project2contract from '@/pages/business/project/contract/components/project2contract/transfer';

const contractColums = [
    {
        title: '申请单编号',
        dataIndex: 'clauseApplyCode',
        align: 'center',
    },
    {
        title: '申请日期',
        dataIndex: 'clauseApplyTime',
        align: 'center',
    },
    {
        title: '项目',
        dataIndex: 'clauseProjectName',
        align: 'center',
    },
    {
        title: '艺人',
        dataIndex: 'clauseStarName',
        align: 'center',
    },
];

@connect(({ business_project_contract, loading }) => {
    return {
        business_project_contract,
        formData: business_project_contract.formData,
        addBtnLoading: loading.effects['business_project_contract/addContract'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                contractType: '1', // 默认值 业务合同
                contractCategory: '0', // 默认值 主合同
            },
            attArr: [],
            platformData: [], // 下单平台
            cooperationProduct: [], // 合作产品
            cooperationIndustry: [], // 合作行业
            cooperationBrand: [], // 合作品牌
        };
    }

    componentDidMount() {
        this.initData();
        this.changeHeader('新增合同');
        const { query } = this.props.location;
        if (query && query.id) {
            // 主合同创建子合同的情况
            this.getContractFromPrimary(query.id);
        }
        if (query && query.projectId) {
            if (query.authorizedId) {
                // 项目授权公司创建合同的情况
                this.getContractFromAuthorized({
                    projectId: query.projectId,
                    id: query.authorizedId,
                });
                return;
            }
            // 项目详情直接创建合同的情况
            this.getContractFromProject(query.projectId);
        }
    }
    // 项目详情直接创建合同的情况
    getContractFromProject = async (projectId) => {
        const formData = await project2contract(projectId, 0);
        this.setState({
            formData,
        });
        this.changeHeader('新增合同');
    };
    // 项目授权公司创建合同的情况
    getContractFromAuthorized = async (data) => {
        const response = await getAuthorizedContractDetail(data);
        if (response && response.success && response.data) {
            const formatData = await primaryDetail2childForm(response.data, data.id);
            this.setState({
                formData: formatData,
            });
            this.changeHeader('新增子合同');
        }
    };
    // 主合同创建子合同的情况
    getContractFromPrimary = async (id) => {
        const response = await getContractDetail(id);
        if (response && response.success && response.data) {
            const formatData = await primaryDetail2childForm(response.data);
            this.setState({
                formData: formatData,
            });
            this.changeHeader('新增子合同');
        }
    };
    // 修改标题
    changeHeader = (title) => {
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title,
            },
        });
    };

    initData = () => {
        initContract((data) => {
            this.setState(data);
        });
    };

    // 合同审核流程
    fnModalContract = () => {};

    // 合同审核流程表格
    formatContractTable = () => {
        return <BITable rowSelection={() => {}} columns={contractColums} dataSource={[]} pagination={false} bordered />;
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        // 合并state跟form数据
        const mergeData = _.assign({}, formData, values);
        const newData = form4submit(mergeData);
        const payload = {
            data: newData,
            cb: this.handleCancel,
        };
        this.setState({
            formData: mergeData,
        });
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
                        return one.talentId == item.talentId;
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
        const {
            formData,
            attArr,
            platformData,
            cooperationProduct,
            cooperationIndustry,
            cooperationBrand,
        } = this.state;
        const { addBtnLoading } = this.props;
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
                attArr,
            }),
        );
        return (
            <>
                <FormView
                    wrappedComponentRef={(fv) => {
                        return (this.formView = fv);
                    }}
                    cols={cols}
                    formData={newFormData}
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    attArr={attArr}
                    btnWrapStyle={{
                        marginTop: '20px',
                    }}
                    loading={addBtnLoading}
                />
            </>
        );
    }
}

export default CreateUser;
