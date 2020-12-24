import React, { PureComponent } from 'react';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';

export const formatColumns = (columnAttrObj, item) => {
    if (item.columnName === 'executeAmount') {
        return { ...columnAttrObj, questionText: '执行金额=SUM（项目返点明细中，“核算规则=计入”的执行金额）' };
    }
    if (item.columnName === 'taxesAmount') {
        return { ...columnAttrObj, questionText: '税费=SUM（项目返点明细中，“核算规则=计入”的税费）' };
    }
    if (item.columnName === 'platformPopularizeAmount') {
        return { ...columnAttrObj, questionText: '平台推广费=SUM（项目返点明细中，“核算规则=计入”的平台推广费）' };
    }
    if (item.columnName === 'yearFrameChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费=SUM（项目返点明细中，“核算规则=计入”的年框渠道营销费）',
        };
    }
    if (item.columnName === 'yearFrameCompanyChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（公司）=SUM（项目返点明细中，“核算规则=计入”的年框渠道营销费（公司））',
        };
    }
    if (item.columnName === 'yearFrameTalentChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（Talent）=SUM（项目返点明细中，“核算规则=计入”的年框渠道营销费（Talent））',
        };
    }
    if (item.columnName === 'checkDate') {
        return {
            ...columnAttrObj,
            questionText: `1.核算起始日期≤当前访问时间≤核算终止日期：日期为蓝色
                 2.当前访问时间≤核算起始日期：日期为绿色
                 3.核算终止日期≤当前访问时间：日期为红色`,
        };
    }
    return columnAttrObj;
};
/**
 * 更多配置在config
 */
export default class Followup extends PureComponent {
    render() {
        const attr = businessConfig[34] || {};
        return <AriTable {...attr} formatColumns={formatColumns} />;
    }
}
