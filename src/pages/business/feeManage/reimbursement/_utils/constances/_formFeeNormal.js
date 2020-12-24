/* eslint-disable */
/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
/**
 * 新增/编辑公司银行帐号form
 * */
import _ from 'lodash';
import moment from 'moment';
import { REIMBURSE_INVOICE_TYPE, REIMBURSE_TAX_RATE, FEESCENE } from '@/utils/enum';
import { getCompanyList, getTalentList } from '@/services/globalSearchApi';
import { getProjectList } from '@/pages/business/feeManage/apply/services';
import { accAdd, accDiv, accMul, accSub } from '@/utils/calculate';
import { getCompanyDetail, getDepartmentDetail, getOutWork } from '@/services/globalDetailApi';
import { getFeeType } from '@/services/dictionary';
import { DATE_FORMAT } from '@/utils/constants';

// 更换项目
function changeProjectingName(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseProjectName: values,
            reimburseProjectCode: values.projectingCode,
            reimburseActorBlogerName: undefined,
        }),
    );
}

// 更换费用类型
function changeFeeType(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseFeeType: values,
        }),
    );
}

// 更换外勤记录
function changeOutOffice(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            outOfficeName: values,
        }),
    );
}

// 更换费用场景
function changeFeeScene(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseFeeScene: values,
        }),
    );
}

// 更换发票类型
function changeInvoiceType(obj, props, values) {
    const form = props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, formData, form, {
            reimburseInvoiceType: values,
            reimburseTaxRate: undefined,
            reimburseNoTaxFee: undefined,
            reimburseTax: undefined,
        }),
    );
}

// 检测发票类型
function checkInvoiceType(props) {
    if (!props) {
        return true;
    }
    const form = props.formView && props.formView.props.form.getFieldsValue();
    const { formData } = props.state;
    return formData.reimburseInvoiceType == 2 || (form && form.reimburseInvoiceType == 2);
}

// 更改申请报销金额
function changeFeeApply(obj, props, values) {
    const { formData } = props.state;
    let reimbursePayApply = values;
    if (obj.formData.reimburseSource == 2) {
        let total = obj.formData.reimburseFeePushDown;
        let flag = total > 0;
        const index = obj.formData.reimburseNormals.findIndex((item) => {
            return item.key == formData.key;
        });
        obj.formData.reimburseNormals.map((item, i) => {
            if (!item.index) {
                if (flag) {
                    total -= index === i ? values : item.reimburseFeeApply;
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                    if (index === i) {
                        reimbursePayApply = item.reimbursePayApply;
                    }
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
            }
            return item;
        });
        if (index === -1) {
            if (flag) {
                total -= values;
                if (total <= 0) {
                    flag = false;
                }
                reimbursePayApply = total >= 0 ? 0 : -total;
            } else {
                reimbursePayApply = values;
            }
        }
        let reimbursePayApplyPro = 0;
        obj.formData.reimburseProjects.map((item) => {
            if (!item.index) {
                if (flag) {
                    total -= item.reimburseFeeApply;
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
                reimbursePayApplyPro = accAdd(reimbursePayApplyPro, item.reimbursePayApply);
            }
            return item;
        });
        // 修改日常费用时，项目明细总计需单独更改
        if (obj.formData.reimburseProjects.length > 0) {
            obj.formData.reimburseProjects[
                obj.formData.reimburseProjects.length - 1
            ].reimbursePayApply = reimbursePayApplyPro;
        }
    }
    props.formView.props.form.setFieldsValue({
        reimburseFeeApply: values,
        reimbursePayApply,
        reimburseIncludeTaxFee: values,
    });
    changeNoTaxFeeByInclude(obj, props, values);
}

function changeIncludeTaxFee(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseTax;
    let reimburseNoTaxFee;
    if (value != undefined && form.reimburseTaxRate) {
        const rate = Number(form.reimburseTaxRate);
        reimburseTax = ((Number(value) * rate) / (1 + rate)).toFixed(2);
        reimburseNoTaxFee = (Number(value) - reimburseTax).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        // reimburseTax,
        reimburseNoTaxFee,
    });
}

function changeTaxRate(obj, props, e) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseTax;
    let reimburseNoTaxFee;
    if (e != undefined && form.reimburseIncludeTaxFee) {
        const rate = Number(e);
        reimburseTax = ((Number(form.reimburseIncludeTaxFee) * rate) / (1 + rate)).toFixed(2);
        reimburseNoTaxFee = (Number(form.reimburseIncludeTaxFee) - reimburseTax).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        // reimburseTax,
        reimburseNoTaxFee,
    });
}

async function changeInvoiceCompany(obj, props, value) {
    const response = await getCompanyDetail(value.value);
    if (response && response.success && response.data) {
        const { company } = response.data;
        props.changeSelfState({
            reimburseInvoiceCompanyName: value,
            reimburseInvoiceCompanyCode: company.companyCode,
        });
    }
}

