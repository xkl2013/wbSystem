import React from 'react';
import SelfTable from './selfTable';
import ApprovalNode from '@/components/General/components/approvalNode';

export const formatCols = (obj) => {
    const { formData } = obj;
    const { approvalFormData, approvalInstanceDto } = formData;
    const { approvalFlowNodeDtos, approvalNoticers } = approvalInstanceDto || {};
    return [
        {
            columns: [
                [
                    {
                        // label: '修改明细',
                        key: 'approvalFormData',
                        type: 'custom',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        component: <SelfTable data={approvalFormData || []} />,
                    },
                ],
                [
                    {
                        // label: '审批人',
                        key: 'approvalInstanceDto',
                        type: 'custom',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        component: (
                            <ApprovalNode
                                layout={{
                                    labelCol: {
                                        xs: { span: 3 },
                                        sm: { span: 3 },
                                    },
                                    wrapperCol: {
                                        xs: { span: 21 },
                                        sm: { span: 21 },
                                    },
                                }}
                                approvalFlowNodes={approvalFlowNodeDtos || []}
                                approvalNoticers={approvalNoticers || []}
                            />
                        ),
                    },
                ],
            ],
        },
    ];
};
export default formatCols;
