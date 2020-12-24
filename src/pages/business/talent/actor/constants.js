/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/**
 * 新增/编辑form表单cols
 * */
import moment from 'moment';
import { SEX_TYPE, STAR_SOURCE, IS_OR_NOT, BLOGGER_SIGN_STATE } from '@/utils/enum';
import { mobileReg, emailReg } from '@/utils/reg';
import { getUserList as getAllUsers } from '@/services/globalSearchApi';
import storage from '@/utils/storage';
import { columnsFn } from './_selfTable';
import { formatSelfCols } from './_selfForm';

export const formatCols = (obj) => {
    const { userId } = storage.getUserInfo();
    return [
        {
            title: '基本信息',
            columns: [
                [
                    {
                        label: '姓名',
                        key: 'starName',
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
                        label: '性别',
                        key: 'starGender',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择性别',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'radio',
                        options: SEX_TYPE,
                        getFormat: (value, form) => {
                            form.starGender = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '出生日期',
                        key: 'starBirth',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择出生日期',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                        },
                        placeholder: '请选择',
                        type: 'date',
                        getFormat: (value, form) => {
                            form.starBirth = moment(value).format('YYYY-MM-DD 00:00:00');
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                    {
                        label: '来源',
                        key: 'starSource',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择来源',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: STAR_SOURCE,
                        getFormat: (value, form) => {
                            form.starSource = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '状态',
                        key: 'starSignState',
                        type: 'select',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择状态',
                                },
                            ],
                        },
                        options: BLOGGER_SIGN_STATE,
                        getFormat: (value, form) => {
                            form.starSignState = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    // {
                    //   label: '级别',
                    //   key: 'starLevel',
                    //   placeholder: '请选择',
                    //   type: 'select',
                    //   componentAttr: {
                    //     allowClear: true
                    //   },
                    //   options: STAR_LEVEL, getFormat: (value, form) => {
                    //     form.starLevel = Number(value);
                    //     return form;
                    //   }, setFormat: (value) => {
                    //     return String(value);
                    //   }
                    // },
                    {
                        label: '备注',
                        key: 'starDescription',
                        checkOption: {
                            rules: [
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
        {
            title: '联系方式',
            columns: [
                [
                    {
                        label: '手机号码',
                        key: 'starPhone',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入手机号码',
                                },
                                {
                                    pattern: mobileReg,
                                    message: '手机号码不正确',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '联系地址',
                        key: 'starAddress',
                        type: 'input',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入联系地址',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        getFormat: (value = {}, form) => {
                            return form;
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                    // {
                    //   label: '联系地址', key: 'starAddress',type:'selectCity', checkOption: {
                    //     rules: [{
                    //       required: true,
                    //       message: '请输入联系地址'
                    //     }]
                    //   },
                    //   placeholder: '请输入',
                    //   getFormat: (value={}, form) => {
                    //     form.starAddress=value.label;
                    //     form.starAddressId=value.value;
                    //     return form;
                    //   }, setFormat: (value) => {
                    //     return value;
                    //   }
                    // },
                ],
                [
                    {
                        label: '邮箱帐号',
                        key: 'starWorkMail',
                        checkOption: {
                            rules: [
                                {
                                    pattern: emailReg,
                                    message: '邮箱帐号不正确',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        type: 'email',
                    },
                    {
                        label: '微信号码',
                        key: 'starWechat',
                        checkOption: {
                            rules: [
                                {
                                    max: 20,
                                    message: '至多输入20个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
            ],
        },
        {
            title: '标签信息',
            columns: [
                [
                    {
                        label: '是否存在潜在风险',
                        key: 'starRisk',
                        placeholder: '请选择',
                        type: 'select',
                        componentAttr: {
                            onChange: obj.changeRisk,
                            allowClear: true,
                        },
                        options: IS_OR_NOT,
                        getFormat: (value, form) => {
                            form.starRisk = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    (() => {
                        // 动态改变潜在风险显隐（显示条件：{starRisk}=>{1}）
                        if (obj && obj.formData && obj.formData.starRisk === 1) {
                            return {
                                label: '潜在风险',
                                key: 'starRiskContent',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: '请输入潜在风险',
                                        },
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
                            };
                        }
                    })(),
                ],
            ],
        },
        {
            title: '帐号信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'starAccountList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: columnsFn,
                            formCols: formatSelfCols,
                            formKey: 'starAccountList',
                            addBtnText: '添加帐号',
                            editBtnText: '编辑帐号',
                            changeParentForm: obj.changeParentForm,
                        },
                    },
                ],
            ],
        },
        {
            title: '参与人信息',
            columns: [
                [
                    {
                        label: '经理人',
                        key: 'starManagerId',
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            mode: 'multiple',
                            request: (val) => {
                                return getAllUsers({ userChsName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'userId', label: 'userChsName' },
                        },
                        getFormat: (value, form) => {
                            const arr = [];
                            value.map((item) => {
                                arr.push({
                                    starParticipantId: item.value,
                                    starParticipantName: (item.label.props && item.label.props.children) || item.label,
                                    starParticipantType: 1,
                                });
                            });
                            form.starManagerId = arr;
                            return form;
                        },
                        setFormat: (value, form) => {
                            const arr = [];
                            value
                                && value.map((item) => {
                                    if (item.starParticipantId) {
                                        arr.push({ label: item.starParticipantName, value: item.starParticipantId });
                                    } else {
                                        arr.push(item);
                                    }
                                });
                            return arr;
                        },
                    },
                    {
                        label: '宣传人',
                        key: 'starDrumbeaterId',
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            mode: 'multiple',
                            request: (val) => {
                                return getAllUsers({ userChsName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'userId', label: 'userChsName' },
                        },
                        getFormat: (value, form) => {
                            const arr = [];
                            value.map((item) => {
                                arr.push({
                                    starParticipantId: item.value,
                                    starParticipantName: (item.label.props && item.label.props.children) || item.label,
                                    starParticipantType: 2,
                                });
                            });
                            form.starDrumbeaterId = arr;
                            return form;
                        },
                        setFormat: (value, form) => {
                            const arr = [];
                            value
                                && value.map((item) => {
                                    if (item.starParticipantId) {
                                        arr.push({ label: item.starParticipantName, value: item.starParticipantId });
                                    } else {
                                        arr.push(item);
                                    }
                                });
                            return arr;
                        },
                    },
                ],
            ],
        },
        Number(userId) === 165 && {
            title: '艺人头像',
            fixed: true,
            columns: [
                [
                    {
                        key: 'starAvatar',
                        placeholder: '请上传',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加图片',
                        },
                        getFormat: (value, form) => {
                            if (value && Array.isArray(value) && value[0]) {
                                form.starAvatar = value[0].url;
                            }
                            return form;
                        },
                    },
                ],
            ],
        },
        Number(userId) === 165 && {
            title: '艺人详情图片 ',
            fixed: true,
            columns: [
                [
                    {
                        key: 'starCover',
                        placeholder: '请上传',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加图片',
                        },
                        getFormat: (value, form) => {
                            if (value && Array.isArray(value) && value[0]) {
                                form.starCover = value[0].url;
                            }
                            return form;
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
