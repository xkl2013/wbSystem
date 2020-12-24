/**
 * 项目费用确认单详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
import AuthButton from '@/components/AuthButton';
import BIModal from '@/ant_components/BIModal';
import SlefProgress from '@/components/Progress';
import BISpin from '@/ant_components/BISpin';
import { connectInfo } from '@/services/globalDetailApi';
import { DATE_FORMAT } from '@/utils/constants';
import _ from 'lodash';
import { message } from 'antd';
import NotifyNode from '@/components/notifyNode';
import Dymic from '@/components/dynamicMsg';
import s from '@/components/modalfy/index.less';
import { baseColumn, expenseDetail, confirmResult } from './columns';
import { getFeeVerifyDetail, postFeeVerifyEnd, getFeeVerifyReminder } from '../../services';
import styles from './index.less';
// import avatar from '@/assets/avatar.png';
const connectColumn = [
    // {
    //     title: '角色',
    //     align: 'center',
    //     dataIndex: 'participantType',
    //     render: (detail) => {
    //         return getOptionName(PARTICIPANT_TYPE, detail);
    //     },
    // },
    {
        title: '转交前',
        align: 'center',
        dataIndex: 'handoverUserName',
    },
    {
        title: '接收人',
        align: 'center',
        dataIndex: 'recipientUserName',
    },
    {
        title: '转交时间',
        align: 'center',
        dataIndex: 'handoverTime',
        render: (text) => {
            return text && moment(text).format(DATE_FORMAT);
        },
    },
    {
        title: '说明',
        align: 'center',
        dataIndex: 'remark',
    },
];
@connect(() => {
    return {};
})
class ExpenseConfirmDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feeVerifyShow: false,
            loading: false,
            confirmButton: false,
            basicData: {},
            notifyUserList: [],
            confirmDetail: [],
            feeVerifyDetailDtos: [],
            title: '',
            content: '',
            endStatus: 0,
            status: 0,
            connectData: [],
            costLogVisible: false,
            detailId: null,
        };
    }

    componentDidMount() {
        this.getFeeVerifyDetail();
        this.getConnectHistory();
    }

    getFeeVerifyDetail = async () => {
        try {
            this.setState({ loading: true });
            const id = this.props.location.query.id || '';
            const result = await getFeeVerifyDetail(id);
            const {
                confirmDetail,
                endStatus,
                feeVerifyDetailDtos,
                projectCode,
                talentDTOS,
                confirmButton,
                notifyUserList,
            } = result.data || {};
            const basicData = Object.assign({}, result.data || {}, {
                talentName: (talentDTOS || [])
                    .map((item) => {
                        return item.talentName;
                    })
                    .join(', '),
            });
            const feeVerifyDetail = (feeVerifyDetailDtos || []).map((item, index) => {
                return { ...item, index };
            });
            const notifyList = (notifyUserList || []).reduce((list, item) => {
                const userItem = {
                    ...item,
                    avatar: item.endUserAvatar,
                    executorName: item.endUserName,
                    userId: item.id,
                    userName: item.endUserName,
                };
                list.push(userItem);
                return list;
            }, []);
            this.setState(
                {
                    endStatus,
                    basicData,
                    confirmButton,
                    confirmDetail,
                    notifyUserList: notifyList,
                    feeVerifyDetailDtos: feeVerifyDetail,
                    detailId: id,
                },
                () => {
                    this.props.dispatch({
                        type: 'header/saveHeaderName',
                        payload: {
                            title: '项目费用确认单详情',
                            subTitle: projectCode || '',
                            component: this.rightBtns(endStatus),
                        },
                    });
                },
            );
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ loading: false });
        }
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await connectInfo(id, 19);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    rightBtns = (endStatus) => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/project/contract/verify/detail/cbPress">
                    <BIButton
                        type="primary"
                        disabled={!!endStatus}
                        className={styles.headerBtn}
                        onClick={this.handleClick}
                    >
                        催办
                    </BIButton>
                </AuthButton>
            </div>
        );
    };

    // 催办
    handleClick = async () => {
        try {
            const id = this.props.location.query.id || '';
            const result = await getFeeVerifyReminder(id);
            if (result.success) {
                message.success('催办成功');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 项目费用未完结操作
    hasNotFinishClick = () => {
        this.setState({
            title: '未完结',
            content:
                '项目未完结后，可继续基于该项目合同进行费用报销，请及时完成报销，否则该项目无法完成结算，是否确认“未完结”操作？',
            status: 0,
            feeVerifyShow: true,
        });
    };

    // 项目费用确认已完结操作 postFeeVerifyEnd
    hasFinishClick = () => {
        this.setState({
            title: '已完结',
            content: '项目结算完成后，无法再次基于该项目合同费用报销，是否确认“已完结”操作？',
            status: 1,
            feeVerifyShow: true,
        });
    };

    // 项目费用确认modal
    feeVerifyConfirm = () => {
        const { title, content, status } = this.state;
        return (
            <BIModal
                title={title}
                destroyOnClose={true}
                visible={this.state.feeVerifyShow}
                onOk={() => {
                    return this.postFeeVerifyEnd(status);
                }}
                onCancel={() => {
                    return this.setState({ feeVerifyShow: false });
                }}
            >
                <p>{content}</p>
            </BIModal>
        );
    };

    // 项目费用确认请求
    postFeeVerifyEnd = async (endStatus) => {
        try {
            const contractId = Number(this.props.location.query.id);
            const result = await postFeeVerifyEnd({
                contractId,
                endStatus,
            });
            if (result.success) {
                this.getFeeVerifyDetail();
                // this.props.history.goBack();
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ feeVerifyShow: false });
        }
    };

    basicList = (list, data) => {
        return list.map((item, index) => {
            const value = data[item.key] || '';
            let border = null;
            if (index === 0) {
                border = { border: '1px solid #ECECEC' };
            } else {
                border = { border: '1px solid #ECECEC', borderTopWidth: 0 };
            }
            return (
                <div key={index}>
                    <div className={styles.row} style={border}>
                        <div className={styles.listLeft}>{item.title}</div>
                        <div className={styles.listRight}>{value}</div>
                    </div>
                </div>
            );
        });
    };

    notifyUserList = () => {
        const { notifyUserList } = this.state;
        return (
            <div>
                <div className={styles.tit}>知会人</div>
                <NotifyNode hideBtn={true} data={notifyUserList} />
            </div>
        );
    };

    renderStatusBtns = () => {
        const { endStatus, confirmButton } = this.state;
        if (confirmButton) {
            if (endStatus === 0) {
                return (
                    <div className={styles.buttonCenter}>
                        <BIButton ghost type="primary" onClick={this.hasNotFinishClick}>
                            未完结
                        </BIButton>
                        <BIButton style={{ marginLeft: '18px' }} type="primary" onClick={this.hasFinishClick}>
                            已完结
                        </BIButton>
                    </div>
                );
            }
        }
    };

    render() {
        const {
            basicData, confirmDetail, feeVerifyDetailDtos, loading, connectData, costLogVisible,
        } = this.state;
        const commentsParams = this.props.commentsParams || {};
        const reimburseApply = feeVerifyDetailDtos.reduce((total, item) => {
            // eslint-disable-next-line no-return-assign
            return (total += item.reimburseApply);
        }, 0);
        const totalNum = _.isEmpty(feeVerifyDetailDtos) ? [] : [{ reimburseApply, index: 'total', name: '总计' }];
        return (
            <>
                <BISpin spinning={loading}>
                    <div className={styles.detailPage1}>
                        <div className={styles.tit}>基本信息</div>
                        <div className={styles.m20}>{this.basicList(baseColumn, basicData)}</div>
                        <div className={styles.tit}>费用明细</div>
                        <div className={styles.m20}>
                            <BITable
                                rowKey="index"
                                columns={expenseDetail}
                                dataSource={feeVerifyDetailDtos.concat(totalNum)}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                        <div className={styles.tit} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>确认结果</span>
                            <BIButton
                                type="link"
                                onClick={() => {
                                    return this.setState({ costLogVisible: true });
                                }}
                            >
                                查看操作日志
                            </BIButton>
                        </div>
                        <div className={styles.m20}>
                            <BITable
                                rowKey="id"
                                columns={confirmResult}
                                dataSource={confirmDetail}
                                bordered={true}
                                pagination={false}
                            />
                        </div>
                        {this.notifyUserList()}
                        {this.renderStatusBtns()}
                        {Array.isArray(connectData) && connectData.length > 0 && (
                            <div className={styles.m20}>
                                <BITable
                                    rowKey="id"
                                    columns={connectColumn}
                                    dataSource={connectData}
                                    bordered={true}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {this.feeVerifyConfirm()}
                        {/* 查看费用确认日志 */}
                        {costLogVisible ? (
                            <Dymic
                                visible={this.state.costLogVisible}
                                width={720}
                                interfaceName="19"
                                commentId={this.state.detailId}
                                footer={null}
                                onCancel={() => {
                                    return this.setState({ costLogVisible: false });
                                }}
                                className={s.modalDymic}
                            />
                        ) : null}
                    </div>
                </BISpin>
                <AuthButton authority="/foreEnd/business/project/contract/verify/detail/commen">
                    <SlefProgress
                        id={Number(commentsParams.id || this.props.location.query.id)}
                        interfaceName={commentsParams.interfaceName || '19'}
                        authority="/foreEnd/business/project/contract/verify/detail/publishCommen"
                    />
                </AuthButton>
            </>
        );
    }
}

export default ExpenseConfirmDetail;
