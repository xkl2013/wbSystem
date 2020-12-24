import React from 'react';
import { connect } from 'dva';
import StatementDetail from './StatementDetail';
import AuthButton from '@/components/AuthButton';
import BIButton from '@/ant_components/BIButton';
import { Watermark } from '@/components/watermark';
import BIModal from '@/ant_components/BIModal';
import { message } from 'antd';

@Watermark
@connect(() => ({}))
class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            launchPayStatus: false,
            startPayStatus: 1,
            oughtSettleAmountTruly: null,
        };
    }

    componentWillMount() {
        this.getDetailID();
    }

    // 页面右侧按钮
    rightBtns = () => {
        const { startPayStatus } = this.state;
        return (
            <div>
                {startPayStatus === 0 && (
                    <AuthButton authority='/foreEnd/business/settleManage/statement/detail/launchPay'>
                        <BIButton
                            type='primary'
                            ghost
                            // className={styles.headerBtn}
                            onClick={() => this.launchPayOpen()}
                        >
                            发起付款
                        </BIButton>
                    </AuthButton>
                )}
            </div>
        );
    };

    // 数据成功回调
    handleCallback = data => {
        let { formData = {} } = data;
        this.setState(
            {
                startPayStatus: formData.startPayStatus,
                oughtSettleAmountTruly: formData.oughtSettleAmountTruly,
            },
            () => {
                this.props.dispatch({
                    type: 'header/saveHeaderName',
                    payload: {
                        title: '结算单详情',
                        subTitle: ``,
                        component: this.rightBtns(),
                    },
                });
            },
        );
    };

    // 根据url获取详情ID
    getDetailID() {
        let {
            query: { id = '' },
        } = this.props.location;
        this.setState({
            id,
        });
    }

    launchPayOpen() {
        const { id } = this.state;
        this.props.dispatch({
            type: 'business_balance/checkPay',
            payload: {
                id,
                cb: () => {
                    this.setState({ launchPayStatus: true });
                },
            },
        });
    }

    launchPayFn() {
        const { id } = this.state;
        this.props.dispatch({
            type: 'business_balance/creatPay',
            payload: {
                id,
                cb: () => {
                    this.refs.StatementDetail.initData(1);
                },
            },
        });

        this.launchPayClose();
    }

    //
    launchPayClose() {
        this.setState({
            launchPayStatus: false,
        });
    }

    render() {
        const { id, launchPayStatus } = this.state;
        return (
            <>
                <BIModal
                    visible={launchPayStatus}
                    onOk={() => this.launchPayFn()}
                    onCancel={() => this.launchPayClose()}
                    maskClosable={false}
                    title='发起付款'
                    width='350px'
                >
                    <p>发起付款后会自动生成费用申请单，此过程不可逆，是否确认发起付款？</p>
                </BIModal>
                <StatementDetail
                    id={id}
                    handleCallback={this.handleCallback}
                    ref='StatementDetail'
                />
            </>
        );
    }
}
export default Detail;
