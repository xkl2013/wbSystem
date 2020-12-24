/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { message, Popover, Tooltip } from 'antd';
import styles from '@/components/ApprovalProgress/index.less';
import { getOptionName } from '@/utils/utils';
import { APPROVAL_GLOBAL_STATE, APPROVAL_STATE } from '@/utils/enum';
import cbSelect from '@/assets/cbSelect.png';
import cbDis from '@/assets/cbDis.png';
import { hastenWorkApi } from '@/services/comment';
import request from '@/utils/request';

export default class ApprovalPerson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolTipList: [],
        };
    }

    clickCbBtn = async (item) => {
        // 点击催办按钮
        if (item.hastenWorkFlag === 2) {
            const { id } = item || {};
            const { approvalTaskLogDtos = [] } = this.props.data || {};
            const { instanceId } = approvalTaskLogDtos[0] || {};
            const response = await hastenWorkApi(instanceId, id);
            if (response && response.success) {
                message.success('已催办');
                this.props.getInstance && this.props.getInstance(instanceId);
            }
        }
    };

    tipsEnter = async (item) => {
        // hover事件
        this.setState({
            toolTipList: [],
        });
        const { executorId, executorType, id } = item || {};
        const { approvalTaskLogDtos = [] } = this.props.data || {};
        const { instanceId } = approvalTaskLogDtos[0] || {};
        const result = await this.getExecutors({
            instanceId,
            executorId,
            executorType,
            nodeId: id,
        });
        if (result && result.success) {
            const { list = [] } = result.data || {};
            let toolTipList = [];
            if (list && list.length > 0 && list[0]) {
                toolTipList = list;
            } else {
                toolTipList = [{ userName: '暂无数据', statusName: '' }];
            }
            this.setState({
                toolTipList,
            });
        }
    };

    tipNode = () => {
        // tip节点
        const { toolTipList } = this.state;
        if (toolTipList.length === 0) {
            return null;
        }
        const node = toolTipList.map((item, index) => {
            return (
                <p key={index} className={styles.tipsItem}>
                    <span>{item.userName}</span>
                    <em>{item.statusName}</em>
                </p>
            );
        });
        return <div>{node}</div>;
    };

    getExecutors = async (params) => {
        // 基于审批流查询审批人
        return request('/approval/executors', { prefix: '/approvalApi', method: 'get', params });
    };

    render() {
        const { data, style } = this.props;
        const { approvalFlowNodeDtos, status } = data;
        return (
            <div className={styles.content} style={style}>
                <div className={styles.list}>
                    {/* -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批 */}
                    {approvalFlowNodeDtos.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className={`${styles.item} ${item.status === 1 ? styles.itemWait : null} ${
                                    item.status === 0 ? styles.itemReject : null
                                }  ${item.status === 2 ? styles.itemAgree : null}  ${
                                    item.status === -1 ? styles.itemCancel : null
                                }  ${item.status === 7 ? styles.itemReback : null}`}
                            >
                                <div className={styles.itemTop}>
                                    {item.status === 1 || item.status === 3 || item.status === 5 ? (
                                        <Tooltip
                                            title={this.tipNode}
                                            placement="bottom"
                                            onMouseEnter={() => {
                                                return this.tipsEnter(item);
                                            }}
                                        >
                                            <p>{item.executorName || item.name}</p>
                                        </Tooltip>
                                    ) : (
                                        <p>{item.executorName || item.name}</p>
                                    )}
                                    <span>
                                        {index === 0 && item.status === 2
                                            ? '已提交'
                                            : getOptionName(APPROVAL_STATE, item.status)}
                                    </span>
                                    <div className={styles.itemTopIcon} />
                                </div>
                                <div className={styles.itemBottom}>
                                    <div
                                        className={`${styles.itemLine} ${index === 0 ? styles.itemLineNone : null} ${
                                            item.status !== 3 || item.status !== 5 ? styles.itemLinePass : null
                                        }`}
                                    />
                                    <div className={styles.itemIcon} />
                                    <div
                                        className={`${styles.itemLine} ${
                                            item.status === 2 ? styles.itemLinePass : null
                                        }`}
                                    />
                                </div>
                                {item.hastenWorkFlag === 0 ? (
                                    <div className={styles.itemBtn1}>-</div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            return this.clickCbBtn(item);
                                        }}
                                        className={item.hastenWorkFlag === 2 ? styles.itemBtn : styles.itemBtnDis}
                                    >
                                        <img
                                            src={item.hastenWorkFlag === 2 ? cbSelect : cbDis}
                                            className={styles.iconcls}
                                            alt=""
                                        />
                                        {item.hastenWorkFlag === 2 ? (
                                            ' 催办'
                                        ) : (
                                            <Popover
                                                placement="bottom"
                                                content={
                                                    item.hastenWorkMsg ? item.hastenWorkMsg : '未满6小时，不可催办'
                                                }
                                                trigger="hover"
                                            >
                                                催办
                                            </Popover>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {/* -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批 */}
                    <div className={styles.state}>
                        <div className={`${styles.stateLine} ${status === 2 ? styles.stateLinePass : null}`} />
                        <div className={styles.stateRight}>
                            <div
                                className={`${styles.stateIcon} ${status === -1 ? styles.stateIconCancel : null} ${
                                    status === 0 ? styles.stateIconReject : null
                                } ${status === 2 ? styles.stateIconAgree : null}`}
                            />
                            <p>{getOptionName(APPROVAL_GLOBAL_STATE, status)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
