import { STAFF_STATUS, EMPLOY_TYPE, JOB_POSITION, RESIDENCS_TYPE, SEX_TYPE } from '@/utils/enum';
import selfStyle from './styles.less';
import { selectUsername } from '../services';

// 获取table列表头
export function searchsFn() {
    const columns = [
        [
            {
                key: 'userRealName',
                placeholder: '请输入名字',
                initValue: undefined,
                className: selfStyle.inputCol,
                type: 'associationSearch',
                componentAttr: {
                    request: (val) => {
                        return selectUsername({ pageNum: 1, pageSize: 100, userRealName: val });
                    },
                    initDataType: 'onfocus',
                    fieldNames: { value: 'userId', label: 'userRealName' },
                    // allowClear: true
                },
            },
            {
                key: 'userChsName',
                placeholder: '请输入花名',
                initValue: undefined,
                className: selfStyle.inputCol,
                type: 'associationSearch',
                componentAttr: {
                    request: (val) => {
                        return selectUsername({ pageNum: 1, pageSize: 100, userChsName: val });
                    },
                    initDataType: 'onfocus',
                    fieldNames: { value: 'userId', label: 'userChsName' },
                    // allowClear: true
                },
            },
            {
                key: 'employeePosition',
                initValue: undefined,
                placeholder: '请输入岗位',
                className: selfStyle.inputCol,
            },
        ],
        [
            {
                key: 'userDepartmentId',
                type: 'orgtree',
                initValue: undefined,
                placeholder: '请输入部门',
                className: selfStyle.inputCol,
            },
            {
                key: 'employeeContractStart',
                initValue: undefined,
                label: '合同开始日期',
                type: 'daterange',
                placeholder: ['合同开始日期', '合同开始日期'],
                className: selfStyle.searchCol,
            },
            {
                key: 'employeeContractEnd',
                initValue: undefined,
                label: '合同结束日期',
                type: 'daterange',
                placeholder: ['合同结束日期', '合同结束日期'],
                className: selfStyle.searchCol,
            },
        ],
        [
            {
                key: 'employeeEmploymentDate',
                initValue: undefined,
                label: '入职开始日期',
                type: 'daterange',
                placeholder: ['入职开始日期', '入职结束日期'],
                className: selfStyle.searchCol,
            },
            {
                key: 'employeeLeaveDate',
                initValue: undefined,
                label: '离职开始日期',
                type: 'daterange',
                placeholder: ['离职开始日期', '离职结束日期'],
                className: selfStyle.searchCol,
            },
            {},
        ],
        [
            {
                key: 'employeeStatusList',
                label: '员工状态',
                type: 'checkbox',
                placeholder: '员工状态',
                options: STAFF_STATUS,
            },
        ],
        [
            {
                key: 'employeeEmploymentFormList',
                label: '聘用形式',
                type: 'checkbox',
                placeholder: '聘用形式',
                options: EMPLOY_TYPE,
            },
        ],

        [
            {
                key: 'employeeHouseholdTypeList',
                label: '户口性质',
                type: 'checkbox',
                placeholder: '户口性质',
                options: RESIDENCS_TYPE,
            },
        ],
        [
            {
                key: 'employeePositionLevelList',
                label: '职别',
                type: 'checkbox',
                placeholder: '职别',
                options: JOB_POSITION,
            },
        ],
        [
            {
                key: 'userGenderList',
                label: '性别',
                type: 'checkbox',
                placeholder: '性别',
                options: SEX_TYPE,
            },
        ],
        [
            {
                key: 'ageRange',
                label: '年龄',
                placeholder: '请输入',
                type: 'numberRange',
            },
        ],
    ];
    return columns || [];
}
