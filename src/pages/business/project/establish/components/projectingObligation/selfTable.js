/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import { dataMask4Number, getOptionName, isNumber, thousandSeparatorFixed } from '@/utils/utils';
import { CONTRACT_BRAND_TYPE, CONTRACT_PROGRESS_TYPE, IS_OR_NOT, CONTRACT_PRI_TYPE } from '@/utils/enum';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { renderTxt } from '@/utils/hoverPopover';
import { DATE_FORMAT, SPECIAL_DATETIME_FORMAT } from '@/utils/constants';
import styles from './index.less';
// 检测该条履约是否可以编辑
const checkCanEdit = (record) => {
    const { projectingAppointmentPath } = record;
    // 调整项不能编辑
    if (projectingAppointmentPath === '00') {
        return false;
    }
    return true;
};
// 检测该条履约是否可以删除
const checkCanDel = (record, formData) => {
    const { projectingAppointmentDTOList, projectBudgets } = formData;
    if (!Array.isArray(projectingAppointmentDTOList) || !Array.isArray(projectBudgets)) {
        return false;
    }
    const {
        projectingAppointmentTalentId,
        projectingAppointmentTalentType,
        projectLiveTime,
        projectAppointmentProgress,
        projectingAppointmentId,
        inUse,
        contractId,
    } = record;
    // 已使用的不允许删除
    if (inUse || contractId) {
        return false;
    }
    /* 执行链接、上线时间实际只在项目编辑时有
     * 项目编辑时分两种情况（项目中已有的数据A：含有projectingAppointmentId；新增的数据B）
     * A中有执行链接或执行进度时不能删除，B不受此限制
     */
    if (projectingAppointmentId && (projectLiveTime || Number(projectAppointmentProgress) > 0)) {
        return false;
    }
    // 履约义务列表中当前艺人的所有履约
    const arr = projectingAppointmentDTOList.filter((item) => {
        return (
            Number(item.projectingAppointmentTalentId) === Number(projectingAppointmentTalentId)
            && Number(item.projectingAppointmentTalentType) === Number(projectingAppointmentTalentType)
        );
    });
    // 当前艺人拥有大于1条履约时可以删除至1条
    if (arr.length > 1) {
        return true;
    }
    // 当前艺人的预算信息
    const index = projectBudgets.findIndex((item) => {
        return (
            Number(item.talentId) === Number(projectingAppointmentTalentId)
            && Number(item.talentType) === Number(projectingAppointmentTalentType)
        );
    });
    // 只有一条且有分成（预算）时不能删除
    if (index > -1) {
        return false;
    }
    // 默认可删除
    return true;
};
// 获取table列表头
export function columnsFn({ formData, from, callback }, props) {
    // const { platformData, trailPlatformOrder, trailOrderPlatformId } = formData;
    const { trailPlatformOrder, projectingType } = formData;
    let columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...arg) => {
                return arg[2] + 1;
            },
        },
        {
            title: '合同',
            dataIndex: 'contractCategory',
            render: (text, record) => {
                const type = getOptionName(CONTRACT_PRI_TYPE, text);
                return type ? `${type}${record.contractId}` : '无';
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'projectingAppointmentTalentName',
            render: (text, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.projectingAppointmentTalentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.projectingAppointmentTalentId,
                    name: text,
                    path,
                };
                return (
                    <span style={{ textAlign: 'center' }}>
                        <Information data={[data]} />
                    </span>
                );
            },
        },
        {
            title: '履约义务',
            dataIndex: 'projectingAppointmentName',
        },
        {
            title: '品牌',
            dataIndex: 'projectingAppointmentBrand',
            render: (text) => {
                if (Number(projectingType) === 4) {
                    return '-';
                }
                return getOptionName(CONTRACT_BRAND_TYPE, text) || '-';
            },
        },
        {
            title: '履约义务详情说明',
            dataIndex: 'projectingAppointmentDescription',
            width: 250,
            render: (text) => {
                if (Number(projectingType) === 4) {
                    return '-';
                }
                return text || '-';
            },
        },
    ];
    const projectingAppointmentProgressType = {
        title: '执行进度变更方式',
        dataIndex: 'projectingAppointmentProgressType',
        render: (text) => {
            return getOptionName(CONTRACT_PROGRESS_TYPE, text);
        },
    };
    const isSelfOrder = {
        title: '是否自下单',
        dataIndex: 'isSelfOrder',
        render: (text) => {
            return getOptionName(IS_OR_NOT, text);
        },
    };
    // const projectingPopularizePlatform = {
    //     title: '推广平台',
    //     dataIndex: 'projectingPopularizePlatform',
    //     width: 250,
    //     render: (text) => {
    //         return getOptionName(platformData, text || trailOrderPlatformId);
    //     },
    // };
    const executeMoney = {
        title: '执行金额',
        dataIndex: 'executeMoney',
        render: (text) => {
            return thousandSeparatorFixed(text);
        },
    };
    const divideAmountRate = {
        title: '佣金分成',
        dataIndex: 'divideAmountRate',
        render: (text) => {
            return (
                text !== undefined
                && dataMask4Number(text, 0, (value) => {
                    return `${value.toFixed(2)}%`;
                })
            );
        },
    };
    const divideRateTalent = {
        title: '分成比例(艺人：公司)',
        dataIndex: 'divideRateTalent',
        render: (text, record) => {
            return Number(record.divideRateTalent) + Number(record.divideRateCompany) === 100
                ? `${record.divideRateTalent}:${record.divideRateCompany}`
                : '';
        },
    };
    const projectingLiveTimePlan = {
        title: '上线日期(预计)',
        dataIndex: 'projectingLiveTimePlan',
        align: 'center',
        render: (text) => {
            if (Number(projectingType) === 4) {
                return text && moment(text).format(SPECIAL_DATETIME_FORMAT);
            }
            return text && moment(text).format(DATE_FORMAT);
        },
    };
    const projectingLiveTime = {
        title: '上线日期(实际)',
        dataIndex: 'projectingLiveTime',
        align: 'center',
        render: (text) => {
            if (Number(projectingType) === 4) {
                return text && moment(text).format(SPECIAL_DATETIME_FORMAT);
            }
            return text && moment(text).format(DATE_FORMAT);
        },
    };
    const projectingExecuteUrl = {
        title: '执行链接',
        dataIndex: 'projectingExecuteUrl',
        align: 'center',
        width: 100,
        render: (text, record) => {
            if (Number(projectingType) === 4) {
                return text;
            }
            if (record.projectingLiveTime) {
                if (text) {
                    return text.split(',').map((item, i) => {
                        return (
                            <p key={i}>
                                <a href={item} target="blank">
                                    {renderTxt(item, 8, 'bottom')}
                                </a>
                            </p>
                        );
                    });
                }
                return '无链接';
            }
        },
    };
    const projectingAppointmentProgress = {
        title: '执行进度',
        dataIndex: 'projectingAppointmentProgress',
        render: (text) => {
            return isNumber(text) && `${text}%`;
        },
    };
    const shoppingArr = [
        {
            title: '购物车链接',
            dataIndex: 'shoppingCartUrl',
            align: 'center',
            render: (text, record) => {
                if (!!record.hasShoppingCart && text) {
                    return text.split(',').map((item, i) => {
                        return (
                            <p key={i}>
                                <a href={item} target="blank">
                                    {item}
                                </a>
                            </p>
                        );
                    });
                }
            },
        },
        {
            title: '购物车产品',
            dataIndex: 'shoppingCartProduct',
            align: 'center',
            render: (text, record) => {
                return !!record.hasShoppingCart && text;
            },
        },
        {
            title: '产品下架时间',
            dataIndex: 'productSoldOutTime',
            align: 'center',
            render: (text, record) => {
                return !!record.hasShoppingCart && text && moment(text).format(DATE_FORMAT);
            },
        },
    ];
    const projectingAppointmentWeight = {
        title: '权重',
        dataIndex: 'projectingAppointmentWeight',
        render: (text) => {
            return (isNumber(text) && `${text}%`) || '-';
        },
    };
    const executeMoneyArr = [
        {
            title: '执行金额(最新)',
            dataIndex: 'appointmentExecuteMoney',
            render: (text) => {
                return (isNumber(text) && text) || '-';
            },
        },
        {
            title: '执行金额(累计)',
            dataIndex: 'appointmentExecuteMoneyTotal',
            render: (text) => {
                return (isNumber(text) && text) || '-';
            },
        },
    ];

    const operator = {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
            return (
                <div>
                    {!callback && checkCanEdit(record) && (
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.editTableLine(record);
                            }}
                        >
                            编辑
                        </span>
                    )}
                    {!callback && checkCanDel(record, formData, from) && (
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.delTableLine(record);
                            }}
                        >
                            删除
                        </span>
                    )}
                    {!!callback && from === 'manage' ? ( // 只有管理详情有查看
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                if (typeof callback === 'function') {
                                    callback(record.projectAppointmentId);
                                }
                            }}
                        >
                            查看
                        </span>
                    ) : null}
                </div>
            );
        },
    };
    if (from === 'establish') {
        columns.splice(1, 1);
        switch (Number(trailPlatformOrder)) {
            case 2:
                columns.push(projectingAppointmentProgressType);
                columns.push(isSelfOrder);
                // columns.push(projectingPopularizePlatform);
                columns.push(executeMoney);
                columns.push(divideRateTalent);
                columns.push(projectingLiveTimePlan);
                columns.push(operator);
                break;
            case 3:
                // columns.push(projectingPopularizePlatform);
                columns.push(divideAmountRate);
                columns.push(divideRateTalent);
                columns.push(projectingLiveTimePlan);
                columns.push(operator);
                break;
            default:
                // columns.push(projectingPopularizePlatform);
                columns.push(projectingLiveTimePlan);
                columns.push(operator);
                break;
        }
    }
    if (from === 'manage') {
        switch (Number(trailPlatformOrder)) {
            case 1:
                // columns.push(projectingPopularizePlatform);
                columns.push(projectingLiveTimePlan);
                columns.push(projectingLiveTime);
                columns.push(projectingExecuteUrl);
                columns.push(projectingAppointmentProgress);
                columns.push(projectingAppointmentWeight);
                columns = columns.concat(executeMoneyArr);
                if (Number(projectingType) !== 4) {
                    columns = columns.concat(shoppingArr);
                }
                columns.push(operator);
                break;
            case 2:
                columns.push(projectingAppointmentProgressType);
                columns.push(isSelfOrder);
                // columns.push(projectingPopularizePlatform);
                columns.push(executeMoney);
                columns.push(divideRateTalent);
                columns.push(projectingLiveTimePlan);
                columns.push(projectingLiveTime);
                columns.push(projectingExecuteUrl);
                columns.push(projectingAppointmentProgress);
                columns.push(projectingAppointmentWeight);
                columns = columns.concat(executeMoneyArr);
                columns.push(operator);
                break;
            case 3:
                // columns.push(projectingPopularizePlatform);
                columns.push(divideAmountRate);
                columns.push(divideRateTalent);
                columns.push(projectingLiveTimePlan);
                columns.push(projectingLiveTime);
                columns.push(projectingExecuteUrl);
                columns.push(projectingAppointmentProgress);
                columns.push(projectingAppointmentWeight);
                columns = columns.concat(executeMoneyArr);
                columns.push(operator);
                break;
            default:
                // columns.push(projectingPopularizePlatform);
                columns.push(projectingLiveTimePlan);
                columns.push(projectingLiveTime);
                columns.push(projectingExecuteUrl);
                columns.push(projectingAppointmentProgress);
                columns.push(projectingAppointmentWeight);
                columns = columns.concat(executeMoneyArr);
                columns.push(operator);
                break;
        }
    }
    return columns || [];
}
export default columnsFn;
