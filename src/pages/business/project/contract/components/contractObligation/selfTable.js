/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import { getOptionName, isNumber } from '@/utils/utils';
import { CONTRACT_BRAND_TYPE, CONTRACT_PROGRESS_TYPE } from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import styles from './index.less';
// 检测该条履约是否可以编辑
const checkCanEdit = (record) => {
    const { contractAppointmentPath } = record;
    // 调整项不能编辑
    if (contractAppointmentPath === '00') {
        return false;
    }
    return true;
};
// 检测该条履约义务是否可删除
const checkCanDel = (record, formData) => {
    const { contractAppointmentList, contractBudgetList } = formData;
    if (!Array.isArray(contractAppointmentList) || !Array.isArray(contractBudgetList)) {
        return false;
    }
    const {
        contractAppointmentTalentId,
        contractAppointmentTalentType,
        contractAppointmentProgress,
        liveTime,
        contractAppointmentPath,
    } = record;
    // 调整项不能编辑
    if (contractAppointmentPath === '00') {
        return false;
    }
    // 执行进度>0不允许删除（执行进度此处不能编辑，如果有就不是新增的数据，不需要判断新增的情况）
    if (contractAppointmentProgress && Number(contractAppointmentProgress) > 0) {
        return false;
    }
    // 有上线日期实际不能删除
    if (liveTime) {
        return false;
    }
    // 当前艺人拥有的所有履约义务
    const arr = contractAppointmentList.filter((item) => {
        return (
            Number(item.contractAppointmentTalentId) === Number(contractAppointmentTalentId)
            && Number(item.contractAppointmentTalentType) === Number(contractAppointmentTalentType)
        );
    });
    // 艺人拥有的履约义务大于1条时可以删除（保证至少有一条）
    if (arr.length > 1) {
        return true;
    }
    // 该艺人的艺人预算信息（预算与分成是一一对应的，预算是必填的，分成可能非必填）
    const index = contractBudgetList.findIndex((item) => {
        return (
            Number(item.talentId) === Number(contractAppointmentTalentId)
            && Number(item.talentType) === Number(contractAppointmentTalentType)
        );
    });
    // 只有一条且有预算（分成）时不能删除
    if (index > -1) {
        return false;
    }
    return true;
};
// 获取table列表头
export function columnsFn(obj, props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...arg) => {
                return arg[2] + 1;
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'contractAppointmentTalentName',
        },
        {
            title: '履约义务',
            dataIndex: 'contractAppointmentName',
        },
        {
            title: '品牌',
            dataIndex: 'contractAppointmentBrand',
            render: (text) => {
                return getOptionName(CONTRACT_BRAND_TYPE, text) || '-';
            },
        },
        {
            title: '履约义务详情说明',
            dataIndex: 'contractAppointmentDescription',
            width: 250,
        },
        {
            title: '起始日期',
            dataIndex: 'contractAppointmentStart',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '终止日期',
            dataIndex: 'contractAppointmentEnd',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '上线日期(预计)',
            dataIndex: 'liveTimePlan',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '权重',
            dataIndex: 'contractAppointmentWeight',
            render: (text) => {
                return (isNumber(text) && `${text}%`) || '-';
            },
        },
        {
            title: '执行进度变更方式',
            dataIndex: 'contractAppointmentProgressType',
            render: (text) => {
                return getOptionName(CONTRACT_PROGRESS_TYPE, text);
            },
        },
        {
            title: '执行金额(最新)',
            dataIndex: 'appointmentExecuteMoney',
            render: (text) => {
                return isNumber(text) ? text : '-';
            },
        },
        {
            title: '执行金额(累计)',
            dataIndex: 'appointmentExecuteMoneyTotal',
            render: (text) => {
                return isNumber(text) ? text : '-';
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        {checkCanEdit(record) && (
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editTableLine(record);
                                }}
                            >
                                编辑
                            </span>
                        )}
                        {checkCanDel(record, obj.formData) && (
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.delTableLine(record);
                                }}
                            >
                                删除
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
export default columnsFn;
