/* eslint-disable */
import React, { Component } from 'react';
import Detail from '../../components/detail';
import styles from './index.less';
import BIModal from '@/ant_components/BIModal';

import { connect } from 'dva';
import BIButton from '@/ant_components/BIButton';
import { message } from 'antd';
import { msgF } from '@/utils/utils';
import { getApprlvalDetail, cancelApproval } from '../../services';
import { detailConfig } from '../../components/detail/config';
import AuthButton from '@/components/AuthButton';
import storage from '@/utils/storage';
import ApprovalEdit from '../../initiate/component/approvalForm';

@connect(() => ({}))
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apprlvalDetail: {}, // 审批详情概况
        };
    }
    componentDidMount() {
        this.getApprlvalDetailFun();
    }
    getApprlvalDetailFun = async () => {
        // 获取审批详情概况
        let {
            query: { id = '' },
        } = this.props.location || {};
        let result = await getApprlvalDetail({ id });
        if (result && result.success) {
            this.setState(
                {
                    apprlvalDetail: result.data,
                },
                () => {
                    this.hancleCallback({});
                },
            );
        }
    };

    // 数据成功回调
    hancleCallback = (data) => {
        let { formData = {}, instanceData = {} } = data;
        let {
            approvalFlow: { flowMark = '' },
            instanceCode = '',
            name = '',
        } = this.state.apprlvalDetail || {}; // type
        let typeName = (flowMark && detailConfig[flowMark] && detailConfig[flowMark].name) || ''; // type name
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: flowMark == 'common' || flowMark === 'travel' ? `${name}详情` : `${typeName}详情`,
                subTitle:
                    flowMark == 'common' || flowMark === 'travel'
                        ? `编号${instanceCode}`
                        : `${typeName}编号${formData[flowMark + 'Code'] || ''}`,
                component: this.rightBtnsApproval(formData, instanceData),
            },
        });
    };

    getId = () => {
        // 获取ID
        let {
            query: { id = '' },
        } = this.props.location || {};
        return id;
    };

    rightBtnsApproval = (formData, instanceData) => {
        // 右侧按钮  -1 撤销  0  驳回 1 审批通过
        let apprlvalDetail = this.state.apprlvalDetail;
        let buttonStatus = (apprlvalDetail && apprlvalDetail.buttons) || [];
        return (
            <div>
                {buttonStatus.includes(-1) && (
                    <AuthButton authority="/foreEnd/approval/apply/myjob/cancel">
                        <BIButton
                            type="primary"
                            ghost
                            style={{ marginRight: '10px', width: '76px' }}
                            onClick={this.handleCancel}
                        >
                            撤销
                        </BIButton>
                    </AuthButton>
                )}
                {/* 重新提交 */}
                {this.handleReset(formData)}
                {/* 费用打印 */}
                {this.handlePrint(formData)}
            </div>
        );
    };

    handleCancel = () => {
        // 撤销
        BIModal.confirm({
            title: '撤销将中断审批申请',
            okText: '确定',
            cancelText: '取消',
            autoFocusButton: null,
            onOk: () => {
                this.cancelProject();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    cancelProject = async () => {
        // 撤销项目
        let id = this.getId();
        let result = await cancelApproval(id, { opinion: '' });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.getApprlvalDetailFun();
            this.refs.parentDetail.refs &&
                this.refs.parentDetail.refs.detail &&
                this.refs.parentDetail.refs.detail.initData &&
                this.refs.parentDetail.refs.detail.initData(); // 强刷子组件
        }
    };

    handleReset = (formData) => {
        // 重新提交按钮判断逻辑
        let { approvalFlow: { flowMark = '' } = {}, createBy = '', status } = this.state.apprlvalDetail || {};
        if (storage.getUserInfo().userId != createBy) {
            return null;
        }

        if (flowMark == 'contract') {
            // 合同
            let { contract: { contractApprovalStatus = '', contractStatus = '' } = {} } = formData;
            if ((contractApprovalStatus == 4 || contractApprovalStatus == 5) && contractStatus == 1) {
                return this.resetBtn(flowMark);
            }
            return null;
        } else if (flowMark == 'projecting') {
            // 立项
            let { projectingApprovalState = '', restartTimes = '' } = formData || {};
            if (
                (projectingApprovalState == 4 || projectingApprovalState == 5 || projectingApprovalState == -1) &&
                !restartTimes
            ) {
                return this.resetBtn(flowMark);
            }
            return null;
        } else if (flowMark == 'application') {
            // 费用申请
            let { applicationApproveStatus = '', applicationStatus = '' } = formData || {};
            if ((applicationApproveStatus == 4 || applicationApproveStatus == 5) && applicationStatus == 1) {
                return this.resetBtn(flowMark);
            }
            return null;
        } else if (flowMark == 'reimburse') {
            // 费用报销
            let { reimburseApproveStatus = '', reimburseStatus = '' } = formData || {};
            if ((reimburseApproveStatus == 4 || reimburseApproveStatus == 5) && reimburseStatus == 1) {
                return this.resetBtn(flowMark);
            }
            return null;
        } else if (flowMark == 'common') {
            // 一般审批
            if (status == 0 || status == -1) {
                return this.resetBtn(flowMark);
            }
            return null;
        }
        return null;
    };

    resetBtn = (type) => {
        // 重新提交按钮
        return (
            <AuthButton authority="/foreEnd/approval/apply/myjob/restart">
                <BIButton
                    type="primary"
                    style={{ marginRight: '10px', width: '76px' }}
                    onClick={() => this.goReset(type)}
                >
                    重新提交
                </BIButton>
            </AuthButton>
        );
    };

    goReset = async (type) => {
        // 重新提交跳转
        // 获取ID
        const approvalForm = this.state.apprlvalDetail.approvalForm || {};
        const approvalFormFields = approvalForm.approvalFormFields || [];
        let id = '';
        if (approvalFormFields && approvalFormFields.length > 0) {
            id = approvalFormFields[0].value;
        }
        if (type == 'contract') {
            this.props.history.push({
                pathname: '/foreEnd/business/project/contract/edit',
                query: {
                    oldContractId: id,
                },
            });
        } else if (type == 'projecting') {
            this.props.history.push({
                pathname: '/foreEnd/business/project/establish/edit',
                query: {
                    id,
                    type: 'add',
                },
            });
        } else if (type == 'application') {
            this.props.history.push({
                pathname: '/foreEnd/business/feeManage/apply/edit',
                query: {
                    oldApplicationId: id,
                },
            });
        } else if (type == 'reimburse') {
            this.props.history.push({
                pathname: '/foreEnd/business/feeManage/reimbursement/edit',
                query: {
                    oldReimburseId: id,
                },
            });
        } else if (type == 'common') {
            const apprlvalDetail = this.state.apprlvalDetail || {};
            this.approvalForm.onShow && this.approvalForm.onShow(apprlvalDetail, 'edit');
        }
    };

    handlePrint = (formData) => {
        //打印按钮判断逻辑
        let { approvalFlow: { flowMark = '' } = {}, approvalForm: { approvalFormFields = [] } = {} } =
            this.state.apprlvalDetail || {};
        let id = approvalFormFields && approvalFormFields[0] && approvalFormFields[0].value;
        if (flowMark == 'application') {
            // 费用申请
            return (
                <BIButton type="primary" style={{ width: '76px' }} onClick={() => this.goPrint('application', id)}>
                    打印
                </BIButton>
            );
        } else if (flowMark == 'reimburse') {
            // 费用报销
            return (
                <BIButton type="primary" style={{ width: '76px' }} onClick={() => this.goPrint('reimburse', id)}>
                    打印
                </BIButton>
            );
        }
        return null;
    };

    goPrint = (type, id) => {
        // 跳转打印
        if (type == 'application') {
            this.props.history.push({
                pathname: '/foreEnd/business/feeManage/apply/print',
                query: {
                    id,
                },
            });
        } else if (type == 'reimburse') {
            this.props.history.push({
                pathname: '/foreEnd/business/feeManage/reimbursement/print',
                query: {
                    id,
                },
            });
        }
    };

    render() {
        let { apprlvalDetail } = this.state;
        return (
            <>
                {/* 重新发起一般审批功能 */}
                <ApprovalEdit ref={(dom) => (this.approvalForm = dom)} history={this.props.history} />
                <Detail
                    {...this.props}
                    apprlvalDetail={apprlvalDetail}
                    handleCallback={this.hancleCallback}
                    ref="parentDetail"
                />
            </>
        );
    }
}

export default Index;
