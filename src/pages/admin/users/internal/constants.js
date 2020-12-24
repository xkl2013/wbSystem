/**
 * 新增/编辑form表单cols
 * */
import {
    CREDENTIAL_TYPE,
    SEX_TYPE,
    RESIDENCS_TYPE,
    MARRY_STATUES,
    BLOOD_TYPE,
    STAFF_STATUS,
    EMPLOY_TYPE,
    CLIENT_STATUS,
    JOB_POSITION,
    NATION_TYPE,
} from '@/utils/enum';
import { mobileReg, emailReg, pureNumberReg, patrnReg } from '@/utils/reg';
import { getCompanyList as getInnerCompanyList, getRoleList } from '@/services/globalSearchApi';
import { checkNickName, travelList } from './services';

export const formatCols = (edit, userId, TRAVEL_STANDARDS, bank_parentId) => {
    return [
        {
            title: '个人信息',
            columns: [
                [
                    {
                        label: '姓名',
                        key: 'userRealName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入姓名',
                                },
                                {
                                    max: 10,
                                    message: '至多输入10个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '花名',
                        key: 'userChsName',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入花名',
                                },
                                {
                                    pattern: patrnReg,
                                    message: '只能输入中文英文和数字',
                                },
                                {
                                    max: 10,
                                    message: '至多输入10个字',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        const res = await checkNickName({ nickName: value, userId });
                                        if (res && res.data) {
                                            callback(rule.message);
                                        } else {
                                            callback();
                                        }
                                    },
                                    message: '此花名已被占用',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '性别',
                        key: 'userGender',
                        checkOption: {
                            initialValue: '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择性别',
                                },
                            ],
                        },
                        placeholder: '性别',
                        type: 'radio',
                        options: SEX_TYPE,
                    },
                ],
                [
                    {
                        label: '户籍所在地',
                        key: 'employeeDomicilePlace',
                        checkOption: {
                            rules: [
                                {
                                    whitespace: true,
                                    message: '请输入户籍所在地',
                                },
                                {
                                    max: 40,
                                    message: '至多输入40个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '户口性质',
                        key: 'employeeHouseholdType',
                        placeholder: '请选择',
                        type: 'select',
                        options: RESIDENCS_TYPE,
                    },
                    {
                        label: '证件类型',
                        key: 'employeeCredentialType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择证件类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CREDENTIAL_TYPE,
                    },
                ],
                [
                    {
                        label: '证件号',
                        key: 'employeeCredentialId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入证件号',
                                },
                                {
                                    max: 25,
                                    message: '至多输入25个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '出生日期',
                        key: 'userBirth',
                        placeholder: '请选择',
                        type: 'date',
                    },
                    {
                        label: '手机号',
                        key: 'userPhone',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入手机号',
                                },
                                {
                                    pattern: mobileReg,
                                    message: '手机号不正确',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        disabled: edit,
                    },
                ],
                [
                    {
                        label: '首次参加工作时间',
                        key: 'employeeWorkFirst',
                        // checkOption: {
                        //   rules: [{
                        //     required: true,
                        //     message: '请选择首次参加工作时间'
                        //   }]
                        // },
                        placeholder: '请选择',
                        type: 'date',
                    },
                    {
                        label: '现居住地址',
                        key: 'employeeCurrentAddress',
                        checkOption: {
                            rules: [
                                {
                                    whitespace: true,
                                    message: '请输入现居住地址',
                                },
                                {
                                    max: 40,
                                    message: '至多输入40个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '婚姻状况',
                        key: 'employeeMaritalStatus',
                        placeholder: '请选择',
                        type: 'select',
                        options: MARRY_STATUES,
                    },
                ],
                [
                    {
                        label: '年龄',
                        key: 'age',
                        disabled: true,
                    },
                    {
                        label: '血型',
                        key: 'employeeBloodType',
                        placeholder: '请选择',
                        type: 'select',
                        options: BLOOD_TYPE,
                    },
                    {
                        label: '民族',
                        key: 'employeeNation',
                        placeholder: '请输入',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                const arr = NATION_TYPE.filter((item) => {
                                    return item.name.indexOf(val) > -1;
                                });
                                return {
                                    success: true,
                                    data: {
                                        list: arr,
                                    },
                                };
                            },
                            fieldNames: { value: 'id', label: 'name' },
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.employeeNation = (value.label.props && value.label.props.children) || value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return {
                                    label: (value.label.props && value.label.props.children) || value.label,
                                    value: value.value,
                                };
                            }
                            return { label: form.employeeNation, value: 1 };
                        },
                    },
                ],
                [
                    {
                        label: '邮箱',
                        key: 'userEmail',
                        placeholder: '请输入',
                        checkOption: {
                            rules: [
                                {
                                    pattern: emailReg,
                                    message: '邮箱不正确',
                                },
                            ],
                        },
                    },
                    {
                        label: '角色',
                        key: 'userRoleList',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '角色不能为空',
                                },
                            ],
                        },
                        componentAttr: {
                            request: (val) => {
                                return getRoleList({ roleName: val });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'roleId', label: 'roleName' },
                            mode: 'multiple',
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            const arr = [];
                            value.map((item) => {
                                arr.push({ roleId: item.value, roleName: item.label });
                            });
                            form.userRoleList = arr;
                            return form;
                        },
                        setFormat: (value) => {
                            const arr = [];
                            if (!value) return value;
                            value.map((item) => {
                                arr.push({
                                    value: item.roleId ? item.roleId : item.value,
                                    label: item.roleName ? item.roleName : item.label,
                                });
                            });
                            return arr;
                        },
                    },
                    (() => {
                        if (edit) {
                            return {
                                label: '员工编码',
                                key: 'userCode',
                                disabled: true,
                            };
                        }
                        return {};
                    })(),
                ],
            ],
        },
        {
            title: '工资账号信息',
            columns: [
                [
                    {
                        label: '银行名称',
                        key: 'employeeBankName',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return travelList({ parentId: 4, pageNum: 1, pageSize: 100, value: val });
                            },
                            allowClear: true,
                            initDataType: 'onfocus',
                            fieldNames: { value: 'id', label: 'value' },
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.employeeBankId = value.value;
                            form.employeeBankName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return value;
                            }
                            return {
                                label: form.employeeBankName,
                                value: form.employeeBankId,
                            };
                        },
                        placeholder: '请选择',
                    },
                    {
                        label: '开户行',
                        key: 'employeeBankAddress',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return travelList({ parentId: bank_parentId, value: val });
                            },
                            initDataType: 'onfocus',
                            allowClear: true,
                            fieldNames: { value: 'code', label: 'value' },
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.employeeBankNo = value.value;
                            form.employeeBankAddress = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return value;
                            }
                            return {
                                label: form.employeeBankAddress,
                                value: form.employeeBankNo,
                            };
                        },
                        placeholder: '请选择',
                    },
                    {
                        label: '银行卡号',
                        key: 'employeeBankCard',
                        checkOption: {
                            rules: [
                                {
                                    max: 30,
                                    message: '至多输入30个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
                [
                    {
                        label: '联行行号',
                        key: 'employeeBankRelate',
                        checkOption: {
                            rules: [
                                {
                                    max: 30,
                                    message: '至多输入30个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {},
                    {},
                ],
            ],
        },
        {
            title: '岗位信息',
            columns: [
                [
                    {
                        label: '聘用形式',
                        key: 'employeeEmploymentForm',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '聘用形式',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: EMPLOY_TYPE,
                    },
                    {
                        label: '入职日期',
                        key: 'employeeEmploymentDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '入职日期',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'date',
                    },
                    {
                        label: '所属公司',
                        key: 'employeeCompanyName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择所属公司',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getInnerCompanyList({ pageNum: 1, pageSize: 100, companyName: val });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'companyId', label: 'companyName' },
                        },
                        getFormat: (value, formObj) => {
                            const form = { ...formObj };
                            form.employeeCompanyId = value.value;
                            form.employeeCompanyName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return value;
                            }
                            return {
                                label: form.employeeCompanyName,
                                value: form.employeeCompanyId,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '所属部门',
                        key: 'employeeDepartmentName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择所属部门',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'orgtree',
                    },
                    {
                        label: '岗位',
                        key: 'employeePosition',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入岗位',
                                },
                                {
                                    max: 20,
                                    message: '至多输入20个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '员工状态',
                        key: 'employeeStatus',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择员工状态',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: STAFF_STATUS,
                    },
                ],
                [
                    {
                        label: '转正日期',
                        key: 'employeePromotionDate',
                        placeholder: '请选择',
                        type: 'date',
                        disabled: edit,
                    },
                    {
                        label: '职级',
                        key: 'employeePositionLevel',
                        placeholder: '请选择',
                        type: 'select',
                        options: JOB_POSITION,
                    },
                    {
                        label: '合同有效期',
                        key: 'employeeContractStart',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择合同有效期',
                                },
                            ],
                        },
                        placeholder: ['合同开始日期', '合同结束日期'],
                        type: 'daterange',
                    },
                ],
                [
                    {
                        label: '试用期限',
                        key: 'employeeProbationaryPeriod',
                        placeholder: '请输入试用期限（月）',
                        checkOption: {
                            rules: [
                                {
                                    pattern: pureNumberReg,
                                    message: '请填入整数',
                                },
                            ],
                        },
                    },
                    {
                        label: '聘用期限',
                        key: 'employeeEmployTerm',
                        placeholder: '请输入聘用期限（年）',
                        checkOption: {
                            rules: [
                                {
                                    pattern: pureNumberReg,
                                    message: '请填入整数',
                                },
                            ],
                        },
                    },
                    {
                        label: '差旅标准',
                        key: 'userTravelLevel',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择差旅标准',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: TRAVEL_STANDARDS,
                    },
                    // {
                    //   label: '公司简码',
                    //   key: 'employeeCompanyCodeShort',
                    //   checkOption: {
                    //     rules: [{
                    //       required: true,
                    //       message: '请选择公司简码'
                    //     }]
                    //   },
                    //   placeholder: '请选择',
                    //   type: 'select',
                    //   options: COMPANY_SHORTCODE
                    // },
                ],
            ],
        },
        {
            title: '访问权限',
            columns: [
                [
                    {
                        key: 'authority',
                        label: '访问类别',
                        type: 'checkbox',
                        options: CLIENT_STATUS,
                    },
                    {},
                    {},
                ],
            ],
        },
    ];
};

export default {
    formatCols,
};
