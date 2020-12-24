/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { SCHEDULE_REMINDER, SCHEDULE_PERMISSION, TASK_STATUS, PRIORITY_TYPE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import FileDetail from '@/components/upload/detail';
import IconFont from '@/components/CustomIcon/IconFont';
import { SPECIAL_DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';
// import SubTask from '../../../subTask';
import SubTask from '../components/subTask';
import TagCom from '../components/tag';

export const formatDetailCols = (params, { getData, getDetailData }) => {
    // const { projectAndPanelAccessibleStatus } = params.formData || {};
    // const isShow = Number(projectAndPanelAccessibleStatus) !== 3; // 判断是否展示所属项目和列表
    const { parentScheduleId } = params.formData || {};
    const { scheduleType = {}, taskData } = params;
    const { projectName, schedulePanelList } = scheduleType || {};
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
            title: '任务内容',
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
        !parentScheduleId
            ? {
                title: '所属项目',
                key: 'scheduleProjectDto',
                render: () => {
                    return projectName;
                    // return getOptionName(params.scheduleProjectDto || [], data);
                },
            }
            : {},
        !parentScheduleId
            ? {
                title: '所属列表',
                key: 'schedulePanelList',
                render: (data) => {
                    if (Array.isArray(schedulePanelList) && schedulePanelList.length) {
                        return schedulePanelList[0].panelName;
                    }

                    return getOptionName(params.schedulePanelList || [], data);
                },
            }
            : {},
        params.isEdit === 1
            ? {
                title: '任务状态',
                key: 'finishFlag',
                render: (data) => {
                    return getOptionName(TASK_STATUS, data);
                },
            }
            : {},
        {
            title: '负责人',
            key: 'scheduleMemberList',
            render: (data) => {
                let name = '无';
                if (data) {
                    data.forEach((item) => {
                        if (item.memberType === 1) {
                            name = item.memberName;
                        }
                    });
                }
                return name;
            },
        },
        {
            title: '时间',
            key: 'daterange',
            render: (data) => {
                if (!data || data.length === 0) return '无排期';
                const format = params.formData.wholeDayFlag ? DATE_FORMAT : SPECIAL_DATETIME_FORMAT;
                let date = '';
                if (data) {
                    date = `${moment(data[0]).format(format)} ~ ${moment(data[1]).format(format)}`;
                }
                return date;
            },
        },
        {
            title: '优先级',
            key: 'schedulePriority',
            render: (data) => {
                const color = () => {
                    switch (Number(data)) {
                        case 1:
                            return { color: '#848f9b', icon: 'iconputongjinji' };
                        case 2:
                            return { color: '#F7B500', icon: 'iconjinji' };
                        case 3:
                            return { color: '#F05969', icon: 'iconfeichangjinji' };
                        default:
                            break;
                    }
                };
                const colorObj = color() || {};
                return (
                    <div style={{ color: colorObj.color }}>
                        <IconFont type={`${colorObj.icon}`} />
                        {getOptionName(PRIORITY_TYPE, data)}
                    </div>
                );
            },
        },
        {
            title: '标签',
            key: 'scheduleTagRelationDto',
            render: (data) => {
                return <TagCom hideAddBtn tagList={data && data.scheduleTagRelationList} />;
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
        {
            title: '子任务',
            key: 'scheduleWriteVoList',
            render: (data) => {
                return (
                    // <SubTask
                    //     taskData={taskData}
                    // // treeData={data}
                    // // paramsObj={params}
                    // // getData={getData}
                    // // getDetailData={getDetailData}
                    // // renderNoticers={params.renderNoticers}
                    // // goChildModal={params.goChildModal}
                    // />
                    <SubTask
                        // modeType="detail"
                        treeData={data}
                        taskData={taskData}
                        paramsObj={params}
                        getData={getData}
                        getDetailData={getDetailData}
                        renderNoticers={params.renderNoticers}
                        goChildModal={params.goChildModal}
                    />
                );
            },
        },
    ];
};
export default { formatDetailCols };
