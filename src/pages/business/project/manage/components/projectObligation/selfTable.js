/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { dataMask4Number, getOptionName, isNumber, thousandSeparatorFixed } from '@/utils/utils';
import { CONTRACT_BRAND_TYPE, CONTRACT_PROGRESS_TYPE, IS_OR_NOT } from '@/utils/enum';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { checkEditAppointAuthority } from '../../config/authority';

const checkCanDel = (record, formData) => {
    const { projectAppointments, projectingTalentDivides } = formData;
    const {
        projectAppointmentTalentId,
        projectAppointmentTalentType,
        projectExecuteUrl,
        projectAppointmentProgress,
    } = record;
    // 有执行链接或执行进度时不能删除
    if (projectExecuteUrl || (projectAppointmentProgress && projectAppointmentProgress > 0)) {
        return false;
    }
    const arr = projectAppointments.filter((item) => {
        return (
            Number(item.projectAppointmentTalentId) === Number(projectAppointmentTalentId)
            && Number(item.projectAppointmentTalentType) === Number(projectAppointmentTalentType)
        );
    });
    // 大于1条时可以删除
    if (arr.length > 1) {
        return true;
    }
    const divides = projectingTalentDivides.find((item) => {
        return (
            Number(item.talentId) === Number(projectAppointmentTalentId)
            && Number(item.talentType) === Number(projectAppointmentTalentType)
        );
    });
    // 只有一条且有分成时不能删除
    if (divides && Number(divides.divideAmountRate) > 0) {
        return false;
    }
    return true;
};
// 获取table列表头
export function columnsFn({ formData, from }, props) {
    const { platformData, trailPlatformOrder } = formData;
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...arg) => {
                return arg[2] + 1;
            },
            fixed: 'left',
            width: 50,
        },
        {
            title: '艺人/博主',
            dataIndex: 'projectAppointmentTalentName',
            render: (text, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.projectAppointmentTalentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.projectAppointmentTalentId,
                    name: text,
                    path,
                };
                return (
                    <span style={{ textAlign: 'center' }}>
                        <Information data={[data]} />
                    </span>
                );
            },
            fixed: 'left',
            width: 150,
        },
        {
            title: '履约义务',
            dataIndex: 'projectAppointmentName',
        },
        {
            title: '品牌',
            dataIndex: 'projectAppointmentBrand',
            render: (text) => {
                return getOptionName(CONTRACT_BRAND_TYPE, text) || '-';
            },
        },
        {
            title: '履约义务详情说明',
            dataIndex: 'projectAppointmentDescription',
        },
        {
            title: '推广平台',
            dataIndex: 'projectPopularizePlatform',
            render: (text) => {
                return getOptionName(platformData, text);
            },
        },
        {
            title: '上线时间',
            dataIndex: 'projectLiveTime',
            align: 'center',
            render: (text) => {
                return text && moment(text).format(DATETIME_FORMAT);
            },
        },
        {
            title: '执行链接',
            dataIndex: 'projectExecuteUrl',
            align: 'center',
            render: (text) => {
                if (text) {
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
            title: '执行进度',
            dataIndex: 'projectAppointmentProgress',
            render: (text) => {
                return isNumber(text) && `${text}%`;
            },
        },
        {
            title: '购物车链接',
            dataIndex: 'shoppingCartUrl',
            align: 'center',
            render: (text) => {
                if (text) {
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
        {
            title: '操作',
            dataIndex: 'operate',
            fixed: 'right',
            width: 150,
            render: (text, record, i) => {
                const recordData = record;
                recordData.disabled = i < formData.projectBudgets.length;
                return (
                    checkEditAppointAuthority(formData) && (
                        <div>
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editTableLine(recordData);
                                }}
                            >
                                编辑
                            </span>
                            {checkCanDel(record, formData) && (
                                <span
                                    className={styles.btnCls}
                                    onClick={() => {
                                        return props.delTableLine(recordData);
                                    }}
                                >
                                    删除
                                </span>
                            )}
                        </div>
                    )
                );
            },
        },
    ];
    if (Number(trailPlatformOrder) === 2) {
        columns.splice(5, 0, {
            title: '执行进度变更方式',
            dataIndex: 'projectAppointmentProgressType',
            render: (text) => {
                return getOptionName(CONTRACT_PROGRESS_TYPE, text);
            },
        });
        columns.splice(6, 0, {
            title: '是否自下单',
            dataIndex: 'isSelfOrder',
            render: (text) => {
                return getOptionName(IS_OR_NOT, text);
            },
        });
        columns.splice(8, 0, {
            title: '执行金额',
            dataIndex: 'executeMoney',
            render: (text) => {
                return thousandSeparatorFixed(text);
            },
        });
        columns.splice(9, 0, {
            title: '分成比例(艺人：公司)',
            dataIndex: 'divideRateTalent',
            render: (text, record) => {
                return Number(record.divideRateTalent) + Number(record.divideRateCompany) === 100
                    ? `${record.divideRateTalent}:${record.divideRateCompany}`
                    : '';
            },
        });
        columns.splice(13, 3);
    }
    if (Number(trailPlatformOrder) === 3) {
        columns.splice(6, 0, {
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
        });
        columns.splice(7, 0, {
            title: '分成比例(艺人：公司)',
            dataIndex: 'divideRateTalent',
            render: (text, record) => {
                return Number(record.divideRateTalent) + Number(record.divideRateCompany) === 100
                    ? `${record.divideRateTalent}:${record.divideRateCompany}`
                    : '';
            },
        });
        columns.splice(11, 3);
    }
    if (from === 'detail') {
        columns.pop();
    }
    return columns || [];
}
export default columnsFn;
