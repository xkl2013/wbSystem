import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import lodash from 'lodash';
import BIButton from '@/ant_components/BIButton';
import { getOptionName } from '@/utils/utils';
import { CONTRACT_SIGN_TYPE } from '@/utils/enum';
import BIModal from '@/ant_components/BIModal';
import BIInput from '@/ant_components/BIInput';
import Upload from '@/components/upload';
import storage from '@/utils/storage';
import { renderTxt } from '@/utils/hoverPopover';
import SubmitButton from '@/components/SubmitButton';
import NotifyNode from '@/components/notifyNode';
import Information from '@/components/informationModel';
import {
    cancelApproval,
    getCommerceDetail,
    CommerceAgree,
    pushCommerce,
    CommerceAgreeEnd,
} from '@/pages/approval/services';

import VerifyRounds from './VerifyRounds';
import DetailInfoFlex from './DetailInfoTemplate';
import styles from './index.less';

@connect(() => {
    return {
        // loading: loading.effects['admin_approval/getCommerceDetail'],
    };
})
class ContractVerifyDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailData: {},
            detailInfo: [],
            // approvaled: 0,
            btnCancelPush: false, // 撤销按钮
            btnRejectPush: false, // 发起审批按钮
            btnConfirmPush: false, // 确认定稿按钮
            modalConfirmStatus: false, // 确认定稿弹窗
            modalBackState: false, // 弹窗
            approveStatus: false, // 发起审批：true；反馈意见：false
            upload: [],
            opinion: '',
            submitIng: false,
        };
    }

    componentDidMount() {
        this.getDetailData();
    }

    getUserId = () => {
        const userInfo = storage.getUserInfo() || {};
        return userInfo.userId;
    };

    // 审批详情数据
    getDetailData = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        try {
            const res = await getCommerceDetail(id);
            if (res && res.data) {
                const { data } = res;
                let detailInfo = [];
                detailInfo = [
                    { infokey: '申请日期', infoValue: data.clauseApplyTime.slice(0, 10) },
                    { infokey: '申请人', infoValue: data.clauseApplyUserName },
                    { infokey: '申请人所属部门', infoValue: data.clauseApplyDeptName },
                    {
                        infokey: '项目',
                        infoValue: data.clauseProjectName,
                        projectId: data.clauseProjectId,
                        projectName: data.clauseProjectName,
                    },
                    {
                        infokey: '艺人',
                        infoValue: data.clauseStarName,
                        starId: data.clauseStarId,
                        starName: data.clauseStarName,
                        starType: data.clauseStarType,
                    },
                ];
                if (data.clauseContractType === 1) {
                    detailInfo = [
                        ...detailInfo,
                        {
                            infokey: '签约方式',
                            infoValue: getOptionName(CONTRACT_SIGN_TYPE, data.clauseSigningWay),
                        },
                    ];
                }
                const { approvalList } = data;
                const newParams = {
                    detailInfo,
                    detailData: data,
                };
                // this.setState(
                //     {
                //         detailInfo,
                //         detailData: data,
                //     },
                //     () => {
                //         this.rightBtn();
                //     },
                // );

                // 审批已撤销或者是可以发起审核,未定稿
                // eslint-disable-next-line max-len
                newParams.btnRejectPush = (data.clauseApprovalStatus === -1 && this.getUserId() === data.clauseApplyUserId)
                    || (data.submited === 1 && data.clauseFinalizedStatus === 0 && approvalList[0].status === 2);
                // if (data.submited === 1 && data.clauseFinalizedStatus === 0 && approvalList[0].status === 2) {
                // this.setState(
                //     {
                //         btnRejectPush: true,
                //     },
                //     () => {
                //         this.rightBtn();
                //     },
                // );
                // }
                // eslint-disable-next-line max-len
                newParams.btnConfirmPush = data.agreed === 1 && (data.clauseFinalizedStatus === 0 && approvalList[0].status === 2);
                newParams.btnCancelPush = data.clauseFinalizedStatus === 0
                    && this.getUserId() === data.clauseApplyUserId
                    && data.clauseApprovalStatus !== -1
                    && approvalList[0].status < 2;
                // if (data.agreed === 1 && data.clauseFinalizedStatus === 0 && approvalList[0].status === 2) {

                //     this.setState(
                //         {
                //             btnConfirmPush: true,
                //         },
                //         () => {
                //             this.rightBtn();
                //         },
                //     );
                // }
                this.setState({ ...newParams }, () => {
                    this.rightBtn();
                });
            }
        } catch (error) {
            throw error;
        }
    };

    // 测校本轮审批
    onCancelInstance = async () => {
        const { detailData } = this.state;
        const res = await cancelApproval(detailData.clauseApprovalId, { opinion: '' });
        if (res && res.success) {
            message.success('撤销成功');
            this.getDetailData();
        }
    };

    // 确认定稿
    fnConfirmAgree = async () => {
        const { detailData } = this.state;
        const result = await CommerceAgreeEnd(detailData.clauseId);
        this.modalConfirmClose();
        if (result.success) {
            // 确认定稿
            if (detailData.clauseContractType === 1) {
                this.props.history.push({
                    pathname: '/foreEnd/approval/apply/business',
                });
            } else {
                this.props.history.push({
                    pathname: '/foreEnd/approval/apply/contract',
                });
            }
        } else {
            message.error(result.message);
        }
    };

    // 审批详情内容DOM
    creatVerifyDetail = (data) => {
        const result = [];
        data.map((item, index) => {
            if (item.infokey === '项目') {
                const dataItem = [
                    {
                        ...item.infoValue,
                        id: item.projectId,
                        name: item.projectName,
                        path: '/foreEnd/business/project/manage/detail',
                    },
                ];
                result.push(
                    <li key={index}>
                        <span className={styles.infoKey}>{item.infokey}</span>
                        <span className={styles.infoValue}>
                            <Information data={dataItem} hoverPopover={true} />
                        </span>
                    </li>,
                );
            } else if (item.infokey === '艺人') {
                let starName = [];
                try {
                    starName = JSON.parse(item.starName);
                } catch (e) {
                    console.log(e);
                }
                const dataItem = starName.map((cItem) => {
                    return {
                        id: cItem.talentId,
                        name: cItem.talentName,
                        path:
                            cItem.talentType === 0
                                ? '/foreEnd/business/talentManage/talent/actor/detail'
                                : '/foreEnd/business/talentManage/talent/blogger/detail',
                    };
                });
                result.push(
                    <li key={index}>
                        <span className={styles.infoKey}>{item.infokey}</span>
                        <span className={styles.infoValue} style={{ display: 'flex' }}>
                            {dataItem.map((dom, domIndex) => {
                                return <Information data={[dom]} hoverPopover={true} key={domIndex} />;
                            })}
                        </span>
                    </li>,
                );
            } else {
                result.push(
                    <li key={index}>
                        <span className={styles.infoKey}>{item.infokey}</span>
                        <span className={styles.infoValue}>
                            <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {renderTxt(item.infoValue, 40)}
                            </span>
                        </span>
                    </li>,
                );
            }

            return result;
        });
        return <ul className={styles.verifyDetailInfo}>{result}</ul>;
    };

    // 发起审批btn
    rightBtn = () => {
        const { detailData } = this.state;
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title:
                    detailData.clauseContractType === 1 ? '合同条款审核详情（商单类）' : '合同条款审核详情（非商单类）',
                subTitle: detailData.clauseApplyCode,
                component: this.rightBtns(),
            },
        });
    };

    rightBtns = () => {
        const { btnRejectPush, btnConfirmPush, btnCancelPush } = this.state;
        return (
            <>
                {btnCancelPush ? (
                    <BIButton type="primary" ghost className={styles.headerBtn} onClick={this.onCancelInstance}>
                        撤销本轮
                    </BIButton>
                ) : null}
                {btnRejectPush ? (
                    <BIButton
                        type="primary"
                        ghost
                        className={styles.headerBtn}
                        onClick={() => {
                            return this.setState({ modalBackState: true, approveStatus: true });
                        }}
                    >
                        发起审核
                    </BIButton>
                ) : null}
                {btnConfirmPush ? (
                    <SubmitButton
                        type="primary"
                        ghost
                        className={styles.headerBtn}
                        onClick={() => {
                            return this.setState({ modalConfirmStatus: true });
                        }}
                    >
                        确认定稿
                    </SubmitButton>
                ) : null}
            </>
        );
    };

    // 附件上传监听
    changeFile = (data) => {
        const upload = data.map((item) => {
            return {
                domain: item.domain,
                name: item.name,
                url: item.value,
            };
        });
        this.setState({
            upload,
        });
    };

    // 反馈意见展示
    showModalReject = () => {
        this.setState({
            modalBackState: true,
        });
    };

    // 反馈意见、发起审批
    fnCommerceReject = async () => {
        await this.setState({ submitIng: true });
        try {
            const { upload, opinion, approveStatus, detailData } = this.state;
            const id = detailData.clauseApprovalId;
            const { clauseId } = detailData;

            if (opinion === '') {
                message.warning(`${approveStatus ? '待审核内容' : '审核意见'}必填`);
            } else if (opinion.length > 140) {
                message.warning(`${approveStatus ? '待审核内容' : '审核意见'}不能超过140个字`);
            } else if (!approveStatus) {
                // 反馈意见
                if (upload.length > 5) {
                    message.warning('附件不得超过5个');
                    return;
                }
                const res = await CommerceAgree(id, {
                    upload: JSON.stringify(upload),
                    opinion,
                });
                if (res.success) {
                    this.modalBackClose();
                    this.getDetailData();
                }
            } else if (upload.length < 1) {
                message.warning('附件个数小于1或未上传完毕');
            } else {
                // 发起审批
                let params = {
                    clauseContractType: detailData.clauseContractType,
                    approvalDesc: opinion,
                    clauseId,
                };
                if (detailData.clauseContractType === 1) {
                    params = Object.assign(
                        {
                            attachmentList: upload,
                            // clauseProjectId: Number(detailData.clauseProjectId),
                            // clauseProjectName: detailData.clauseProjectName,
                            // clauseStarId: detailData.clauseStarId,
                            // clauseStarName: detailData.clauseStarName,
                            // clauseSigningWay: Number(detailData.clauseSigningWay),
                        },
                        params,
                    );
                } else {
                    params = Object.assign(
                        {
                            attachmentList: upload,
                            clauseApplyTime: detailData.clauseApplyTime,
                        },
                        params,
                    );
                }
                if (upload.length > 5) {
                    message.warning('附件不得超过5个');
                    return;
                }
                const res = await pushCommerce(params);
                if (res.success) {
                    // this.modalBackClose();
                    // this.getDetailData();
                    this.setState(
                        {
                            btnRejectPush: false,
                            btnConfirmPush: false,
                        },
                        () => {
                            this.modalBackClose();
                            this.getDetailData();
                        },
                    );
                }
            }
        } catch (error) {
            throw error;
        }
        await this.setState({ submitIng: false });
    };

    // 审核意见文本变化监听
    textAreaChange = (e) => {
        this.setState({
            opinion: e.target.value.replace(/\s+/g, ''),
        });
    };

    // 关闭发起审批、反馈意见弹窗
    modalBackClose() {
        this.setState({
            modalBackState: false,
        });
    }

    // 关闭确认定稿弹窗
    modalConfirmClose() {
        this.setState({
            modalConfirmStatus: false,
        });
    }

    // 进程轮次
    verifyDom(detailData) {
        const { detailInfo } = this.state;
        const result = [];
        const { approvalList, clauseContractType } = detailData;
        const { approvaled } = detailData; // 是否是经办人

        if (Array.isArray(approvalList) && approvalList.length >= 1) {
            approvalList.map((item, index) => {
                result.push(
                    <VerifyRounds
                        key={index === 1 ? `${item.id}${Math.random()}` : item.id}
                        verifyId={item.versionId}
                        id={item.id}
                        detailInfo={detailInfo}
                        approvaled={approvaled}
                        dataSource={item}
                        btnStatus={!!(approvaled === 1 && index === 0)}
                        commentShowStatus={index === 0}
                        clauseContractType={clauseContractType}
                        refresh={this.getDetailData}
                        showModalReject={this.showModalReject}
                    />,
                );
            });
        }
        return result;
    }

    render() {
        const { detailInfo, detailData, modalBackState, approveStatus, modalConfirmStatus } = this.state;
        const { notifyUserList } = detailData;
        return (
            <>
                <BIModal
                    visible={modalBackState}
                    onOk={lodash.debounce(this.fnCommerceReject, 400)}
                    onCancel={() => {
                        return this.modalBackClose();
                    }}
                    title={!approveStatus ? '反馈意见' : '发起审核'}
                    width={500}
                    confirmLoading={this.state.submitIng}
                >
                    <BIInput.TextArea
                        placeholder="请输入审核意见"
                        maxLength={140}
                        onChange={(e) => {
                            return this.textAreaChange(e);
                        }}
                    />
                    <Upload
                        value={[]}
                        btnText="添加附件"
                        onChange={this.changeFile}
                        renderButton={<span className={styles.btnUpload}>添加附件</span>}
                    />
                </BIModal>
                <BIModal
                    visible={modalConfirmStatus}
                    onOk={lodash.debounce(this.fnConfirmAgree, 400)}
                    onCancel={() => {
                        return this.modalConfirmClose();
                    }}
                    title="确认定稿"
                >
                    <p>确认定稿后不允许再次发起审核，且定稿附件会关联至合同流程，此过程不可逆，是否确认定稿？</p>
                </BIModal>
                {/* 审批详情 */}
                <DetailInfoFlex title="审批详情">{this.creatVerifyDetail(detailInfo)}</DetailInfoFlex>
                {/* 审批进程 */}
                <DetailInfoFlex title="审批进程">
                    {/* 进程轮次 */}
                    {this.verifyDom(detailData)}
                </DetailInfoFlex>
                <DetailInfoFlex title="知会人">
                    {notifyUserList && notifyUserList.length > 0 ? (
                        <NotifyNode
                            hideBtn={true}
                            title=""
                            data={notifyUserList.map((item) => {
                                return {
                                    ...item,
                                    executorName: item.notifyUsername,
                                };
                            })}
                        />
                    ) : (
                        <div style={{ height: '20px' }} />
                    )}
                </DetailInfoFlex>
            </>
        );
    }
}
export default ContractVerifyDetail;
