/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
/**
 * 新增/编辑公司银行帐号form
 * */
import { STAR_PLATFORM, BLOGGER_TYPE } from '@/utils/enum';

export const formatSelfCols = (formTable) => {
    return [
        {
            columns: [
                [
                    {
                        label: '帐号名称',
                        key: 'bloggerAccountName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入帐号名称',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                ],
                [
                    {
                        label: '平台',
                        key: 'bloggerAccountPlatform',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择平台',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: STAR_PLATFORM,
                        getFormat: (value, form) => {
                            form.bloggerAccountPlatform = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '平台账号ID',
                        key: 'bloggerAccountUuid',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入平台账号ID',
                                },
                                {
                                    validator(rule, value, callback) {
                                        if (formTable && formTable.formView) {
                                            const data = formTable.formView.props.form.getFieldsValue();
                                            if ([1, 2, 4, 5].includes(Number(data.bloggerAccountPlatform))) {
                                                if (!/^[0-9]*$/gi.test(value)) {
                                                    callback('该平台账号ID只能为数字');
                                                }
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        placeholder: '请输入平台账号ID',
                    },
                ],

                [
                    {
                        label: '类型',
                        key: 'bloggerAccountType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: BLOGGER_TYPE,
                        getFormat: (value, form) => {
                            form.bloggerAccountType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
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
