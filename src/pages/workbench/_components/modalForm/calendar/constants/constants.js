/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { Checkbox } from 'antd';
import { SCHEDULE_REMINDER, SCHEDULE_PERMISSION, ALLOW_SCHEDULE } from '@/utils/enum';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import { SPECIAL_DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';
import s from './index.less';

export const formatCols = (obj, params) => {
    const { wholeDayFlag } = obj.formData;
    const format = wholeDayFlag ? DATE_FORMAT : SPECIAL_DATETIME_FORMAT;
    //  时间是否完整
    const daterangeIsFull = (obj.formData.daterange && obj.formData.daterange.length === 2) || false;
    return [
        {
            title: '日程内容:',
            icon: 'iconziduan-danhangwenben',
            columns: [
                [
                    {
                        key: 'scheduleName',
                        type: 'input',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写日程内容',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value.length > 300) {
                                            callback(rule.message);
                                        }
                                    },
                                    message: '最多输入300字',
                                },
                            ],
                        },
                        componentAttr: { maxLength: 300 },
                        placeholder: '请填写日程内容',
                    },
                ],
            ],
        },
        {
            title: '日程描述:',
            icon: 'iconziduan-duohangwenben',
            columns: [
                [
                    {
                        key: 'description',
                        type: 'textarea',
                        componentAttr: { maxLength: 1000 },
                        placeholder: '请填写日程描述',
                    },
                ],
            ],
        },
        {
            title: '所属日历:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'scheduleType',
                        type: 'select',
                        options: ALLOW_SCHEDULE,
                        componentAttr: { allowClear: false },
                    },
                ],
            ],
        },

        {
            title: '时间:',
            icon: 'iconziduan-riqi',
            columns: [
                [
                    {
                        key: 'daterange',
                        type: 'daterange',
                        placeholder: ['日程起始日期', '日程终止日期'],
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写日程时间',
                                },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (
                                            !value[0]
                                            || !value[1]
                                            || moment(value[0]).unix() > moment(value[1]).unix()
                                        ) {
                                            callback('请选择完整的日程时间');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            showTime: { format: 'HH:mm', minuteStep: 15 },
                            format,
                            onChange: params.changeDaterange,
                            onCalendarChange: params.changeDaterange,
                            renderExtraFooter: () => {
                                return (
                                    <Checkbox checked={wholeDayFlag} onChange={params.changeParentForm1}>
                                        全天
                                    </Checkbox>
                                );
                            },
                            dropdownClassName: wholeDayFlag ? s.wholeDayFlag : s.timeFlag,
                        },
                        getFormat: (value, _form) => {
                            const form = { ..._form };
                            form.beginTime = moment(value[0]).format(format);
                            form.endTime = moment(value[1]).format(format);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            if (form.beginTime && form.endTime) {
                                return [moment(form.beginTime), moment(form.endTime)];
                            }
                            return [];
                        },
                    },
                ],
            ],
        },
        {
            title: '创建人:',
            icon: 'iconziduan-ren',
            columns: [
                [
                    {
                        key: 'memberType0',
                        type: 'custom',
                        component: (
                            <NotifyNode
                                hideBtn={obj.formData.memberType0 && obj.formData.memberType0.length > 0}
                                newItemBottom={{ lineHeight: '14px' }}
                                newContent={{ padding: 0 }}
                                data={params.renderNoticers(obj.formData.memberType0 || [])}
                            />
                        ),
                        getFormat: (value, _form) => {
                            const form = { ..._form };
                            const newVal = value;
                            if (newVal) {
                                newVal.forEach((item, i) => {
                                    const newItem = { ...item };
                                    newItem.memberType = 0;
                                    // item.scheduleId=this.state.id;
                                    newItem.memberId = item.userId;
                                    newItem.memberName = item.userName;
                                    newVal[i] = newItem;
                                });
                            }
                            form.memberType0 = newVal;
                            return form;
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
                        key: 'memberType2',
                        type: 'custom',
                        component: (
                            <NotifyNode
                                newItemBottom={{ lineHeight: '14px' }}
                                newContent={{ padding: 0 }}
                                data={params.renderNoticers(obj.formData.memberType2 || [])}
                                isShowClear
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
            title: '提醒:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'timeIntervalFlag',
                        type: 'select',
                        options: SCHEDULE_REMINDER,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择提醒',
                                },
                            ],
                        },
                    },
                ],
            ],
        },
        {
            title: '会议室:',
            customCom: params.customCom,
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'meeting',
                        type: 'select',
                        options: obj.meetingList,
                        disabled: !daterangeIsFull,
                        componentAttr: {
                            onChange: params.changeParentForm2,
                        },
                    },
                ],
            ],
        },
        {
            title: '权限:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'privateFlag',
                        type: 'select',
                        options: SCHEDULE_PERMISSION,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择权限',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: false,
                        },
                        getFormat: (value, _form) => {
                            const form = { ..._form };
                            form.privateFlag = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
            ],
        },
        {
            title: '上传附件:',
            icon: 'iconziduan-fujian',
            columns: [
                [
                    {
                        key: 'scheduleAttachmentList',
                        placeholder: '请选择',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加附件',
                        },
                        getFormat: (_value, _form) => {
                            const form = { ..._form };
                            const value = _value;
                            value.map((_item, i) => {
                                const item = { ..._item };
                                item.scheduleAttachmentName = item.name;
                                item.scheduleAttachmentUrl = item.value;
                                item.scheduleAttachmentDomain = item.domain;
                                item.scheduleAttachmentSize = item.size;
                                value[i] = item;
                            });
                            form.scheduleAttachmentList = value;
                            return form;
                        },
                        setFormat: (value) => {
                            return value.map((item) => {
                                if (item.name || item.value || item.value === 0) {
                                    return item;
                                }
                                return {
                                    name: item.scheduleAttachmentName,
                                    value: item.scheduleAttachmentUrl,
                                    domain: item.scheduleAttachmentDomain,
                                    size: item.scheduleAttachmentSize,
                                };
                            });
                        },
                    },
                ],
            ],
        },
        {
            title: '知会人:',
            icon: 'iconziduan-ren',
            columns: [
                [
                    {
                        key: 'memberType3',
                        type: 'custom',
                        component: (
                            <NotifyNode
                                newItemBottom={{ lineHeight: '14px' }}
                                newContent={{ padding: 0 }}
                                isShowClear
                                data={params.renderNoticers(obj.formData.memberType3 || [])}
                                onChange={(val) => {
                                    return params.changeNotifyNode(val, 3);
                                }}
                            />
                        ),
                    },
                ],
            ],
        },
    ];
};
export default {
    formatCols,
};
