import React, { PureComponent } from 'react';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';

export const formatColumns = (columnAttrObj, item) => {
    if (item.columnName === 'executeAmount') {
        return { ...columnAttrObj, questionText: '执行金额=SUM（该项目在项目返点明细中的执行金额）' };
    }
    if (item.columnName === 'taxesAmount') {
        return { ...columnAttrObj, questionText: '税费=SUM（该项目在项目返点明细中的税费）' };
    }
    if (item.columnName === 'platformPopularizeAmount') {
        return { ...columnAttrObj, questionText: '平台推广费=SUM（该项目在项目返点明细中的平台推广费）' };
    }
    if (item.columnName === 'yearFrameChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费=SUM（该项目在项目返点明细中的年框渠道营销费）',
        };
    }
    if (item.columnName === 'yearFrameCompanyChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（公司）=SUM（该项目在项目返点明细中的年框渠道营销费（公司））',
        };
    }
    if (item.columnName === 'yearFrameTalentChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（Talent）=SUM（该项目在项目返点明细中的年框渠道营销费（Talent））',
        };
    }
    return columnAttrObj;
};
/**
 * 更多配置在config
 */
export default class Followup extends PureComponent {
    render() {
        const attr = businessConfig[35] || {};
        return <AriTable {...attr} formatColumns={formatColumns} />;
    }
}
