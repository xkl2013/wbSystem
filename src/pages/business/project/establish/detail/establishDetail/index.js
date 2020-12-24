import React, { Component } from 'react';
import { message } from 'antd';
import AuthButton from '@/components/AuthButton';
import BIRadio from '@/ant_components/BIRadio';
import SelfProgress from '@/components/Progress';
import Approval from '@/pages/business/project/common/components/detail/_approval';
import { connectInfo } from '@/services/globalDetailApi';
import { detail2form } from '@/pages/business/project/establish/utils/transferData';
import { initProjectingDetail } from '@/pages/business/project/establish/utils/initOptions';
import { getProjectDetail, getInstance } from '../../services';
import styles from './index.less';
import Basic from '../../../common/components/detail';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '1', // tab切换 1-概况 2-审批
            formData: {}, // 概况  (复用组件必填，不能更改)
            instanceData: {}, // 审批流  (复用组件必填，不能更改)
            platformData: [],
            connectData: [],
            projectType: [], // 项目类型
        };
    }

    componentDidMount() {
        this.initProjecting();
        this.getData();
        // 数据交接 - 隐藏
        this.getConnectHistory();
    }

    initProjecting = () => {
        initProjectingDetail((data) => {
            this.setState(data);
        });
    };

    // 初始化数据 (复用组件必填，不能更改)
    initData = () => {
        this.setState({
            type: '1',
        });
        this.getData();
    };

    // 获取详情
    getData = async () => {
        const result = await getProjectDetail(this.props.id);
        let formData = {};
        if (result && result.success && result.data) {
            formData = await detail2form(result.data);
        }
        this.setState(
            {
                formData,
            },
            this.handleCallback,
        );
    };

    // 获取审批流
    getInstance = async () => {
        const { instanceId = '' } = this.state.formData;
        const result = await getInstance(instanceId);
        if (result && result.success) {
            this.setState({
                instanceData: result.data || {},
            });
        }
    };

    // 向上回传数据 (复用组件必填，不能更改)
    handleCallback = () => {
        if (this.props.handleCallback && typeof this.props.handleCallback === 'function') {
            const { formData, instanceData } = this.state;
            this.props.handleCallback({ formData, instanceData });
        }
    };

    tabChange = (e) => {
        // tab切换
        const value = e.target.value;
        this.setState({
            type: value,
        });
        if (Number(value) === 1) {
            this.getData();
        } else {
            this.getInstance();
        }
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const { id } = this.props;
        const res = await connectInfo(id, 5);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    render() {
        const {
            formData, instanceData, platformData, type, connectData, projectType,
        } = this.state;
        const { approvalIcon } = this.props;
        const newFormData = { ...formData, projectType, platformData };
        const commentsParams = this.props.commentsParams || {};
        return (
            <div className={styles.detailPage}>
                {approvalIcon}
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={type} buttonStyle="solid" onChange={this.tabChange}>
                        <AuthButton authority="/foreEnd/business/project/establish/detail/info">
                            <BIRadio.Button className={styles.tabBtn} value="1">
                                概况
                            </BIRadio.Button>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/project/establish/detail/apply">
                            <BIRadio.Button className={styles.tabBtn} value="2">
                                审批
                            </BIRadio.Button>
                        </AuthButton>
                    </BIRadio>
                </div>
                {Number(type) === 1 && (
                    <Basic
                        formData={newFormData}
                        instanceData={instanceData}
                        updateFn={this.getData}
                        connectData={connectData}
                    />
                )}
                {Number(type) === 2 && <Approval instanceData={instanceData} />}
                <AuthButton authority="/foreEnd/business/project/establish/detail/commen">
                    <SelfProgress
                        id={Number(commentsParams.id || this.props.id)}
                        interfaceName={commentsParams.interfaceName || '5'}
                        authority="/foreEnd/business/project/establish/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Detail;
