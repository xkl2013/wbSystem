/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { CONTRACT_OBLIGATION_TYPE, CONTRACT_BRAND_TYPE, IS_OR_NOT, CONTRACT_PROGRESS_TYPE } from '@/utils/enum';
import { getLeafOptions, getOptionPath } from '@/utils/utils';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';
import { getTalentList } from '@/services/globalSearchApi';

/* eslint-disable no-use-before-define */
// 改变艺人，清空表单
function changeTalent(obj, props, values) {
    const form = props.state.formData;
    const { projectAppointments, trailPlatformOrder, trailOrderPlatformId } = obj.formData;
    if (projectAppointments) {
        // 增加履约义务同一艺人只能有一条的逻辑
        const index = projectAppointments.findIndex((item) => {
            return (
                Number(item.projectAppointmentTalentId) === Number(values.talentId)
                && Number(item.projectAppointmentTalentType) === Number(values.talentType)
            );
        });
        if (index > -1) {
            message.error('同一艺人/博主只能添加一条履约义务');
            props.changeCols(formatSelfCols.bind(this, obj), {
                projectPopularizePlatform: form.projectPopularizePlatform,
            });
            return;
        }
    }
    const data = { projectAppointmentTalentId: values };
    if (Number(trailPlatformOrder) === 1) {
        // 平台项目默认推广平台为下单平台
        data.projectingPopularizePlatform = trailOrderPlatformId;
    }
    if (Number(trailPlatformOrder) === 2) {
        // 长期项目默认执行进度类型为手动输入
        data.projectAppointmentProgressType = '1';
    }
    props.changeCols(formatSelfCols.bind(this, obj), _.assign({}, data));
}

// 改变履约义务类型，清空品牌
function changeObligation(obj, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    if (!values || values.length === 0) {
        props.changeCols(
            formatSelfCols.bind(this, obj),
            _.assign({}, form, formData, {
                projectAppointmentPath: undefined,
                projectAppointmentBrand: undefined,
            }),
        );
        return;
    }
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, form, formData, {
            projectAppointmentPath: values,
            projectAppointmentBrand: undefined,
        }),
    );
}

// 显示品牌
function showBrand(props) {
    if (!props) {
        return false;
    }
    const { formData } = props.state;
    // 是否是艺人
    const isActor = Number(formData.projectAppointmentTalentType) === 0
        || (formData.projectAppointmentTalentId
            && formData.projectAppointmentTalentId.value
            && Number(formData.projectAppointmentTalentId.value.split('_')[1]) === 0);
    // 是否是代言类/广告推广
    const isDaiyan = formData.projectAppointmentPath
        && (Array.isArray(formData.projectAppointmentPath)
            ? formData.projectAppointmentPath[0].value === '01' || formData.projectAppointmentPath[0].value === '02'
            : formData.projectAppointmentPath.startsWith('01') || formData.projectAppointmentPath.startsWith('02'));
    return isActor && isDaiyan;
}

// 动态修改履约义务类型枚举
function getObligationList(formData, props) {
    if (!props) {
        return [];
    }
    const options = _.cloneDeep(CONTRACT_OBLIGATION_TYPE);
    // 当前表单数据
    const form = props.state.formData;
    const talentId = form.projectAppointmentTalentId
        && (form.projectAppointmentTalentId.value
            ? form.projectAppointmentTalentId.value.split('_')[0]
            : form.projectAppointmentTalentId);
    const talentType = form.projectAppointmentTalentId
        && (form.projectAppointmentTalentId.value
            ? form.projectAppointmentTalentId.value.split('_')[1]
            : form.projectAppointmentTalentType);
    if (!talentId) {
        return [];
    }
    // 已选的履约义务列表
    const talentObligationList = formData.projectAppointments
        && formData.projectAppointments.filter((item) => {
            return (
                Number(item.projectAppointmentTalentId) === Number(talentId)
                && Number(item.projectAppointmentTalentType) === Number(talentType)
            );
        });
    if (talentObligationList && talentObligationList.length > 0) {
        const appointmentPath = talentObligationList[0].projectAppointmentPath;
        const obligationType1 = appointmentPath && appointmentPath.substr(0, 2);
        if (
            obligationType1
            && (talentObligationList.length > 1
                // eslint-disable-next-line max-len
                || (talentObligationList.length === 1
                    && talentObligationList[0].projectAppointmentId !== form.projectAppointmentId))
        ) {
            options.map((item) => {
                if (item.value !== obligationType1) {
                    item.disabled = true;
                }
            });
        }
    }
    options[1].children.map((item) => {
        if (Number(talentType) !== 1 && item.value === '0204') {
            item.disabled = true;
        }
    });
    return options;
}

