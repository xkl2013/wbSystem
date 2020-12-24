import establishDetail from '@/pages/business/project/establish/detail/establishDetail'
import contractDetail from '@/pages/business/project/contract/detail/contractDetail'
import applicationDetail from '@/pages/business/feeManage/apply/detail/reimbursementDetail'
import reimburseDetail from '@/pages/business/feeManage/reimbursement/detail/reimbursementDetail'
export const detailConfig = {
    'projecting': {
        name: '立项',
        component: establishDetail,
    },
    'contract': {
        name: '合同',
        component: contractDetail
    },
    'application': {
        name: '费用申请',
        component: applicationDetail
    },
    'reimburse': {
        name: '费用报销',
        component: reimburseDetail
    },
    'common': {
        name: '一般审批',
        component: require('./common').default,
    },
    'travel': {
        name: '差旅审批',
        component: require('./common').default,
    }

}
