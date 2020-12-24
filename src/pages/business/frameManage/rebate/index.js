import React, { PureComponent } from 'react';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';
import { GroupText } from '../components/step/detail';

export const formatColumns = (columnAttrObj, item) => {
    if (item.columnName === 'executeAmount') {
        return { ...columnAttrObj, questionText: '执行金额=“本次新增”执行金额' };
    }
    if (item.columnName === 'taxesAmount') {
        return { ...columnAttrObj, questionText: '税费=执行金额*税费比例（税费比例在创建客户年框时配置）' };
    }
    if (item.columnName === 'platformPopularizeAmount') {
        return { ...columnAttrObj, questionText: '平台推广费=SUM（该项目合同对应履约义务下的平台推广费）' };
    }
    if (item.columnName === 'yearFrameChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费=（执行金额-平台推广费-税费）*返点比例',
        };
    }
    if (item.columnName === 'yearFrameCompanyChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（公司）=年框渠道营销费-年框渠道营销费（Talent）',
        };
    }
    if (item.columnName === 'yearFrameTalentChannelAmount') {
        return {
            ...columnAttrObj,
            questionText: '年框渠道营销费（Talent）=年框渠道营销费*Talent承担比例（固定比例）',
        };
    }
    return columnAttrObj;
};
/**
 * 更多配置在config
 */
export default class Followup extends PureComponent {
    renderGroupText = (text, col) => {
        if (col.columnName === 'pointGress') {
            return <GroupText value={text} />;
        }
        return text;
    };

    render() {
        const attr = businessConfig[33] || {};
        return <AriTable {...attr} renderGroupText={this.renderGroupText} formatColumns={formatColumns} />;
    }
}
