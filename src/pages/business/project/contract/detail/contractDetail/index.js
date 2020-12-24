import React, { PureComponent } from 'react';
import _ from 'lodash';
import { message } from 'antd';
import BIRadio from '@/ant_components/BIRadio';
import { getContracts } from '../services';
import SlefProgress from '@/components/Progress';
import styles from './index.less';
import AuthButton from '@/components/AuthButton';
import Info from './info';
import Execute from './execute';
import Receipt from './receipt';
import Fee from './fee';
import Account from './account';
import Approval from './approval';
import { connectInfo } from '@/services/globalDetailApi';
import { detail2detail } from '../../utils/transferData';

class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // selTab: 1, // 选中tab
            selTab: props.selTab ? Number(props.selTab) : 1, // 选中tab
            tabList: [
                {
                    key: 1,
                    value: '签约信息',
                    limit: '/foreEnd/business/project/contract/detail/signInfo',
                },
                {
                    key: 2,
                    value: '合同执行',
                    limit: '/foreEnd/business/project/contract/detail/corry',
                },
                {
                    key: 3,
                    value: '收款管理',
                    limit: '/foreEnd/business/project/contract/detail/receivables',
                },
                {
                    key: 4,
                    value: '合同费用',
                    limit: '/foreEnd/business/project/contract/detail/cost',
                },
                {
                    key: 5,
                    value: '合同结算',
                    limit: '/foreEnd/business/project/contract/detail/settle',
                },
                {
                    key: 6,
                    value: '审批信息',
                    limit: '/foreEnd/business/project/contract/detail/approval',
                    isShow: true,
                },
            ],
            formData: {}, // 合同详情概况
            connectData: [],
        };
    }

    componentDidMount() {
        this.getData();
        // 数据交接 - 隐藏
        this.getConnectHistory();
    }

    // 初始化数据
    initData = () => {
        this.setState({
            selTab: 1,
        });
        this.getData();
    };

    getData = async () => {
        // 获取合同详情概况
        const { id } = this.props;
        if (!id) {
            return;
        }
        const result = await getContracts(id);
        if (result && result.success && result.data) {
            const formData = await detail2detail(result.data);
            this.setState({ formData }, () => {
                return this.props.handleCallback({ formData });
            });
        }
    };

    tabChange = (e) => {
        // 切换tab
        this.setState({
            selTab: e.target.value,
        });
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const { id } = this.props;
        const res = await connectInfo(id, 7);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    render() {
        const { tabList, selTab, formData, connectData } = this.state;
        // const commentsParams = this.props.commentsParams || {};
        const { approvalIcon, commentsParams = {} } = this.props;
        if (_.isEmpty(formData)) {
            return null;
        }
        return (
            <div className={styles.detailPage}>
                <div style={{ position: 'relative', top: '-20px', zIndex: '10' }}>{approvalIcon}</div>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={selTab} buttonStyle="solid" onChange={this.tabChange}>
                        {tabList.map((item) => {
                            if (
                                item.key === 1
                                || (item.key === 6 && formData.contract && formData.contract.contractIsVirtual !== 1)
                                || (item.key > 1
                                    && item.key < 6
                                    && formData.contract
                                    && formData.contract.contractApprovalStatus === 3)
                            ) {
                                return (
                                    <AuthButton authority={item.limit} key={item.key}>
                                        <BIRadio.Button className={styles.tabBtn} value={item.key}>
                                            {item.value}
                                        </BIRadio.Button>
                                    </AuthButton>
                                );
                            }
                            return null;
                        })}
                    </BIRadio>
                </div>
                {selTab === 1 && (
                    <Info {...this.props} formData={formData} updataFn={this.getData} connectData={connectData} />
                )}
                {selTab === 2 && <Execute {...this.props} formData={formData} />}
                {selTab === 3 && <Receipt {...this.props} formData={formData} />}
                {selTab === 4 && <Fee {...this.props} formData={formData} />}
                {selTab === 5 && <Account {...this.props} formData={formData} />}
                {selTab === 6 && <Approval {...this.props} formData={formData} />}
                <AuthButton authority="/foreEnd/business/contract/manage/detail/commen">
                    <SlefProgress
                        id={Number(commentsParams.id || this.props.id)}
                        interfaceName={commentsParams.interfaceName || '7'}
                        authority="/foreEnd/business/contract/manage/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
