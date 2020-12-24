/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import styles from './index.less';
import BIButton from '@/ant_components/BIButton';
import AuthButton from '@/components/AuthButton';
import storage from '@/utils/storage';
import { purePosNumberReg } from '@/utils/reg';
import ApprovalBtns from '@/components/ApprovalBtns';
import ReimbursementDetail from './reimbursementDetail';
import ModalComponent from './ModalComponent';
import { cancelApproval, reimbursePushDown, getPushdownSurplusMoney } from '../services';
import {
    FINANCE_PUSHDOWN_USER_ID1,
    FINANCE_PUSHDOWN_USER_ID2,
    FINANCE_PUSHDOWN_USER_ID3,
    FINANCE_PUSHDOWN_USER_ID4,
    FINANCE_PUSHDOWN_USER_ID5,
    FINANCE_PUSHDOWN_USER_ID6,
    FINANCE_PUSHDOWN_USER_ID7,
} from '@/utils/constants';
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
            visible: false,
            inputValue: '', // 下推金额
            approvalIcon: null,
            pushDownNum: null,
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
        const { formData = {}, instanceData = {} } = data;
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '费用申请详情',
                subTitle: `费用申请编号${formData.applicationCode}`,
                component: this.rightBtns(formData),
            },
        });
    };

    onPrint = () => {
        // 打印
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
        console.log(formData);
        const { applicationInstanceId, settlementReceiptId, applicationChargeAgainstSatus } = formData;
        const detail = this.detail.current;
        // 右侧按钮
        return (
            <div>
                {/* 根据业务写死id */}
                {(formData.createUserId == storage.getUserInfo().userId ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID1 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID2 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID3 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID4 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID6 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID7 ||
                    storage.getUserInfo().userId === FINANCE_PUSHDOWN_USER_ID5) &&
                    applicationChargeAgainstSatus !== 3 && (
                        <AuthButton authority="/foreEnd/business/feeManage/apply/detail/pushDown">
                            <BIButton
                                type="primary"
                                ghost
                                className={styles.headerBtn}
                                onClick={() => {
                                    return this.pushDown(formData);
                                }}
                            >
                                下推
                            </BIButton>
                        </AuthButton>
                    )}
                <AuthButton authority="/foreEnd/business/feeManage/apply/print">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.onPrint}>
                        {' '}
                        打印
                    </BIButton>
                </AuthButton>
                {(formData.applicationApproveStatus == 4 || formData.applicationApproveStatus == 5) &&
                    formData.applicationStatus == 1 &&
                    formData.createUserId == storage.getUserInfo().userId && (
                        // <AuthButton authority="/foreEnd/business/project/establish/detail/recommit">
                        <BIButton type="primary" className={styles.headerBtn} onClick={() => this.goReset(2)}>
                            重新提交
                        </BIButton>
                        // </AuthButton>
                    )}
                <ApprovalBtns
                    instanceId={applicationInstanceId}
                    editCallback={this.editCallback}
                    commonCallback={detail.initData}
                    approvalIconCallback={(node) => {
                        this.setState({ approvalIcon: node });
                    }}
                    btnsObjCallback={(data) => (settlementReceiptId === null ? data : { ...data, rebackBtn: false })}
                />
            </div>
        );
    };

    goReset(resubmitEnum) {
        // 重新提交
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/feeManage/apply/edit',
            query: {
                oldApplicationId: id,
                resubmitEnum,
            },
        });
    }

    revocation = (formData) => {
        // 撤销按钮
        const that = this;
        BIModal.confirm({
            title: '撤销费用申请',
            content: `确认要撤销编号为${formData.applicationCode}的费用申请吗？`,
            autoFocusButton: null,
            onOk: () => {
                that.cancelRequest(formData);
            },
        });
    };

    cancelRequest = async (formData) => {
        // 撤销操作请求
        const id = formData.applicationInstanceId;
        const detail = this.detail.current;
        const result = await cancelApproval(id, { opinion: '' });
        if (result && result.success) {
            message.success('撤销成功');
            detail.initData(); // 强刷子组件请求
        }
    };

    getPushdownSurplusMoney = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await getPushdownSurplusMoney(id);
        if (res.success) {
            return res.data;
        } else {
            message.error(res.message);
        }
    };

    pushDown = async (formData) => {
        // 下推按钮
        if (formData.applicationApproveStatus !== 3) {
            message.warning('审批未通过，不允许下推');
            return;
        }
        const pushDownNum = await this.getPushdownSurplusMoney();
        this.setState({
            visible: true,
            inputValue: '',
            pushDownNum,
        });
    };

    inputChange = (val) => {
        // 金额改变
        this.setState({
            inputValue: val,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = async () => {
        const val = this.state.inputValue;
        if (!val || val == 0 || !purePosNumberReg.test(val)) {
            message.warning('输入金额不合法');
            return;
        }
        this.pushDownRequest();
    };

    pushDownRequest = async () => {
        // 下推操作请求
        const {
            query: { id = '' },
        } = this.props.location;
        const result = await reimbursePushDown({
            applicationId: id,
            applicationFeePushDown: this.state.inputValue,
        });
        const detail = this.detail.current;
        if (result && result.success) {
            message.success('下推成功');
            this.onCancel();
            detail.initData(); // 强刷子组件请求
        }
    };

    editCallback = () => {
        this.goReset(1);
    };

    render() {
        const {
            query: { id = '' },
        } = this.props.location;
        const { approvalIcon, pushDownNum } = this.state;
        return (
            <div id="prindDom">
                <ReimbursementDetail
                    id={id}
                    handleCallback={this.hancleCallback}
                    ref={this.detail}
                    approvalIcon={approvalIcon}
                />
                <ModalComponent
                    pushDownNum={pushDownNum}
                    visible={this.state.visible}
                    inputChange={this.inputChange}
                    inputValue={this.state.inputValue}
                    title="下推"
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    destroyOnClose
                />
            </div>
        );
    }
}

export default Index;
