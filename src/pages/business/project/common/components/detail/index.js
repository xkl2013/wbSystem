/**
 *@author   zhangwenshuai
 *@date     2019-06-22 13:33
 * */
import React, { PureComponent } from 'react';
import moment from 'moment';
import FlexDetail from '@/components/flex-detail';
import { DATE_FORMAT } from '@/utils/constants';
import BITable from '@/ant_components/BITable';
import { PARTICIPANT_TYPE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import {
    getGeneralCols,
    getCompanyCols,
    getClauseCols,
    getHeaderCols,
    getParticipateCols,
    getStatusCols,
    getCreatorCols,
    getVarietyCols,
    getMovieCols,
    getExecutorCols,
    getCooperateCols,
    getDividesCols,
    getBudgetInfoCols,
    getObligationCols,
    getReturnCols,
} from './basic';

const LabelWrap11 = [
    {
        title: '角色',
        align: 'center',
        dataIndex: 'participantType',
        render: (detail) => {
            return getOptionName(PARTICIPANT_TYPE, detail);
        },
    },
    {
        title: '转交前',
        align: 'center',
        dataIndex: 'handoverUserName',
    },
    {
        title: '接收人',
        align: 'center',
        dataIndex: 'recipientUserName',
    },
    {
        title: '转交时间',
        align: 'center',
        dataIndex: 'handoverTime',
        render: (text) => {
            return text && moment(text).format(DATE_FORMAT);
        },
    },
    {
        title: '说明',
        align: 'center',
        dataIndex: 'remark',
    },
];

class CommonDetail extends PureComponent {
    render() {
        const { formData, connectData } = this.props;
        return (
            <>
                <FlexDetail LabelWrap={getGeneralCols(formData)} detail={formData} title="项目基本信息" />
                <FlexDetail LabelWrap={getCompanyCols(formData)} detail={formData} title="企业信息" />

                {Number(formData.projectingType) === 2 && (
                    <FlexDetail LabelWrap={getVarietyCols} detail={formData} title="综艺信息" />
                )}
                {Number(formData.projectingType) === 3 && (
                    <FlexDetail LabelWrap={getMovieCols} detail={formData} title="影视信息" />
                )}

                <FlexDetail LabelWrap={getClauseCols(formData)} detail={formData} title="项目条款信息" />
                {Number(formData.trailPlatformOrder) !== 2 && Number(formData.trailPlatformOrder) !== 3 && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="艺人博主分成">
                        {getDividesCols(formData, 'establish')}
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={[[]]} detail={formData} title="履约义务明细">
                    {getObligationCols(formData, 'establish')}
                </FlexDetail>
                <FlexDetail LabelWrap={[[]]} detail={formData} title="项目预算信息">
                    {getBudgetInfoCols(formData)}
                </FlexDetail>
                {Number(formData.trailPlatformOrder) === 2 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="回款计划">
                        {getReturnCols(formData)}
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={getHeaderCols} detail={formData} title="负责人信息" />
                <FlexDetail LabelWrap={getCooperateCols(formData)} detail={formData} title="合作人信息" />
                <FlexDetail LabelWrap={getExecutorCols} detail={formData} title="执行人信息" />
                <FlexDetail LabelWrap={getParticipateCols} detail={formData} title="参与人信息" />
                <FlexDetail LabelWrap={getStatusCols(formData)} detail={formData} title="状态信息" />
                <FlexDetail LabelWrap={getCreatorCols} detail={formData} title="更新信息" />
                {Array.isArray(connectData) && connectData.length > 0 && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="转交记录">
                        <BITable
                            rowKey="id"
                            dataSource={connectData}
                            bordered
                            pagination={false}
                            columns={LabelWrap11}
                        />
                    </FlexDetail>
                )}
            </>
        );
    }
}

export default CommonDetail;
