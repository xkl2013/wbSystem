import React from 'react';
import { getOptionName, getOptionKeyByRelatedKey, riseDimension } from '@/utils/utils';
import {
    PROJECT_AGENT_ORDER,
    PROJECT_INFO_TYPE,
    PROJECT_LEVEL,
    PROJECT_ORDER_TYPE,
    PROJECT_SOURCE,
    PROJECT_YEAR_FRAME_TYPE,
} from '@/utils/enum';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { renderTxt } from '@/utils/hoverPopover';

const getGeneralCols = (formData) => {
    const projectingType = {
        key: 'projectingType',
        label: '项目类型',
        render: (detail) => {
            const PROJECT_TYPE = detail.projectType;
            let str = getOptionKeyByRelatedKey(PROJECT_TYPE, 'index', detail.projectingType, 'value');
            if (str && Number(detail.projectingType) === 1) {
                str += `/${getOptionKeyByRelatedKey(
                    PROJECT_TYPE[0].children,
                    'index',
                    detail.trailPlatformOrder,
                    'value',
                )}`;
            }
            return str;
        },
    };
    const projectingName = {
        key: 'projectingName',
        label: '项目名称',
        render: (detail) => {
            return renderTxt(detail.projectingName);
        },
    };
    const cols = [
        projectingType,
        {
            key: 'projectingCategory',
            label: '项目明细分类',
            render: (detail) => {
                return getOptionName(PROJECT_INFO_TYPE, detail.projectingCategory);
            },
        },
        {
            key: 'projectingTrailId',
            label: Number(formData.projectingTrailType) === 2 ? '内容客户跟进' : '商务客户跟进',
            render: (detail) => {
                if (Number(detail.projectingTrailType) === 2) {
                    if (detail && detail.contentCustomerFollowUp) {
                        const { projectName, id } = detail.contentCustomerFollowUp;
                        const contentConfig = businessConfig[26];
                        const data = {
                            id: id && id[0] && id[0].value,
                            name: projectName && projectName[0] && projectName[0].text,
                            path: contentConfig.pathname,
                        };
                        return <Information data={[data]} moduleConfig={{ moduleType: 26, moduleOrigin: 'history' }} />;
                    }
                } else if (Number(detail.projectingTrailType) === 3) {
                    if (detail && detail.customerFollowUp) {
                        const { customerNameInput, id } = detail.customerFollowUp;
                        const contentConfig = businessConfig[12];
                        const data = {
                            id: id && id[0] && id[0].value,
                            name: customerNameInput && customerNameInput[0] && customerNameInput[0].text,
                            path: contentConfig.pathname,
                        };
                        return (
                            <Information
                                data={[data]}
                                moduleConfig={{
                                    moduleType: 12,
                                    moduleOrigin: 'history',
                                }}
                            />
                        );
                    }
                } else if (detail && detail.trail) {
                    const trailConfig = businessConfig[4];
                    const data = {
                        id: detail.trail.trailId,
                        name: detail.trail.trailName,
                        path: trailConfig.pathname,
                    };
                    return <Information data={[data]} />;
                }
            },
        },
        projectingName,
        {
            key: 'projectingLevel',
            label: '项目级别',
            render: (detail) => {
                return getOptionName(PROJECT_LEVEL, detail.projectingLevel);
            },
        },
        {
            key: 'projectingSource',
            label: '项目来源',
            render: (detail) => {
                const options = detail.projectingType
                    && PROJECT_SOURCE.find((item) => {
                        return Number(item.id) === Number(detail.projectingType);
                    });
                if (options) {
                    return getOptionName(options.child || [], detail.projectingSource);
                }
                return detail.projectingType;
            },
        },
        {
            key: 'projectingRecommender',
            label: '推荐人',
        },
    ];
    const trailOrderPlatformId = {
        key: 'trailOrderPlatformId',
        label: '下单平台',
        render: (detail) => {
            return getOptionName(detail.platformData || [], detail.trailOrderPlatformId);
        },
    };
    const projectingOrderType = {
        key: 'projectingOrderType',
        label: '下单方式',
        render: (detail) => {
            return getOptionName(PROJECT_ORDER_TYPE, detail.projectingOrderType);
        },
    };
    const projectingOrderNumber = {
        key: 'projectingOrderNumber',
        label: '星图任务ID',
    };
    const isAgent = {
        key: 'isAgentOrder',
        label: '下单类型',
        render: (detail) => {
            return getOptionName(PROJECT_AGENT_ORDER, detail.isAgentOrder);
        },
    };
    const commonOrderName = {
        key: 'commonOrderName',
        label: '代下单项目',
    };
    const yearFrameType = {
        key: 'yearFrameType',
        label: '年框',
        render: (detail) => {
            return getOptionName(PROJECT_YEAR_FRAME_TYPE, detail.yearFrameType);
        },
    };
    const yearFrameName = {
        key: 'yearFrameName',
        label: '关联年框',
    };
    const description = {
        key: 'projectingDescription',
        label: '备注',
        render: (detail) => {
            return renderTxt(detail.projectingDescription);
        },
    };
    if (Number(formData.projectingType) === 4) {
        // 直播项目只展示类型和名称
        return riseDimension([projectingType, projectingName]);
    }
    if (Number(formData.trailPlatformOrder) === 1) {
        // 平台单显示下单平台
        cols.push(trailOrderPlatformId);
        if (Number(formData.trailOrderPlatformId) === 1) {
            // 下单平台为抖音星图显示下单方式和人物ID
            cols.push(projectingOrderType);
            if (Number(formData.projectingOrderType) === 1) {
                cols.push(projectingOrderNumber);
            }
        }
    }
    cols.push(isAgent);
    if (Number(formData.isAgentOrder) === 1) {
        cols.push(commonOrderName);
    }
    if (formData.yearFrameType) {
        cols.push(yearFrameType);
        cols.push(yearFrameName);
    }
    cols.push(description);
    return riseDimension(cols);
};
export default getGeneralCols;
