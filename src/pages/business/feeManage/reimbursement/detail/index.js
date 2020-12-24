import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import styles from './index.less';
import BIButton from '@/ant_components/BIButton';
import AuthButton from '@/components/AuthButton';
import ApprovalBtns from '@/components/ApprovalBtns';
import storage from '@/utils/storage';
import ReimbursementDetail from './reimbursementDetail';
import { cancelApproval } from '../services';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(() => {
    return {};
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.detail = React.createRef();
        this.state = {
            approvalIcon: null,
        };
    }

    componentWillUnmount() {
        // 卸载时清掉header中的数据
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {},
        });
    }

    // 数据成功回调
    hancleCallback = (data) => {
        const { formData = {} } = data;
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '费用报销详情',
                subTitle: `费用报销编号${formData.reimburseCode}`,
                component: this.rightBtns(formData),
            },
        });
    };

    onPrint = () => {
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: './print',
            query: {
                id,
            },
        });
    };

    rightBtns = (formData) => {
        const { reimburseInstanceId } = formData;
        const detail = this.detail.current;
        // 右侧按钮
        return (
            <div>
                {/* {formData.reimburseApproveStatus === 1 && formData.createUserId
                === storage.getUserInfo().userId && (
                    <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail/cancel">
                        <BIButton
                            type="primary"
                            ghost
                            className={styles.headerBtn}
                            onClick={() => {
                                return this.revocation(formData);
                            }}
                        >
                            撤销
                        </BIButton>
                    </AuthButton>
                )} */}
                <AuthButton authority="/foreEnd/business/feeManage/reimbursement/print">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.onPrint}>
                        {' '}
                        打印
                    </BIButton>
                </AuthButton>
                {(formData.reimburseApproveStatus === 4 || formData.reimburseApproveStatus === 5)
                    && formData.reimburseStatus === 1
                    && formData.createUserId === storage.getUserInfo().userId && (
                    <BIButton
                        type="primary"
                        className={styles.headerBtn}
                        onClick={() => {
                            return this.goReset(2);
                        }}
                    >
                            重新提交
                    </BIButton>
                )}
                <ApprovalBtns
                    instanceId={reimburseInstanceId}
                    editCallback={this.editCallback}
                    commonCallback={detail.initData}
                    approvalIconCallback={(node) => {
                        this.setState({ approvalIcon: node });
                    }}
                />
            </div>
        );
    };

    revocation = (formData) => {
        // 撤销按钮
        const that = this;
        BIModal.confirm({
            title: '撤销费用报销',
            content: `确认要撤销编号为${formData.reimburseCode}的费用报销吗？`,
            autoFocusButton: null,
            onOk: () => {
                that.cancelRequest(formData);
            },
        });
    };

    cancelRequest = async (formData) => {
        // 撤销操作请求
        const id = formData.reimburseInstanceId;
        const result = await cancelApproval(id, { opinion: '' });
        const detail = this.detail.current;
        if (result && result.success) {
            message.success('撤销成功');
            detail.initData(); // 强刷子组件请求
        }
    };

    editCallback = () => {
        this.goReset(1);
    };

    goReset(resubmitEnum) {
        // 重新提交
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/feeManage/reimbursement/edit',
            query: {
                oldReimburseId: id,
                resubmitEnum,
            },
        });
    }

    render() {
        const {
            query: { id = '' },
        } = this.props.location;
        const { approvalIcon } = this.state;
        return (
            <div>
                <ReimbursementDetail
                    id={id}
                    handleCallback={this.hancleCallback}
                    ref={this.detail}
                    approvalIcon={approvalIcon}
                />
            </div>
        );
    }
}

export default Index;
