import React, { Component } from 'react';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import styles from './index.less';
import BIRadio from '@/ant_components/BIRadio';
import ApprovalProgress from '@/components/ApprovalProgress';
import SlefProgress from '@/components/Progress';
import { getReimburseDetail, getInstance, reimburseConfirmPay } from '../../services';
import Info from './Info';
import Payment from './Payment';
import AuthButton from '@/components/AuthButton';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, // tab切换 1-申请详情 2-审批信息  3-付款信息
            formData: {}, // 概况
            instanceData: {}, // 审批流
        };
    }

    componentDidMount() {
        this.getData();
    }

    // 初始化数据 (复用组件必填，不能更改)
    initData = () => {
        this.setState({
            type: 1,
        });
        this.getData();
    };

    // 获取详情
    getData = async () => {
        const result = await getReimburseDetail(this.props.id);
        if (result && result.success) {
            const reimburseProjects1 = []; // 日常
            const reimburseProjects2 = []; // 项目
            if (result.data && result.data.reimburseProjects && result.data.reimburseProjects.length > 0) {
                result.data.reimburseProjects.map((item) => {
                    if (item.reimburseProjectType === 1) {
                        reimburseProjects1.push(item);
                    } else if (item.reimburseProjectType === 2) {
                        reimburseProjects2.push(item);
                    }
                });
            }
            if (reimburseProjects1.length > 0) {
                // 日常 合计
                let reimburseFeeApplyTotal = 0;
                let reimbursePayApplyTotal = 0;
                let reimburseIncludeTaxFeeTotoal = 0;
                let reimburseNoTaxFeeTotal = 0;
                let reimburseTaxTatal = 0;
                reimburseProjects1.map((item) => {
                    reimburseFeeApplyTotal += Number(item.reimburseFeeApply);
                    reimbursePayApplyTotal += Number(item.reimbursePayApply);
                    reimburseIncludeTaxFeeTotoal += Number(item.reimburseIncludeTaxFee);
                    reimburseNoTaxFeeTotal += Number(item.reimburseNoTaxFee || 0);
                    reimburseTaxTatal += Number(item.reimburseTax || 0);
                });
                reimburseProjects1.push({
                    reimburseFeeApply: reimburseFeeApplyTotal.toFixed(2),
                    reimbursePayApply: reimbursePayApplyTotal.toFixed(2),
                    reimburseIncludeTaxFee: reimburseIncludeTaxFeeTotoal.toFixed(2),
                    reimburseNoTaxFee: reimburseNoTaxFeeTotal.toFixed(2),
                    reimburseTax: reimburseTaxTatal.toFixed(2),
                    isTotal: true,
                });
            }
            if (reimburseProjects2.length > 0) {
                // 项目 合计
                let reimburseFeeApplyTotal = 0;
                let reimbursePayApplyTotal = 0;
                let reimburseIncludeTaxFeeTotoal = 0;
                let reimburseNoTaxFeeTotal = 0;
                let reimburseTaxTatal = 0;
                reimburseProjects2.map((item) => {
                    reimburseFeeApplyTotal += Number(item.reimburseFeeApply);
                    reimbursePayApplyTotal += Number(item.reimbursePayApply);
                    reimburseIncludeTaxFeeTotoal += Number(item.reimburseIncludeTaxFee);
                    reimburseNoTaxFeeTotal += Number(item.reimburseNoTaxFee || 0);
                    reimburseTaxTatal += Number(item.reimburseTax || 0);
                });
                reimburseProjects2.push({
                    reimburseFeeApply: reimburseFeeApplyTotal.toFixed(2),
                    reimbursePayApply: reimbursePayApplyTotal.toFixed(2),
                    reimburseIncludeTaxFee: reimburseIncludeTaxFeeTotoal.toFixed(2),
                    reimburseNoTaxFee: reimburseNoTaxFeeTotal.toFixed(2),
                    reimburseTax: reimburseTaxTatal.toFixed(2),
                    isTotal: true,
                });
            }
            let fileList = []; // 循环附件
            if (result.data && result.data.attachments && result.data.attachments.length > 0) {
                fileList = result.data.attachments.map((item) => {
                    return {
                        domain: item.reimburseAttachmentDomain,
                        name: item.reimburseAttachmentName,
                        value: item.reimburseAttachmentUrl,
                    };
                });
            }
            this.setState(
                {
                    formData: {
                        ...result.data,
                        reimburseProjects1,
                        reimburseProjects2,
                        fileList,
                    },
                },
                this.handleCallback,
            );
        }
    };

    // 获取审批流
    getInstance = async () => {
        const { reimburseInstanceId = '' } = this.state.formData;
        const result = await getInstance(reimburseInstanceId);
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
        }
    };

    render() {
        const { formData, instanceData, type } = this.state;
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
                        {formData.reimburseApproveStatus === 3 && (
                            <BIRadio.Button className={styles.tabBtn} value="3">
                                付款信息
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
                <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail/commen">
                    <SlefProgress
                        id={Number(commentsParams.id || this.props.id)}
                        interfaceName={commentsParams.interfaceName || '9'}
                        authority="/foreEnd/business/feeManage/reimbursement/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
