import {
    renderProjectingType,
    renderTrailName,
    renderProjectingName,
    renderProjectingCategory,
    renderProjectingLevel,
    renderProjectingSource,
    renderProjectingDescription,
    renderProjectingRecommend,
    renderProjectingCustomerName,
    renderVariety,
    renderProjectingBudget,
    renderProjectingSigningDate,
    renderProjectingBusinessType,
    renderProjectingSEDate,
    renderProjectingBroadcastPlatform,
    renderProjectingRecordDate,
    renderProjectingTalentDivides,
    renderProjectingBudgetInfo,
    renderProjectingHeader,
    renderProjectingCooperate,
    renderProjectingUserList,
    renderProjectingUsers,
    renderProjectingNotice,
    renderProjectingCustomerType,
    renderProjectingCompanyName,
    renderProjectingObligation,
    renderYearFrameType,
    renderYearFrameName,
    renderProjectingIsAgentOrder,
    renderProjectingCommonOrder,
} from '../components';

const formatCols = (obj) => {
    return [
        {
            title: '项目基本信息',
            columns: [
                [
                    renderProjectingType(obj, { from: 'establish' }),
                    renderTrailName(obj, { from: 'establish' }),
                    renderProjectingCategory(),
                ],
                [
                    renderProjectingName(obj, { from: 'establish' }),
                    renderProjectingLevel(),
                    renderProjectingSource(obj),
                ],
                [
                    renderProjectingRecommend(obj),
                    renderProjectingIsAgentOrder(obj, { from: 'establish' }),
                    renderProjectingCommonOrder(obj, { from: 'establish' }),
                ],
                [
                    renderYearFrameType(obj, { from: 'establish' }),
                    renderYearFrameName(obj, { from: 'establish' }),
                    renderProjectingDescription(),
                ],
            ],
        },
        {
            title: '企业信息',
            fixed: true,
            columns: [
                [renderProjectingCustomerType(obj, { from: 'establish' }), {}, {}],
                [renderProjectingCompanyName(obj, { from: 'establish' }), {}, {}],
                [renderProjectingCustomerName(obj, { from: 'establish' }), {}, {}],
            ],
        },
        {
            title: '综艺信息',
            columns: [renderVariety()],
        },
        {
            title: '项目条款信息',
            columns: [
                [
                    renderProjectingBudget(obj, { from: 'establish' }),
                    renderProjectingSigningDate(),
                    renderProjectingBusinessType(obj),
                ],
                [renderProjectingSEDate(obj), renderProjectingBroadcastPlatform()],
                [renderProjectingRecordDate()],
            ],
        },
        renderProjectingTalentDivides(obj, { from: 'establish' }),
        renderProjectingObligation(obj, { from: 'establish' }),
        {
            title: '项目预算信息',
            fixed: true,
            columns: [[renderProjectingBudgetInfo(obj, { from: 'establish' })]],
        },
        {
            title: '负责人信息',
            columns: [renderProjectingHeader(obj)],
        },
        {
            title: '合作人信息',
            columns: [renderProjectingCooperate(obj)],
        },
        {
            title: '执行人信息',
            columns: [[renderProjectingUserList()]],
        },
        {
            title: '参与人信息',
            columns: [[renderProjectingUsers()]],
        },
        {
            title: '知会人',
            fixed: true,
            columns: [[renderProjectingNotice()]],
        },
    ];
};

export default formatCols;
