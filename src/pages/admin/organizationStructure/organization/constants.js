import { getUserList } from '@/services/globalSearchApi';
import { DEPARTMENT_TYPE } from '@/utils/enum';

/**
 * 新增/编辑form表单cols
 * */

export const formatCols = (obj, editType) => {
    return [
        {
            columns: [
                [
                    {
                        label: '部门名称',
                        key: 'departmentName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '部门名称不能为空',
                                },
                                {
                                    max: 30,
                                    message: '至多输入30个字',
                                },
                            ],
                        },
                        placeholder: '请输入部门名称',
                        disabled:
                            (obj && obj.formData && obj.formData.departmentPid === 0)
                            || editType === '设置部门主管'
                            || false,
                    },
                ],
                [
                    {
                        label: '上级部门',
                        key: 'departmentPName',
                        placeholder: '上级部门',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '部门主管',
                        key: 'departmentHeaderId',
                        placeholder: '请输入部门主管',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getUserList({ userRealName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'userId', label: 'userRealName' },
                            allowClear: true,
                            disabled: editType === '编辑部门',
                            customName: (obj) => {
                                return `${obj.userRealName}${
                                    obj.userRealName !== obj.userChsName ? `(${obj.userChsName})` : ''
                                }`;
                            },
                        },
                        getFormat: (value, form) => {
                            form.departmentHeaderId = value.value;
                            // eslint-disable-next-line max-len
                            form.departmentHeaderName = (value.label.props && value.label.props.children) || value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label && value.value) {
                                return {
                                    label: (value.label.props && value.label.props.children) || value.label,
                                    value: value.value,
                                };
                            }
                            return { label: form.departmentHeaderName, value: form.departmentHeaderId };
                        },
                    },
                ],
                [
                    {
                        label: '部门属性',
                        key: 'departmentProperty',
                        placeholder: '请选择部门属性',
                        type: 'select',
                        options: DEPARTMENT_TYPE,
                        disabled: editType === '设置部门主管',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '部门属性不能为空',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.departmentProperty = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '备注',
                        key: 'departmentDesc',
                        placeholder: '备注内容',
                        type: 'textarea',
                        disabled: editType === '设置部门主管',
                        componentAttr: {
                            rows: 2,
                            placeholder: '备注内容',
                        },
                        checkOption: {
                            rules: [
                                {
                                    max: 20,
                                    message: '至多输入20个字',
                                },
                            ],
                        },
                    },
                ],
            ],
        },
    ];
};

export default {
    formatCols,
};
