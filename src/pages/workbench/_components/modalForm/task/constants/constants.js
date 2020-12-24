/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { SCHEDULE_REMINDER, SCHEDULE_PERMISSION, TASK_STATUS, PRIORITY_TYPE } from '@/utils/enum';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import { getUserList as getInnerUserList } from '@/services/globalSearchApi';
import { SPECIAL_DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';
import s from '@/pages/workbench/_components/modalForm/calendar/constants/index.less';
import TagCom from '../components/tag';
// import SubTask from '../components/subTask';
import Checkbox from '../../components/checkbox';
import { myProjectId } from '../../../../_enum';

export const formatCols = (obj, params) => {
    const {
        wholeDayFlag,
        scheduleTagRelationDto,
        // scheduleWriteVoList = [],
        parentScheduleFinishFlag,
        parentScheduleId,
    } = obj.formData;
    const scheduleTagRelationList = Array.isArray(scheduleTagRelationDto)
        ? scheduleTagRelationDto
        : scheduleTagRelationDto && scheduleTagRelationDto.scheduleTagRelationList;
    const format = wholeDayFlag ? DATE_FORMAT : SPECIAL_DATETIME_FORMAT;
    // 获取选择项目id,没有匹配到数据默认为不能编辑
    const { scheduleProjectDto } = obj.formData || {};
    const hasProjectAuth = (obj.scheduleProjectDto || []).find((ls) => {
        return String(ls.id) === String(scheduleProjectDto);
    });
    // 当任务所属项目为我的日历时,任务完成状态进行隐藏
    return [
        {
            title: '任务内容:',
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
                                    message: '请填写任务内容',
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
                        placeholder: '请填写任务内容',
                    },
                ],
            ],
        },
        {
            title: '任务描述:',
            icon: 'iconziduan-duohangwenben',
            columns: [
                [
                    {
                        key: 'description',
                        type: 'textarea',
                        componentAttr: { maxLength: 1000 },
                        placeholder: '请填写任务描述',
                    },
                ],
            ],
        },
        hasProjectAuth && !parentScheduleId
            ? {
                title: '所属项目:',
                icon: 'iconziduan-xiala',
                columns: [
                    [
                        {
                            key: 'scheduleProjectDto',
                            type: 'select',
                            options: obj.scheduleProjectDto,
                            componentAttr: {
                                allowClear: false,
                                onChange: params.changeScheduleProjectDto,
                            },
                            // setFormat: (value) => {
                            //     return typeof value === 'object' && value ? value.projectId : value;
                            // },
                        },
                    ],
                ],
            }
            : {},
        hasProjectAuth && !parentScheduleId
            ? {
                title: '所属列表:',
                icon: 'iconziduan-xiala',
                columns: [
                    [
                        {
                            key: 'schedulePanelList',
                            type: 'select',
                            options: obj.schedulePanelList || [],
                            componentAttr: { allowClear: false },
                        },
                    ],
                ],
                // setFormat: (value) => {
                //     return typeof value === 'object' && value ? value.projectId : value;
                // },
            }
            : {},
        // 创建模式下和(我的日历模式且不是子任务)下不可见
        obj.isEdit && !(Number(scheduleProjectDto) === myProjectId && parentScheduleId === 0)
            ? {
                title: '任务状态:',
                icon: 'iconziduan-xiala',
                columns: [
                    [
                        {
                            key: 'finishFlag',
                            type: 'radio',
                            options: TASK_STATUS,
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择任务状态',
                                    },
                                ],
                            },
                            disabled: parentScheduleFinishFlag === 1, // 若父级是已完成，则禁止点击
                            setFormat: (value) => {
                                return String(value);
                            },
                        },
                    ],
                ],
            }
            : {},
        {
            title: '负责人:',
            icon: 'iconziduan-ren',
            columns: [
                [
                    {
                        key: 'memberType1',
                        type: 'associationSearch',
                        placeholder: '请选择',
                        componentAttr: {
                            request: (val) => {
                                return getInnerUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'userId', label: 'userChsName' },
                            allowClear: true,
                            placeholder: '请选择',
                        },
                        getFormat: (value, _form) => {
                            const form = { ..._form };
                            form.memberType1 = [];
                            if (value.value) {
                                form.memberType1.push({
                                    memberType: 1,
                                    memberId: Number(value.value),
                                    memberName: value.label,
                                    userId: Number(value.value),
                                    userName: value.label,
                                });
                            }
                            return form;
                        },
                        setFormat: (value) => {
                            if (Array.isArray(value)) {
                                const newObj = value[0];
                                if (newObj) {
                                    return {
                                        label: newObj.memberName || newObj.userName,
                                        value: newObj.memberId || newObj.userId,
                                    };
                                }
                            } else {
                                return { label: value.label, value: value.value };
                            }
                        },
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
                        placeholder: ['任务起始日期', '任务终止日期'],
                        // checkOption: {
                        //     validateFirst: true,
                        // rules: [
                        //     {
                        //         // required: true,
                        //         // message: '请填写任务时间',
                        //     },
                        //     {
                        //         validator: async (rule, value, callback) => {
                        //             // if (
                        //             //     !value[0]
                        //             //     || !value[1]
                        //             //     || moment(value[0]).unix() > moment(value[1]).unix()
                        //             // ) {
                        //             //     callback('请选择完整的任务时间');
                        //             //     return;
                        //             // }
                        //             callback();
                        //         },
                        //     },
                        // ],
                        // },
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
            title: '优先级:',
            icon: 'iconziduan-xiala',
            columns: [
                [
                    {
                        key: 'schedulePriority',
                        type: 'select',
                        options: PRIORITY_TYPE,
                        componentAttr: { allowClear: false },
                        getFormat: (value, _form) => {
                            const form = _form;
                            form.schedulePriority = Number(value);
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
            title: '标签:',
            icon: 'iconbiaoqian',
            columns: [
                [
                    {
                        key: 'scheduleTagRelationDto',
                        type: 'custom',
                        component: <TagCom tagList={scheduleTagRelationList || []} />,
                        getFormat: (value, _form) => {
                            const form = _form;
                            if (Array.isArray(value)) {
                                form.scheduleTagRelationDto = {
                                    scheduleId: obj.id,
                                    scheduleTagRelationList: value,
                                };
                            }
                            return form;
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
        // obj.isEdit
        //     ? {
        //         title: '子任务:',
        //         icon: 'iconzirenwu',
        //         columns: [
        //             [
        //                 {
        //                     key: 'scheduleWriteVoList',
        //                     type: 'custom',
        //                     component: (
        //                         <SubTask
        //                             treeData={scheduleWriteVoList}
        //                             paramsObj={obj}
        //                             getData={params.getData}
        //                             getDetailData={params.getDetailData}
        //                             renderNoticers={params.renderNoticers}
        //                             goChildModal={params.goChildModal}
        //                         />
        //                     ),
        //                 },
        //             ],
        //         ],
        //     }
        //     : {},
    ];
};
export default {
    formatCols,
};
