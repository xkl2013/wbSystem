import React, { Component } from 'react';
import { message } from 'antd';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';
import IconFont from '@/components/CustomIcon/IconFont';
import BIModal from '@/ant_components/BIModal';
import DownLoad from '@/components/DownLoad';
import BIButton from '@/ant_components/BIButton';
import { checkPathname } from '@/components/AuthButton';
import {
    lock,
    unlock,
    getLockConfig,
    updateLockConfig,
    submitApprovalFlow,
    getChangedDataAndFlow,
    getApprovalList,
} from '../../../service';
import s from '../../../index.less';
import LockSetting from '../lockSetting';
import Approval from '../approval';
import ApprovalList from '../approvalList';
import DownModal from './downModal';

export default class DoubleMicro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentModuleType: undefined,
            moduleType: undefined, // module-table转换21-28/9-15
            editModuleType: undefined,
            lockSettingVisible: false, // 锁定设置
            lockSettingFormData: {},
            approvalVisible: false, // 提交审批
            approvalFormData: {},
            approvalListVisible: false, // 审批详情
            approvalListFormData: [],
            flush: null, // airTable刷新回调
            downAllvisible: false,
        };
    }

    componentDidMount() {
        const { moduleType, editModuleType } = this.props;
        this.setState({
            moduleType,
            editModuleType,
            currentModuleType: moduleType,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { moduleType } = this.props;
        if (moduleType !== nextProps.moduleType) {
            this.setState({
                moduleType: nextProps.moduleType,
                editModuleType: nextProps.editModuleType,
                currentModuleType: nextProps.moduleType,
                lockSettingVisible: false, // 锁定设置
                lockSettingFormData: {},
                approvalVisible: false, // 提交审批
                approvalFormData: {},
                approvalListVisible: false, // 审批详情
                approvalListFormData: [],
                flush: null, // airTable刷新回调
            });
        }
    }

    lock = async ({ data }) => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const ids = [];
        if (data) {
            data.map((item) => {
                ids.push(item.id);
            });
        }
        const response = await lock({ tableId: attr.tableId, data: { ids } });
        if (response && response.success) {
            message.success(response.message);
        }
    };

    checkLock = (data, callback) => {
        BIModal.confirm({
            title: '确认提示',
            content: '刊例锁定后任何人将无编辑权限，是否确认锁定？',
            onOk: callback,
        });
    };

    unlock = async ({ data }) => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const ids = [];
        if (data) {
            data.map((item) => {
                ids.push(item.id);
            });
        }
        const response = await unlock({ tableId: attr.tableId, data: { ids } });
        if (response && response.success) {
            message.success(response.message);
        }
    };

    checkUnlock = (data, callback) => {
        BIModal.confirm({
            title: '确认提示',
            content: '刊例解锁后相关人员将可变更刊例内容，是否确认解锁？',
            onOk: callback,
        });
    };

    exportAllData = (bol) => {
        this.setState({ downAllvisible: bol });
    };

    exportData = ({ data, btn }) => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const ids = [];
        if (data) {
            data.map((item) => {
                ids.push(item.id);
            });
        }
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/quotation/kol/export/${attr.tableId}`}
                params={{ method: 'post', data: { ids } }}
                fileName={() => {
                    return `${attr.name}.xlsx`;
                }}
                textClassName={s.exportContainer}
                text={
                    <BIButton className={s.btn}>
                        {btn.icon}
                        <span className={s.text}>{btn.label}</span>
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    hiddenLock = ({ record, menu }) => {
        const { currentModuleType, editModuleType } = this.state;
        // 编辑页隐藏
        if (currentModuleType === editModuleType) {
            return true;
        }

        // 无权限隐藏
        if (menu.authority && !checkPathname(menu.authority)) {
            return true;
        }
        // 已锁定隐藏
        if (record.isLocked) {
            return true;
        }
        return false;
    };

    hiddenUnlock = ({ record, menu }) => {
        const { currentModuleType, editModuleType } = this.state;
        if (currentModuleType === editModuleType) {
            return true;
        }
        if (menu.authority && !checkPathname(menu.authority)) {
            return true;
        }
        if (!record.isLocked) {
            return true;
        }
        return false;
    };

    edit = () => {
        const { editModuleType } = this.state;
        this.setState({
            currentModuleType: editModuleType,
        });
    };

    cancel = () => {
        const { moduleType } = this.state;
        this.setState({
            currentModuleType: moduleType,
        });
    };

    showApproval = async ({ flush }) => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const response = await getChangedDataAndFlow({ tableId: attr.tableId });
        if (response && response.success && response.data) {
            this.setState({
                approvalFormData: response.data,
                approvalVisible: true,
                flush,
            });
        }
    };

    submitApproval = async (values) => {
        const { currentModuleType, flush } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const { approvalInstanceDto } = values;
        const { approvalNoticers } = approvalInstanceDto || {};
        const response = await submitApprovalFlow({ tableId: attr.tableId, data: approvalNoticers || [] });
        if (response && response.success) {
            message.success('提交成功');
            if (typeof flush === 'function') {
                flush(true);
            }
        }
        this.hideApproval();
    };

    hideApproval = () => {
        this.setState({
            approvalVisible: false,
        });
    };

    showApprovalList = (data) => {
        const { flush } = data || {};
        this.getApprovalList();
        this.setState({
            approvalListVisible: true,
            flush,
        });
    };

    getApprovalList = async () => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const response = await getApprovalList({ tableId: attr.tableId });
        if (response && response.success && response.data) {
            this.setState({
                approvalListFormData: response.data,
            });
        }
    };

    commonCallback = () => {
        // 点击审批撤销按钮回调
        const { flush } = this.state;
        this.getApprovalList();
        // 刷新视图列表数据
        flush(true);
    };

    hideApprovalList = () => {
        this.setState({
            approvalListVisible: false,
        });
    };

    showLockSetting = async ({ flush }) => {
        const { currentModuleType } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        const response = await getLockConfig({ tableId: attr.tableId });
        if (response && response.success && response.data) {
            this.setState({
                lockSettingFormData: response.data,
                lockSettingVisible: true,
            });
            return;
        }
        this.setState({
            lockSettingVisible: true,
            flush,
        });
    };

    updateLockConfig = async (values) => {
        const { currentModuleType, lockSettingFormData } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        if (lockSettingFormData.id) {
            values.id = lockSettingFormData.id;
        }
        const response = await updateLockConfig({ tableId: attr.tableId, data: values });
        if (response && response.success) {
            message.success('更新成功');
        }
        this.hideLockSetting();
    };

    hideLockSetting = () => {
        this.setState({
            lockSettingVisible: false,
        });
    };

    renderHandleBtns = () => {
        // 编辑状态下降锁定与解锁隐藏
        const { editModuleType, moduleType, currentModuleType } = this.state;
        const isEditMode = editModuleType === currentModuleType;
        const btns = [
            {
                label: '编辑',
                key: 1,
                icon: <IconFont type="iconxiangqingye-bianji" />,
                onClick: this.edit,
                authority: '/foreEnd/business/talentManage/publication/blogger/edit',
                hide: currentModuleType === editModuleType,
                noNeedFlush: true,
            },
            {
                label: '取消',
                key: 2,
                // icon: <IconFont type="iconxiangqingye-bianji" />,
                onClick: this.cancel,
                hide: currentModuleType === moduleType,
                noNeedFlush: true,
            },
            {
                label: '提交',
                key: 3,
                // icon: <IconFont type="iconxiangqingye-bianji" />,
                onClick: this.showApproval,
                authority: '/foreEnd/business/talentManage/publication/blogger/edit',
                hide: currentModuleType === moduleType,
                noNeedFlush: true,
                type: 'primary',
            },
            {
                label: '导出',
                key: 4,
                icon: <IconFont type="iconliebiaoye-daochu" />,
                download: this.exportData,
                type: 'multiple',
                authority: '/foreEnd/business/talentManage/publication/blogger/export',
            },
            {
                label: '锁定',
                key: 5,
                icon: <IconFont type="iconliebiaoye-suoding" />,
                onClick: this.lock,
                type: 'multiple',
                check: this.checkLock,
                authority: '/foreEnd/business/talentManage/publication/blogger/lock',
            },
            {
                label: '解锁',
                key: 6,
                icon: <IconFont type="iconliebiaoye-jiesuo" />,
                onClick: this.unlock,
                type: 'multiple',
                check: this.checkUnlock,
                authority: '/foreEnd/business/talentManage/publication/blogger/unlock',
            },
            {
                label: '下载',
                key: 7,
                icon: <IconFont type="iconxiazai" />,
                onClick: () => {
                    this.exportAllData(true);
                },
                noNeedFlush: true,
                authority: '/foreEnd/business/talentManage/publication/blogger/exportAll',
            },
        ];
        return btns.filter((ls) => {
            return (isEditMode && ls.key !== 5 && ls.key !== 6 && ls.key !== 4) || !isEditMode;
        });
    };

    render() {
        const {
            moduleType,
            currentModuleType,
            lockSettingVisible,
            lockSettingFormData,
            approvalVisible,
            approvalFormData,
            approvalListVisible,
            approvalListFormData,
            downAllvisible,
        } = this.state;
        const attr = businessConfig[currentModuleType] || {};
        return (
            <>
                <AriTable
                    {...attr}
                    noAdd={
                        !checkPathname('/foreEnd/business/talentManage/publication/blogger/add')
                        || currentModuleType === moduleType
                    }
                    noEdit={
                        !checkPathname('/foreEnd/business/talentManage/publication/blogger/edit')
                        || currentModuleType === moduleType
                    }
                    noDel={
                        !checkPathname('/foreEnd/business/talentManage/publication/blogger/del')
                        || currentModuleType === moduleType
                    }
                    btns={this.renderHandleBtns()}
                    moreBtns={[
                        {
                            label: '审批详情',
                            // icon: <IconFont type="iconxiangqingye-bianji" />,
                            onClick: this.showApprovalList,
                            authority: '/foreEnd/business/talentManage/publication/blogger/detail',
                            noNeedFlush: true,
                        },
                        {
                            label: '锁定设置',
                            // icon: <IconFont type="iconxiangqingye-bianji" />,
                            onClick: this.showLockSetting,
                            authority: '/foreEnd/business/talentManage/publication/blogger/setting',
                            noNeedFlush: true,
                        },
                    ]}
                    extraMenu={[
                        {
                            label: '锁定',
                            icon: <IconFont type="iconliebiaoye-suoding" />,
                            onClick: this.lock,
                            check: this.checkLock,
                            hidden: this.hiddenLock,
                            authority: '/foreEnd/business/talentManage/publication/blogger/lock',
                        },
                        {
                            label: '解锁',
                            icon: <IconFont type="iconliebiaoye-jiesuo" />,
                            onClick: this.unlock,
                            check: this.checkUnlock,
                            hidden: this.hiddenUnlock,
                            authority: '/foreEnd/business/talentManage/publication/blogger/unlock',
                        },
                    ]}
                />
                {lockSettingVisible && (
                    <LockSetting
                        title="锁定设置"
                        footer={null}
                        visible={lockSettingVisible}
                        formData={lockSettingFormData}
                        onCancel={this.hideLockSetting}
                        handleCancel={this.hideLockSetting}
                        handleSubmit={this.updateLockConfig}
                        bodyStyle={{ padding: 0 }}
                    />
                )}
                {approvalVisible && (
                    <Approval
                        width={800}
                        title="修改明细"
                        footer={null}
                        okText="提交审批"
                        cancelText="暂不提交"
                        visible={approvalVisible}
                        formData={approvalFormData}
                        onCancel={this.hideApproval}
                        handleCancel={this.hideApproval}
                        handleSubmit={this.submitApproval}
                    />
                )}
                {approvalListVisible && (
                    <ApprovalList
                        width={800}
                        wrapClassName={s.selfModal}
                        title="审批详情"
                        footer={null}
                        visible={approvalListVisible}
                        formData={approvalListFormData}
                        onCancel={this.hideApprovalList}
                        handleCancel={this.hideApprovalList}
                        commonCallback={this.commonCallback}
                        showApproval={true}
                    />
                )}
                <DownModal visible={downAllvisible} changeVisible={this.exportAllData} />
            </>
        );
    }
}
