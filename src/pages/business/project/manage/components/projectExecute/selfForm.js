/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { DATETIME_FORMAT } from '@/utils/constants';

/* eslint-disable no-use-before-define */
// 改变艺人，清空表单
function changeTalent(obj, props, values) {
    const { projectAppointments } = obj.formData;
    if (projectAppointments) {
        // 增加履约义务同一艺人只能有一条的逻辑
        const index = projectAppointments.findIndex((item) => {
            return (
                Number(item.projectAppointmentTalentId) === Number(values.talentId)
                && Number(item.projectAppointmentTalentType) === Number(values.talentType)
            );
        });
        if (index > -1) {
            message.error('同一艺人/博主只能添加一条执行链接');
            props.changeCols(formatSelfCols.bind(this, obj), {});
            return;
        }
    }
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign(
            {},
            {
                projectAppointmentTalentId: values,
            },
        ),
    );
}

export const formatSelfCols = (obj, props) => {
    const { projectingTalentDivides } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'projectAppointmentTalentId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '目标艺人或博主不能为空',
                                },
                            ],
                        },
                        componentAttr: {
                            request: () => {
                                return {
                                    success: true,
                                    data: {
                                        list: projectingTalentDivides || [],
                                    },
                                };
                            },
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                            onChange: changeTalent.bind(this, obj, props),
                            disabled: props && props.state.formData.projectAppointmentId,
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectAppointmentTalentId = Number(value.value.split('_')[0]);
                            form.projectAppointmentTalentName = value.label;
                            form.projectAppointmentTalentType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (!value) return value;
                            if (value.value && value.label) {
                                return value;
                            }
                            return {
                                value: `${form.projectAppointmentTalentId}_${form.projectAppointmentTalentType}`,
                                label: form.projectAppointmentTalentName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '上线时间',
                        key: 'projectLiveTime',
                        type: 'datetime',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择上线时间',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.projectLiveTime = moment(value).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
                [
                    {
                        label: '执行链接',
                        key: 'projectExecuteUrl',
                        placeholder: '请输入',
                        type: 'textarea',
                        componentAttr: {
                            rows: 3,
                            maxLength: 500,
                            placeholder: '多个链接以英文逗号分隔',
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入执行链接',
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
    formatSelfCols,
};
