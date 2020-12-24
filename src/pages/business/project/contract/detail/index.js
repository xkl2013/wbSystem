import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';

import AuthButton from '@/components/AuthButton';
import Upload from '@/components/upload';
import ApprovalBtns from '@/components/ApprovalBtns';
import storage from '@/utils/storage';
import { Watermark } from '@/components/watermark';
import ContractDetail from './contractDetail';
import { cancelApproval, archive, getContracts, endContract } from './services';
import styles from './index.less';

@Watermark
@connect(() => {
    return {};
})
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.detail = React.createRef();
        this.state = {
            id: '', // 详情ID
            activeStatus: false,
            upload: [],
            verifyStatus: false,
            approvalIcon: null,
        };
    }

    componentDidMount() {
        const {
            query: { id = '' },
        } = this.props.location;
        this.setState({
            id,
        });
    }

    componentWillUnmount() {
        // 卸载时清掉header中的数据
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {},
        });
    }

    // 数据成功回调
    hancleCallback = (data) => {
        const { formData = {} } = data;
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '合同详情',
                subTitle: `合同编号${formData.contract && formData.contract.contractCode}`,
                component: this.rightBtns(formData),
            },
        });
    };

    rightBtns = (formData) => {
        // 右侧按钮
        const {
            contract: {
                contractApprovalStatus = '',
                contractStatus = '',
                contractCreatedId = '',
                contractInstanceId = '',
                contractArchiveStatus = '',
                contractFeeVerifyTaskStatus = '',
                endStatus,
            } = {},
        } = formData;
        const detail = this.detail.current;
        return (
            <div>
                {/* {Number(endStatus) === 2 && (
                    <AuthButton authority="/foreEnd/business/project/contract/detail/end"> */}
                <BIButton type="primary" className={styles.headerBtn} onClick={this.end}>
                    结案
                        </BIButton>
                {/* </AuthButton>
                )} */}
                {/* {Number(formData.contractProjectType) !== 4
                    && Number(contractApprovalStatus) === 3
                    && Number(contractArchiveStatus) === 0 && (
                        <AuthButton authority="/foreEnd/business/project/contract/detail/archive"> */}
                <BIButton type="primary" className={styles.headerBtn} onClick={this.archive}>
                    归档
                        </BIButton>
                {/* </AuthButton>
                    )} */}
                {/* {Number(formData.contractProjectType) !== 4 && Number(contractFeeVerifyTaskStatus) === 0 && (
                    <AuthButton authority="/foreEnd/business/project/contract/detail/verify"> */}
                <BIButton
                    type="primary"
                    className={styles.headerBtn}
                    onClick={lodash.debounce(this.checkVerify, 400)}
                >
                    发起项目费用确认
                        </BIButton>
                {/* </AuthButton> */}
            </div>
        );
    };

    // 发起项目费用确认
    checkVerify = async () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'business_project_contract/getCheckVerify',
            payload: {
                id: Number(query.id),
                cb: this.checkVerifyModal,
            },
        });
    };

    checkVerifyModal = () => {
        this.setState({
            verifyStatus: true,
        });
    };

    closeCheckVerifyModal = () => {
        this.setState({
            verifyStatus: false,
        });
    };

    // 发起项目费用确认
    startVerify = () => {
        const { query } = this.props.location;
        const detail = this.detail.current;
        this.props.dispatch({
            type: 'business_project_contract/getStartVerify',
            payload: {
                id: Number(query.id),
                cb: () => {
                    this.closeCheckVerifyModal();
                    detail.initData();
                },
            },
        });
    };

    revocation = (contractInstanceId) => {
        // 撤销项目
        const that = this;
        BIModal.confirm({
            title: '撤销合同',
            content: '你确定要撤销该合同？',
            autoFocusButton: null,
            onOk: () => {
                that.cancelApprovalFun(contractInstanceId);
            },
        });
    };

    cancelApprovalFun = async (contractInstanceId) => {
        // 撤销方法
        const result = await cancelApproval(contractInstanceId, { opinion: '' });
        const detail = this.detail.current;
        if (result && result.success) {
            message.success(result.message || '请求成功');
            detail.initData();
        }
    };

    archive = async () => {
        this.setState({
            activeStatus: true,
        });
    };

    archiveClose = () => {
        this.setState({
            activeStatus: false,
        });
    };

    archiveFun = async () => {
        // 归档方法
        const { upload, id } = this.state;
        if (upload.length <= 0) {
            message.warning('至少有一个归档附件');
        } else {
            // 获取合同详情
            const result = await getContracts(id);
            const detail = this.detail.current;
            if (result && result.success) {
                const contractAttachmentList = [...upload];
                // const contractAttachmentList = [...result.data.contractAttachmentList, ...upload];
                const data = { contractAttachmentList, contractId: id };
                const res = await archive(data);
                if (res && res.success) {
                    message.success(res.message || '请求成功');
                    this.archiveClose();
                    detail.initData();
                }
            }
        }
    };

    // 附件上传监听
    changeFile = (data) => {
        const upload = data.map((item) => {
            return {
                domain: item.domain,
                name: item.name,
                value: item.value,
                attachmentOrigin: 3,
            };
        });
        this.setState({
            upload,
        });
    };

    editCallback = () => {
        this.goReset(1);
    };

    // eslint-disable-next-line react/sort-comp
    goReset(resubmitEnum) {
        // 重新提交;
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/edit',
            query: {
                oldContractId: id,
                resubmitEnum,
            },
        });
    }

    end = () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const detail = this.detail.current;
        BIModal.confirm({
            title: '确定结案',
            onOk: async () => {
                const res = await endContract(id);
                if (res && res.success) {
                    message.success('操作成功');
                    detail.initData();
                }
            },
        });
    };

    render() {
        const {
            query: { id = '', selTab = '' },
        } = this.props.location;
        const { activeStatus, verifyStatus, approvalIcon } = this.state;
        return (
            <>
                <BIModal
                    visible={verifyStatus}
                    onOk={lodash.debounce(this.startVerify, 400)}
                    onCancel={() => {
                        return this.closeCheckVerifyModal();
                    }}
                    maskClosable={false}
                    title="发起项目费用确认"
                    width="350px"
                >
                    <p>发起项目费用确认后会通知相关参与人进行项目费用确认，是否确认进行此操作？</p>
                </BIModal>
                <BIModal
                    visible={activeStatus}
                    onOk={() => {
                        return this.archiveFun();
                    }}
                    onCancel={() => {
                        return this.archiveClose();
                    }}
                    maskClosable={false}
                    title="归档"
                >
                    <div>
                        <span>
                            <i className={styles.must}>*</i>
                            附件：
                        </span>
                        <Upload
                            value=""
                            btnText="添加附件"
                            onChange={this.changeFile}
                            renderButton={<span className={styles.btnUpload}>添加附件</span>}
                        />
                    </div>
                    <p style={{ marginTop: '20px' }}>此操作不可逆，是否确认归档？</p>
                </BIModal>
                <ContractDetail
                    id={id}
                    selTab={selTab}
                    handleCallback={this.hancleCallback}
                    ref={this.detail}
                    approvalIcon={approvalIcon}
                />
            </>
        );
    }
}

export default Index;