function changeNoTaxFeeByTax(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseNoTaxFee;
    if (form.reimburseIncludeTaxFee) {
        reimburseNoTaxFee = Number(Number(form.reimburseIncludeTaxFee) - Number(value)).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        reimburseNoTaxFee,
    });
}

function changeNoTaxFeeByInclude(obj, props, value) {
    const form = props.formView.props.form.getFieldsValue();
    let reimburseNoTaxFee;
    if (form.reimburseTax) {
        reimburseNoTaxFee = Number(Number(value) - Number(form.reimburseTax)).toFixed(2);
    }
    props.formView.props.form.setFieldsValue({
        reimburseNoTaxFee,
    });
}

async function changeFeeTakerDep(obj, props, value) {
    const response = await getDepartmentDetail(value.value);
    if (response && response.success && response.data) {
        const { departmentCode } = response.data;
        props.changeSelfState({
            reimburseFeeTakerDeptId: value,
            reimburseFeeTakerDeptCode: departmentCode,
        });
    }
}

export const formatSelfCols = (obj, props) => {
    return [
        {
            columns: [
                [
                    {
                        label: '项目',
                        key: 'reimburseProjectName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择项目',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getProjectList({
                                    projectName: val,
                                    pageSize: 50,
                                    pageNum: 1,
                                    projectBaseType: 0,
                                });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'projectingId', label: 'projectingName' },
                            allowClear: true,
                            onChange: changeProjectingName.bind(this, obj, props),
                        },
                        getFormat: (value, form) => {
                            form.reimburseProjectId = value.value;
                            form.reimburseProjectName = value.label;
                            form.reimburseProjectType = 1;
                            form.reimburseProjectCode = props.state.formData.reimburseProjectCode;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { label: form.reimburseProjectName, value: form.reimburseProjectId };
                        },
                    },
                ],
                [
                    {
                        label: '艺人/博主',
                        key: 'reimburseActorBlogerName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择艺人/博主',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        componentAttr: {
                            request: (val) => {
                                return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.reimburseActorBlogerId = Number(value.value.split('_')[0]);
                            form.reimburseActorBlogerName = value.label;
                            form.reimburseActorBlogerType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: `${form.reimburseActorBlogerId}_${form.reimburseActorBlogerType}`,
                                label: form.reimburseActorBlogerName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '费用类型',
                        key: 'reimburseFeeType',
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
                            request: (val) => {
                                return getFeeType({ value: val });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'index', label: 'value' },
                            onChange: changeFeeType.bind(this, obj, props),
                        },
                        getFormat: (value, form) => {
                            if (
                                Number(value.value) !== 26 &&
                                Number(value.value) !== 30 &&
                                Number(value.value) !== 99 &&
                                Number(value.value) !== 108 &&
                                Number(value.value) !== 73
                            ) {
                                form.reimburseFeeActualTime = null;
                            }
                            if (Number(value.value) !== 18) {
                                form.reimburseFeeScene = null;
                                form.outOfficeName = null;
                                form.outOfficeId = null;
                            }
                            form.reimburseFeeType = value.value;
                            form.reimburseFeeTypeName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value,
                                label: form.reimburseFeeTypeName || undefined,
                            };
                        },
                    },
                ],
                [
                    (() => {
                        const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                        if (
                            feeActualTimeStatus &&
                            (feeActualTimeStatus === 18 ||
                                feeActualTimeStatus.key === 18 ||
                                feeActualTimeStatus.value === 18)
                        ) {
                            return {
                                label: '费用场景',
                                key: 'reimburseFeeScene',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择费用场景',
                                        },
                                    ],
                                },
                                placeholder: '请选择费用场景',
                                type: 'select',
                                options: FEESCENE,
                                componentAttr: {
                                    onChange: changeFeeScene.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    if (Number(value) === 1) {
                                        form.outOfficeName = null;
                                        form.outOfficeId = null;
                                    }
                                    form.reimburseFeeScene = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    (() => {
                        const { reimburseFeeScene } = props.state.formData;
                        const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                        if (
                            feeActualTimeStatus &&
                            (feeActualTimeStatus === 18 ||
                                feeActualTimeStatus.key === 18 ||
                                feeActualTimeStatus.value === 18) &&
                            Number(reimburseFeeScene) === 2
                        ) {
                            return {
                                label: '外勤记录',
                                key: 'outOfficeName',
                                // checkOption: {
                                //     rules: [
                                //         {
                                //             required: true,
                                //             message: '请选择外勤记录',
                                //         },
                                //     ],
                                // },
                                placeholder: '请选择外勤记录',
                                type: 'associationSearch',
                                options: [],
                                componentAttr: {
                                    request: (val) => {
                                        return getOutWork({ value: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'id', label: 'name' },
                                    onChange: changeOutOffice.bind(this, obj, props),
                                },
                                getFormat: (value, form) => {
                                    form.outOfficeName = value.label;
                                    form.outOfficeId = value.value;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        value: form.outOfficeId,
                                        label: form.outOfficeName,
                                    };
                                },
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    (() => {
                        const feeActualTimeStatus = props.state.formData.reimburseFeeType;
                        if (
                            feeActualTimeStatus &&
                            (feeActualTimeStatus === 26 ||
                                feeActualTimeStatus === 30 ||
                                feeActualTimeStatus === 99 ||
                                feeActualTimeStatus === 108 ||
                                feeActualTimeStatus === 73 ||
                                feeActualTimeStatus.key === 26 ||
                                feeActualTimeStatus.key === 30 ||
                                feeActualTimeStatus.key === 99 ||
                                feeActualTimeStatus.key === 108 ||
                                feeActualTimeStatus.key === 73)
                        ) {
                            return {
                                label: '实际发生日期',
                                key: 'reimburseFeeActualTime',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择实际发生日期',
                                        },
                                    ],
                                },
                                placeholder: '请选择实际发生日期',
                                type: 'date',
                                getFormat: (value, form) => {
                                    form.reimburseFeeActualTime = moment(value).format(DATE_FORMAT);
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    return moment(value);
                                },
                            };
                        }
                        return [];
                    })(),
                ],
                [
                    {
                        label: '申请报销金额',
                        key: 'reimburseFeeApply',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入申请报销金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 99999999,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                            onChange: changeFeeApply.bind(this, obj, props),
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '申请付款金额',
                        key: 'reimbursePayApply',
                        disabled: true,
                        componentAttr: {
                            precision: 2,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '费用承担部门',
                        key: 'reimburseFeeTakerDeptId',
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
                            form.reimburseFeeTakerDeptId = value.value;
                            form.reimburseFeeTakerDeptName = value.label;
                            form.reimburseFeeTakerDeptCode = props.state.formData.reimburseFeeTakerDeptCode;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.reimburseFeeTakerDeptName,
                                value: form.reimburseFeeTakerDeptId,
                            };
                        },
                    },
                ],
                [
                    // {
                    //   label: '发票主体', key: 'reimburseInvoiceCompanyName', checkOption: {
                    //     rules: [{
                    //       required: true,
                    //       message: '请选择发票主体'
                    //     }]
                    //   },
                    //   placeholder: '请选择', type: 'associationSearch',
                    //   componentAttr: {
                    //     allowClear: true,
                    //     request: (val) => {
                    //       return getCompanyList({pageNum: 1, pageSize: 50, companyName: val})
                    //     },
                    //     fieldNames: {value: 'companyId', label: 'companyName'},
                    //     onChange: changeInvoiceCompany.bind(this, obj, props)
                    //   },
                    //   getFormat: (value, form) => {
                    //     form.reimburseInvoiceCompanyId = value.value;
                    //     form.reimburseInvoiceCompanyName = value.label;
                    //     form.reimburseInvoiceCompanyCode = props.state.formData.reimburseInvoiceCompanyCode;
                    //     return form;
                    //   },
                    //   setFormat: (value, form) => {
                    //     if (value.label || value.value || value.value === 0) {
                    //       return value;
                    //     }
                    //     return {label: form.reimburseInvoiceCompanyName, value: form.reimburseInvoiceCompanyId};
                    //   }
                    // },
                ],
                [
                    {
                        label: '发票类型',
                        key: 'reimburseInvoiceType',
                        checkOption: {
                            initialValue: '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择发票类型',
                                },
                            ],
                        },
                        options: REIMBURSE_INVOICE_TYPE,
                        placeholder: '请选择',
                        type: 'select',
                        getFormat: (value, form) => {
                            form.reimburseInvoiceType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                        componentAttr: {
                            onChange: changeInvoiceType.bind(this, obj, props),
                        },
                    },
                ],
                [
                    {
                        label: '含税金额',
                        key: 'reimburseIncludeTaxFee',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入含税金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 99999999,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                            // onChange: changeIncludeTaxFee.bind(this, obj, props),
                            onChange: changeNoTaxFeeByInclude.bind(this, obj, props),
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '税率',
                        key: 'reimburseTaxRate',
                        placeholder: '请选择',
                        checkOption: {
                            initialValue: '0.06',
                            rules: [
                                {
                                    required: !checkInvoiceType(props),
                                    message: '请选择税率',
                                },
                            ],
                        },
                        type: 'select',
                        options: REIMBURSE_TAX_RATE,
                        disabled: checkInvoiceType(props),
                        // componentAttr: {
                        //     onChange: changeTaxRate.bind(this, obj, props),
                        // },
                        getFormat: (value, form) => {
                            form.reimburseTaxRate = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '未税金额',
                        key: 'reimburseNoTaxFee',
                        checkOption: {
                            // rules: [{
                            //   required: true,
                            //   message: '请输入未税金额'
                            // }]
                        },
                        disabled: true,
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
                        label: '税额',
                        key: 'reimburseTax',
                        checkOption: {
                            rules: [
                                {
                                    required: !checkInvoiceType(props),
                                    message: '请输入税额',
                                },
                            ],
                        },
                        disabled: checkInvoiceType(props),
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 99999999,
                            onChange: changeNoTaxFeeByTax.bind(this, obj, props),
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
                        key: 'reimburseFeeRemark',
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
};

export default {
    formatSelfCols,
};
