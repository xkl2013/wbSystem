/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { Popover } from 'antd';
import NotifyNode from '@/components/notifyNode';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';
import icon from '@/assets/yiwen.png';
import { getStartsList, getBloggersList } from '../../services';
import styles from './styles.less';

const ONLINE_URL = [{ id: '1', name: '有链接' }, { id: '0', name: '无链接' }];

export const formatCols = (obj, params) => {
    console.log(obj.formData);

    // 外部项目无法编辑
    const disabledEdit = !!(obj.formData.origin && obj.formData.origin === 2);
    // 已关联投放成功不可编辑
    const disablePutStatus = !!(obj.formData.popularizeStatus && obj.formData.popularizeStatus !== 1);
    return [
        params.talentType === 0
            ? {
                title: '艺人姓名:',
                icon: 'iconziduan-xiala',
                columns: [
                    [
                        {
                            key: 'talentId',
                            type: 'associationSearch',
                            placeholder: '请选择',
                            disabled: disabledEdit,
                            componentAttr: {
                                request: (val) => {
                                    return getStartsList({ starName: val, over: true });
                                },
                                fieldNames: { value: 'starId', label: 'starName' },
                                allowClear: true,
                                placeholder: '请选择',
                            },
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择艺人',
                                    },
                                ],
                            },
                            getFormat: (value, form) => {
                                // eslint-disable-next-line
                                  form.talentId = value.value;
                                // eslint-disable-next-line no-param-reassign
                                form.talentName = value.label;
                                return form;
                            },
                            setFormat: (value, form) => {
                                if (value && value.value) {
                                    return {
                                        label: value.label,
                                        value: value.value,
                                    };
                                }
                                return {
                                    label: form.talentName,
                                    value: form.talentId,
                                };
                            },
                        },
                    ],
                ],
            }
            : {
                title: '博主姓名:',
                icon: 'iconziduan-xiala',
                columns: [
                    [
                        {
                            key: 'talentId',
                            type: 'associationSearch',
                            placeholder: '请选择',
                            disabled: disabledEdit,
                            componentAttr: {
                                request: (val) => {
                                    return getBloggersList({ bloggerName: val, over: true });
                                },
                                fieldNames: { value: 'bloggerId', label: 'bloggerNickName' },
                                allowClear: true,
                                placeholder: '请选择',
                            },
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择博主',
                                    },
                                ],
                            },
                            getFormat: (value, form) => {
                                // eslint-disable-next-line no-param-reassign
                                form.talentId = value.value;
                                // eslint-disable-next-line no-param-reassign
                                form.talentName = value.label;
                                return form;
                            },
                            setFormat: (value, form) => {
                                if (value && value.value) {
                                    return {
                                        label: value.label,
                                        value: value.value,
                                    };
                                }
                                return {
                                    label: form.talentName,
                                    value: form.talentId,
                                };
                            },
                        },
                    ],
                ],
            },
        {
            title: '项目时间:',
            icon: 'iconziduan-riqi',
            columns: [
                [
                    {
                        key: 'projectStartDate',
                        type: 'daterange',
                        placeholder: ['项目起始日期', '项目终止日期'],
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写项目时间',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (
                                            !value[0]
                                            || !value[1]
                                            || moment(value[0]).unix() > moment(value[1]).unix()
                                        ) {
                                            callback(rule.message);
                                        }
                                    },
                                    message: '请填写正确项目起始时间',
                                },
                            ],
                        },
                        componentAttr: {
                            format: DATE_FORMAT,
                        },
                        getFormat: (value, form) => {
                            // eslint-disable-next-line no-param-reassign
                            form.projectStartDate = moment(value[0]).format(DATETIME_FORMAT);
                            // eslint-disable-next-line no-param-reassign
                            form.projectEndDate = moment(value[1]).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return [value[0], value[1]];
                            }
                            return [moment(form.projectStartDate), moment(form.projectEndDate)];
                        },
                    },
                ],
            ],
        },
        {
            title: '当前所在地:',
            icon: 'iconziduan-duohangwenben',
            columns: [
                [
                    {
                        key: 'currentAddress',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入当前所在地',
                                },
                            ],
                        },
                        componentAttr: { maxLength: 20 },
                        placeholder: '请输入当前所在地',
                    },
                ],
            ],
        },
        {
            title: '项目类型:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'projectType',
                        type: 'select',
                        disabled: disabledEdit,
                        options: params.projectType,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择项目类型',
                                },
                            ],
                        },
                    },
                ],
            ],
        },
        {
            title: '负责人:',
            icon: 'iconziduan-ren',
            columns: [
                [
                    {
                        key: 'talentCalendarHeaderDTOList',
                        type: 'custom',
                        component: (
                            <NotifyNode
                                hideBtn={disabledEdit}
                                newItemBottom={{ lineHeight: '14px' }}
                                disabled={disabledEdit}
                                newContent={{ padding: 0 }}
                                data={params.renderNoticers(obj.formData.talentCalendarHeaderDTOList || [])}
                                isShowClear={!disabledEdit}
                                onChange={(val) => {
                                    return params.changeNotifyNode(val, 1);
                                }}
                            />
                        ),
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择负责人',
                                },
                            ],
                        },
                    },
                ],
            ],
        },
        {
            title: '参与人:',
            icon: 'iconziduan-ren',
            columns: [
                [
                    {
                        key: 'talentCalendarUserDTOList',
                        type: 'custom',
                        component: (
                            <NotifyNode
                                hideBtn={disabledEdit}
                                newItemBottom={{ lineHeight: '14px' }}
                                disabled={disabledEdit}
                                newContent={{ padding: 0 }}
                                data={params.renderNoticers(obj.formData.talentCalendarUserDTOList || [])}
                                isShowClear={!disabledEdit}
                                onChange={(val) => {
                                    return params.changeNotifyNode(val, 2);
                                }}
                            />
                        ),
                    },
                ],
            ],
        },
        {
            title: '项目说明:',
            icon: 'iconziduan-duohangwenben',
            columns: [
                [
                    {
                        key: 'projectRemark',
                        type: 'textarea',
                        disabled: disabledEdit,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写项目说明',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (!value) {
                                            setTimeout(() => {
                                                document.getElementById('gotop').scrollTop = 100000;
                                            }, 20);
                                        }
                                        if (value.length > 500) {
                                            callback(rule.message);
                                            return;
                                        }
                                        callback();
                                    },
                                    message: '最多输入500字',
                                },
                            ],
                        },
                        componentAttr: { maxLength: 500 },
                        placeholder: '请填写项目说明',
                    },
                ],
            ],
        },
        params.talentType === 1 && obj.isEdit
            ? {
                title: '履约义务:',
                icon: 'iconziduan-duohangwenben',
                columns: [
                    [
                        {
                            type: 'custom',
                            key: '333',
                            component: (
                                <div className={styles.itemIcon}>
                                    <span>{obj.formData.projectAppointmentName}</span>
                                    {obj.formData.projectAppointmentRemark && (
                                        <Popover content={obj.formData.projectAppointmentRemark}>
                                            <img src={icon} alt="" />
                                        </Popover>
                                    )}
                                </div>
                            ),
                        },
                    ],
                ],
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线日期(预计):',
                icon: 'iconziduan-riqi',
                columns: [
                    [
                        {
                            key: 'onlineDatePlan',
                            type: 'date',
                            placeholder: '上线日期(预计)',
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写上线日期(预计)',
                                    },
                                ],
                            },
                            componentAttr: {
                                format: DATE_FORMAT,
                            },
                            getFormat: (value, form) => {
                                // eslint-disable-next-line no-param-reassign
                                form.onlineDatePlan = moment(value).format(DATETIME_FORMAT);
                                return form;
                            },
                            setFormat: (value, form) => {
                                return moment(form.onlineDatePlan);
                            },
                        },
                    ],
                ],
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线日期(实际):',
                icon: 'iconziduan-riqi',
                columns: [
                    [
                        {
                            key: 'onlineDate',
                            type: 'date',
                            placeholder: '上线日期(实际)',
                            // checkOption: {
                            //     rules: [
                            //         {
                            //             required: disablePutStatus,
                            //             message: '请填写上线日期(实际)',
                            //         },
                            //     ],
                            // },
                            componentAttr: {
                                format: DATE_FORMAT,
                                onChange: params.onlineDateChange,
                            },
                            getFormat: (value, form) => {
                                // eslint-disable-next-line no-param-reassign
                                form.onlineDate = moment(value).format(DATETIME_FORMAT);
                                return form;
                            },
                            setFormat: (value, form) => {
                                return moment(form.onlineDate);
                            },
                        },
                    ],
                ],
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线链接:',
                icon: 'iconziduan-duohangwenben',
                columns: [
                    [
                        {
                            key: 'hasOnlineUrl',
                            type: 'select',
                            placeholder: '请选择有无上线链接',
                            checkOption: {
                                rules: [
                                    {
                                        required: obj.formData.onlineDate,
                                        message: '请选择有无上线链接',
                                    },
                                ],
                            },
                            componentAttr: {
                                onChange: params.onlineUrlTypeChange,
                            },
                            disabled: !obj.formData.onlineDate || disablePutStatus,
                            options: ONLINE_URL,
                            getFormat: (value, form) => {
                                if (Number(value) !== 1) {
                                    form.onlineUrl = '';
                                }
                                return form;
                            },
                            setFormat: (value) => {
                                return String(value);
                            },
                        },
                        obj.formData.onlineDate && Number(obj.formData.hasOnlineUrl) === 1
                            ? {
                                key: 'onlineUrl',
                                type: 'textarea',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写上线链接',
                                        },
                                    ],
                                },
                                disabled: disablePutStatus,
                                componentAttr: { maxLength: 1000 },
                                placeholder: '请填写上线链接',
                            }
                            : null,
                        obj.formData.onlineDate && Number(obj.formData.hasOnlineUrl) === 1
                            ? {
                                key: 'popularizeFlag',
                                type: 'checkbox',
                                options: [{ name: '是否投放', id: 1 }],
                                disabled: disablePutStatus,
                                getFormat: (value, form) => {
                                    form.popularizeFlag = (value && value[0]) || 0;
                                    return form;
                                },
                                setFormat: (value) => {
                                    if (Array.isArray(value)) {
                                        return value;
                                    }
                                    return [value];
                                },
                            }
                            : null,
                    ],
                ],
            }
            : {},
    ];
};
export default {
    formatCols,
};
