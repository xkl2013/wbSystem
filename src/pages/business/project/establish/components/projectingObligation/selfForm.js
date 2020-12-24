/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import _ from 'lodash';
import moment from 'moment';
import { CONTRACT_OBLIGATION_TYPE, CONTRACT_BRAND_TYPE, CONTRACT_PROGRESS_TYPE, IS_OR_NOT } from '@/utils/enum';
import { getLeafOptions, getOptionPath, isNumber } from '@/utils/utils';
import { getTalentList } from '@/services/globalSearchApi';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';

const ONLINE_URL = [{ id: '1', name: '有链接' }, { id: '0', name: '无链接' }];
/* eslint-disable no-use-before-define */
// 改变艺人，清空表单
function changeTalent(objData, props, values) {
    const { obj } = objData;
    const { trailPlatformOrder, trailOrderPlatformId } = obj.formData;
    const data = { projectingAppointmentTalentId: values };
    if (Number(trailPlatformOrder) === 1) {
        // 平台项目默认推广平台为下单平台
        data.projectingPopularizePlatform = trailOrderPlatformId;
    }
    if (Number(trailPlatformOrder) === 2) {
        // 长期项目默认执行进度类型为手动输入
        data.projectingAppointmentProgressType = '1';
    }
    props.changeCols(formatSelfCols.bind(this, objData), _.assign({}, data));
}

