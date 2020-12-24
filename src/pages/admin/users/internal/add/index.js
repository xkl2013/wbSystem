import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import moment from 'moment';
import { birth2age } from '@/utils/utils';
import { getCompanyDetail } from '@/services/globalDetailApi';
import _ from 'lodash';
import { formatCols } from '../constants';
import { travelList } from '../services';

@connect(({ internal_user, loading }) => {
    return {
        internal_user,
        addBtnLoading: loading.effects['internal_user/addUser'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                userRoleList: [{ roleId: 31, roleName: '普通成员' }],
            },
            TRAVEL_STANDARDS: [],
            bank_parentId: -1,
            employeeCompanyCodeShort: '',
        };
    }

    componentDidMount() {
        this.getTravelList();
    }

    getTravelList = async () => {
        const response = await travelList({ parentId: 453 });
        if (response && response.success) {
            if (response.data) {
                const { list = [] } = response.data;
                list.forEach((item) => {
                    item.id = item.index;
                    item.name = item.value;
                });
                this.setState({ TRAVEL_STANDARDS: list });
            }
        }
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        // ---------------int类----------------------
        // 性别int
        if (values.userGender != null) {
            values.userGender = parseInt(values.userGender, 0);
        }
        // 血型int
        if (values.employeeBloodType != null) {
            values.employeeBloodType = parseInt(values.employeeBloodType, 0);
        }
        // 证件类型int
        if (values.employeeCredentialType) {
            values.employeeCredentialType = parseInt(values.employeeCredentialType, 0);
        }
        // 试用期限int
        if (values.employeeProbationaryPeriod) {
            values.employeeProbationaryPeriod = parseInt(values.employeeProbationaryPeriod, 0);
        }
        // 聘用期限int
        if (values.employeeEmployTerm) {
            values.employeeEmployTerm = parseInt(values.employeeEmployTerm, 0);
        }
        // TODO
        values.userType = 0; // 内部用户
        values.userStatus = '1'; // 启用用户
        // -------------------------date类----------------------------
        // 合同开始日期-合同结束日期 date
        if (values.employeeContractStart && values.employeeContractStart.length === 2) {
            values.employeeContractEnd = moment(values.employeeContractStart[1]).format('YYYY-MM-DD HH:mm:ss');
            values.employeeContractStart = moment(values.employeeContractStart[0]).format('YYYY-MM-DD HH:mm:ss');
        }
        // 生日date
        if (values.userBirth) {
            values.userBirth = moment(values.userBirth).format('YYYY-MM-DD HH:mm:ss');
        }
        // 入职日期date
        if (values.employeeEmploymentDate) {
            values.employeeEmploymentDate = moment(values.employeeEmploymentDate).format('YYYY-MM-DD HH:mm:ss');
        }
        // 转正日期date
        if (values.employeePromotionDate) {
            values.employeePromotionDate = moment(values.employeePromotionDate).format('YYYY-MM-DD HH:mm:ss');
        }
        // 首次参加工作日期date
        if (values.employeeWorkFirst) {
            values.employeeWorkFirst = moment(values.employeeWorkFirst).format('YYYY-MM-DD HH:mm:ss');
        }
        // ---------------------------string--------------------------
        // 户口性质string
        if (values.employeeHouseholdType) {
            values.employeeHouseholdType = values.employeeHouseholdType.toString();
        }
        // 证件号string
        if (values.employeeCredentialId) {
            values.employeeCredentialId = values.employeeCredentialId.toString();
        }
        // 婚姻情况string
        if (values.employeeMaritalStatus) {
            values.employeeMaritalStatus = values.employeeMaritalStatus.toString();
        }
        // 聘用形式string
        if (values.employeeEmploymentForm) {
            values.employeeEmploymentForm = values.employeeEmploymentForm.toString();
        }
        // 员工状态string
        if (values.employeeStatus) {
            values.employeeStatus = values.employeeStatus.toString();
        }
        // ---------------------------other-----------------------------
        // 员工所属部门ID int，名称string
        if (values.employeeDepartmentName) {
            values.userDepartmentId = values.employeeDepartmentName.value;
            values.employeeDepartmentName = values.employeeDepartmentName.label;
        }
        if (formData.employeeCompanyCodeShort) {
            values.employeeCompanyCodeShort = formData.employeeCompanyCodeShort;
        }
        const payload = {
            data: values,
            cb: this.handleCancel,
        };
        this.props.dispatch({
            type: 'internal_user/addUser',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    onChangeParams = async (changedValues, allValues) => {
        const key = Object.keys(changedValues)[0];
        const { employeeCompanyCodeShort } = this.state;
        switch (key) {
            case 'userBirth':
                return this.setState({
                    formData: { ...allValues, age: birth2age(moment(changedValues[key]).format('YYYY-MM-DD')) },
                });
            case 'employeeCompanyName':
                const response = await getCompanyDetail(changedValues[key].value);
                if (response && response.success && response.data) {
                    const companyCodeShort = response.data.company.companyCodeShort;
                    return this.setState({
                        formData: {
                            ...allValues,
                            employeeCompanyCodeShort: companyCodeShort,
                        },
                        employeeCompanyCodeShort: companyCodeShort,
                    });
                }
                break;
            case 'employeeBankName':
                return this.setState({
                    formData: {
                        ...allValues,
                        employeeBankAddress: undefined,
                    },
                    bank_parentId: changedValues[key] && changedValues[key].value ? changedValues[key].value : -1,
                });
            case 'employeeBankAddress':
                return this.setState({
                    formData: {
                        ...allValues,
                        employeeBankNo: changedValues[key].value,
                    },
                });
            default:
                this.setState({
                    formData: {
                        ...allValues,
                        employeeCompanyCodeShort,
                    },
                });
                break;
        }
    };

    render() {
        const { formData, TRAVEL_STANDARDS, bank_parentId } = this.state;
        const { addBtnLoading } = this.props;
        const cols = formatCols(false, _, TRAVEL_STANDARDS, bank_parentId);

        return (
            <FormView
                cols={cols}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                onChangeParams={this.onChangeParams}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                formData={formData}
                loading={addBtnLoading}
            />
        );
    }
}

export default CreateUser;
