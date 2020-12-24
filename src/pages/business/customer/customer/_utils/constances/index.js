/**
 *@author   zhangwenshuai
 *@date     2019-08-07 20:46
 * */
/* eslint-disable */
import { THREAD_LEVEL, CUSTOM_COMPANY_TYPE, COMPANY_PROERTY, COMPANY_MODE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import { getUserDetail } from '@/services/globalDetailApi';
import { mobileReg } from '@/utils/reg';
import storage from '@/utils/storage';
import { getPublicCompanyList } from '@/services/globalSearchApi';
import { getIndustryList } from '../../services';
import { EditTableCoumn as brandCols } from './_brandCols';
import { EditTableCoumn as contactCols } from './_contactCols';
import { EditTableCoumn as headerCols } from './_headerCols';
import { EditTableCoumn as zhikeCols } from './_zhikeCols';
import TextSelect from '../../../../../../components/dataEntry/textSelect';
import s from './index.less';

let customerIndustryList = [];
// 主营行业为娱乐时，将本人添加为负责人
async function setHeader(obj) {
    const self = storage.getUserInfo();
    const response = await getUserDetail(self.userId);
    if (response && response.success && response.data) {
        const user = response.data.user || {};
        const department = response.data.department || {};
        const customerHeaders = obj.customerHeaders || [];
        const index = customerHeaders.findIndex((item) => {
            return item.customerParticipantId === self.userId;
        });
        if (index === -1) {
            customerHeaders.push({
                customerParticipantId: user.userId,
                customerParticipantName: user.userChsName,
                customerParticipantDepartment: department.departmentName,
            });
        }
        obj.changeSelfForm({ customerHeaders });
    }
}
// 公司类型修改时，同步state数据，方便后续判断
function changeTypeId(obj, value) {
    obj.changeSelfForm(
        {
            customerTypeId: value,
        },
        'customerTypeId',
    );
}

// 主营行业修改为娱乐时，添加负责人
function changeIndustryId(obj, value) {
    obj.changeSelfForm({
        customerIndustryId: Number(value.value),
        customerIndustryName: value.label,
    });
    if (Number(value.value) === 19) {
        setHeader(obj);
    }
}

// 公司性质为平台、制作公司时，主营行业置为娱乐，不可编辑
function changePropId(obj, value) {
    if (value === '2' || value === '1') {
        obj.changeSelfForm({
            customerPropId: value,
            customerIndustryId: 19,
            customerIndustryName: getOptionName(customerIndustryList, 19),
        });
        setHeader(obj);
    } else {
        obj.changeSelfForm({
            customerPropId: value,
            customerIndustryId: undefined,
            customerIndustryName: undefined,
        });
    }
}

export function formatCols(obj, type) {
    const { customerTypeId } = obj.formData;
    return [
        {
            title: '企业基本信息',
            columns: [
                [
                    {
                        label: '公司类型',
                        key: 'customerTypeId',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '公司类型不能为空',
                                },
                            ],
                        },
                        type: 'select',
                        options: CUSTOM_COMPANY_TYPE,
                        getFormat: (value, form) => {
                            form.customerTypeId = Number(value);
                            form.customerTypeName = getOptionName(CUSTOM_COMPANY_TYPE, value);
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                        componentAttr: {
                            onChange: changeTypeId.bind(this, obj),
                            disabled: type === 'edit',
                        },
                    },
                    {
                        label: '公司名称',
                        key: 'customerName',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公司名称',
                                },
                            ],
                        },
                        type: 'custom',
                        render: () => {
                            const componentAttr = {
                                request: (val) => {
                                    return getPublicCompanyList({
                                        companyName: val,
                                        pageSize: 50,
                                        pageNum: 1,
                                    });
                                },
                                fieldNames: { value: 'id', label: 'companyName' },
                                allowClear: true,
                            };
                            return <TextSelect {...componentAttr} />;
                        },
                        getFormat: (value = {}, form) => {
                            form.customerId = value.value;
                            form.customerName = value.label;
                            return form;
                        },
                        setFormat: (value = {}, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { label: form.customerName, value: form.customerId };
                        },
                    },
                    {
                        label: '公司性质',
                        key: 'customerPropId',
                        placeholder: '请选择',
                        type: 'select',
                        options: COMPANY_PROERTY,
                        getFormat: (value, form) => {
                            form.customerPropId = Number(value);
                            form.customerPropName = getOptionName(COMPANY_PROERTY, value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                        componentAttr: {
                            onChange: changePropId.bind(this, obj),
                        },
                    },
                ],
                [
                    {
                        label: '主营行业',
                        key: 'customerIndustryId',
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: async (val) => {
                                const response = await getIndustryList();
                                if (response && response.success && response.data) {
                                    customerIndustryList = response.data.map((item) => {
                                        item.name = item.desc;
                                        return item;
                                    });
                                    return {
                                        success: true,
                                        data: {
                                            list: response.data,
                                        },
                                    };
                                }
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'id', label: 'desc' },
                            disabled: obj && (obj.formData.customerPropId == 2 || obj.formData.customerPropId == 1),
                            onChange: changeIndustryId.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            form.customerIndustryId = Number(value.value);
                            form.customerIndustryName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.customerIndustryName,
                                value: form.customerIndustryId,
                            };
                        },
                    },
                    {
                        label: '公司级别',
                        key: 'customerGradeId',
                        placeholder: '请选择',
                        type: 'select',
                        options: THREAD_LEVEL,
                        getFormat: (value, form) => {
                            form.customerGradeId = Number(value);
                            form.customerGradeName = getOptionName(THREAD_LEVEL, value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '公司规模',
                        key: 'customerScaleId',
                        placeholder: '请选择',
                        type: 'select',
                        options: COMPANY_MODE,
                        getFormat: (value, form) => {
                            form.customerScaleId = Number(value);
                            form.customerScaleName = getOptionName(COMPANY_MODE, value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '所在地区',
                        key: 'customerProvinceId',
                        type: 'selectCity',
                        componentAttr: {
                            placeholder: '请选择',
                        },
                        getFormat: (value, form) => {
                            const l = value.label.split('/');
                            const v = value.value.split('/');
                            form.customerProvinceId = v[0];
                            form.customerProvinceName = l[0];
                            form.customerCityId = v[1];
                            form.customerCityName = l[1];
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.customerCityName
                                    ? `${form.customerProvinceName}/${form.customerCityName}`
                                    : form.customerProvinceName,
                                value: form.customerCityId
                                    ? `${form.customerProvinceId}/${form.customerCityId}`
                                    : form.customerProvinceId,
                            };
                        },
                    },
                    {
                        label: '详细地址',
                        key: 'customerAddress',
                        componentAttr: { maxLength: 20, placeholder: '请输入' },
                    },
                    {
                        label: '备注',
                        type: 'textarea',
                        key: 'customerRemark',
                        componentAttr: { maxLength: 140, placeholder: '请输入' },
                    },
                ],
            ],
        },
        (() => {
            if (Number(customerTypeId) === 1 || Number(customerTypeId) === 2) {
                return {
                    title: '直客信息',
                    fixed: true,
                    columns: [
                        [
                            {
                                key: 'customers',
                                labelCol: { span: 0 },
                                wrapperCol: { span: 24 },
                                type: 'formEditTable',
                                componentAttr: {
                                    btns: [
                                        {
                                            title: '新增',
                                            onClick: (table) => {
                                                return table.addTableLine();
                                            },
                                        },
                                    ],
                                    editable: true,
                                    cols: zhikeCols.bind(this, true),
                                    initForm: (record) => {
                                        record.customerTypeId = '0';
                                        record.customerTypeName = '直客';
                                        return record;
                                    },
                                },
                                checkOption: {
                                    rules: [
                                        {
                                            validator: (rule, value, callback) => {
                                                if (!value) {
                                                    return callback();
                                                }
                                                for (let i = 0; i < value.length; i++) {
                                                    if (!value[i].customerName) {
                                                        return callback(rule.message);
                                                    }
                                                }
                                                callback();
                                            },
                                            message: '直客信息不完整',
                                        },
                                    ],
                                },
                                className: s.tableCol,
                            },
                        ],
                    ],
                };
            }
            return {};
        })(),
        (() => {
            if (Number(customerTypeId) === 0 || Number(customerTypeId) === 2) {
                return {
                    title: '品牌信息',
                    fixed: true,
                    columns: [
                        [
                            {
                                key: 'customerBusinesses',
                                labelCol: { span: 0 },
                                wrapperCol: { span: 24 },
                                type: 'formEditTable',
                                checkOption: {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            validator: (rule, value, callback) => {
                                                if (!value) {
                                                    callback();
                                                    return;
                                                }
                                                const result = {};
                                                for (let i = 0; i < value.length; i++) {
                                                    if (!value[i].businessName || !value[i].customerIndustryName) {
                                                        return callback('品牌信息不完整');
                                                    }
                                                    if (value[i].businessName.length > 25) {
                                                        return callback('品牌名称不超过25个字');
                                                    }
                                                    const key = encodeURI(
                                                        `${value[i].businessName}_${value[i].customerIndustryName}`,
                                                    );
                                                    if (result[key]) {
                                                        return callback('品牌信息不能重复');
                                                    }
                                                    result[key] = true;
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                },
                                componentAttr: {
                                    btns: [
                                        {
                                            title: '新增',
                                            onClick: (table) => {
                                                return table.addTableLine();
                                            },
                                        },
                                    ],
                                    editable: true,
                                    cols: brandCols.bind(this, true),
                                    // initForm: (record) => {
                                    //     record.customerIndustryId = record.customerIndustryId || obj.formData.customerIndustryId;
                                    //     record.customerIndustryName = record.customerIndustryName || obj.formData.customerIndustryName;
                                    //     return record;
                                    // }
                                },
                                className: s.tableCol,
                            },
                        ],
                    ],
                };
            }
            return {};
        })(),
        {
            title: '联系人信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'customerContacts',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btns: [
                                {
                                    title: '新增',
                                    onClick: (table) => {
                                        return table.addTableLine();
                                    },
                                },
                            ],
                            editable: true,
                            cols: contactCols.bind(this, true),
                            initForm: (record) => {
                                record.sex = record.sex || '1';
                                return record;
                            },
                        },
                        type: 'formEditTable',
                        checkOption: {
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (!value) {
                                            callback();
                                            return;
                                        }
                                        const result = {};
                                        const weixinResult = {};
                                        for (let i = 0; i < value.length; i++) {
                                            if (
                                                !value[i].contactName ||
                                                (!value[i].decisioner && value[i].decisioner !== 0) ||
                                                (!value[i].mobilePhone &&
                                                    !value[i].otherNumber &&
                                                    !value[i].weixinNumber)
                                            ) {
                                                return callback('联系人信息不完整');
                                            }
                                            if (value[i].mobilePhone && !mobileReg.test(value[i].mobilePhone)) {
                                                return callback('手机号不正确');
                                            }
                                            const key = value[i].mobilePhone;
                                            const weixinKey = value[i].weixinNumber;
                                            if (key) {
                                                if (result[key]) {
                                                    return callback('手机号不能重复');
                                                }
                                                result[key] = true;
                                            }
                                            // 判断微信号不可重复
                                            if (weixinKey) {
                                                if (weixinResult[weixinKey]) {
                                                    return callback('微信号不能重复');
                                                }
                                                weixinResult[weixinKey] = true;
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        className: s.tableCol,
                    },
                ],
            ],
        },
        {
            title: '负责人信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'customerHeaders',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btns: [
                                {
                                    title: '新增',
                                    onClick: (table) => {
                                        return table.addTableLine();
                                    },
                                },
                            ],
                            editable: true,
                            cols: headerCols.bind(this, true),
                        },
                        type: 'formEditTable',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '负责人不能为空',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const result = {};
                                        for (let i = 0; i < value.length; i++) {
                                            if (!value[i].customerParticipantId) {
                                                return callback('负责人信息不完整');
                                            }
                                            const key = value[i].customerParticipantId;
                                            if (result[key]) {
                                                return callback('负责人不能重复');
                                            }
                                            result[key] = true;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        className: s.tableCol,
                    },
                ],
            ],
        },
        // {
        //     title: '负责人信息',
        //     columns: [
        //         [
        //             {
        //                 key: 'customerChargerId', placeholder: '请搜索负责人', label: '负责人',
        //                 checkOption: {
        //                     rules: [{
        //                         required: true,
        //                         message: '负责人不能为空'
        //                     }]
        //                 },
        //                 type: 'associationSearch',
        //                 componentAttr: {
        //                     request: (val) => getUserList({userChsName: val, "pageSize": 50, "pageNum": 1}),
        //                     fieldNames: {value: `userId`, label: 'userChsName'},
        //                     allowClear: true,
        //                     onChange: changeUser.bind(this, obj),
        //                 },
        //                 getFormat: (value, form) => {
        //                     form.customerChargerId = value.value;
        //                     form.customerChargerName = value.label;
        //                     return form;
        //                 },
        //                 setFormat: (value, form) => {
        //                     if (value.label || value.value || value.value === 0) {
        //                         return value;
        //                     }
        //                     return {label: form.customerChargerName, value: form.customerChargerId};
        //                 }
        //             },
        //             {
        //                 key: 'customerChargerDeptId', label: '负责人所属部门', placeholder: '负责人所属部门', disabled: true,
        //                 checkOption: {
        //                     rules: [{
        //                         required: true,
        //                         message: '负责人所属部门不能为空'
        //                     }]
        //                 },
        //                 type: 'orgtree',
        //                 getFormat: (value, form) => {
        //                     form.customerChargerDeptId = value.value;
        //                     form.customerChargerDeptName = value.label;
        //                     return form;
        //                 },
        //                 setFormat: (value, form) => {
        //                     if (value.label || value.value || value.value === 0) {
        //                         return value;
        //                     }
        //                     return {label: form.customerChargerDeptName, value: form.customerChargerDeptId};
        //                 }
        //             },
        //             {},
        //         ],
        //     ]
        // },
    ];
}

export default {
    formatCols,
};
/* eslint-enable */
