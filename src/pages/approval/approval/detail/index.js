import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import Detail from '../../components/detail';
import { agreeProject, rejectProject, getApprlvalDetail } from '../../services';
import ModalComponent from '../../components/ModalComponent';
import BIButton from '@/ant_components/BIButton';
import { msgF } from '@/utils/utils';
import { detailConfig } from '../../components/detail/config';
import SubmitButton from '@/components/SubmitButton';

@connect(() => {
    return {};
})
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 弹框是否显示
            btnState: 1, // 1-同意  2- 驳回
            value: '', // 理由
            apprlvalDetail: {}, // 审批详情概况
        };
    }

    componentDidMount() {
        this.getApprlvalDetailFun();
    }

    getApprlvalDetailFun = async () => {
        // 获取审批详情概况
        const {
            query: { id = '' },
        } = this.props.location || {};
        const result = await getApprlvalDetail({ id });
        if (result && result.success) {
            this.setState(
                {
                    apprlvalDetail: result.data,
                },
                () => {
                    this.hancleCallback({});
                },
            );
        }
    };

    // 数据成功回调
    hancleCallback = (data) => {
        const { formData = {}, instanceData = {} } = data;
        const {
            approvalFlow: { flowMark = '' },
            instanceCode = '',
            name = '',
        } = this.state.apprlvalDetail || {}; // type
        const typeName = (flowMark && detailConfig[flowMark] && detailConfig[flowMark].name) || ''; // type name
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: flowMark == 'common' || flowMark === 'travel' ? `${name}详情` : `${typeName}详情`,
                subTitle:
                    flowMark == 'common' || flowMark === 'travel'
                        ? `编号${instanceCode}`
                        : `${typeName}编号${formData[`${flowMark}Code`] || ''}`,
                component: this.rightBtnsApproval(formData, instanceData),
            },
        });
    };

    getId = () => {
        const {
            query: { id = '' },
        } = this.props.location || {};
        return id;
    };

    rightBtnsApproval = (formData, instanceData) => {
        // 右侧按钮 -1 撤销  0  驳回 1 审批通过
        const { apprlvalDetail } = this.state;
        const buttonStatus = (apprlvalDetail && apprlvalDetail.buttons) || [];
        return (
            <div>
                {buttonStatus.includes(0) && (
                    <BIButton
                        type="primary"
                        ghost
                        style={{ marginRight: '10px', width: '76px' }}
                        onClick={this.rejectProject}
                    >
                        驳回
                    </BIButton>
                )}
                {buttonStatus.includes(1) && (
                    <SubmitButton type="primary" style={{ width: '76px' }} onClick={this.agree}>
                        同意
                    </SubmitButton>
                )}
            </div>
        );
    };

    agreeProject = () => {
        // 审批同意
        this.setState({
            visible: true,
            btnState: 1,
        });
    };

    rejectProject = () => {
        // 审批驳回
        this.setState({
            visible: true,
            btnState: 2,
        });
    };

    inputChange = (e) => {
        e.persist();
        const value = e.target && e.target.value;
        this.setState({
            value,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = () => {
        let { btnState, value } = this.state;
        value = value.trim();
        if (!value && btnState == 2) {
            message.error(msgF('请输入理由'));
            return;
        }
        if (btnState == 1) {
            this.agree(value);
        } else {
            this.reject(value);
        }
    };

    agree = async () => {
        // 同意
        const id = this.getId();
        const result = await agreeProject(id, { opinion: '' });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.onCancel();
            this.getApprlvalDetailFun();
            this.refs.parentDetail.refs
                && this.refs.parentDetail.refs.detail
                && this.refs.parentDetail.refs.detail.initData
                && this.refs.parentDetail.refs.detail.initData(); // 强刷子组件
            this.goApproval();
        }
    };

    reject = async (opinion) => {
        // 驳回
        const id = this.getId();
        const result = await rejectProject(id, { opinion });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.onCancel();
            this.getApprlvalDetailFun();
            this.refs.parentDetail.refs
                && this.refs.parentDetail.refs.detail
                && this.refs.parentDetail.refs.detail.initData
                && this.refs.parentDetail.refs.detail.initData(); // 强刷子组件
            this.goApproval();
        }
    };

    goApproval = () => {
        const {
            approvalFlow: { flowMark = '' },
        } = this.state.apprlvalDetail;
        switch (flowMark) {
            case 'reimburse':
                // 跳转审批列表
                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/foreEnd/approval/approval/reimbursement',
                    });
                }, 500);
                break;
            case 'application':
                // 跳转审批列表
                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/foreEnd/approval/approval/application',
                    });
                }, 500);
                break;
            default:
                // 跳转审批列表
                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/foreEnd/approval/approval/myjob',
                    });
                }, 500);
                break;
        }
    };

    render() {
        const { apprlvalDetail } = this.state;
        return (
            <>
                <Detail apprlvalDetail={apprlvalDetail} handleCallback={this.hancleCallback} ref="parentDetail" />
                <ModalComponent
                    visible={this.state.visible}
                    inputChange={this.inputChange}
                    title={`${this.state.btnState == 1 ? '同意理由' : '驳回理由'}`}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    footer={
                        <div>
                            <BIButton onClick={this.onCancel}>取消</BIButton>
                            <SubmitButton type="primary" style={{ marginLeft: '10px' }} onClick={this.onOk}>
                                确定
                            </SubmitButton>
                        </div>
                    }
                />
            </>
        );
    }
}

export default Index;
