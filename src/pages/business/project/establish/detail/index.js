import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import BIButton from '@/ant_components/BIButton';
import EstablishDetail from './establishDetail';
import { Watermark } from '@/components/watermark';
import ApprovalBtns from '@/components/ApprovalBtns';
import { checkResubmitAuthority } from '../config/authority';

@connect(() => {
    return {};
})
@Watermark
class EstablishDetailIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            approvalIcon: null,
        };
    }

    componentWillUnmount() {
        // 卸载时清掉header中的数据
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {},
        });
    }

    // 数据成功回调
    handleCallback = (data) => {
        const { formData = {} } = data;
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '立项详情',
                subTitle: `立项编号${formData.projectingCode}`,
                component: this.rightBtns(formData),
            },
        });
    };

    goReset = (resubmitEnum) => {
        // 重新提交
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/project/establish/edit',
            query: {
                id,
                type: 'add',
                resubmitEnum,
            },
        });
    };

    rightBtns = (formData) => {
        const that = this;
        // 右侧按钮

        return (
            <div>
                {checkResubmitAuthority(formData) && (
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.goReset.bind(this, 2)}>
                        重新提交
                    </BIButton>
                )}
                <ApprovalBtns
                    instanceId={formData.instanceId}
                    commonCallback={this.detail.initData}
                    editCallback={this.editCallback}
                    approvalIconCallback={(node) => {
                        that.setState({ approvalIcon: node });
                    }}
                />
            </div>
        );
    };

    editCallback = () => {
        this.goReset(1);
    };

    render() {
        const {
            query: { id = '' },
        } = this.props.location;
        const { approvalIcon } = this.state;
        return (
            <EstablishDetail
                id={id}
                handleCallback={this.handleCallback}
                ref={(dom) => {
                    this.detail = dom;
                }}
                approvalIcon={approvalIcon}
            />
        );
    }
}

export default EstablishDetailIndex;
