import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import styles from './index.less';
import icon1 from '../../../assets/approval/icon1.png';
import ApprovalForm from './component/approvalForm';
import { ApprovalRequest } from './_utils/approvalRequest';

/* eslint-disable */
@connect(({ admin_approval, loading }) => ({
    flowGroups: admin_approval.flowGroups,
}))
class Initiate extends React.Component {
    state = {
        visible: false,
        flowKey: '',
        flowMark: '',
    };
    componentDidMount() {
        this.getFlowGroup();
    }
    getFlowGroup = () => {
        this.props.dispatch({
            type: 'admin_approval/getFlowGroups',
            payload: { flowStatus: 1, authorityFilterFlag: 1, groupStatus: 0 }, //写死的，0:禁用，1:启用
        });
    };

    toPathGeneral = () => {
        this.props.history.push({
            pathname: '/foreEnd/approval/initiate/general',
        });
    };

    toAddPage = (pathname) => {
        this.props.history.push({
            pathname,
        });
    };
    onClickItem = (item) => {
        const { flowMark, flowKey } = item || {};
        switch (flowMark) {
            case 'common': //一班
                this.setState({ visible: true, flowKey, flowMark }, () => {
                    this.ref.onShow && this.ref.onShow(item);
                });
                break;
            case 'travel': //差旅
                this.setState({ visible: true, flowKey }, () => {
                    this.ref.onShow && this.ref.onShow(item);
                });
                break;
            case 'contract': // 合同
                return this.toAddPage('/foreEnd/business/project/contract/add');
            case 'projecting': // 项目
                return this.toAddPage('/foreEnd/business/project/establish/add');
            case 'reimburse': // 报销
                return this.toAddPage('/foreEnd/business/feeManage/reimbursement/add');
            case 'application': // 申请
                return this.toAddPage('/foreEnd/business/feeManage/apply/add');
            case 'ContractCommerce': //商务合同
                const obj = ApprovalRequest['ContractCommerce'] || {};
                this.setState({ visible: true, flowKey }, () => {
                    this.ref.onShowOtherType &&
                        this.ref.onShowOtherType(item, {
                            hideApprovalNode: true,
                            hideNotifyNode: false,
                            callback: obj.request,
                        });
                });
                break;
            case 'common_ContractCommerce': //非商务合同
                const objCommon = ApprovalRequest['common_ContractCommerce'] || {};
                this.setState({ visible: true, flowKey }, () => {
                    this.ref.onShowOtherType &&
                        this.ref.onShowOtherType(item, {
                            hideApprovalNode: true,
                            hideNotifyNode: false,
                            callback: objCommon.request,
                        });
                });
                break;
            default:
                return message.warn('类型传入未定义');
        }
    };
    onCannel = () => {
        this.setState({ visible: false });
    };
    handleImageErrored = (e) => {
        const targt = e.currentTarget;
        targt.src = icon1;
    };
    renderDetailApproval = (item) => {
        const approvalFlows = item.approvalFlows || [];
        return approvalFlows.map((ls) => (
            <div className={styles.item} onClick={this.onClickItem.bind(this, ls)} key={ls.id}>
                <img
                    src={`${ls.icon ? CDN_HOST + '/' + ls.icon + '!pc.png' : ''}`}
                    onError={this.handleImageErrored}
                    alt=""
                />
                <p>{ls.name}</p>
            </div>
        ));
    };
    render() {
        const { visible } = this.state;
        const flowGroups = this.props.flowGroups || [];
        return (
            <div className={styles.wrap}>
                {flowGroups.map((item) => (
                    <div key={item.id}>
                        <div className={styles.listTit}>{item.name}</div>
                        <div className={styles.list}>{this.renderDetailApproval(item)}</div>
                    </div>
                ))}
                {!visible ? null : (
                    <ApprovalForm
                        visible={this.state.visible}
                        flowKey={this.state.flowKey}
                        ref={(dom) => (this.ref = dom)}
                        history={this.props.history}
                        onCannel={this.onCannel}
                    />
                )}
            </div>
        );
    }
}
export default Initiate;
