import React from 'react';
import _ from 'lodash';
import ApprovalNode from '@/components/ApprovalProgress/approvalNode_new';
import Notify from '@/components/notifyNode/user_org_jole';
import { config } from './utils';

class Approval extends React.Component {
    state = {
        newData: [],
        approvalFlowNodes: [],
        approvalNoticers: [],
    };

    componentDidMount() {
        this.renderNoticers(this.props.approvalNoticers || []);
        this.renderApprovalNode(this.props.approvalFlowNodes || []);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.approvalNoticers) !== JSON.stringify(nextProps.approvalNoticers)) {
            this.renderNoticers(nextProps.approvalNoticers || []);
        }
        if (JSON.stringify(this.props.approvalFlowNodes) !== JSON.stringify(nextProps.approvalFlowNodes)) {
            this.renderApprovalNode(nextProps.approvalFlowNodes || []);
        }
    }

    addNodes = (approvalFlowNodes) => {
        this.setState({ approvalFlowNodes });
        if (this.props.onChange) {
            this.props.onChange({ approvalFlowNodes: this.paserApproval(approvalFlowNodes) });
        }
    };

    paserApproval = (value) => {
        return value.map((item) => {
            return {
                executorId: Number(item.id),
                name: item.name,
                type: { user: 0, department: 1, role: 2 }[item.type],
            };
        });
    };

    paserNoticers = (value) => {
        return value.map((item) => {
            return {
                avatar: item.avatar,
                userId: Number(item.id),
                userName: item.name,
                userType: { user: 0, department: 1, role: 2 }[item.type],
            };
        });
    };

    changeNotifyNode = (approvalNoticers) => {
        const noticers = this.props.approvalNoticers.map((item) => {
            return {
                name: item.userName,
                id: item.userId,
                type: { 0: 'user', 1: 'department', 2: 'role' }[item.userType] || 'user',
            };
        });
        const newData = noticers.concat(approvalNoticers);
        const uniqueData = _.unionBy(newData, approvalNoticers, 'id');
        this.setState({ approvalNoticers: uniqueData, newData: approvalNoticers });
        if (this.props.onChange) {
            this.props.onChange({ approvalNoticers: this.paserNoticers(approvalNoticers) });
        }
    };

    renderNoticers = (Noticers = []) => {
        const approvalNoticers = Noticers.map((item) => {
            return {
                name: item.userName,
                id: item.userId,
                type: { 0: 'user', 1: 'department', 2: 'role' }[item.userType] || 'user',
            };
        });
        this.setState({ approvalNoticers });
    };

    renderApprovalNode = (data = []) => {
        const approvalFlowNodes = data.map((item) => {
            return {
                name: item.name,
                id: item.executorId,
                avatar: item.avatar,
                type: { 0: 'user', 1: 'department', 2: 'role' }[item.executorType] || 'user',
            };
        });
        this.setState({ approvalFlowNodes });
    };

    willSubmit = () => {
        return {
            approvalNoticers: this.paserNoticers(this.state.approvalNoticers),
            approvalFlowNodes: this.paserApproval(this.state.approvalFlowNodes),
        };
    };

    render() {
        const { approvalFlowNodes, approvalNoticers, newData } = this.state;
        return (
            <>
                {this.props.hideApprovalNode ? null : (
                    <ApprovalNode
                        {...config}
                        layout={this.props.layout}
                        data={approvalFlowNodes}
                        isShowAddBtn={this.props.flowType === 'freedom'}
                        onChange={this.addNodes}
                        title="审批人"
                    />
                )}
                {this.props.hideNotifyNode ? null : (
                    <Notify
                        {...config}
                        data={approvalNoticers}
                        layout={this.props.layout}
                        // isShowClear
                        title="知会人"
                        newData={newData}
                        showDefaultData={false}
                        onChange={this.changeNotifyNode}
                    />
                )}
            </>
        );
    }
}

export default Approval;