const changeHasShoppingCart = (obj, props, values) => {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    props.changeCols(
        formatSelfCols.bind(this, obj),
        _.assign({}, form, formData, {
            hasShoppingCart: values,
            shoppingCartUrl: undefined,
            shoppingCartProduct: undefined,
            productSoldOutTime: undefined,
        }),
    );
};

export const formatSelfCols = (obj, props) => {
    const formData = (obj && obj.formData) || {};
    const { projectBudgets, platformData, projectAppointments, trailPlatformOrder } = obj.formData;
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
                            request: (val) => {
                                // 长期项目可选所有艺人
                                if (Number(trailPlatformOrder) === 2) {
                                    return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                                }
                                return {
                                    success: true,
                                    data: {
                                        list: projectBudgets || [],
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
                        label: '履约义务',
                        key: 'projectAppointmentPath',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择最末级履约义务',
                                },
                            ],
                        },
                        type: 'cascader',
                        componentAttr: {
                            options: getObligationList(formData, props),
                            changeOnSelect: false,
                            placeholder: '请选择',
                            mode: 'leaf',
                            onChange: changeObligation.bind(this, obj, props),
                        },
                        getFormat: (value, form) => {
                            if (typeof value[value.length - 1] === 'string') {
                                // form回填未修改的数据
                                form.projectAppointmentPath = value[value.length - 1];
                                form.projectAppointmentName = getOptionPath(
                                    getLeafOptions(CONTRACT_OBLIGATION_TYPE),
                                    value[value.length - 1],
                                );
                            } else {
                                // 用户选择的数据
                                form.projectAppointmentPath = value[value.length - 1].value;
                                form.projectAppointmentName = value[value.length - 1].path;
                            }
                            return form;
                        },
                        setFormat: (value) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            // form回填
                            const arr = value.match(/\d{2}/g);
                            return [arr[0], arr[0] + arr[1], value];
                        },
                    },
                ],
                [
                    {
                        label: '品牌',
                        key: 'projectAppointmentBrand',
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_BRAND_TYPE,
                        checkOption: {
                            rules: [
                                {
                                    required: showBrand(props),
                                    message: '请选择品牌',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && formData.projectAppointments) {
                                            // eslint-disable-next-line max-len
                                            const appointmentTalentId = props && props.state.formData.projectAppointmentTalentId;
                                            // eslint-disable-next-line max-len
                                            const appointmentTalentType = props && props.state.formData.projectAppointmentTalentType;
                                            const appointmentId = props && props.state.formData.projectAppointmentId;
                                            let talentId = appointmentTalentId;
                                            let talentType = appointmentTalentType;
                                            if (appointmentTalentId.talentId) {
                                                talentId = appointmentTalentId.talentId;
                                                talentType = appointmentTalentId.talentType;
                                            }
                                            if (talentId) {
                                                // 该艺人已选择的履约义务列表
                                                const appoints = formData.projectAppointments.filter((item) => {
                                                    return (
                                                        Number(item.projectAppointmentTalentId) === Number(talentId)
                                                        // eslint-disable-next-line max-len
                                                        && Number(item.projectAppointmentTalentType) === Number(talentType)
                                                    );
                                                });
                                                // 如果该艺人已选择的履约义务列表只有一条，且当前为编辑状态，不需检测
                                                if (appoints.length === 1 && appointmentId) {
                                                    callback();
                                                    return;
                                                }
                                                // 该艺人已选择的履约义务列表第一条的品牌与当前所选择品牌比较
                                                if (
                                                    appoints[0]
                                                    && Number(appoints[0].projectAppointmentBrand) !== Number(value)
                                                ) {
                                                    callback('同一艺人/博主的品牌类型须唯一');
                                                    return;
                                                }
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        disabled: !showBrand(props),
                        getFormat: (value, form) => {
                            form.projectAppointmentBrand = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '履约义务详情说明',
                        key: 'projectAppointmentDescription',
                        type: 'textarea',
                        componentAttr: {
                            rows: 2,
                            maxLength: 40,
                            placeholder: '请输入',
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入履约义务详情说明',
                                },
                            ],
                        },
                    },
                ],
                (() => {
                    if (Number(trailPlatformOrder) === 2) {
                        return [
                            {
                                label: '执行进度变更方式',
                                key: 'projectAppointmentProgressType',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择执行进度变更方式',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                type: 'select',
                                options: CONTRACT_PROGRESS_TYPE,
                                getFormat: (value, form) => {
                                    form.projectAppointmentProgressType = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(trailPlatformOrder) === 2) {
                        return [
                            {
                                label: '是否自下单',
                                key: 'isSelfOrder',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否自下单',
                                        },
                                    ],
                                },
                                placeholder: '请选择',
                                type: 'select',
                                options: IS_OR_NOT,
                                getFormat: (value, form) => {
                                    form.isSelfOrder = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                [
                    {
                        label: '推广平台',
                        key: 'projectPopularizePlatform',
                        type: 'select',
                        options: platformData,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择推广平台',
                                },
                            ],
                        },
                        componentAttr: {
                            disabled: Number(trailPlatformOrder) === 1,
                        },
                        setFormat: (value) => {
                            return Number(value);
                        },
                    },
                ],
                (() => {
                    if (Number(trailPlatformOrder) === 2) {
                        return [
                            {
                                label: '执行金额',
                                key: 'executeMoney',
                                type: 'inputNumber',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入执行金额',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    precision: 2,
                                    min: 0,
                                    max: 9999999999.99,
                                    placeholder: '请输入',
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(trailPlatformOrder) === 3) {
                        return [
                            {
                                label: '佣金分成',
                                key: 'divideAmountRate',
                                type: 'inputNumber',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入佣金分成',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    precision: 2,
                                    min: 0,
                                    max: 100,
                                    formatter: (value) => {
                                        return `${value}%`;
                                    },
                                    parser: (value) => {
                                        return value.replace('%', '');
                                    },
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
                        return [
                            {
                                label: '分成比例(艺人：公司)',
                                key: 'divideRateTalent',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入分成比例',
                                        },
                                    ],
                                },
                                placeholder: '请输入',
                                type: 'numberRatio',
                                minAttr: {
                                    precision: 0,
                                    min: 0,
                                    max: 100,
                                },
                                maxAttr: {
                                    precision: 0,
                                    min: 0,
                                    max: 100,
                                },
                                getFormat: (value, form) => {
                                    form.divideRateTalent = value.min;
                                    form.divideRateCompany = value.max;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.min && value.max) {
                                        return value;
                                    }
                                    return { min: form.divideRateTalent, max: form.divideRateCompany };
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (props.state.formData.projectAppointmentId || Number(trailPlatformOrder) !== 1) {
                        return [
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
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (props.state.formData.projectAppointmentId || Number(trailPlatformOrder) !== 1) {
                        return [
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
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (props.state.formData.projectAppointmentId || Number(trailPlatformOrder) !== 1) {
                        return [
                            {
                                label: '执行进度',
                                key: 'projectAppointmentProgress',
                                placeholder: '请输入',
                                type: 'inputNumber',
                                checkOption: {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: Number(trailPlatformOrder) !== 1,
                                            message: '请输入执行进度',
                                        },
                                        {
                                            validator: (rule, value, callback) => {
                                                const appoint = projectAppointments.find((item) => {
                                                    return (
                                                        item.projectAppointmentId
                                                        === props.state.formData.projectAppointmentId
                                                    );
                                                });
                                                if (appoint && appoint.projectAppointmentProgress) {
                                                    if (!value || value < appoint.projectAppointmentProgress) {
                                                        callback('执行进度不能小于原值');
                                                        return;
                                                    }
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                },
                                componentAttr: {
                                    precision: 0,
                                    min: 0,
                                    max: 100,
                                    formatter: (value) => {
                                        return `${value}%`;
                                    },
                                    parser: (value) => {
                                        return value.replace('%', '');
                                    },
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(trailPlatformOrder) === 1 && props.state.formData.projectAppointmentId) {
                        return [
                            {
                                label: '是否包含购物车',
                                key: 'hasShoppingCart',
                                placeholder: '请选择',
                                type: 'select',
                                options: IS_OR_NOT,
                                componentAttr: {
                                    onChange: changeHasShoppingCart.bind(this, obj, props),
                                },
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否包含购物车',
                                        },
                                    ],
                                },
                                getFormat: (value, form) => {
                                    form.hasShoppingCart = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(props.state.formData.hasShoppingCart) === 1) {
                        return [
                            {
                                label: '购物车链接',
                                key: 'shoppingCartUrl',
                                placeholder: '请输入',
                                type: 'textarea',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入购物车链接',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    rows: 3,
                                    maxLength: 500,
                                    placeholder: '多个链接以英文逗号分隔',
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(props.state.formData.hasShoppingCart) === 1) {
                        return [
                            {
                                label: '购物车产品',
                                key: 'shoppingCartProduct',
                                placeholder: '请输入',
                                componentAttr: {
                                    maxLength: 50,
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (Number(props.state.formData.hasShoppingCart) === 1) {
                        return [
                            {
                                label: '产品下架时间',
                                key: 'productSoldOutTime',
                                type: 'date',
                                getFormat: (value, form) => {
                                    form.productSoldOutTime = moment(value).format(DATE_FORMAT);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return moment(value);
                                },
                            },
                        ];
                    }
                    return [];
                })(),
            ],
        },
    ];
};

export default {
    formatSelfCols,
};
