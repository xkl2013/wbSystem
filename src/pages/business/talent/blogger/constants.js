/**
 * 新增/编辑form表单cols
 * */
import { BLOGGER_SIGN_STATE } from '@/utils/enum';
import { getUserList as getAllUsers } from '@/services/globalSearchApi';
import { columnsFn } from './_selfTable';
import { formatSelfCols } from './_selfForm';

export const formatCols = (obj) => {
    return [
        {
            title: '基本信息',
            columns: [
                [
                    {
                        label: '昵称',
                        key: 'bloggerNickName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入昵称',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '状态',
                        key: 'bloggerSignState',
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
                            // eslint-disable-next-line
                            form.bloggerSignState = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '分组',
                        key: 'bloggerGroupId',
                        type: 'select',
                        placeholder: '请选择',
                        options: obj.dictionariesList,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择分组',
                                },
                            ],
                        },
                    },
                    {
                        label: '备注',
                        key: 'bloggerDescription',
                        type: 'textarea',
                        checkOption: {
                            rules: [
                                {
                                    max: 140,
                                    message: '至多输入140个字',
                                },
                            ],
                        },
                        componentAttr: {
                            rows: 3,
                            placeholder: '请输入',
                        },
                    },
                ],
            ],
        },
        {
            title: '帐号信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'bloggerAccountList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: columnsFn,
                            formCols: formatSelfCols,
                            initForm: obj.initForm,
                            formKey: 'bloggerAccountList',
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
                        label: '制作人',
                        key: 'bloggerMakerId',
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
                                    bloggerParticipantId: item.value,
                                    bloggerParticipantName:
                                        (item.label.props && item.label.props.children) || item.label,
                                    bloggerParticipantType: 3,
                                });
                            });
                            // eslint-disable-next-line
                            form.bloggerMakerId = arr;
                            return form;
                        },
                        setFormat: (value) => {
                            const arr = [];
                            // eslint-disable-next-line
                            value &&
                                value.map((item) => {
                                    if (item.bloggerParticipantId) {
                                        arr.push({
                                            label: item.bloggerParticipantName,
                                            value: item.bloggerParticipantId,
                                        });
                                    } else {
                                        arr.push(item);
                                    }
                                });
                            return arr;
                        },
                    },
                    {
                        label: '新媒体运营',
                        key: 'bloggerMediaId',
                        placeholder: '请搜索新媒体运营',
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
                                    bloggerParticipantId: item.value,
                                    bloggerParticipantName:
                                        (item.label.props && item.label.props.children) || item.label,
                                    bloggerParticipantType: 13,
                                });
                            });
                            // eslint-disable-next-line
                            form.bloggerMediaId = arr;
                            return form;
                        },
                        setFormat: (value) => {
                            const arr = [];
                            // eslint-disable-next-line
                            value &&
                                value.map((item) => {
                                    if (item.bloggerParticipantId) {
                                        arr.push({
                                            label: item.bloggerParticipantName,
                                            value: item.bloggerParticipantId,
                                        });
                                    } else {
                                        arr.push(item);
                                    }
                                });
                            return arr;
                        },
                    },
                    {},
                ],
            ],
        },
        {
            title: '博主推荐BP',
            fixed: true,
            columns: [
                [
                    {
                        key: 'bloggerAttachmentList',
                        placeholder: '请上传',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加附件',
                            // onChangeFile: value => uploadChange(value, obj),
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
