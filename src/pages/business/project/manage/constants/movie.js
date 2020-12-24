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
    renderMovie,
    renderProjectingBudget,
    renderProjectingSigningDate,
    renderProjectingBusinessType,
    renderProjectingSEDate,
    renderProjectingBroadcastPlatform,
    renderProjectingMovieExtra,
    renderProjectingTalentDivides,
    renderProjectingBudgetInfo,
    renderProjectingHeader,
    renderProjectingCooperate,
    renderProjectingCustomerType,
    renderProjectingCompanyName,
    renderProjectingUserList,
    renderProjectingUsers,
    renderProjectingObligation,
    renderYearFrameType,
    renderYearFrameName,
    renderProjectingIsAgentOrder,
    renderProjectingCommonOrder,
} from '../../establish/components';

const formatCols = (obj) => {
    return [
        {
            title: '项目基本信息',
            columns: [
                [
                    renderProjectingType(obj, { from: 'manage' }),
                    renderTrailName(obj, { from: 'manage' }),
                    renderProjectingCategory(),
                ],
                [renderProjectingName(obj, { from: 'manage' }), renderProjectingLevel(), renderProjectingSource(obj)],
                [
                    renderProjectingRecommend(obj),
                    renderProjectingIsAgentOrder(obj, { from: 'manage' }),
                    renderProjectingCommonOrder(obj, { from: 'manage' }),
                ],
                [
                    renderYearFrameType(obj, { from: 'manage' }),
                    renderYearFrameName(obj, { from: 'manage' }),
                    renderProjectingDescription(),
                ],
            ],
        },
        {
            title: '企业信息',
            fixed: true,
            columns: [
                [renderProjectingCustomerType(obj, { from: 'manage' }), {}, {}],
                [renderProjectingCompanyName(obj, { from: 'manage' }), {}, {}],
                [renderProjectingCustomerName(obj, { from: 'manage' }), {}, {}],
            ],
        },
        {
            title: '影视信息',
            columns: [renderMovie()],
        },
        {
            title: '项目条款信息',
            columns: [
                [
                    renderProjectingBudget(obj, { from: 'manage' }),
                    renderProjectingSigningDate(),
                    renderProjectingBusinessType(obj),
                ],
                [renderProjectingSEDate(obj), renderProjectingBroadcastPlatform()],
                renderProjectingMovieExtra(),
            ],
        },
        renderProjectingTalentDivides(obj, { from: 'manage' }),
        renderProjectingObligation(obj, { from: 'manage' }),
        {
            title: '项目预算信息',
            fixed: true,
            columns: [[renderProjectingBudgetInfo(obj, { from: 'manage' })]],
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
    ];
};

export default formatCols;
