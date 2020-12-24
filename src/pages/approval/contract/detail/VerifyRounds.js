import React from 'react';
import { Tag } from 'antd';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import Information from '@/components/informationModel';
import FileDetail from '@/components/upload/detail';
import { renderTxt } from '@/utils/hoverPopover';
import SubmitButton from '@/components/SubmitButton';
import { CommerceAgree } from '../../services';
import RoundsTable from './RoundsTable';
import RoundsComment from './RoundsComment';
import styles from './VerifyRounds.less';

const columns = (data) => {
    return [
        {
            title: '',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '内容描述与意见反馈',
            dataIndex: 'opinion',
            render: (text, record, index) => {
                if (data && data.status === -1 && index === 0) {
                    return <Tag>发起人已撤销本轮审批</Tag>;
                }
                if (text === '' && record.status === 2) {
                    return <Tag color="#5C99FF">同意定稿</Tag>;
                }

                return <span style={{ cursor: 'pointer' }}>{renderTxt(text, 20)}</span>;
            },
            align: 'center',
        },
        {
            title: '附件',
            dataIndex: 'attachmentList',
            align: 'center',
            render: (text, record, index) => {
                if (record && record.status === -1 && index > 0) {
                    return null;
                }
                return <FileDetail stylePosition="center" data={text} />;
            },
        },
        {
            title: '操作人',
            dataIndex: 'executorName',
            align: 'center',
            render: (text, record, index) => {
                if (record && record.status === -1 && index > 0) {
                    return null;
                }
                return text;
            },
        },
        {
            title: '操作时间',
            dataIndex: 'createAt',
            align: 'center',
            render: (text, record, index) => {
                if (data && data.status === -1 && index === 0) {
                    const taskVoList = Array.isArray(data.taskVoList) ? data.taskVoList : [];
                    const taskObj = taskVoList.find((ls) => { return ls.status === -1; }) || {};
                    return taskObj.createAt;
                }
                if (record && record.status === -1 && index > 0) {
                    return null;
                }
                return text;
            },
        },
    ];
};

// 轮次业务组件
class VerifyRounds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAgreeState: false,
            commentStatus: false,
        };
    }

    componentDidMount() {}

    modalAgreeShow = () => {
        this.setState({
            modalAgreeState: true,
        });
    };

    // 同意定稿
    fnCommerceAgree = async () => {
        try {
            const { id } = this.props;
            const res = await CommerceAgree(id, { opinion: '', upload: '' });
            if (res.success) {
                this.modalAgreeClose();
                this.props.refresh();
            }
        } catch (error) {
            throw error;
        }
    };

    formatRoundsData = (data) => {
        const { taskVoList } = data;
        const { clauseContractType } = this.props;
        const result = [];
        let name = '经办人';
        taskVoList.map((item, index) => {
            switch (index) {
                case 0:
                    name = '经办人';
                    break;
                case 1:
                    name = '法务';
                    break;
                case 2:
                    name = '财务';
                    break;
                default:
                    name = '经办人';
                    break;
            }
            const dataInfo = [
                {
                    ...item.executorName,
                    id: item.executorId,
                    name: item.executorName,
                    flowKeys: clauseContractType === 2 ? 'common_ContractCommerce' : 'ContractCommerce',
                    flowName: clauseContractType === 2 ? '合同条款审核（非商单类）' : '合同条款审核（商单类）',
                    path: '/foreEnd/executorApproval/executor/detail',
                },
            ];
            result.push({
                name,
                opinion: item.opinion,
                createAt: item.createAt,
                attachmentList: item.attachmentList.map((cItem) => {
                    return {
                        domain: cItem.domain,
                        value: cItem.url,
                        name: cItem.name,
                    };
                }),
                status: item.status,
                id: item.id,
                executorName: index === 0 ? <Information data={dataInfo} informationModel /> : item.executorName,
            });
        });
        return result;
    };

    btnRoundsCommentFn() {
        const { commentStatus } = this.state;
        this.setState({
            commentStatus: !commentStatus,
        });
    }

    modalAgreeClose() {
        this.setState({
            modalAgreeState: false,
        });
    }

    render() {
        const { btnStatus, dataSource, commentShowStatus, verifyId } = this.props;
        const { modalAgreeState } = this.state;
        const roundsData = this.formatRoundsData(dataSource);
        return (
            <>
                <BIModal
                    visible={modalAgreeState}
                    onOk={() => {
                        return this.fnCommerceAgree();
                    }}
                    onCancel={() => {
                        return this.modalAgreeClose();
                    }}
                    title="同意定稿"
                    width={360}
                >
                    <p>同意定稿代表对申请内容无异议，此申请稿会作为最终稿，是否同意定稿？</p>
                </BIModal>
                <div className={styles.roundsBox} style={commentShowStatus ? { marginTop: '20px' } : null}>
                    <i className={styles.roundsIcon} />
                    {/* 轮次 && 按钮 */}
                    <div className={styles.roundsInfo}>
                        <div className={styles.roundsInfoTitle}>{dataSource.name}</div>
                        {btnStatus ? (
                            <div className={styles.roundsInfoBtnBox}>
                                <BIButton
                                    type="primary"
                                    className={styles.roundsInfoBtn}
                                    onClick={this.props.showModalReject}
                                >
                                    反馈意见
                                </BIButton>
                                <SubmitButton
                                    type="primary"
                                    className={styles.roundsInfoBtn}
                                    onClick={this.modalAgreeShow.bind(this)}
                                >
                                    同意订稿
                                </SubmitButton>
                            </div>
                        ) : null}
                    </div>
                    {/* 审核内容 */}
                    <RoundsTable columns={columns(dataSource)} rowKey={String(dataSource.id)} dataSource={roundsData} />
                    {/* 轮次评论 */}
                    {commentShowStatus ? (
                        <RoundsComment id={verifyId} commentShowStatus={commentShowStatus} />
                    ) : (
                        <RoundsComment id={verifyId} />
                    )}
                </div>
            </>
        );
    }
}
export default VerifyRounds;
