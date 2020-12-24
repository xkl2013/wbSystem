/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import FormView from '@/components/FormView';
import storage from '@/utils/storage';
import { formatFormCols } from '@/utils/utils';
import { formatCols } from '../constants';
import {
    deleteTags,
    addTags,
    confirmDelTags,
    getExecuteUrl,
    getTagsTree,
    getScheduleDetail,
    getGeneralizeDetail,
    getSupplier,
} from '../../services';

@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        talentAccountList: throw_manage.talentAccountList,
        channelList: throw_manage.channelList,
        appointment: throw_manage.appointment,
        addBtnLoading: loading.effects['throw_manage/editPopularizeSave'],
    };
})
class ThrowAdd extends Component {
    constructor(props) {
        super(props);
        const { userName, userId } = storage.getUserInfo() || {};
        this.state = {
            formData: {
                createUserName: userName,
                createUserId: userId,
            },
            tagsTreeData: [], // 标签树列表
        };
    }

    componentDidMount() {
        const { talentCalendarId, addId } = this.props.history.location.query;
        // 从档期过来的
        if (talentCalendarId) {
            getScheduleDetail(talentCalendarId).then((res) => {
                if (res && res.success) {
                    const {
                        talentId,
                        talentName,
                        talentType,
                        onlineUrl,
                        projectId,
                        projectName,
                        projectAppointmentId,
                    } = res.data;
                    const formData = {
                        talentCalendarId,
                        talentId,
                        talentName,
                        talentType,
                        projectId,
                        projectName,
                        projectIdFlag: !!projectId, // 从档期同步过来的，不能更改标志
                        executeUrl: onlineUrl,
                        projectAppointmentId,
                        // eslint-disable-next-line react/no-access-state-in-setstate
                        ...this.state.formData,
                    };
                    this.setState({
                        formData,
                    });
                    this.getTalentAccount({ talentId, talentType });
                    if (projectId) {
                        this.getAppointment(projectId);
                    }
                }
            });
        }
        if (addId) {
            // 从追加投放过来的
            getGeneralizeDetail(addId).then((res) => {
                if (res && res.success) {
                    const {
                        talentId,
                        talentName,
                        talentType,
                        talentAccountId,
                        putType,
                        putChannel,
                        executeUrl,
                        projectId,
                        projectName,
                        projectAppointmentId,
                        accountPlatform,
                        companyName,
                        supplierName,
                    } = res.data;
                    const formData = {
                        addId,
                        talentId,
                        talentName,
                        talentAccountId,
                        putType,
                        putChannel,
                        talentType,
                        projectIdFlagAdd: !!projectId, // 不能更改标志
                        projectId,
                        projectName,
                        executeUrl,
                        projectAppointmentId,
                        companyName,
                        supplierName,
                        // eslint-disable-next-line react/no-access-state-in-setstate
                        ...this.state.formData,
                    };
                    this.setState({
                        formData,
                        channel: putChannel,
                        platform: accountPlatform,
                    });
                    this.getTalentAccount({ talentId, talentType });
                    this.getChannelList(accountPlatform);
                    if (projectId) {
                        this.getAppointment(projectId);
                    }
                    if (putChannel) {
                        this.getTagsTree(putChannel);
                    }
                }
            });
        }
    }

    componentDidUpdate() {
        // const { executeUrlList, formData } = this.state;
        // const id = formData.projectId && formData.projectId.projectingId;
        // if (executeUrlList && executeUrlList.length === 0) {
        //     BIModal.confirm({
        //         title: '当前项目talent下未添加执行链接，需添加后进行投放，去项目中添加？',
        //         autoFocusButton: null,
        //         onOk: () => {
        //             window.open(`${window.location.origin}/foreEnd/business/project/manage/detail?id=${id}`);
        //         },
        //     });
        // }
    }

    getExecuteUrlToProject = (id) => {
        // 履约义务无执行链接，跳转项目
        BIModal.confirm({
            title: '当前项目talent下未添加执行链接，需添加后进行投放，去项目中添加？',
            autoFocusButton: null,
            onOk: () => {
                const newData = _.assign({}, this.state.formData, { projectId: undefined });
                this.setState({
                    formData: newData,
                });
                window.open(`${window.location.origin}/foreEnd/business/project/manage/detail?id=${id}`);
            },
        });
    };

