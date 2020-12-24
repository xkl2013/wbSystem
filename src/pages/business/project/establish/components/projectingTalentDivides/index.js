import moment from 'moment';
import { accAdd } from '@/utils/calculate';
import { formatSelfCols } from './form';
import { columnsFn } from './table';

// 修改艺人时动态生成项目名称
const createProjectingName = (trailName, talentList) => {
    const projectingName = trailName || '';
    const time = moment().format('YYMM');
    let talentName = '';
    if (Array.isArray(talentList)) {
        if (talentList.length === 1) {
            talentName = talentList[0].talentName;
        } else if (talentList.length > 1) {
            talentName = '打包';
        }
    }
    return `${projectingName.trim()}*${talentName}*${time}`;
};

/**
 * 增删改艺人时同时修改艺人预算、履约义务、项目名称
 * @param obj               父组件提供的信息对象{formData,changeSelfForm}
 * @param from              使用来源（establish，manage）
 * @param key               对应该组件的key，一般没用
 * @param values            本次修改后的值
 * @param delIndex          删除的数据索引（使用索引必须保证数据顺序不变，此处不使用）
 * @param changedInfo       本次修改的详情（type：类型，oldItem：旧值，newItem：新值）
 */
const changeTalent = ({ obj, from }, key, values, delIndex, changedInfo) => {
    const { projectBudgets, projectingAppointmentDTOList, projectingTrailName } = obj.formData;
    let budgets = [...(projectBudgets || [])];
    let appoints = [...(projectingAppointmentDTOList || [])];
    if (changedInfo) {
        const { type, oldItem, newItem } = changedInfo;
        switch (type) {
            case 'add':
                budgets.push({
                    talentId: newItem.talentId,
                    talentType: newItem.talentType,
                    talentName: newItem.talentName,
                });
                appoints.push({
                    projectingAppointmentTalentId: newItem.talentId,
                    projectingAppointmentTalentType: newItem.talentType,
                    projectingAppointmentTalentName: newItem.talentName,
                });
                break;
            case 'edit':
                budgets.map((item) => {
                    if (
                        Number(item.talentId) === Number(oldItem.talentId)
                        && Number(item.talentType) === Number(oldItem.talentType)
                    ) {
                        item.talentId = newItem.talentId;
                        item.talentType = newItem.talentType;
                        item.talentName = newItem.talentName;
                    }
                    return item;
                });
                appoints.map((item) => {
                    if (
                        Number(item.projectingAppointmentTalentId) === Number(oldItem.talentId)
                        && Number(item.projectingAppointmentTalentType) === Number(oldItem.talentType)
                    ) {
                        item.projectingAppointmentTalentId = newItem.talentId;
                        item.projectingAppointmentTalentType = newItem.talentType;
                        item.projectingAppointmentTalentName = newItem.talentName;
                        // 艺人博主修改或删除后要清掉履约义务中对应艺人的数据
                        if (Number(item.projectingAppointmentTalentType) === 0) {
                            // 如果原数据为直播，需清空
                            if (item.projectingAppointmentPath === '0204') {
                                item.projectingAppointmentPath = undefined;
                            }
                            let checkCode = '';
                            if (item.projectingAppointmentPath) {
                                checkCode = item.projectingAppointmentPath.substr(0, 2);
                                // 如果原数据为代言类/广告推广
                                if (checkCode !== '01' && checkCode !== '02') {
                                    item.projectingAppointmentBrand = undefined;
                                }
                            }
                        } else {
                            item.projectingAppointmentBrand = undefined;
                        }
                    }
                    return item;
                });
                break;
            case 'del':
                budgets = budgets.filter((item) => {
                    return !(
                        Number(item.talentId) === Number(oldItem.talentId)
                        && Number(item.talentType) === Number(oldItem.talentType)
                    );
                });
                appoints = appoints.filter((item) => {
                    return !(
                        Number(item.projectingAppointmentTalentId) === Number(oldItem.talentId)
                        && Number(item.projectingAppointmentTalentType) === Number(oldItem.talentType)
                    );
                });
                break;
            default:
                break;
        }
    }
    const data = {
        projectingTalentDivides: values,
        projectBudgets: budgets,
        projectingAppointmentDTOList: appoints,
    };
    if (from === 'establish') {
        // 立项时需要自动生成项目名称
        data.projectingName = createProjectingName(projectingTrailName, values);
    }
    obj.changeSelfForm(data);
};
const renderProjectingTalentDivides = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    // 长期和cps不显示艺人博主分成
    return (
        Number(trailPlatformOrder) !== 2
        && Number(trailPlatformOrder) !== 3 && {
            title: '艺人博主分成',
            fixed: true,
            columns: [
                [
                    {
                        key: 'projectingTalentDivides',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            validateTrigger: 'onSubmit',
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '艺人博主分成信息填写不完整',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const flag = (value || []).find((el) => {
                                            return (
                                                accAdd(Number(el.divideRateCompany), Number(el.divideRateTalent))
                                                !== 100
                                            );
                                        });
                                        if (flag) {
                                            callback('艺人博主分成信息填写不完整');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                                // {
                                //     validator: (rule, value, callback) => {
                                //         let total = 0;
                                //         let money = 0;
                                //         if (value) {
                                //             value.map((item) => {
                                //                 total = accAdd(total, Number(item.divideAmountRate));
                                //                 money = accAdd(money, Number(item.divideAmount));
                                //                 return item;
                                //             });
                                //         }
                                //         if (
                                //             Number(total) !== 100
                                //             || Number(money) !== Number(obj.formData.projectingBudget)
                                //         ) {
                                //             callback('艺人博主拆账比例之和应为100%，拆账金额之和应等于签单额');
                                //             return;
                                //         }
                                //         callback();
                                //     },
                                // },
                            ],
                        },
                        componentAttr: {
                            formCols: formatSelfCols.bind(this, { obj, from }),
                            tableCols: columnsFn.bind(this, { formData: obj.formData, from }),
                            addBtnText: '添加艺人',
                            changeParentForm: changeTalent.bind(this, { obj, from }),
                            disabled: from === 'manage',
                        },
                    },
                ],
            ],
        }
    );
};
export default renderProjectingTalentDivides;
