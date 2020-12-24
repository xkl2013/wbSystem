import React from 'react';
import { connect } from 'dva';
import SlefProgress from '@/components/Progress';
import _ from 'lodash';
import Approval from '@/components/ApprovalProgress';
import BIRadio from '@/ant_components/BIRadio';
import storage from '@/utils/storage';
import BIButton from '@/ant_components/BIButton';
import ApprovalBtns from '@/components/ApprovalBtns';
import ApprovalEdit from '@/pages/approval/initiate/component/approvalForm';
import { getApprovalInstance, getInstanceNodes } from '../services';
import styles from './styles.less';
import Detail from './commonDetail';

/**
 * 发起人详情及审批历史记录
 *  flowKeys: {
 *      PROJECTING("立项审批","projecting"),
        REIMBURSE("费用报销","reimburse"),
        CONTRACT("合同审批","contract"),
        APPLICATION("费用申请","application"),
        COMMONCONTRACTCOMMERCE("合同条款审核非商单类","common_ContractCommerce"),
        CONTRACTCOMMERCE("合同条款审核商单类","ContractCommerce"),
        TRAVEL("出差申请","travel"),
        OUTWORK("外勤","outwork"),
        PROPAGATE("宣传费用申请","propagate"),
        QUOTATIOON("刊例审批","quotation")
 * }
 *
 */

@connect()
class Project extends React.Component {
    state = {
        type: '1', // tab切换 1-概况 2-审批
        flowKey: '',
        approvalData: {},
        instanceData: {},
        approvalIcon: null, // 审批角标
    };

    componentDidMount() {
        this.getApprovalInstance();
    }

    componentWillUnmount() {
        // 卸载时清掉header中的数据
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {},
        });
    }

    initData = () => {
        this.setState({
            type: '1',
        });
    };

    fetchData = () => {
        this.getInstanceData();
        this.getApprovalInstance();
    };

    getInstanceData = async () => {
        // 审批tab
        const id = this.props.location.query.id || '';
        if (!id) {
            return;
        }
        const response = await getInstanceNodes(id);
        if (response && response.success) {
            const approvalData = response.data || {};
            this.setState({ approvalData });
        }
    };

    reStsartPress = (data, type) => {
        if (this.detail && this.detail.reStart) {
            this.detail.reStart(data, type);
            return;
        }
        if (this.reStartForm.onShow) {
            this.reStartForm.onShow(_.cloneDeep(data), type);
        }
    };

    getApprovalInstance = async () => {
        // 概况tab
        const id = this.props.location.query.id || '';
        if (!id) {
            return;
        }
        const response = await getApprovalInstance(id);
        if (response && response.success) {
            const instanceData = response.data || {};
            const approvalFlow = instanceData.approvalFlow || {};
            const flowKey = approvalFlow.flowKey || '';
            const code = instanceData.instanceCode || '';
            const title = approvalFlow.name || '审批';
            // const status = instanceData.status;
            this.setState({ instanceData, flowKey }, () => {
                this.props.dispatch({
                    type: 'header/saveHeaderName',
                    payload: {
                        title: title ? `${title}详情` : '',
                        subTitle: code,
                        component: this.rightBtnsApproval(instanceData, id),
                    },
                });
            });
        }
    };

    btnsObjCallback = (data) => {
        // 处理自定义审批按钮
        const { flowKey } = this.state;
        switch (flowKey) {
            case 'quotation': // 刊例审批变更不需要审批回退和审批转交
                return { ...data, rebackBtn: false, handOverBtn: false };
            default:
                return data;
        }
    };

    rightBtnsApproval = (instanceData, id) => {
        // 右侧按钮  -1 撤销  0  驳回 1 审批通过
        return (
            <div>
                {/* 重新提交 */}
                {this.resetBtn(instanceData)}
                <ApprovalBtns
                    btnsObjCallback={this.btnsObjCallback}
                    commonCallback={this.fetchData}
                    editCallback={() => {
                        return this.reStsartPress(instanceData, 'edit');
                    }}
                    instanceId={id}
                    approvalIconCallback={(node) => {
                        this.setState({ approvalIcon: node });
                    }}
                />
            </div>
        );
    };

    resetBtn = (instanceData) => {
        // 重新提交按钮
        const createBy = instanceData.createBy || '';
        const status = instanceData.status;
        if (storage.getUserInfo().userId !== createBy) {
            return null;
        }
        if (status === 0 || status === -1) {
            return (
                <BIButton
                    type="primary"
                    style={{ marginRight: '10px', width: '76px' }}
                    onClick={() => {
                        return this.reStsartPress(instanceData, 'approvalReStart');
                    }}
                >
                    重新提交
                </BIButton>
            );
        }
        return null;
    };

    tabChange = (e) => {
        // tab切换
        this.setState({
            type: e.target.value,
        });
        if (e.target.value === '2') {
            this.getInstanceData();
        }
        if (e.target.value === '1') {
            this.getApprovalInstance();
        }
    };

    renderContent = () => {
        const { approvalData, instanceData, flowKey } = this.state;
        const type = this.state.type;
        // 需要自定义渲染内容区域
        if (flowKey === 'quotation') {
            return (
                <Detail
                    {...this.props}
                    flowKey={flowKey}
                    ref={(dom) => {
                        this.detail = dom;
                    }}
                    instanceData={instanceData}
                    tabTape={type}
                    onTabChange={this.tabChange}
                    approvalDom={() => {
                        return (
                            <div className={styles.m20}>
                                <Approval data={approvalData} />
                            </div>
                        );
                    }}
                />
            );
        }
        return (
            <>
                {type === '1' ? (
                    <Detail
                        {...this.props}
                        flowKey={flowKey}
                        ref={(dom) => {
                            this.detail = dom;
                        }}
                        instanceData={instanceData}
                    />
                ) : null}
                {type === '2' ? (
                    <div className={styles.m20}>
                        <Approval data={approvalData} />
                    </div>
                ) : null}
            </>
        );
    };

    render() {
        const { instanceData, flowKey } = this.state;
        const selfId = this.props.location.query.id || '';
        return (
            <div className={styles.wrap}>
                {this.state.approvalIcon}
                <div className={styles.wrapTit}>
                    <BIRadio value={this.state.type} buttonStyle="solid" onChange={this.tabChange}>
                        <BIRadio.Button className={styles.tabBtn} value="1">
                            概况
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="2">
                            审批
                        </BIRadio.Button>
                    </BIRadio>
                </div>
                {this.renderContent()}
                <SlefProgress id={Number(selfId)} interfaceName="8" />
                {/* 重新发起一般审批功能 */}
                <ApprovalEdit
                    ref={(dom) => {
                        this.reStartForm = dom;
                    }}
                    formData={instanceData}
                    flowKey={flowKey}
                    instanceId={selfId}
                    history={this.props.history}
                />
            </div>
        );
    }
}
export default Project;
