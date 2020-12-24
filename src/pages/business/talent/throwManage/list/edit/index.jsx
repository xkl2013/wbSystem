/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { formatCols } from '../constants';
import { deleteTags, addTags, confirmDelTags, getExecuteUrl, getTagsTree } from '../../services';

@Watermark
@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        talentAccountList: throw_manage.talentAccountList,
        generalizeDetail: throw_manage.generalizeDetail,
        appointment: throw_manage.appointment,
        loading: loading.effects['throw_manage/getGeneralizeDetail'],
        editBtnLoading: loading.effects['throw_manage/editPopularizeSave'],
    };
})
class ThrowEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.generalizeDetail || {},
            channel: props.generalizeDetail.putChannel,
            platform: props.generalizeDetail.accountPlatform,
            tagsTreeData: [], // 标签树列表
            originPutStatus: undefined, // 原始投放状态
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.generalizeDetail !== nextProps.generalizeDetail) {
            let fansPrice = '--';
            let newFollowCost = '--';
            const {
                putAmount,
                fansUpCount,
                putChannel,
                accountPlatform,
                projectId,
                talentId,
                talentType,
                putStatus,
                newFollowCount,
            } = nextProps.generalizeDetail;

            if (fansUpCount) {
                fansPrice = `${(Number(putAmount) / Number(fansUpCount)).toFixed(2)}元`;
            }
            if (newFollowCount) {
                newFollowCost = `${(Number(putAmount) / Number(newFollowCount)).toFixed(2)}元`;
            }
            talentId && this.getTalentAccount({ talentId, talentType }); // 获取账号列表
            projectId && this.getAppointment(projectId); //  获取履约义务
            this.setState(
                {
                    formData: { ...nextProps.generalizeDetail, fansPrice, newFollowCost },
                    channel: putChannel,
                    platform: accountPlatform,
                    originPutStatus: putStatus,
                },
                () => {
                    this.getTagsTree(putChannel);
                },
            );
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
                window.open(`${window.location.origin}/foreEnd/business/project/manage/detail?id=${id}`);
            },
        });
    };

    // 获取投放标签树形结构
    getTagsTree = async (channel) => {
        const { platform } = this.state;
        if (!platform) return;
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
    addTags = async (id, nodeName, addCb, cancelcb) => {
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
            cancelcb && cancelcb();
        }
    };

    getData = async () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'throw_manage/getGeneralizeDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    // 修改父表单数据
    changeParentForm = (value) => {
        value.forEach((item) => {
            item.label.props && (item.label = item.label.props.name);
        });
        const form = this.formView.props.form.getFieldsValue();
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newData = _.assign({}, this.state.formData, form, { tagsDtos: value });
        this.setState({
            formData: newData,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    // 获取执行链接
    getExecuteUrl = async (id, obj) => {
        const { executeUrl } = obj;
        const response = await getExecuteUrl(id);
        if (response && response.success) {
            const projectExecuteUrl = [];
            response.data.list
                && response.data.list.forEach((item) => {
                    item.projectExecuteUrl
                        && projectExecuteUrl.push({ id: item.projectExecuteUrl, name: item.projectExecuteUrl });
                });
            this.setState({
                formData: { ...obj, executeUrl: projectExecuteUrl.length ? executeUrl || projectExecuteUrl[0].id : '' },
                executeUrlList: projectExecuteUrl,
            });
        }
    };

    getTalentAccount = (payload) => {
        // 获取账户
        this.props.dispatch({
            type: 'throw_manage/getTalentAccount',
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
        const fansPrice = values.fansPrice && Number(String(values.fansPrice).replace('元', ''));
        const newFollowCost = values.newFollowCost && Number(String(values.newFollowCost).replace('元', ''));
        const { formData } = this.state;
        const newParam = {
            ...formData,
            ...values,
            fansPrice,
            newFollowCost,
            ...this.props.location.query,
        };
        this.setState({
            formData: newParam,
        });
        const payload = {
            data: newParam,
            cb: this.handleCancel,
        };
        this.props.dispatch({
            type: 'throw_manage/editPopularizeSave',
            payload,
        });
    };

    onChangeParams = (changedValues, val) => {
        const key = Object.keys(changedValues)[0];
        const { formData } = this.state;
        switch (key) {
            case 'putStatus':
                let feedbackObj = {};
                if (Number(val[key]) === 4) {
                    const {
                        shareCount, playCount, giveUpCount, commentCount, fansUpCount, fansPrice,
                    } = formData;
                    feedbackObj = {
                        shareCount,
                        playCount,
                        giveUpCount,
                        commentCount,
                        fansUpCount,
                        fansPrice,
                    };
                }
                return this.setState({
                    formData: { ...formData, ...val, ...feedbackObj },
                });
            case 'putChannel':
                this.getTagsTree(val.putChannel); // 选择完渠道之后获取投放标签树接口
                return this.setState({
                    formData: { ...formData, ...val, putType: undefined, tagsDtos: [] },
                    channel: val.putChannel,
                });
            case 'putType':
                return this.setState({
                    formData: { ...formData, ...val },
                });
            case 'projectId':
                this.getExecuteUrl(val.projectId.projectingId, { ...formData, ...val, executeUrl: '' });
                break;
            case 'fansUpCount':
                if (Number(val[key]) > 0 && formData.putAmount) {
                    return this.setState({
                        formData: {
                            ...formData,
                            ...val,
                            fansPrice: `${(Number(formData.putAmount) / Number(val[key])).toFixed(2)}元`,
                        },
                    });
                }
                break;
            case 'newFollowCount':
                if (Number(val[key]) > 0 && formData.putAmount) {
                    return this.setState({
                        formData: {
                            ...formData,
                            ...val,
                            newFollowCost: `${(Number(formData.putAmount) / Number(val[key])).toFixed(2)}元`,
                        },
                    });
                }
                break;
            case 'putAmount':
                if (Number(val[key]) > 0 && formData.fansUpCount) {
                    return this.setState({
                        formData: {
                            ...formData,
                            ...val,
                            fansPrice: `${(Number(val[key]) / Number(formData.fansUpCount)).toFixed(2)}元`,
                        },
                    });
                }
                if (Number(val[key]) > 0 && formData.newFollowCount) {
                    return this.setState({
                        formData: {
                            ...formData,
                            ...val,
                            newFollowCost: `${(Number(val[key]) / Number(formData.newFollowCount)).toFixed(2)}元`,
                        },
                    });
                }
                break;
            case 'tagsDtos':
                const { executeUrlList } = this.state;
                const _executeUrlList = executeUrlList && executeUrlList.length ? executeUrlList : undefined;
                return this.setState({ executeUrlList: _executeUrlList });
            default:
                break;
        }
    };

    render() {
        const { formData, executeUrlList, tagsTreeData, originPutStatus } = this.state;
        const { editBtnLoading, talentAccountList, appointment } = this.props;

        const detail = _.assign({}, formData);
        const cols = formatFormCols(
            formatCols(
                {
                    formData: detail,
                    changeParentForm: this.changeParentForm,
                    deleteTags: this.deleteTags,
                    addTags: this.addTags,
                    executeUrlList,
                },
                'edit',
                talentAccountList,
                detail.channelList,
                tagsTreeData,
                appointment,
                originPutStatus,
            ),
        );
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={detail}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
                onChangeParams={(changedValues, val) => {
                    return this.onChangeParams(changedValues, val);
                }}
            />
        );
    }
}

export default ThrowEdit;
