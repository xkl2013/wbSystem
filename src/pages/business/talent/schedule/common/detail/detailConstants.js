/**
 * 新增/编辑form表单cols
 * */
import moment from 'moment';
import React from 'react';
import { Popover } from 'antd';
import NotifyNode from '@/components/notifyNode';
import { getOptionName } from '@/utils/utils';

import { DATE_FORMAT } from '@/utils/constants';
import { IS_OR_NOT } from '@/utils/enum';
import icon from '@/assets/yiwen.png';
import styles from './styles.less';

const urlReg = /((http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+))/g;

export const formatDetailCols = (params) => {
    return [
        {
            title: `${params.talentType === 0 ? '艺人姓名' : '博主姓名'}`,
            key: 'talentName',
        },
        {
            title: '项目时间',
            key: 'projectStartDate',
            render: () => {
                return `${moment(params.formData.projectStartDate).format(DATE_FORMAT)} ~ ${moment(
                    params.formData.projectEndDate,
                ).format(DATE_FORMAT)}`;
            },
        },
        {
            title: '项目类型',
            key: 'projectType',
            render: (data) => {
                return getOptionName(params.projectType, data);
            },
        },
        {
            title: '当前所在地',
            key: 'currentAddress',
        },
        {
            title: '负责人',
            key: 'talentCalendarHeaderDTOList',
            render: (data) => {
                return (
                    <NotifyNode
                        hideBtn={true}
                        newItemBottom={{ lineHeight: '14px' }}
                        newContent={{ padding: '5px 0' }}
                        data={params.renderNoticers(data || [])}
                    />
                );
            },
        },
        {
            title: '参与人',
            key: 'talentCalendarUserDTOList',
            render: (data) => {
                return (
                    <NotifyNode
                        hideBtn={true}
                        newItemBottom={{ lineHeight: '14px' }}
                        newContent={{ padding: '5px 0' }}
                        data={params.renderNoticers(data || [])}
                    />
                );
            },
        },
        {
            title: '项目说明',
            key: 'projectRemark',
        },
        params.talentType === 1
            ? {
                title: '履约义务',
                key: 'projectAppointmentName',
                render: () => {
                    return (
                        <div className={styles.itemIcon}>
                            <span>{params.formData.projectAppointmentName}</span>
                            {params.formData.projectAppointmentRemark && (
                                <Popover content={params.formData.projectAppointmentRemark}>
                                    <img src={icon} alt="" />
                                </Popover>
                            )}
                        </div>
                    );
                },
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线日期(预计)',
                key: 'onlineDatePlan',
                render: (data) => {
                    return (data && moment(data).format(DATE_FORMAT)) || '--';
                },
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线日期(实际)',
                key: 'onlineDate',
                render: (data) => {
                    return (data && moment(data).format(DATE_FORMAT)) || '--';
                },
            }
            : {},
        params.talentType === 1
            ? {
                title: '上线链接',
                key: 'onlineUrl',
                render: (data) => {
                    if (!params.formData.onlineDate) {
                        return '--';
                    }
                    if (!data) {
                        return '无链接';
                    }
                    // eslint-disable-next-line
                      const d = data && data.replace(urlReg, '<a target=' + "'_blank'" + " href='$1'>$1</a>");
                    // eslint-disable-next-line
                      return <div dangerouslySetInnerHTML={{ __html: d }} />;
                },
            }
            : {},
        params.talentType === 1
            ? {
                title: '是否投放',
                key: 'popularizeFlag',
                render: (data) => {
                    return (data && getOptionName(IS_OR_NOT, data)) || '否';
                },
            }
            : {},
    ];
};
export default {
    formatDetailCols,
};
