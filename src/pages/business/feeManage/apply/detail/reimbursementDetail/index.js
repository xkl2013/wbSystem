import React, { Component } from 'react';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import styles from './index.less';
import BIRadio from '@/ant_components/BIRadio';
import ApprovalProgress from '@/components/ApprovalProgress';
import SlefProgress from '@/components/Progress';
import {
    getReimburseDetail,
    getInstance,
    reimburseConfirmPay,
    getPushdownRepeal,
    getPushdownRecord,
} from '../../services';
import Info from './Info';
import Payment from './Payment';
import PushdownRecord from './PushdownRecord';
import AuthButton from '@/components/AuthButton';
import { visibilityChangeEvent, onVisibilityChange } from '@/utils/userAgent';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, // tab切换 1-申请详情 2-审批信息  3-付款信息 4-下推记录
            formData: {}, // 概况
            instanceData: {}, // 审批流
            pushdownRecord: null, // 下推记录
        };
    }

    componentDidMount() {
        this.getData();
        this.getPushdownRecordFn();

        // 监听tab激活
        document.addEventListener(visibilityChangeEvent, this.currentTabIsActive);
    }

    currentTabIsActive = () => {
        // 判断当前tab是否激活状态
        onVisibilityChange(() => {
            // console.log('激活了');
            if (this.state.type === 4) {
                this.getPushdownRecordFn();
            }
        });
    };

    // 初始化数据 (复用组件必填，不能更改)
    initData = () => {
        this.setState({
            type: 1,
        });
        this.getData();
        this.getPushdownRecordFn();
    };

    // 获取详情
    getData = async () => {
        const result = await getReimburseDetail(this.props.id);
        if (result && result.success) {
            const applicationProjectVoList1 = []; // 日常
            const applicationProjectVoList2 = []; // 项目
            if (
                result.data
                && result.data.applicationProjectVoList
                && result.data.applicationProjectVoList.length > 0
            ) {
                result.data.applicationProjectVoList.map((item) => {
                    if (item.applicationProjectType === 1) {
                        applicationProjectVoList1.push(item);
                    } else if (item.applicationProjectType === 2) {
                        applicationProjectVoList2.push(item);
                    }
                });
            }
            if (applicationProjectVoList1.length > 0) {
                // 日常 合计
                let applicationFeeApplyTotal = 0;
                applicationProjectVoList1.map((item) => {
                    applicationFeeApplyTotal += Number(item.applicationFeeApply);
                });
                applicationProjectVoList1.push({
                    applicationFeeApply: applicationFeeApplyTotal.toFixed(2),
                    isTotal: true,
                });
            }
            if (applicationProjectVoList2.length > 0) {
                // 项目 合计
                let applicationFeeApplyTotal = 0;
                applicationProjectVoList2.map((item) => {
                    applicationFeeApplyTotal += Number(item.applicationFeeApply);
                });
                applicationProjectVoList2.push({
                    applicationFeeApply: applicationFeeApplyTotal.toFixed(2),
                    isTotal: true,
                });
            }
            let fileList = []; // 循环附件
            if (result.data && result.data.attachments && result.data.attachments.length > 0) {
                fileList = result.data.attachments.map((item) => {
                    return {
                        domain: item.applicationAttachmentDomain,
                        name: item.applicationAttachmentName,
                        value: item.applicationAttachmentUrl,
                    };
                });
            }
            this.setState(
                {
                    formData: {
                        ...result.data,
                        applicationProjectVoList1,
                        applicationProjectVoList2,
                        fileList,
                    },
                },
                this.handleCallback,
            );
        }
    };

    // 获取费用下推记录
    getPushdownRecordFn = async () => {
        const { id } = this.props;
        const res = await getPushdownRecord(id);
        if (res.code === '200' && Array.isArray(res.data) && res.data.length > 0) {
            this.setState({
                pushdownRecord: res.data,
            });
        } else {
            this.setState({
                pushdownRecord: null,
            });
        }
    };

    // 获取审批流
    getInstance = async () => {
        const { applicationInstanceId = '' } = this.state.formData;
        const result = await getInstance(applicationInstanceId);
        if (result && result.success) {
            this.setState(
                {
                    instanceData: result.data || {},
                },
                this.handleCallback,
            );
        }
    };

    // 付款确认操作
    confirmPay = () => {
        const that = this;
        BIModal.confirm({
            title: '付款确认',
            content: '付款确认后会生成对应实付台帐数据，此操作不可逆，是否进行付款确认？',
            autoFocusButton: null,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                that.confirmPayFun();
            },
        });
    };

    // 下推撤销操作
    btnRepeal = (id) => {
        const that = this;
        BIModal.confirm({
            title: '撤销',
            content: '撤销后，下推额度会恢复且对应的报销但会进行删除，是否确认删除？',
            autoFocusButton: null,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                that.btnRepealFn(id);
            },
        });
    };

    // 下推撤销操作fn
    btnRepealFn = async (id) => {
        const result = await getPushdownRepeal(id);
        if (result && result.code === '200') {
            message.success('撤销成功');
            this.getPushdownRecordFn();
        } else {
            message.error(result.message);
        }
    };

    // 付款确认request
    confirmPayFun = async () => {
        const result = await reimburseConfirmPay(this.props.id);
        if (result && result.success) {
            message.success('付款确认成功');
            this.getData();
        }
    };

    // 向上回传数据 (复用组件必填，不能更改)
    handleCallback = () => {
        if (this.props.handleCallback && typeof this.props.handleCallback === 'function') {
            const { formData, instanceData } = this.state;
            this.props.handleCallback({ formData, instanceData });
        }
    };

    tabChange = (e) => {
        // tab切换
        const value = Number(e.target.value);
        this.setState({
            type: value,
        });
        if (value === 1) {
            this.getData();
        } else if (value === 2) {
            this.getInstance();
        } else if (value === 4) {
            this.getPushdownRecordFn();
        }
    };

    componentDidUnMount() {
        document.removeEventListener(visibilityChangeEvent, this.currentTabIsActive);
    }

    render() {
        const { formData, instanceData, type, pushdownRecord } = this.state;
        const { approvalIcon } = this.props;
        const commentsParams = this.props.commentsParams || {};
        return (
            <div className={styles.detailPage}>
                <div style={{ position: 'relative', top: '-20px' }}>{approvalIcon}</div>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={String(type)} buttonStyle="solid" onChange={this.tabChange}>
                        <BIRadio.Button className={styles.tabBtn} value="1">
                            申请详情
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="2">
                            审批信息
                        </BIRadio.Button>
                        {formData.applicationApproveStatus === 3 && (
                            <BIRadio.Button className={styles.tabBtn} value="3">
                                付款信息
                            </BIRadio.Button>
                        )}
                        {pushdownRecord !== null && (
                            <BIRadio.Button className={styles.tabBtn} value="4">
                                下推记录
                            </BIRadio.Button>
                        )}
                    </BIRadio>
                </div>
                {type === 1 && <Info formData={formData} />}
                {type === 2 && (
                    <div className={styles.p20}>
                        <ApprovalProgress data={instanceData} />
                    </div>
                )}
                {type === 3 && <Payment formData={formData} confirmPay={this.confirmPay} />}
                {type === 4 && <PushdownRecord formData={pushdownRecord} btnRepeal={this.btnRepeal} />}
                <AuthButton authority="/foreEnd/business/feeManage/apply/detail/commen">
                    <SlefProgress
                        id={Number(commentsParams.id || this.props.id)}
                        interfaceName={commentsParams.interfaceName || '10'}
                        authority="/foreEnd/business/feeManage/apply/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
