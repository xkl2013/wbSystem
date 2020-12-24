import React from 'react';
import { message, Menu, Dropdown } from 'antd';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';

import { msgF } from '@/utils/utils';
import SubmitButton from '@/components/SubmitButton';
import getApprovalBtnsMth from './getApprovalBtnsMth';
import styles from './styles.less';
import Reject from './components/reject';
import HandOver from './components/handOver';
import Reback from './components/reback';
import approvalIcon from './components/approvalIcon';

import { agreeProject, getInstanceNodes, cancelApproval } from './services';
/**
 *  审批：同意、驳回、转交、回退、撤销、编辑  按钮组件
 *  props:
 *      instanceId          -  number    - 审批ID（必传）
 *      commonCallback      -  function  - 同意、驳回、转交、回退、撤销成功后   统一回调
 *      agreeCallback       -  function  - 同意回调
 *      rejectCallback      -  function  - 驳回回调
 *      handOverCallback    -  function  - 转交回调
 *      rebackCallback      -  function  - 回退回调
 *      revocationCallback  -  function  - 撤销回调
 *      editCallback        -  function  - 编辑回调
 *      approvalIconCallback-  function(ReactNode) - 审批状态角标
 *      btnsObjCallback     -  function(obj) - 传入按钮显隐对象，并返回新的显隐对象
 *
 *
 */
