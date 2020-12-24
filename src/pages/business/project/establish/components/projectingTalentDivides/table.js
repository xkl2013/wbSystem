/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import React from 'react';
import { dataMask4Number, getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { checkEditDividesAuthority } from '@/pages/business/project/manage/config/authority';
import { CONTRACT_PRI_TYPE } from '@/utils/enum';
import styles from '../index.less';

const checkEdit = (formData, record) => {
    const { projectingAppointmentDTOList } = formData;
    const { talentId, talentType } = record;
    if (!checkEditDividesAuthority(formData)) {
        return false;
    }
    if (Array.isArray(projectingAppointmentDTOList)) {
        const appoint = projectingAppointmentDTOList.find((item) => {
            const {
                projectingAppointmentTalentId,
                projectingAppointmentTalentType,
                projectingLiveTime,
                projectingAppointmentProgress,
                contractId,
            } = item;
            // 项目编辑时，只要艺人履约义务有上线日期实际或执行进度或合同使用不允许编辑
            return (
                Number(projectingAppointmentTalentId) === Number(talentId)
                && Number(projectingAppointmentTalentType) === Number(talentType)
                && (projectingLiveTime || Number(projectingAppointmentProgress) > 0 || contractId)
            );
        });
        if (appoint) {
            return false;
        }
    }
    return true;
};
// 获取table列表头
export function columnsFn({ formData, from }, props) {
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
            title: '合同',
            dataIndex: 'contractCategory',
            render: (text, record) => {
                const type = getOptionName(CONTRACT_PRI_TYPE, text);
                return type ? `${type}${record.contractId}` : '无';
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'talentName',
            render: (text, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.talentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.talentId,
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
            title: '拆账比例',
            dataIndex: 'divideAmountRate',
            render: (text) => {
                return (
                    text !== undefined
                    && dataMask4Number(text, 0, (value) => {
                        return `${value.toFixed(4)}%`;
                    })
                );
            },
        },
        {
            title: '拆账金额',
            dataIndex: 'divideAmount',
            render: (text) => {
                return (
                    text !== undefined
                    && dataMask4Number(text, 0, (value) => {
                        return `¥ ${thousandSeparatorFixed(value, 2)}`;
                    })
                );
            },
        },
        {
            title: '分成比例(艺人：公司)',
            dataIndex: 'separateRatio',
            render: (text, record) => {
                return (
                    (record.divideRateTalent || record.divideRateCompany)
                    && `${dataMask4Number(record.divideRateTalent, 0, (value) => {
                        return value.toFixed(0);
                    })}:${dataMask4Number(record.divideRateCompany, 0, (value) => {
                        return value.toFixed(0);
                    })}`
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                if (from === 'manage') {
                    if (checkEdit(formData, record)) {
                        return (
                            <div>
                                <span
                                    className={styles.btnCls}
                                    onClick={() => {
                                        return props.editTableLine(record);
                                    }}
                                >
                                    编辑
                                </span>
                            </div>
                        );
                    }
                    return null;
                }
                // 立项时可以编辑、删除
                return (
                    <div>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.editTableLine(record);
                            }}
                        >
                            编辑
                        </span>
                        <span
                            className={styles.btnCls}
                            onClick={() => {
                                return props.delTableLine(record);
                            }}
                        >
                            删除
                        </span>
                    </div>
                );
            },
        },
    ];
    if (from === 'establish') {
        columns.splice(1, 1);
    }
    return columns || [];
}
export default columnsFn;