// 改变履约义务类型，清空品牌
function changeObligation(objData, props, values) {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    if (!values || values.length === 0) {
        props.changeCols(
            formatSelfCols.bind(this, objData),
            _.assign({}, form, formData, {
                projectingAppointmentPath: undefined,
                projectingAppointmentBrand: undefined,
            }),
        );
        return;
    }
    props.changeCols(
        formatSelfCols.bind(this, objData),
        _.assign({}, form, formData, {
            projectingAppointmentPath: values,
            projectingAppointmentBrand: undefined,
        }),
    );
}
// 获取当前表单中的艺人
const getTalent = (props) => {
    if (!props || !props.state) {
        return {};
    }
    const { projectingAppointmentTalentId, projectingAppointmentTalentType } = props.state.formData;
    if (!projectingAppointmentTalentId) {
        return {};
    }
    if (typeof projectingAppointmentTalentId === 'object') {
        const { value } = projectingAppointmentTalentId;
        const arr = value.split('_');
        return {
            talentId: arr[0],
            talentType: arr[1],
        };
    }
    return {
        talentId: projectingAppointmentTalentId,
        talentType: projectingAppointmentTalentType,
    };
};
// 是否是代言类/广告推广
const checkDY = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { formData } = props.state;
    const { projectingAppointmentPath } = formData || {};
    if (!projectingAppointmentPath) {
        return false;
    }
    let checkCode = '';
    if (Array.isArray(projectingAppointmentPath)) {
        const [first] = projectingAppointmentPath;
        checkCode = first;
        if (typeof first === 'object') {
            checkCode = first.value;
        }
    } else if (typeof projectingAppointmentPath === 'string') {
        checkCode = projectingAppointmentPath.substr(0, 2);
    }
    return checkCode === '01' || checkCode === '02';
};
// 显示品牌
function showBrand(props) {
    if (!props) {
        return false;
    }
    const talent = getTalent(props);
    // 是否是艺人
    const isActor = talent.talentId && Number(talent.talentType) === 0;
    // 是否是代言类/广告推广
    const isDaiyan = checkDY(props);
    return isActor && isDaiyan;
}
// 检测并获取受限的履约义务
const checkLimit = (formData, props) => {
    if (!props || !props.state) {
        return false;
    }
    const talent = getTalent(props);
    const { talentId, talentType } = talent;

    if (!talentId) {
        return [];
    }
    const { projectingAppointmentDTOList } = formData;
    const { projectingAppointmentId, key } = props.state.formData;
    // 已选的履约义务列表
    const talentObligationList = (projectingAppointmentDTOList
        && projectingAppointmentDTOList.filter((item) => {
            return (
                Number(item.projectingAppointmentTalentId) === Number(talentId)
                && Number(item.projectingAppointmentTalentType) === Number(talentType)
                && item.projectingAppointmentPath
            );
        }))
        || [];
    let flag = false;
    if (talentObligationList.length > 0) {
        // 项目履约中该艺人拥有多于1条履约，则本次编辑履约受限
        if (talentObligationList.length > 1) {
            flag = true;
        }
        // 项目履约中该艺人履约只有一条时
        if (talentObligationList.length === 1) {
            // 项目中履约的ID与本次编辑的履约ID不同，表示正在新增履约（本次编辑没有ID），则本次编辑履约受限
            if (
                talentObligationList[0].projectingAppointmentId !== projectingAppointmentId
                || talentObligationList[0].key !== key
            ) {
                flag = true;
            }
        }
    }
    if (flag) {
        return talentObligationList[0];
    }
    return flag;
};
// 动态修改履约义务类型枚举
function getObligationList(formData, props) {
    if (!props) {
        return [];
    }
    const options = _.cloneDeep(CONTRACT_OBLIGATION_TYPE);
    const talent = getTalent(props);
    const { talentId, talentType } = talent;
    if (!talentId) {
        return [];
    }
    const limitObligation = checkLimit(formData, props);
    if (limitObligation) {
        const appointmentPath = limitObligation.projectingAppointmentPath;
        if (appointmentPath) {
            const obligationType1 = appointmentPath.substr(0, 2);
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
// 修改是否有商品购物车
const changeHasShoppingCart = (objData, props, values) => {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    props.changeCols(
        formatSelfCols.bind(this, objData),
        _.assign({}, form, formData, {
            hasShoppingCart: values,
            shoppingCartUrl: undefined,
            shoppingCartProduct: undefined,
            productSoldOutTime: undefined,
        }),
    );
};
// 修改是否有上线链接
const changeHasOnlineUrl = (objData, props, values) => {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    props.changeCols(
        formatSelfCols.bind(this, objData),
        _.assign({}, form, formData, {
            hasOnlineUrl: values,
            projectingExecuteUrl: undefined,
        }),
    );
};
// 修改上线日期实际
const changeLiveTime = (objData, props, values) => {
    const formData = props.formView.props.form.getFieldsValue();
    const form = props.state.formData;
    const { projectingAppointmentDTOList } = objData.obj.formData;
    const { popularizeDisabled } = form;
    const data = {
        projectingLiveTime: values,
    };
    // 如果关联了投放不允许编辑时，修改日期保留原来的链接
    if (popularizeDisabled) {
        const originData = getDataFromList(projectingAppointmentDTOList, props);
        data.hasOnlineUrl = originData.projectingExecuteUrl ? '1' : '0';
        data.projectingExecuteUrl = originData.projectingExecuteUrl;
    }
    // 日期清空时，链接也清空
    if (!values) {
        data.hasOnlineUrl = undefined;
        data.projectingExecuteUrl = undefined;
    }
    props.changeCols(formatSelfCols.bind(this, objData), _.assign({}, form, formData, data));
};
// 项目编辑时，有执行进度或执行链接的不允许编辑
const getDisabled = (projectingAppointmentDTOList, props) => {
    if (!props || !props.state) {
        return false;
    }
    const originData = getDataFromList(projectingAppointmentDTOList, props);
    // 项目编辑
    if (originData) {
        const {
            projectAppointmentProgress,
            projectLiveTime,
            projectAppointmentId,
            projectAppointmentPath,
        } = originData;
        // 有履约义务id而没有履约义务字段时可编辑（兼容老数据执行链接，之前没有履约义务，此时数据有问题，不能编辑，不能创建合同）
        if (projectAppointmentId && !projectAppointmentPath) {
            return false;
        }
        // 有执行进度或上线日期实际或该履约被合同占用中，不可编辑
        return (
            Number(projectAppointmentProgress) > 0 || projectLiveTime || checkInUse(projectingAppointmentDTOList, props)
        );
    }
    return false;
};
// 检测履约是否被占用
const checkInUse = (projectingAppointmentDTOList, props) => {
    if (!props || !props.state) {
        return false;
    }
    const originData = getDataFromList(projectingAppointmentDTOList, props);
    // 履约义务已被合同使用
    if (originData) {
        const { inUse } = originData;
        return Number(inUse) === 1;
    }
    return false;
};
// 项目编辑时，有执行进度的不允许清空
const getRequiredProgress = (projectingAppointmentDTOList, props) => {
    if (!props || !props.state) {
        return false;
    }
    const { projectingAppointmentId } = props.state.formData;
    // 项目编辑，执行进度有值就不能删
    if (projectingAppointmentId) {
        const originData = getDataFromList(projectingAppointmentDTOList, props);
        return isNumber(originData.projectAppointmentProgress);
    }
    return false;
};
// 检测上线链接必填
const getRequiredExecuteUrl = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { projectingLiveTime, hasOnlineUrl } = props.state.formData;
    // 有上线日期实际且选择了有上线链接时必填
    return projectingLiveTime && Number(hasOnlineUrl) === 1;
};
// 检测执行链接只读
const getDisabledExecuteUrl = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { projectingAppointmentPath, hasOnlineUrl, popularizeDisabled } = props.state.formData;
    let path = '';
    if (Array.isArray(projectingAppointmentPath)) {
        path = projectingAppointmentPath[0];
    } else if (typeof projectingAppointmentPath === 'string') {
        path = projectingAppointmentPath.substr(0, 4);
    }
    // 授权类的履约义务不需要填写执行链接，投放限制的不可编辑
    return (path === '0101' && Number(hasOnlineUrl) === 1) || popularizeDisabled;
};
// 检测有无上线链接必填
const getRequiredHasOnlineUrl = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { projectingLiveTime } = props.state.formData;
    // 有上线日期实际时必填
    return projectingLiveTime;
};
// 检测有无上线链接只读
const getDisabledHasOnlineUrl = (props) => {
    if (!props || !props.state) {
        return true;
    }
    const { projectingLiveTime, popularizeDisabled } = props.state.formData;
    // 没有上线日期实际或者投放限制的不能修改
    return !projectingLiveTime || popularizeDisabled;
};
// 检测是否可以编辑执行进度
const checkExecuteProgress = (props) => {
    if (!props || !props.state) {
        return false;
    }
    const { projectingAppointmentProgressType } = props.state.formData;
    // 按月均摊类型，执行进度由后端计算，不允许修改
    return isNumber(projectingAppointmentProgressType) && Number(projectingAppointmentProgressType) === 0;
};
// 获取该条数据的原始值（projecting开头的字段为编辑值，对应的project开头的为详情原始值，在获取数据后transferData中处理）
const getDataFromList = (projectingAppointmentDTOList = [], props, params) => {
    // 无原列表
    if (!projectingAppointmentDTOList || projectingAppointmentDTOList.length === 0) {
        return;
    }
    // 当前formView未加载
    if (!props || !props.state) {
        return;
    }
    const form = props.state.formData;
    // 默认对比条件为id
    if (!params) {
        params = 'projectingAppointmentId';
    }
    return projectingAppointmentDTOList.find((item) => {
        if (typeof params === 'string') {
            return String(item[params]) === String(form[params]);
        }
        if (Array.isArray(params)) {
            for (let i = 0; i < params.length; i += 1) {
                if (typeof params[i] !== 'string') {
                    return false;
                }
                if (String(item[params[i]]) !== String(form[params[i]])) {
                    return false;
                }
            }
            return true;
        }
    });
};
export const formatSelfCols = (objData, props) => {
    const { obj, from } = objData;
    const { projectBudgets, projectingAppointmentDTOList, trailPlatformOrder } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'projectingAppointmentTalentId',
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
                                if (from === 'establish') {
                                    // 长期项目、cps可选所有艺人
                                    if (Number(trailPlatformOrder) === 2 || Number(trailPlatformOrder) === 3) {
                                        return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                                    }
                                } else if (from === 'manage') {
                                    // 长期项目可选所有艺人
                                    if (Number(trailPlatformOrder) === 2) {
                                        return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                                    }
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
                            onChange: changeTalent.bind(this, objData, props),
                            // eslint-disable-next-line max-len
                            disabled:
                                props && (props.state.formData.id || props.state.formData.projectingAppointmentId),
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectingAppointmentTalentId = Number(value.value.split('_')[0]);
                            form.projectingAppointmentTalentName = value.label;
                            form.projectingAppointmentTalentType = Number(value.value.split('_')[1]);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (!value) return value;
                            if (value.value && value.label) {
                                return value;
                            }
                            return {
                                value: `${form.projectingAppointmentTalentId}_${form.projectingAppointmentTalentType}`,
                                label: form.projectingAppointmentTalentName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '履约义务',
                        key: 'projectingAppointmentPath',
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
                            options: getObligationList(obj.formData, props),
                            changeOnSelect: false,
                            placeholder: '请选择',
                            mode: 'leaf',
                            onChange: changeObligation.bind(this, objData, props),
                            disabled: getDisabled(projectingAppointmentDTOList, props),
                        },
                        getFormat: (value, form) => {
                            if (typeof value[value.length - 1] === 'string') {
                                // form回填未修改的数据
                                form.projectingAppointmentPath = value[value.length - 1];
                                form.projectingAppointmentName = getOptionPath(
                                    getLeafOptions(CONTRACT_OBLIGATION_TYPE),
                                    value[value.length - 1],
                                );
                            } else {
                                // 用户选择的数据
                                form.projectingAppointmentPath = value[value.length - 1].value;
                                form.projectingAppointmentName = value[value.length - 1].path;
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
                        key: 'projectingAppointmentBrand',
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_BRAND_TYPE,
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: showBrand(props),
                                    message: '请选择品牌',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value) {
                                            const talent = getTalent(props);
                                            const { talentId } = talent;
                                            if (talentId) {
                                                const limitObligation = checkLimit(obj.formData, props);
                                                if (limitObligation) {
                                                    const brand = limitObligation.projectingAppointmentBrand;
                                                    if (isNumber(brand) && String(brand) !== value) {
                                                        callback('同一艺人/博主的品牌类型须唯一');
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        disabled: !showBrand(props) || getDisabled(projectingAppointmentDTOList, props),
                        getFormat: (value, form) => {
                            form.projectingAppointmentBrand = Number(value);
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
                        key: 'projectingAppointmentDescription',
                        type: 'textarea',
                        componentAttr: {
                            rows: 2,
                            maxLength: 40,
                            placeholder: '请输入',
                            disabled: getDisabled(projectingAppointmentDTOList, props),
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
                                key: 'projectingAppointmentProgressType',
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
                                disabled: getDisabled(projectingAppointmentDTOList, props),
                                getFormat: (value, form) => {
                                    form.projectingAppointmentProgressType = Number(value);
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
                                disabled: getDisabled(projectingAppointmentDTOList, props),
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
                // [
                //     {
                //         label: '推广平台',
                //         key: 'projectingPopularizePlatform',
                //         type: 'select',
                //         options: platformData,
                //         checkOption: {
                //             rules: [
                //                 {
                //                     required: true,
                //                     message: '请选择推广平台',
                //                 },
                //             ],
                //         },
                //         componentAttr: {
                //             disabled: Number(trailPlatformOrder) === 1,
                //         },
                //     },
                // ],
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
                                    // disabled: checkInUse(projectingAppointmentDTOList, props),
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
                                    // disabled: checkInUse(projectingAppointmentDTOList, props),
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
                                    // TODO：合同同步过来的数据没有这些信息，先允许编辑
                                    // disabled: checkInUse(projectingAppointmentDTOList, props),
                                },
                                maxAttr: {
                                    precision: 0,
                                    min: 0,
                                    max: 100,
                                    // disabled: checkInUse(projectingAppointmentDTOList, props),
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
                [
                    {
                        label: '上线日期(预计)',
                        key: 'projectingLiveTimePlan',
                        type: 'date',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择上线日期(预计)',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.projectingLiveTimePlan = moment(value).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
                (() => {
                    if (from === 'manage') {
                        return [
                            {
                                label: '上线日期(实际)',
                                key: 'projectingLiveTime',
                                type: 'date',
                                componentAttr: {
                                    onChange: changeLiveTime.bind(this, objData, props),
                                },
                                getFormat: (value, form) => {
                                    form.projectingLiveTime = value && moment(value).format(DATETIME_FORMAT);
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
                    if (from === 'manage') {
                        return [
                            {
                                label: '执行链接',
                                key: 'hasOnlineUrl',
                                type: 'select',
                                placeholder: '请选择有无执行链接',
                                checkOption: {
                                    rules: [
                                        {
                                            required: getRequiredHasOnlineUrl(props),
                                            message: '请选择有无执行链接',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    onChange: changeHasOnlineUrl.bind(this, objData, props),
                                },
                                disabled: getDisabledHasOnlineUrl(props),
                                options: ONLINE_URL,
                                getFormat: (value, form) => {
                                    form.hasOnlineUrl = Number(value);
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
                    if (from === 'manage' && Number(props.state.formData.hasOnlineUrl) === 1) {
                        return [
                            {
                                label: ' ',
                                key: 'projectingExecuteUrl',
                                placeholder: '请输入',
                                type: 'textarea',
                                componentAttr: {
                                    rows: 3,
                                    maxLength: 500,
                                    placeholder: '多个链接以英文逗号分隔',
                                    disabled: getDisabledExecuteUrl(props),
                                },
                                checkOption: {
                                    rules: [
                                        {
                                            required: getRequiredExecuteUrl(props),
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
                    if (from === 'manage') {
                        return [
                            {
                                label: '执行进度',
                                key: 'projectingAppointmentProgress',
                                placeholder: '请输入',
                                type: 'inputNumber',
                                checkOption: {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: getRequiredProgress(projectingAppointmentDTOList, props),
                                            message: '请输入执行进度',
                                        },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (!isNumber(value)) {
                                                    callback();
                                                    return;
                                                }
                                                const originData = getDataFromList(projectingAppointmentDTOList, props);
                                                if (originData && originData.projectAppointmentProgress) {
                                                    if (
                                                        !isNumber(value)
                                                        || value < Number(originData.projectAppointmentProgress)
                                                    ) {
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
                                    disabled: checkExecuteProgress(props),
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                (() => {
                    if (from === 'manage') {
                        return [
                            {
                                label: '权重',
                                key: 'projectingAppointmentWeight',
                                placeholder: '请输入',
                                type: 'inputNumber',
                                disabled: true,
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
                    if (from === 'manage' && Number(trailPlatformOrder) === 1) {
                        return [
                            {
                                label: '是否包含购物车',
                                key: 'hasShoppingCart',
                                placeholder: '请选择',
                                type: 'select',
                                options: IS_OR_NOT,
                                componentAttr: {
                                    onChange: changeHasShoppingCart.bind(this, objData, props),
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
