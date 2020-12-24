import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import moment from 'moment';
import _ from 'lodash';
import { birth2age } from '@/utils/utils';
import { getCompanyDetail } from '@/services/globalDetailApi';
import { formatCols } from '../constants';
import { travelList } from '../services';

@connect(({ internal_user }) => {
    return {
        formData: internal_user.formData,
    };
})
class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData,
            TRAVEL_STANDARDS: [],
            bank_parentId: props.formData.employeeBankId || -1,
        };
    }

    componentDidMount() {
        this.getData();
        this.getTravelList();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.formData) !== JSON.stringify(nextProps.formData)) {
            this.setState({
                formData: nextProps.formData,
                bank_parentId: nextProps.formData.employeeBankId,
            });
        }
    }

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'internal_user/getUserDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

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
        const { query } = this.props.location;
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
        if (values.employeeCredentialType != null) {
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
        // -------------------------date类----------------------------
        // 合同开始日期-合同结束日期 date
        if (values.employeeContractStart && values.employeeContractStart.length === 2) {
            values.employeeContractEnd = moment(values.employeeContractStart[1]).format('YYYY-MM-DD HH:mm:ss');
            values.employeeContractStart = moment(values.employeeContractStart[0]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            delete values.employeeContractStart;
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
        // 证件号码string
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
            id: query && query.id,
            data: values,
            cb: this.handleCancel,
        };
        this.props.dispatch({
            type: 'internal_user/editUser',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    onChangeParams = async (changedValues, allValues) => {
        const key = Object.keys(changedValues)[0];
        switch (key) {
            case 'userBirth':
                this.setState({
                    formData: { ...allValues, age: birth2age(moment(changedValues[key]).format('YYYY-MM-DD')) },
                });
                break;
            case 'employeeCompanyName':
                const response = await getCompanyDetail(changedValues[key].value);
                if (response && response.success && response.data) {
                    const companyCodeShort = response.data.company.companyCodeShort;
                    this.setState({
                        formData: {
                            ...allValues,
                            employeeCompanyCodeShort: companyCodeShort,
                        },
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
                break;
        }
    };

    render() {
        const { formData, TRAVEL_STANDARDS, bank_parentId } = this.state;
        const { editBtnLoading, location } = this.props;
        const values = _.assign({}, formData);
        // ---------------int类----------------------
        // 性别int
        if (values.userGender != null) {
            values.userGender = values.userGender.toString();
        }
        // 血型int
        if (values.employeeBloodType != null) {
            values.employeeBloodType = values.employeeBloodType.toString();
        }
        // 证件类型int
        if (values.employeeCredentialType != null) {
            values.employeeCredentialType = values.employeeCredentialType.toString();
        }
        // 试用期限int
        if (values.employeeProbationaryPeriod != null) {
            values.employeeProbationaryPeriod = values.employeeProbationaryPeriod.toString();
        }
        // 聘用期限int
        if (values.employeeEmployTerm != null) {
            values.employeeEmployTerm = values.employeeEmployTerm.toString();
        }
        // -------------------------date类----------------------------
        // 合同开始日期-合同结束日期 date
        if (values.employeeContractStart && values.employeeContractEnd) {
            values.employeeContractStart = [moment(values.employeeContractStart), moment(values.employeeContractEnd)];
        }
        // 生日date
        if (values.userBirth) {
            values.userBirth = moment(values.userBirth);
            values.age = birth2age(moment(values.userBirth).format('YYYY-MM-DD'));
        }
        // 入职日期date
        if (values.employeeEmploymentDate) {
            values.employeeEmploymentDate = moment(values.employeeEmploymentDate);
        }
        // 转正日期date
        if (values.employeePromotionDate) {
            values.employeePromotionDate = moment(values.employeePromotionDate);
        }
        // 首次参加工作日期date
        if (values.employeeWorkFirst) {
            values.employeeWorkFirst = moment(values.employeeWorkFirst);
        }
        // -----------------------------other-------------------------
        // 员工所属部门ID int，名称string
        if (values.employeeDepartmentName && values.userDepartmentId) {
            values.employeeDepartmentName = { label: values.employeeDepartmentName, value: values.userDepartmentId };
        }
        // ---------------------------string--------------------------
        // 户口性质string
        if (values.employeeHouseholdType) {
            values.employeeHouseholdType = values.employeeHouseholdType.toString();
        }
        // 证件类型string
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
        const cols = formatCols(true, location.query.id, TRAVEL_STANDARDS, bank_parentId);
        return (
            <FormView
                cols={cols}
                formData={values}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                onChangeParams={this.onChangeParams}
                loading={editBtnLoading}
            />
        );
    }
}

export default EditUser;
