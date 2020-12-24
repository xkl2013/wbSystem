/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
import React from 'react';
import _ from 'lodash';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import { formatFormCols } from '@/utils/utils';
import { checkPathname } from '@/components/AuthButton';
import ModalCom from '@/components/CalendarForm/modal';
import { formatCols } from './constants';
import { formatDetailCols } from './detailConstants';

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/extensions

import { addSchedule, getScheduleDetail, updateSchedule, delSchedule, getProjectType } from '../../services';

export default class Detail extends React.Component {
    state = {
        visible: false,
        formData: {},
        talentType: 0, // 0-艺人  1-博主
        isEdit: false, // true-编辑  false -新增
        id: '', // 详情ID
        detailType: this.props.detailType || 'detailPage', // detailPage:详情页面
        loading: false,
        projectType: [], // 项目类型列表
        copyOnlineUrl: '', // 备份上线链接
    };

    async getProjectType() {
        // 获取项目类型   艺人：全部   博主：[1,2,3,15]
        const { talentType } = this.state;
        const res = await getProjectType();
        if (res && res.success) {
            const projectType = [];
            res.data.map((item) => {
                if (talentType === 0) {
                    projectType.push({
                        id: item.value,
                        name: item.text,
                    });
                } else if (talentType === 1) {
                    if ([1, 2, 3, 15].includes(item.value)) {
                        projectType.push({
                            id: item.value,
                            name: item.text,
                        });
                    }
                }
            });
            this.setState({
                projectType,
            });
        }
    }

    showModal = (id) => {
        // 消息跳转 用到的
        this.showInstanceModal(null, true, id);
    };

    showInstanceModal = (talentType, isEdit, id) => {
        // 新增、编辑、详情
        if (isEdit) {
            this.getScheduleDetail(id);
        }
        this.setState(
            {
                talentType,
                isEdit,
                id,
                visible: true,
                // talent 相关人员1:经理人 2:宣传人 3:制作人 4:知会人 5:审批人 6:参与人 7:创建人 8:负责人 9:boss 10:执行人 11:跟进人 12:合作人
                talentUserList: [],
                detailType: isEdit ? 'detailPage' : 'editPage',
                formData: {
                    talentCalendarHeaderDTOList: [],
                    talentCalendarUserDTOList: [],
                    hasOnlineUrl: null, // 是否有上线链接 0无 1有
                },
            },
            () => {
                if (!isEdit) {
                    this.getProjectType();
                }
            },
        );
    };

    getScheduleDetail = async (id) => {
        // 获取详情
        const res = await getScheduleDetail(id);
        if (res && res.success) {
            const talentCalendarHeaderDTOList = []; // 负责人-8
            const talentCalendarUserDTOList = []; // 参与人 -6
            res.data.talentCalendarUserDTOList.map((item) => {
                if (item.participantType === 8) {
                    talentCalendarHeaderDTOList.push(item);
                } else if (item.participantType === 6) {
                    talentCalendarUserDTOList.push(item);
                }
            });
            let hasOnlineUrl = null; // 是否有上线链接 0无 1有
            if (res.data.onlineDate) {
                if (res.data.onlineUrl) {
                    hasOnlineUrl = 1;
                } else {
                    hasOnlineUrl = 0;
                }
            }

            const formData = {
                ...res.data,
                talentCalendarHeaderDTOList,
                talentCalendarUserDTOList,
                hasOnlineUrl,
            };
            this.setState(
                {
                    talentType: res.data.talentType,
                    formData,
                    talentUserList: res.data.talentCalendarUserDTOList,
                    copyOnlineUrl: res.data.onlineUrl,
                },
                this.getProjectType,
            );
        } else {
            this.hideForm();
        }
    };

    getNewData = (obj = {}) => {
        // 返回新formData
        const form = this.formView.props.form.getFieldsValue();
        return _.assign({}, this.state.formData, form, obj);
    };

    renderModalTitle = () => {
        // title 展示
        const { detailType, isEdit } = this.state;
        if (detailType === 'detailPage') {
            return '查看档期';
        }
        if (isEdit) {
            return '编辑档期';
        }
        return '新增档期';
    };

    // 修改负责人 参与人 type 1-负责人  2-参与人
    changeNotifyNode = (value, type) => {
        let { talentCalendarHeaderDTOList, talentCalendarUserDTOList } = this.state.formData;
        const userList = value.map((item) => {
            return {
                participantId: Number(item.id),
                participantName: item.name,
                userIcon: item.avatar,
            };
        });
        if (type === 1) {
            talentCalendarHeaderDTOList = userList;
        } else if (type === 2) {
            talentCalendarUserDTOList = userList;
        }
        const form = this.formView.props.form.getFieldsValue();
        const newData = _.assign({}, this.state.formData, form, {
            talentCalendarHeaderDTOList,
            talentCalendarUserDTOList,
        });
        this.setState({ formData: newData });
    };

