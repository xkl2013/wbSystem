/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/**
 * 新增/编辑form表单cols
 * */
import moment from 'moment';
import { THROW_TYPE, THROW_STATUS, THROW_STATUS_SUCESS, THROW_PLATFORM } from '@/utils/enum';
import { pureNumberReg, purePosNumberReg } from '@/utils/reg';
import { DATETIME_FORMAT } from '@/utils/constants';
// eslint-disable-next-line no-unused-vars
import { getTalentList, getUserList as getAllUsers, getCompanyList, getSupplierList } from '@/services/globalSearchApi';
import { getOptionName, riseDimension } from '@/utils/utils';
import { getProjectList } from '../services';
import SelfTable from './edit/editTable';

export const formatCols = (
    obj,
    page,
    talentAccountList = [],
    channelList = [],
    tagsTreeData = [],
    appointment = [],
    originPutStatus,
) => {
    const { talentName = {}, talentCalendarId, projectIdFlag, addId, projectIdFlagAdd } = obj.formData;
    const putType = obj.formData.putType && Number(obj.formData.putType);
    const putStatus = obj.formData.putStatus && Number(obj.formData.putStatus);
    const putChannel = obj.formData.putChannel && Number(obj.formData.putChannel);
    const accountPlatform = obj.formData.accountPlatform && Number(obj.formData.accountPlatform);
    const executeUrlList = obj.executeUrlList;
    const projectAppointmentId = obj.formData.projectAppointmentId && Number(obj.formData.projectAppointmentId);
    talentAccountList.forEach((item) => {
        item.id = item.accountId;
        item.name = `${item.accountName}(${getOptionName(THROW_PLATFORM, String(item.platform))})`;
    });
    channelList.forEach((item) => {
        item.id = item.channelId;
        item.name = item.channelName;
    });

    // 新增投放，如果履约义务有投放，执行链接不能编辑
    let executeUrlDisabled = false;
    const appointmentObj = appointment.find((item) => {
        return item.projectAppointmentId === projectAppointmentId;
    });
    const { talentPopularizeIdList } = appointmentObj || {};
    if (page === 'add' && talentPopularizeIdList && talentPopularizeIdList.length > 0) {
        executeUrlDisabled = true;
    }

    // 项目组件显隐逻辑
    const projectIsShow = putType === 2
        || putType === 3
        || putType === 5
        || putType === 8
        || projectIdFlag
        || projectIdFlagAdd
        || (putChannel === 4 && putType === 6);

    return [
        (() => {
            if (page === 'edit') {
                return {
                    title: '推广效果',
                    columns: [
                        [
                            {
                                label: '投放状态',
                                key: 'putStatus',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择投放状态',
                                        },
                                    ],
                                },
                                allowClear: 'false',
                                placeholder: '请选择',
                                options:
                                    originPutStatus === 3 || originPutStatus === 4 ? THROW_STATUS_SUCESS : THROW_STATUS,
                                type: 'select',
                                getFormat: (value, form) => {
                                    form.putStatus = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                            (() => {
                                if (putStatus === 4) {
                                    return {
                                        label: '失败原因',
                                        key: 'failReason',
                                        checkOption: {
                                            rules: [
                                                {
                                                    max: 500,
                                                    message: '至多输入500个字',
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
                                return {};
                            })(),
                            {},
                        ],
                        [
                            (() => {
                                if (putStatus === 4) {
                                    return {};
                                }
                                return {
                                    key: 'fansCount',
                                    type: 'custom',
                                    labelCol: { span: 0 },
                                    wrapperCol: { span: 24 },
                                    render: () => {
                                        return <SelfTable {...obj.formData} />;
                                    },
                                    getFormat: (value, form) => {
                                        form.beforeFansCount = value.beforeFansCount;
                                        form.afterFansCount = value.afterFansCount;
                                        return form;
                                    },
                                    setFormat: (value) => {
                                        return value;
                                    },
                                };
                            })(),
                        ],
                    ],
                };
            }
            return {};
        })(),
        (() => {
            if (page === 'edit') {
                const is78 = putType === 7 || putType === 8;
                let arr = [];
                if (accountPlatform === 3) {
                    arr = [
                        {
                            label: '曝光量',
                            key: 'exposureCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '播放量',
                            key: 'playCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '点赞数',
                            key: 'giveUpCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '收藏数',
                            key: 'collectCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '评论数',
                            key: 'commentCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '主页浏览',
                            key: 'homePageViewCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '新增关注',
                            key: 'newFollowCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                        },
                        {
                            label: '新增关注成本',
                            key: 'newFollowCost',
                            placeholder: '--',
                            disabled: true,
                        },
                    ];
                } else {
                    arr = [
                        !is78
                            ? {
                                label: '播放量',
                                key: 'playCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        !is78
                            ? {
                                label: '点赞量',
                                key: 'giveUpCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        !is78
                            ? {
                                label: '评论数',
                                key: 'commentCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        !is78
                            ? {
                                label: '分享量',
                                key: 'shareCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        is78
                            ? {
                                label: '进直播间人数',
                                key: 'comingPersonCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        {
                            label: is78 ? '新增粉丝量' : '粉丝增长',
                            key: 'fansUpCount',
                            checkOption: {
                                rules: [
                                    {
                                        pattern: pureNumberReg,
                                        message: '请填写数字',
                                    },
                                ],
                            },
                            componentAttr: { maxLength: 15 },
                            placeholder: '请输入',
                            disabled: putStatus === 4,
                        },
                        is78
                            ? {
                                label: '观众评论量',
                                key: 'commentsCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        is78
                            ? {
                                label: '打赏音浪',
                                key: 'rewardCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : null,
                        is78
                            ? {
                                label: '购物车点击量',
                                key: 'shoppingCartClickCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            }
                            : {
                                label: '购物车点击',
                                key: 'afterCartClickCount',
                                checkOption: {
                                    rules: [
                                        {
                                            pattern: pureNumberReg,
                                            message: '请填写数字',
                                        },
                                    ],
                                },
                                componentAttr: { maxLength: 15 },
                                placeholder: '请输入',
                                disabled: putStatus === 4,
                            },
                        {
                            label: '投放粉丝成本',
                            key: 'fansPrice',
                            placeholder: '--',
                            disabled: true,
                        },
                    ];
                }
                return {
                    title: '反馈信息',
                    columns: riseDimension(arr),
                };
            }
            return {};
        })(),
        {
            title: '基本信息',
            columns: [
                [
                    {
                        label: 'Talent名称',
                        key: 'talentName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择Talent名称',
                                },
                            ],
                        },
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
                        placeholder: '请选择',
                        disabled: page === 'edit' || !!talentCalendarId || !!addId,
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.talentId = value.value.split('_')[0];
                            form.talentType = value.value.split('_')[1];
                            form.talentName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { value: `${form.talentId}_${form.talentType}`, label: form.talentName };
                        },
                    },
                    {
                        label: '账号',
                        key: 'talentAccountId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择账号',
                                },
                            ],
                        },
                        disabled: page === 'edit' || !!addId,
                        options: talentAccountList,
                        type: 'select',
                        getFormat: (value, form) => {
                            form.talentAccountId = Number(value);
                            // 放入档期ID
                            form.talentCalendarId = (talentCalendarId && Number(talentCalendarId)) || undefined;
                            return form;
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                    {
                        label: '负责人',
                        key: 'chargeUserList', // todo 改成后端需要的字段
                        type: 'associationSearch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '负责人不能为空',
                                },
                            ],
                        },
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
                                    popularizeChargeuserId: item.value,
                                    popularizeChargeuserName: item.label,
                                });
                            });
                            form.chargeUserList = arr;
                            return form;
                        },
                        setFormat: (value) => {
                            const arr = [];
                            value
                                && value.map((item) => {
                                    if (item.label && item.value) {
                                        arr.push(item);
                                    } else {
                                        arr.push({
                                            label: item.popularizeChargeuserName,
                                            value: item.popularizeChargeuserId,
                                        });
                                    }
                                });
                            return arr;
                        },
                    },
                ],
                [
                    (() => {
                        if (page === 'edit') {
                            return {
                                label: '填报时间',
                                key: 'createTime',
                                placeholder: '请输入',
                                disabled: true,
                            };
                        }
                        return {};
                    })(),
                ],
            ],
        },
        {
            title: '推广信息',
            columns: [
                [
                    {
                        label: '推广内容',
                        key: 'popularizeContent',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入推广内容',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '推广开始时间',
                        key: 'popularizeDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '推广开始时间不能为空',
                                },
                            ],
                        },
                        style: { width: '250px' },
                        placeholder: '请选择推广开始时间',
                        type: 'datetime',
                        getFormat: (value, form) => {
                            form.popularizeDate = moment(value).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                    {
                        label: '预计推广时长(h)',
                        key: 'predictHours',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入预计推广时长',
                                },
                                {
                                    pattern: pureNumberReg,
                                    message: '请填写整数时长',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (Number(value) > 8760) {
                                            callback('输入数据过大');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        placeholder: '请输入',
                        getFormat: (value, form) => {
                            form.predictHours = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                ],
                [
                    {
                        label: '投放渠道',
                        key: 'putChannel',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择投放渠道',
                                },
                            ],
                        },
                        allowClear: 'false',
                        placeholder: '请选择',
                        options: channelList,
                        type: 'select',
                        disabled: page === 'edit',
                        getFormat: (value, form) => {
                            form.putChannel = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                    {
                        label: '投放类型',
                        key: 'putType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择投放类型',
                                },
                            ],
                        },
                        type: 'select',
                        disabled: page === 'edit',
                        options: putChannel ? THROW_TYPE[putChannel - 1].children : [],
                        placeholder: '请输入',
                        getFormat: (value, form) => {
                            form.putType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    (() => {
                        if (projectIsShow) {
                            return {
                                label: '项目',
                                key: 'projectId',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择项目',
                                        },
                                    ],
                                },
                                placeholder: '请输入',
                                type: 'associationSearch',
                                disabled: page === 'edit' || projectIdFlag || projectIdFlagAdd,
                                componentAttr: {
                                    request: (val) => {
                                        return getProjectList({
                                            projectName: val,
                                            talentId: talentName.talentId,
                                            talentType: talentName.talentType,
                                            pageSize: 50,
                                            pageNum: 1,
                                            projectBaseType: 1,
                                            endStatusList: [0, 2],
                                            projectingStateList: [0, 1], // 项目进展未终止
                                        });
                                    },
                                    fieldNames: { value: 'projectingId', label: 'projectingName' },
                                    initDataType: 'onfocus',
                                },
                                getFormat: (value, form) => {
                                    form.projectId = value.value;
                                    form.projectName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return { label: form.projectName, value: form.projectId };
                                },
                            };
                        }
                        return {};
                    })(),
                    {},
                    {},
                ],
                [
                    (() => {
                        // 投放渠道是快手的时候不展示履约义务-曹栋需求
                        if (
                            (putType === 2 && putChannel !== 5)
                            || putType === 3
                            || putType === 5
                            || projectIdFlag
                            || projectIdFlagAdd
                        ) {
                            return {
                                label: '履约义务',
                                key: 'projectAppointmentId',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择履约义务',
                                        },
                                    ],
                                },
                                allowClear: 'false',
                                placeholder: '请选择',
                                options: appointment,
                                type: 'select',
                                disabled: page === 'edit' || projectIdFlag || projectIdFlagAdd,
                                getFormat: (value, form) => {
                                    form.projectAppointmentId = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return value;
                                },
                            };
                        }
                        return {};
                    })(),
                    {
                        label: '投放金额',
                        key: 'putAmount',
                        checkOption: {
                            rules: [
                                {
                                    required: !talentCalendarId,
                                    message: '请填写投放金额',
                                },
                                {
                                    pattern: purePosNumberReg,
                                    message: '请填写最多两位小数的数字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '费用承担主体',
                        key: 'companyName',
                        disabled: true,
                    },
                    {
                        label: '供应商主体',
                        key: 'supplierName',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '分类标签',
                        key: 'tagsDtos',
                        placeholder: '请输入',
                        type: 'tags',
                        componentAttr: {
                            tagsTreeData,
                            deleteTags: obj.deleteTags,
                            addTags: obj.addTags,
                            onChange: obj.changeParentForm,
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                    {},
                    {},
                ],
                [
                    (() => {
                        if (executeUrlList) {
                            return {
                                label: '执行链接',
                                key: 'executeUrl',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择执行链接',
                                        },
                                    ],
                                },
                                allowClear: 'false',
                                type: 'select',
                                options: executeUrlList,
                                placeholder: '请输入',
                                setFormat: (value) => {
                                    return value;
                                },
                            };
                        }
                        return {
                            label: '执行链接',
                            key: 'executeUrl',
                            placeholder: '请输入',
                            disabled: !!addId || executeUrlDisabled,
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写执行链接',
                                    },
                                ],
                            },
                        };
                    })(),
                    {},
                    {},
                ],
                [
                    {
                        label: '附件',
                        key: 'attachments',
                        placeholder: '请选择',
                        type: 'upload',
                        componentAttr: {
                            btnText: '添加附件',
                        },
                        setFormat: (value) => {
                            return value.map((item) => {
                                if (item.name || item.value || item.value === 0) {
                                    return item;
                                }
                                return {
                                    name: item.attachmentName,
                                    value: item.attachmentUrl,
                                    domain: item.attachmentDomain,
                                };
                            });
                        },
                    },
                    {},
                    {},
                ],
                [
                    {
                        label: '备注',
                        key: 'remark',
                        checkOption: {
                            rules: [
                                {
                                    max: 500,
                                    message: '至多输入500个字',
                                },
                            ],
                        },
                        type: 'textarea',
                        componentAttr: {
                            placeholder: '请输入',
                            rows: 3,
                        },
                    },
                    {},
                    {},
                ],
            ],
        },
    ];
};

export default {
    formatCols,
};
