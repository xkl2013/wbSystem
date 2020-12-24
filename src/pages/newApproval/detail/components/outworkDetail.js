import React, { Component } from 'react';
import _ from 'lodash';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { OUTOFFICESTATUS } from '@/utils/enum';
import CommonDetail from './commonDetail';

import { getOutOffice } from '@/services/globalDetailApi';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';

const columns = [
    {
        title: '报销申请时间',
        dataIndex: 'reimburseApplyTime',
        key: 'reimburseApplyTime',
        align: 'center',
        render: (text) => {
            return text ? text.slice(0, 10) : null;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'reimburseFeeTypeName',
        key: 'reimburseFeeTypeName',
        align: 'center',
    },
    {
        title: '含税金额',
        dataIndex: 'reimburseIncludeTaxFee',
        key: 'reimburseIncludeTaxFee',
        align: 'center',
        render: (detail) => {
            return `${thousandSeparatorFixed(detail)}`;
        },
    },
    {
        title: '相关项目',
        dataIndex: 'reimburseProjectName',
        key: 'reimburseProjectName',
        align: 'center',
    },
    {
        title: '审批状态',
        dataIndex: 'reimburseApproveStatus',
        key: 'reimburseApproveStatus',
        align: 'center',
        render: (text) => {
            return getOptionName(OUTOFFICESTATUS, text);
        },
    },
];
class OutworkDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    getOutOfficeDom = async (id) => {
        const res = await getOutOffice(id);
        let dataSource = [];
        if (res && Array.isArray(res.data) && res.data.length > 0) {
            dataSource = res.data;
            this.setState({
                dataSource,
            });
        }
    };

    renderOutOffice() {
        const { dataSource } = this.state;
        if (_.isEmpty(dataSource)) {
            return null;
        }
        return [
            <FlexDetail LabelWrap={[[]]} detail={{}} title="关联外勤">
                <BITable
                    rowKey="reimburseProjectId"
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                />
            </FlexDetail>,
        ];
    }

    render() {
        return (
            <>
                <CommonDetail {...this.props} />
                {this.renderOutOffice()}
            </>
        );
    }
}
export default OutworkDetail;
