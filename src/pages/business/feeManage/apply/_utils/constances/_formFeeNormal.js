/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 **/
import { getTalentList, getCompanyList } from '@/services/globalSearchApi';
import { getCompanyDetail, getDepartmentDetail } from '@/services/globalDetailApi';
import { getProjectList } from '../../services';
import { getFeeType } from '@/services/dictionary';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';

async function changeProjectingName(obj, props, values) {
    props.changeSelfState({
        applicationProjectName: values,
        applicationProjectCode: values.projectingCode,
        applicationActorBlogerName: undefined,
    });
}

async function changeInvoiceCompany(obj, props, value) {
    let response = await getCompanyDetail(value.value);
    if (response && response.success && response.data) {
        const { company } = response.data;
        props.changeSelfState({
            applicationFeeTakerMainId: value,
            applicationFeeTakerMainCode: company.companyCode,
        });
    }
}

async function changeFeeTakerDep(obj, props, value) {
    let response = await getDepartmentDetail(value.value);
    if (response && response.success && response.data) {
        const { departmentCode } = response.data;
        props.changeSelfState({
            applicationFeeTakerDeptId: value,
            applicationFeeTakerDeptCode: departmentCode,
        });
    }
}

export const formatSelfCols = (obj, props) => [
    {
        columns: [
            [
                {
                    label: '项目',
                    key: 'applicationProjectName',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择项目名称',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    type: 'associationSearch',
                    componentAttr: {
                        request: val =>
                            getProjectList({
                                projectName: val,
                                pageSize: 50,
                                pageNum: 1,
                                projectBaseType: 0,
                            }),
                        fieldNames: { value: 'projectingId', label: 'projectingName' },
                        allowClear: true,
                        onChange: changeProjectingName.bind(this, obj, props),
                    },
                    getFormat: (value, form) => {
                        form.applicationProjectId = value.value;
                        form.applicationProjectName = value.label;
                        form.applicationProjectType = 1;
                        form.applicationProjectCode = props.state.formData.applicationProjectCode;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            label: form.applicationProjectName,
                            value: form.applicationProjectId,
                        };
                    },
                },
            ],
            [
                {
                    label: '艺人/博主',
                    key: 'applicationActorBlogerName',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择类型',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    componentAttr: {
                        request: val =>
                            getTalentList({ talentName: val, pageSize: 50, pageNum: 1 }),
                        fieldNames: {
                            value: val => `${val.talentId}_${val.talentType}`,
                            label: 'talentName',
                        },
                    },
                    type: 'associationSearch',
                    getFormat: (value, form) => {
                        form.applicationActorBlogerId = Number(value.value.split('_')[0]);
                        form.applicationActorBlogerName = value.label;
                        form.applicationActorBlogerType = Number(value.value.split('_')[1]);
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            value: `${form.applicationActorBlogerId}_${form.applicationActorBlogerType}`,
                            label: form.applicationActorBlogerName,
                        };
                    },
                },
            ],
            [
                {
                    label: '费用类型',
                    key: 'applicationFeeType',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择费用类型',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    type: 'associationSearch',
                    componentAttr: {
                        request: val => getFeeType({ value: val }),
                        fieldNames: { value: 'index', label: 'value' },
                    },
                    getFormat: (value, form) => {
                        form.applicationFeeType = value.value;
                        form.applicationFeeTypeName = value.label;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            value: value,
                            label: form.applicationFeeTypeName || undefined,
                        };
                    },
                },
            ],
            // [
            //   {
            //     label: '费用承担主体', key: 'applicationFeeTakerMainId', checkOption: {
            //       rules: [{
            //         required: true,
            //         message: '请选择费用承担主体'
            //       }]
            //     }, placeholder: '请选择',
            //     type: 'associationSearch',
            //     componentAttr: {
            //       allowClear: true,
            //       request: (val) => {
            //         return getCompanyList({pageNum: 1, pageSize: 50, companyName: val})
            //       },
            //       fieldNames: {value: 'companyId', label: 'companyName'},
            //       onChange: changeInvoiceCompany.bind(this, obj, props)
            //     },
            //     getFormat: (value, form) => {
            //       form.applicationFeeTakerMainId = value.value;
            //       form.applicationFeeTakerMainName = value.label;
            //       form.applicationFeeTakerMainCode = props.state.formData.applicationFeeTakerMainCode;
            //       return form;
            //     },
            //     setFormat: (value, form) => {
            //       if (value.label || value.value || value.value === 0) {
            //         return value;
            //       }
            //       return {label: form.applicationFeeTakerMainName, value: form.applicationFeeTakerMainId};
            //     }
            //   }
            // ],
            [
                {
                    label: '费用承担部门',
                    key: 'applicationFeeTakerDeptId',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请选择费用承担部门',
                            },
                        ],
                    },
                    placeholder: '请选择',
                    type: 'orgtree',
                    componentAttr: {
                        onChange: changeFeeTakerDep.bind(this, obj, props),
                    },
                    getFormat: (value, form) => {
                        form.applicationFeeTakerDeptId = value.value;
                        form.applicationFeeTakerDeptName = value.label;
                        form.applicationFeeTakerDeptCode =
                            props.state.formData.applicationFeeTakerDeptCode;
                        return form;
                    },
                    setFormat: (value, form) => {
                        if (value.label || value.value || value.value === 0) {
                            return value;
                        }
                        return {
                            label: form.applicationFeeTakerDeptName,
                            value: form.applicationFeeTakerDeptId,
                        };
                    },
                },
            ],
            [
                {
                    label: '申请金额',
                    key: 'applicationFeeApply',
                    checkOption: {
                        rules: [
                            {
                                required: true,
                                message: '请输入申请金额',
                            },
                        ],
                    },
                    componentAttr: {
                        precision: 2,
                        min: 0,
                        max: 99999999,
                        // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                    },
                    placeholder: '请输入',
                    type: 'inputNumber',
                },
            ],
            [
                {
                    label: '备注',
                    key: 'applicationFeeRemark',
                    checkOption: {
                        rules: [
                            // {
                            //     required: true,
                            //     message: '请输入备注',
                            // },
                            {
                                max: 140,
                                message: '至多输入140个字',
                            },
                        ],
                    },
                    type: 'textarea',
                    componentAttr: {
                        placeholder: '请输入',
                        rows: 3,
                    },
                },
            ],
        ],
    },
];

export default {
    formatSelfCols,
};