    // 获取投放标签树形结构
    getTagsTree = async (channel) => {
        const { platform } = this.state;
        const result = await getTagsTree({ channel, platform });
        if (result.success) {
            let tagsTreeData = [];
            const _data = (data) => {
                return data.forEach((item) => {
                    if (item.children.length) {
                        _data(item.children);
                    }
                    item.title = item.nodeName;
                    item.key = item.id;
                    item.value = item.id;
                    tagsTreeData = data;
                });
            };
            _data(result.data);
            this.setState({ tagsTreeData });
        }
    };

    fetchDelTags = async (val) => {
        const { channel } = this.state;
        const response = await deleteTags(val.id);
        if (response && response.success) {
            message.success('删除成功');
            this.getTagsTree(channel);
        }
    };

    // 删除投放标签
    deleteTags = async (val) => {
        const result = await confirmDelTags(val.id);
        if (result && !result.data.delete) {
            this.fetchDelTags(val);
        } else {
            BIModal.confirm({
                title: '当前标签有投放正在使用，是否删除？(删除标签不影响，原有投放的标签)',
                autoFocusButton: null,
                onOk: async () => {
                    this.fetchDelTags(val);
                },
            });
        }
    };

    // 新增投放标签
    addTags = async (id, nodeName, addCb, cb) => {
        const { channel, platform } = this.state;
        const response = await addTags({ channel, platform, parentId: id, nodeName });
        if (response && response.success) {
            message.success('新增成功');
            this.getTagsTree(channel);
            const addObj = {};
            if (response.data) {
                addObj.label = response.data.nodeName;
                addObj.value = response.data.id;
            }
            addCb && addCb([addObj]);
            cb && cb();
        }
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    getTalentAccount = (payload) => {
        // 获取账户
        this.props.dispatch({
            type: 'throw_manage/getTalentAccount',
            payload,
        });
    };

    getChannelList = (payload) => {
        // 获取渠道
        this.props.dispatch({
            type: 'throw_manage/getChannelList',
            payload,
        });
    };

    getAppointment = (payload) => {
        // 获取履约义务列表
        this.props.dispatch({
            type: 'throw_manage/getAppointment',
            payload,
        });
    };

    getSupplier = async (channelId, popularizeType) => {
        // 根据投放渠道ID和投放类型获取供应商和费用承担主体的信息
        let supplierObj = {};
        if (channelId && popularizeType) {
            const res = await getSupplier({ channelId, popularizeType });
            if (res && res.success && res.data) {
                supplierObj = {
                    companyId: res.data.companyId,
                    companyName: res.data.companyName,
                    supplierId: res.data.supplierId,
                    supplierName: res.data.supplierName,
                };
            }
        }
        return supplierObj;
    };

    handleSubmit = (values) => {
        if (values.tagsDtos && values.tagsDtos.length > 20) {
            message.error('最多输入20个分类标签');
            return;
        }
        if (typeof values.executeUrl === 'string' && values.executeUrl.length > 500) {
            message.error('执行链接最多输入500个字符');
            return;
        }

        if (values.attachments && values.attachments.length > 0) {
            values.attachments.forEach((item) => {
                item.attachmentName = item.name;
                item.attachmentUrl = item.value;
                item.attachmentDomain = item.domain;
            });
        }
        // this.setState({
        //     formData: values,
        // });
        const payload = {
            data: { ...this.state.formData, ...values },
            cb: this.handleCancel,
        };
        this.props.dispatch({
            type: 'throw_manage/editPopularizeSave',
            payload,
        });
    };

    // 获取执行链接
    getExecuteUrl = async (id, obj) => {
        const response = await getExecuteUrl(id);
        if (response && response.success) {
            const projectExecuteUrl = [];
            response.data.list
                && response.data.list.forEach((item) => {
                    item.projectExecuteUrl
                        && projectExecuteUrl.push({ id: item.projectExecuteUrl, name: item.projectExecuteUrl });
                });
            this.setState({
                formData: { ...obj, executeUrl: projectExecuteUrl.length ? projectExecuteUrl[0].id : '' },
                executeUrlList: projectExecuteUrl,
            });
        }
    };

    onChangeParams = async (changedValues, val) => {
        const key = Object.keys(changedValues)[0];
        const { formData } = this.state;
        const { projectIdFlag, talentCalendarId, addId, projectIdFlagAdd } = formData;
        switch (key) {
            case 'talentName':
                const { talentId, talentType } = val.talentName;
                this.getTalentAccount({ talentId, talentType });
                return this.setState({
                    formData: {
                        ...formData,
                        ...val,
                        talentAccountId: undefined,
                        putChannel: undefined,
                        companyName: undefined,
                        supplierName: undefined,
                    },
                });
            case 'talentAccountId':
                const filterObj = this.props.talentAccountList.find((item) => {
                    return item.accountId === val.talentAccountId;
                });
                this.getChannelList(filterObj.platform);
                return this.setState({
                    formData: {
                        ...formData,
                        ...val,
                        putChannel: undefined,
                        putType: undefined,
                        projectId: projectIdFlag ? formData.projectId : undefined,
                        executeUrl: talentCalendarId ? formData.executeUrl : '',
                        companyName: undefined,
                        supplierName: undefined,
                    },
                    tagsTreeData: [],
                    // eslint-disable-next-line react/no-unused-state
                    talentAccountNo: filterObj.accountUuid,
                    platform: filterObj.platform,
                    executeUrlList: undefined,
                });
            case 'putChannel':
                this.getTagsTree(val.putChannel); // 选择完渠道之后获取投放标签树接口
                return this.setState({
                    formData: {
                        ...formData,
                        ...val,
                        putType: undefined,
                        tagsDtos: [],
                        companyName: undefined,
                        supplierName: undefined,
                    },
                    channel: val.putChannel,
                });
            case 'putType':
                // 更换投放类型需要把执行链接变为空
                const supplierObj = await this.getSupplier(val.putChannel, val.putType);
                return this.setState({
                    formData: {
                        ...formData,
                        ...val,
                        ...supplierObj,
                        projectId: projectIdFlag || projectIdFlagAdd ? formData.projectId : undefined,
                        executeUrl: talentCalendarId || addId ? formData.executeUrl : '',
                    },
                    executeUrlList: undefined,
                });
            case 'projectId':
                // this.getExecuteUrl(val.projectId.projectingId, { ...formData, ...val });
                this.getAppointment(val.projectId.projectingId);
                return this.setState({
                    formData: { ...formData, ...val, projectAppointmentId: undefined, executeUrl: '' },
                });
            case 'projectAppointmentId':
                const executeUrl = this.props.appointment.find((item) => {
                    return item.projectAppointmentId === val.projectAppointmentId;
                }).projectExecuteUrl || '';
                let projectAppointmentId = val.projectAppointmentId;
                if (!executeUrl) {
                    projectAppointmentId = undefined;
                    this.getExecuteUrlToProject(val.projectId.projectingId);
                }
                return this.setState({
                    formData: { ...formData, ...val, executeUrl, projectAppointmentId },
                });
            case 'tagsDtos':
                const { executeUrlList } = this.state;
                const _executeUrlList = executeUrlList && executeUrlList.length ? executeUrlList : undefined;
                return this.setState({ executeUrlList: _executeUrlList });
            default:
                break;
        }
    };

    // 修改父表单数据
    changeParentForm = (value) => {
        value.forEach((item) => {
            item && item.label.props && (item.label = item.label.props.name);
        });
        const form = this.formView.props.form.getFieldsValue();
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newData = _.assign({}, this.state.formData, form, { tagsDtos: value });
        this.setState({
            formData: newData,
        });
    };

    render() {
        const { formData, executeUrlList, tagsTreeData } = this.state;
        const { addBtnLoading, talentAccountList, channelList } = this.props;
        const appointment = this.props.appointment.filter((item) => {
            const talentId = formData && (formData.talentId || (formData.talentName && formData.talentName.talentId));
            return talentId === item.projectAppointmentTalentId;
        });
        const cols = formatFormCols(
            formatCols(
                {
                    formData,
                    changeParentForm: this.changeParentForm,
                    deleteTags: this.deleteTags,
                    addTags: this.addTags,
                    executeUrlList,
                },
                'add',
                talentAccountList,
                channelList,
                tagsTreeData,
                appointment,
            ),
        );
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={formData}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={addBtnLoading}
                onChangeParams={(changedValues, val) => {
                    return this.onChangeParams(changedValues, val);
                }}
            />
        );
    }
}
export default ThrowAdd;
