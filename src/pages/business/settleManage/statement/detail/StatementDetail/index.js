import React from 'react';
import { message } from 'antd';
import styles from './index.less';
import AuthButton from '@/components/AuthButton';
import BIRadio from '@/ant_components/BIRadio';
import StatementInfo from './StatementInfo';
import DifferentChange from './DifferentChange';
import SlefProgress from '@/components/Progress';
import { getStatementDetail, statementChange } from '../../../services';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import BIInputNumber from '@/ant_components/BIInputNumber';
import BIInput from '@/ant_components/BIInput';
// import { getSupplierList } from '@/services/globalSearchApi';

class StatementDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selTab: props.selTab ? Number(props.selTab) : 1, // 选中tab
            tabList: [
                {
                    key: 1,
                    value: '结算详情',
                    limit: '/foreEnd/business/settleManage/statement/detail/statementInfo',
                },
                {
                    key: 2,
                    value: '成本差异调整',
                    limit: '/foreEnd/business/settleManage/statement/detail/differentChange',
                },
            ],
            formData: {},
            statementChangeStatus: false,
            oughtSettleAmountAdjustment: null, // 应结算金额（调整）
            brokerageAdjustment: null, // 佣金（调整）
            adjustmentReason: '', // 调整原因
            talentDivideProportion: null, // 艺人博主分成比例
        };
    }

    componentWillMount() {
        this.getDetailData();
    }

    // 获取详情数据
    getDetailData = async () => {
        const { id, handleCallback } = this.props;
        const res = await getStatementDetail(id);
        if (res && res.success) {
            this.setState(
                {
                    formData: res.data || {},
                },
                () => {
                    return handleCallback({ formData: res.data });
                },
            );
        } else {
            message.error(res.message);
        }
    };

    // 初始化数据
    initData = (selTab) => {
        this.setState({
            selTab,
        });
        this.getDetailData();
    };

    // 切换tab
    tabChange = (e) => {
        this.setState({
            selTab: e.target.value,
        });
    };

    // 结算调整
    async lstatementChangeFn() {
        const {
            oughtSettleAmountAdjustment,
            brokerageAdjustment,
            adjustmentReason,
            talentDivideProportion,
        } = this.state;
        const { id } = this.props;
        const data = {
            oughtSettleAmountAdjustment,
            brokerageAdjustment,
            adjustmentReason,
            talentDivideProportion: Number(talentDivideProportion) / 100,
            id: Number(id),
        };
        const res = await statementChange(data);
        if (res.success) {
            message.success(res.message);
            this.initData(1);
        } else {
            message.error(res.message);
        }
        this.statementChangeClose();
    }

    // 关闭结算调整弹窗
    statementChangeClose() {
        this.setState({
            statementChangeStatus: false,
            oughtSettleAmountAdjustment: null, // 应结算金额（调整）
            brokerageAdjustment: null, // 佣金（调整）
            adjustmentReason: '', // 调整原因
            talentDivideProportion: null,
        });
    }

    //
    statementChangeOpen(data) {
        const { oughtSettleAmountAdjustment, brokerageAdjustment, adjustmentReason, talentDivideProportion } = data;
        this.setState({
            oughtSettleAmountAdjustment,
            brokerageAdjustment,
            adjustmentReason,
            talentDivideProportion: Number(talentDivideProportion) * 100,
            statementChangeStatus: true,
        });
    }

    render() {
        const {
            tabList,
            selTab,
            formData,
            statementChangeStatus,
            oughtSettleAmountAdjustment,
            brokerageAdjustment,
            adjustmentReason,
            talentDivideProportion,
        } = this.state;
        const { commentsParams = {}, id } = this.props;
        // const commentsParams = this.props.commentsParams || {};
        // const componentAttr = {
        //     request: (val) => {
        //         return getSupplierList({ pageNum: 1, pageSize: 50, supplierName: val });
        //     },
        //     fieldNames: { value: 'supplierId', label: 'supplierName' },
        // };
        return (
            <div className={styles.detailBox}>
                <BIModal
                    visible={statementChangeStatus}
                    onOk={() => {
                        return this.lstatementChangeFn();
                    }}
                    onCancel={() => {
                        return this.statementChangeClose();
                    }}
                    maskClosable={false}
                    title="结算调整"
                    width="600px"
                >
                    <p className={styles.changePayInfoBox}>
                        <span>应结算金额（调整）：</span>
                        <BIInputNumber
                            className={styles.changePayInfoTerm}
                            placeholder="请输入应结算金额（调整）"
                            value={oughtSettleAmountAdjustment}
                            precision={2}
                            onChange={(value) => {
                                this.setState({
                                    oughtSettleAmountAdjustment: value,
                                });
                            }}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>佣金（调整）：</span>
                        <BIInputNumber
                            className={styles.changePayInfoTerm}
                            placeholder="请输入佣金（调整）"
                            value={brokerageAdjustment}
                            precision={2}
                            onChange={(value) => {
                                this.setState({
                                    brokerageAdjustment: value,
                                });
                            }}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>艺人博主分成比例：</span>
                        <BIInputNumber
                            className={styles.changePayInfoTerm}
                            placeholder="请输入艺人博主分成比例"
                            value={talentDivideProportion}
                            precision={2}
                            max={100}
                            min={0}
                            formatter={(value) => {
                                return `${value}%`;
                            }}
                            parser={(value) => {
                                return value.replace('%', '');
                            }}
                            onChange={(value) => {
                                this.setState({
                                    talentDivideProportion: value,
                                });
                            }}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>调整原因：</span>
                        <BIInput.TextArea
                            placeholder="请输入调整原因（最多输入150字）"
                            className={styles.changePayInfoTerm}
                            maxLength={150}
                            value={adjustmentReason}
                            onChange={(e) => {
                                this.setState({
                                    adjustmentReason: e.target.value,
                                });
                            }}
                        />
                    </p>
                </BIModal>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={selTab} buttonStyle="solid" onChange={this.tabChange}>
                        {tabList.map((item) => {
                            return (
                                <AuthButton authority={item.limit} key={item.key}>
                                    <BIRadio.Button className={styles.tabBtn} value={item.key}>
                                        {item.value}
                                    </BIRadio.Button>
                                </AuthButton>
                            );
                        })}
                    </BIRadio>
                    {selTab === 1 && formData.startPayStatus === 0 && (
                        <AuthButton authority="/foreEnd/business/settleManage/statement/detail/statementChange">
                            <BIButton
                                type="primary"
                                ghost
                                // className={styles.headerBtn}
                                onClick={() => {
                                    return this.statementChangeOpen(formData);
                                }}
                            >
                                结算调整
                            </BIButton>
                        </AuthButton>
                    )}
                </div>
                {selTab === 1 && <StatementInfo {...this.props} initData={this.initData} formData={formData} />}
                {selTab === 2 && <DifferentChange {...this.props} initData={this.initData} formData={formData} />}
                <AuthButton authority="/foreEnd/business/settleManage/statement/detail/commen">
                    <SlefProgress
                        id={Number(commentsParams.id || id)}
                        interfaceName={commentsParams.interfaceName || '20'}
                        authority="/foreEnd/business/settleManage/statement/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}
export default StatementDetail;
