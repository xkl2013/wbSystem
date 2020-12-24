/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { SCHEDULE_REMINDER, SCHEDULE_PERMISSION, ALLOW_SCHEDULE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import FileDetail from '@/components/upload/detail';
import { SPECIAL_DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';

export const formatDetailCols = (params) => {
    const renderDom = (data, type) => {
        // 展示成员
        const memberList = [];
        if (data) {
            const newData = data;
            newData.forEach((item) => {
                if (Number(item.memberType) === type) {
                    const newItem = { ...item };
                    newItem.userName = item.memberName;
                    newItem.avatar = item.memberAvatar;
                    newItem.userId = item.memberId;
                    memberList.push(newItem);
                }
            });
        }
        return (
            <NotifyNode
                hideBtn={true}
                ewItemBottom={{ lineHeight: '14px' }}
                newContent={{ padding: '5px 0' }}
                data={params.renderNoticers(memberList || [])}
            />
        );
    };
    return [
        {
            title: '日程内容',
            key: 'scheduleName',
        },
        {
            title: '描述',
            key: 'description',
            render: (data) => {
                const myString = (data || '').replace(/(\r\n|\n|\r)/gm, '<br />');
                return <div dangerouslySetInnerHTML={{ __html: myString }} />;
            },
        },
        {
            title: '所属日历',
            key: 'scheduleType',
            render: (data) => {
                return getOptionName(ALLOW_SCHEDULE, data);
            },
        },
        {
            title: '时间',
            key: 'daterange',
            render: (data) => {
                const format = params.formData.wholeDayFlag ? DATE_FORMAT : SPECIAL_DATETIME_FORMAT;
                let date = '';
                if (data) {
                    date = `${moment(data[0]).format(format)} ~ ${moment(data[1]).format(format)}`;
                }
                return date;
            },
        },
        {
            title: '创建人',
            key: 'scheduleMemberList',
            render: (data) => {
                return renderDom(data, 0);
            },
        },
        {
            title: '参与人',
            key: 'scheduleMemberList',
            render: (data) => {
                return renderDom(data, 2);
            },
        },
        {
            title: '提醒',
            key: 'timeIntervalFlag',
            render: (data) => {
                return getOptionName(SCHEDULE_REMINDER, data);
            },
        },
        {
            title: '会议室',
            key: 'scheduleResource',
            render: (data) => {
                return data ? data.resourceName : '无';
            },
        },
        {
            title: '权限',
            key: 'privateFlag',
            render: (data) => {
                return getOptionName(SCHEDULE_PERMISSION, data);
            },
        },
        {
            title: '上传附件',
            key: 'scheduleAttachmentList',
            render: (data) => {
                const newData = data;
                if (newData) {
                    newData.forEach((item, i) => {
                        const newItem = { ...item };
                        newItem.name = item.scheduleAttachmentName;
                        newItem.value = item.scheduleAttachmentUrl;
                        newItem.domain = item.scheduleAttachmentDomain;
                        newItem.size = item.scheduleAttachmentSize;
                        newData[i] = newItem;
                    });
                }
                return <FileDetail data={newData} />;
            },
        },
        {
            title: '知会人',
            key: 'scheduleMemberList',
            render: (data) => {
                return renderDom(data, 3);
            },
        },
    ];
};
export default { formatDetailCols };