export default class ApprovalBtns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnsObj: {}, // 按钮显隐状态
            moreBtns: [
                {
                    key: 'rebackBtn',
                    title: '回退',
                },
                {
                    key: 'handOverBtn',
                    title: '转交',
                },
            ], // 更多按钮
        };
        this.moreBtn = React.createRef();
    }

    componentDidMount() {
        this.getInstanceData(this.props.instanceId);
    }

    // eslint-disable-next-line react/sort-comp
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.instanceId !== this.props.instanceId || nextProps.approvalStatus !== this.props.approvalStatus) {
            this.getInstanceData(nextProps.instanceId);
        }
    }

    getInstanceData = async (id) => {
        // 获取审批流数据
        if (!id) {
            return;
        }
        const result = await getInstanceNodes(id);
        if (result && result.success && result.data) {
            this.approvalIconMth(result.data.status);
            const btnsObj = await getApprovalBtnsMth(result.data);
            this.setState({
                btnsObj,
            });
        }
    };

    approvalIconMth = (status) => {
        // 获取审批状态角标
        const res = approvalIcon(status);
        if (this.props.approvalIconCallback) {
            this.props.approvalIconCallback(res);
        }
    };

    rejectMth = () => {
        // 驳回mth
        // eslint-disable-next-line no-unused-expressions
        this.rejectRef && this.rejectRef.initData();
    };

    agreeMth = async () => {
        // 同意mth
        const id = this.props.instanceId;
        if (!id) {
            message.error(msgF('id不存在'));
            return;
        }
        const result = await agreeProject(id, { opinion: '' });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.getInstanceData(id);
            // eslint-disable-next-line no-unused-expressions
            this.props.agreeCallback && this.props.agreeCallback();
            // eslint-disable-next-line no-unused-expressions
            this.props.commonCallback && this.props.commonCallback();
            this.successGo();
        }
    };

    moreBtnsItem = (btnsObj) => {
        // 更多按钮
        const { moreBtns } = this.state;
        return (
            <Menu onClick={this.moreBtnClick}>
                {moreBtns.map((item) => {
                    return btnsObj[item.key] ? (
                        <Menu.Item key={item.key}>
                            <p className={styles.tc}>{item.title}</p>
                        </Menu.Item>
                    ) : null;
                })}
            </Menu>
        );
    };

    moreBtnClick = (item) => {
        // 更多按钮点击
        switch (item.key) {
            case 'rebackBtn':
                // eslint-disable-next-line no-unused-expressions
                this.rebackRef && this.rebackRef.initData();
                break;
            case 'handOverBtn':
                // eslint-disable-next-line no-unused-expressions
                this.handOverRef && this.handOverRef.initData();
                break;
            default:
                break;
        }
    };

    revocationMth = () => {
        // 撤销
        BIModal.confirm({
            title: '撤销将中断审批申请',
            okText: '确定',
            cancelText: '取消',
            autoFocusButton: null,
            onOk: () => {
                this.cancelProject();
            },
        });
    };

    cancelProject = async () => {
        // 撤销项目
        const id = this.props.instanceId;
        if (!id) {
            message.error(msgF('id不存在'));
            return;
        }
        const result = await cancelApproval(id, { opinion: '' });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.getInstanceData(id);
            // eslint-disable-next-line no-unused-expressions
            this.props.revocationCallback && this.props.revocationCallback();
            // eslint-disable-next-line no-unused-expressions
            this.props.commonCallback && this.props.commonCallback();
        }
    };

    editMth = () => {
        // 编辑
        // eslint-disable-next-line no-unused-expressions
        this.props.editCallback && this.props.editCallback();
    };

    successGo = () => {
        // 成功的回调、跳转
        setTimeout(() => {
            window.history.go(-1);
            // window.g_history.push('/foreEnd/approval/approval/myjob');
        }, 500);
    };

    btnsObjMth = () => {
        // 返回按钮显隐对象
        let btnsObj = this.state.btnsObj;
        if (this.props.btnsObjCallback) {
            const obj = this.props.btnsObjCallback(btnsObj);
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                btnsObj = obj;
            }
        }
        return btnsObj;
    };

    render() {
        const btnsObj = this.btnsObjMth();
        const {
            editBtn, revocationBtn, agreeBtn, rejectBtn, handOverBtn, rebackBtn,
        } = btnsObj;
        return (
            <>
                {editBtn && (
                    <BIButton
                        type="primary"
                        ghost
                        style={{ marginRight: '10px', width: '76px' }}
                        onClick={this.editMth}
                    >
                        编辑
                    </BIButton>
                )}
                {revocationBtn && (
                    <BIButton
                        type="primary"
                        ghost
                        style={{ marginRight: '10px', width: '76px' }}
                        onClick={this.revocationMth}
                    >
                        撤销
                    </BIButton>
                )}
                {rejectBtn && (
                    <BIButton
                        type="primary"
                        ghost
                        style={{ marginRight: '10px', width: '76px' }}
                        onClick={this.rejectMth}
                    >
                        驳回
                    </BIButton>
                )}
                {agreeBtn && (
                    <SubmitButton type="primary" style={{ marginRight: '10px', width: '76px' }} onClick={this.agreeMth}>
                        同意
                    </SubmitButton>
                )}
                {(handOverBtn || rebackBtn) && (
                    <Dropdown
                        overlay={this.moreBtnsItem(btnsObj)}
                        getPopupContainer={() => {
                            return this.moreBtn && this.moreBtn.current;
                        }}
                        // overlayClassName={styles.overlayClassName}
                    >
                        <div ref={this.moreBtn} style={{ display: 'inline-block' }}>
                            <BIButton style={{ marginRight: '10px', width: '76px' }}>更多</BIButton>
                        </div>
                    </Dropdown>
                )}
                <Reject
                    ref={(dom) => {
                        this.rejectRef = dom;
                    }}
                    {...this.props}
                    getInstanceData={this.getInstanceData}
                    successGo={this.successGo}
                />
                <HandOver
                    ref={(dom) => {
                        this.handOverRef = dom;
                    }}
                    {...this.props}
                    getInstanceData={this.getInstanceData}
                    successGo={this.successGo}
                />
                <Reback
                    ref={(dom) => {
                        this.rebackRef = dom;
                    }}
                    {...this.props}
                    getInstanceData={this.getInstanceData}
                    successGo={this.successGo}
                />
            </>
        );
    }
}