    hideForm = (onlyClose) => {
        // 隐藏弹框
        this.setState({ visible: false, detailType: 'detailPage' });
        if (!onlyClose) {
            if (this.props.getScheduleData) {
                this.props.getScheduleData();
            }
        }

        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    goEdit = (detailType) => {
        this.setState({ detailType });
    };

    hideEditBtnFun = () => {
        // 是否隐藏编辑按钮
        const talentType = this.state.talentType;
        if (talentType === 0 && checkPathname('/foreEnd/business/talentManage/schedule/actor/edit')) {
            return false;
        }
        if (talentType === 1 && checkPathname('/foreEnd/business/talentManage/schedule/blogger/edit')) {
            return false;
        }
        return true;
    };

    renderNoticers = (Noticers = []) => {
        // 获取用户列表
        return Noticers.map((item) => {
            return {
                ...item,
                avatar: item.userIcon,
                name: item.participantName,
                id: item.participantId,
                userName: item.participantName,
                userId: item.participantId,
            };
        });
    };

    delBtn = () => {
        // 删除按钮展示逻辑
        const { talentType, isEdit, formData } = this.state;
        if (isEdit) {
            const origin = formData && formData.origin;
            if (
                talentType === 0
                && checkPathname('/foreEnd/business/talentManage/schedule/actor/del')
                && origin === 1
            ) {
                return true;
            }
            if (
                talentType === 1
                && checkPathname('/foreEnd/business/talentManage/schedule/blogger/del')
                && origin === 1
            ) {
                return true;
            }
            return false;
        }
        return false;
    };

    handleDelete = () => {
        // 删除档期
        const { id, formData } = this.state;
        const disablePutStatus = !!(formData.popularizeStatus && formData.popularizeStatus !== 1);
        if (disablePutStatus) {
            message.error('已关联投放，不可删除');
            return;
        }
        BIModal.confirm({
            title: '删除操作',
            content: '你确定要删除这个档期吗？',
            onOk: async () => {
                const res = await delSchedule({ id });
                if (res && res.success) {
                    message.success('删除档期成功');
                    this.hideForm();
                }
            },
        });
    };

    // 跳转投放新增
    goThrowManage = (type, popularizeFlag, talentType, id, createPopularizeFlag) => {
        if (talentType === 1) {
            if (type === 'add' && popularizeFlag === 1) {
                window.g_history.push(`/foreEnd/business/talentManage/throwManage/add?talentCalendarId=${id}`);
            } else if (type === 'edit' && createPopularizeFlag) {
                window.g_history.push(`/foreEnd/business/talentManage/throwManage/add?talentCalendarId=${id}`);
            }
        }
    };

    handleSubmit = async (data) => {
        // 提交
        await this.setState({
            loading: true,
        });
        const { talentType, id, isEdit } = this.state;
        data.talentType = talentType;
        const popularizeFlag = data.popularizeFlag || 0;
        if (isEdit) {
            data.id = id;
            data.popularizeFlag = popularizeFlag;
            if (!data.onlineDate) {
                data.onlineDate = '';
            }
            if (!data.onlineUrl) {
                data.onlineUrl = '';
            }
            const res = await updateSchedule(data);
            if (res && res.success) {
                message.success('编辑档期成功');
                this.hideForm();
                this.goThrowManage('edit', data.popularizeFlag, talentType, id, res.data.createPopularizeFlag);
            }
        } else {
            data.popularizeFlag = 0; // 新增强制为0
            const result = await addSchedule(data);
            if (result && result.success) {
                message.success('新增档期成功');
                this.hideForm();
                this.goThrowManage('add', popularizeFlag, talentType, result.data.talentCalendarId);
            }
        }
        const newData = _.assign({}, this.state.formData, data);
        this.setState({
            loading: false,
            formData: newData,
        });
    };

    onlineDateChange = (v) => {
        // 实际上线日期change
        const { copyOnlineUrl, formData } = this.state;
        const { popularizeStatus } = formData || {};
        const obj = { onlineDate: v };
        if (!v) {
            obj.hasOnlineUrl = null;
            obj.onlineUrl = '';
            obj.popularizeFlag = 0;
        }
        if (v && popularizeStatus && popularizeStatus !== 1) {
            obj.hasOnlineUrl = 1;
            obj.onlineUrl = copyOnlineUrl;
            obj.popularizeFlag = 1;
        }
        const newData = this.getNewData(obj);
        this.setState({ formData: newData });
    };

    onlineUrlTypeChange = (v) => {
        // 有无上线链接 change
        const hasOnlineUrl = v === null ? null : Number(v);
        const obj = { hasOnlineUrl };
        if (hasOnlineUrl !== 1) {
            obj.onlineUrl = '';
            obj.popularizeFlag = 0;
        }
        const newData = this.getNewData(obj);
        this.setState({ formData: newData });
    };

    render() {
        const {
            visible, formData, isEdit, id, detailType, loading, talentType, projectType,
        } = this.state;
        const cols = formatFormCols(
            formatCols(
                {
                    formData,
                    isEdit,
                },
                {
                    projectType,
                    talentType,
                    changeNotifyNode: this.changeNotifyNode,
                    renderNoticers: this.renderNoticers,
                    updateFormData: this.updateFormData,
                    onlineUrlTypeChange: this.onlineUrlTypeChange,
                    onlineDateChange: this.onlineDateChange,
                },
            ),
        );
        const detailCol = formatDetailCols({
            projectType,
            talentType,
            isEdit,
            formData,
            renderNoticers: this.renderNoticers,
        });
        const delBtnIsShow = this.delBtn();
        const editBtnIsShide = this.hideEditBtnFun();
        return !visible ? null : (
            <ModalCom
                formTitle={this.renderModalTitle()}
                visible={visible}
                className="editFormModal"
                width={isEdit ? 920 : 580}
                title={null}
                footer={null}
                onCancel={() => {
                    return this.hideForm(true);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={detailType === 'editPage' ? cols : detailCol}
                detailType={detailType}
                goEdit={this.goEdit}
                hideEditBtn={editBtnIsShide}
                formData={formData}
                handleCancel={() => {
                    return this.hideForm(true);
                }}
                handleSubmit={this.handleSubmit}
                handleDelete={this.handleDelete}
                isOnlyShowDelBtn={delBtnIsShow}
                isOnlyShowSelfProgress={isEdit}
                hideAddComment={true} // 隐藏发表评论功能
                loading={loading}
                commentId={id} // 评论id
                interfaceName="18" // 动态消息的配置id
                commentSort={1}
                menuConfig={['1', '4', '5']}
            />
        );
    }
}
