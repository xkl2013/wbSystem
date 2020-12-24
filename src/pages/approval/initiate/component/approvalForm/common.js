/* eslint-disable */
import React from 'react';
import { Skeleton, message, Tooltip, Icon } from 'antd';
import IconFont from '@/submodule/components/IconFont';
import _ from 'lodash';
// import lodash from 'lodash';
import BImodel from '@/ant_components/BIModal';
import {
    getApprlvalFlow,
    addApprovalInstance,
    getFlowsSubflow,
    getFlowCompatible,
    getApprovalButton,
} from '../../../services';
import GeneralCom from '@/components/General';
// import ApprovalHistory from '../approvalHistory';
import styles from './styles.less';
import ButtonGroup from './buttonGroup';
import { getFlowId, editApprovalParams, handleDefaultValue } from './edit';

export default class ApprovalForm extends React.Component {
    constructor(props) {
        super(props);
        this.changeConditonField = _.debounce(this.changeConditonField, 500);
    }

    conditons = [];

    state = {
        visible: false,
        formData: {},
        approvalForm: {},
        loading: false,
        submitIng: false,
        updateNum: 1,
        historyVisible: false,
        buttonData: [],
        editType: '',
    };

    callback = null;

    // 设置提交回调
    hideApprovalNode = false;

    // 隐藏添加审批人,定制化审批
    hideNotifyNode = false;

    // 隐藏添加知会人,定制化审批
    getApprlvalFlow = async (id, callback) => {
        await this.setState({ loading: true });
        this.getButtons(id);
        const response = await getApprlvalFlow(id);
        if (response && response.success && response.data) {
            const formData = callback ? callback(response.data) : response.data;
            const approvalForm = formData.approvalForm || {};
            approvalForm.approvalFormFields = handleDefaultValue(approvalForm.approvalFormFields);
            formData.approvalFlowNodes = formData.type === 'freedom' ? [] : formData.approvalFlowNodes;
            await this.chooseConditonField(formData);
            this.setState({ formData, approvalForm });
        }
        await this.setState({ loading: false });
    };

    getButtons = async (id) => {
        const response = await getApprovalButton(id);
        if (response && response.success) {
            const data = response.data || {};
            const buttonData = Array.isArray(data.approvalFlowButtonList) ? data.approvalFlowButtonList : [];
            this.setState({ buttonData });
        }
    };

    editApprlvalFlow = (data, flowId) => {
        if (!flowId) return;
        this.getApprlvalFlow(flowId, (instanceData) => {
            return editApprovalParams(data, instanceData);
        });
    };

    chooseConditonField = (params) => {
        if (params.type !== 'condition') return;
        const approvalForm = params.approvalForm || {};
        this.conditons = approvalForm.approvalFormFields
            .filter((item) => {
                return item.conditonField === 1;
            })
            .map((item) => {
                const changeParse = GeneralCom.config[item.type] ? GeneralCom.config[item.type].parser : null;
                return {
                    fieldId: item.id,
                    name: item.name,
                    value: changeParse ? changeParse(item.value) : item.value,
                    type: item.type,
                };
            });
    };

    addApproval = async (value) => {
        await this.setState({ submitIng: true });
        let response = {};
        let pathName = '/foreEnd/approval/apply/myjob';
        if (this.callback) {
            // 定制审批流（非正规）
            response = await this.callback(value);
            if (response.data && response.data.clauseContractType === 2) {
                pathName = '/foreEnd/approval/apply/contract';
            } else {
                pathName = '/foreEnd/approval/apply/business';
            }
        } else {
            // 默认审批流
            response = await addApprovalInstance(value);
            pathName = '/foreEnd/approval/apply/myjob';
        }
        if (response && response.success) {
            message.success('流程创建成功');
            this.onHide();
            this.props.history.push(pathName);
        }
        await this.setState({ submitIng: false });
    };

    checkoutTypeValue = (value) => {
        return value.map((item) => {
            const changePormatter = GeneralCom.config[item.type] ? GeneralCom.config[item.type].changePormatter : null;
            return changePormatter ? changePormatter(item) : item;
        });
    };

    changeConditonField = async (value, currentValue) => {
        if (this.state.formData.type !== 'condition') return;
        const newValue = { conditionDtos: this.checkoutTypeValue(value) };
        const response = await getFlowsSubflow(this.state.formData.id, newValue);
        if (response && response.success) {
            const data = response.data || {};
            const formData = {
                ...this.state.formData,
                approvalFlowNodes: JSON.parse(JSON.stringify(data.approvalFlowNodes || [])),
                approvalNoticers: JSON.parse(JSON.stringify(data.approvalNoticers || [])),
                selfId: data.id,
            };
            this.setState({ formData, updateNum: new Date().valueOf() });
            // TODO:response.message!=='成功'
            if (!data.id && currentValue.value && response.message !== '成功') {
                message.warning(response.message);
            }
        }
    };

    onSubmit = (values = {}) => {
        const { formData } = this.state;
        const params = {
            flowId: formData.selfId === undefined ? formData.id : formData.selfId,
            formId: formData.approvalForm.id,
            name: formData.name,
            approvalInstanceDataDtos: values.approvalInstanceDataDtos || [],
            approvalNoticers: values.approvalNoticers,
            approvalFlowDto: {
                approvalFlowNodeDtos: this.checkoutFlowType(values.approvalFlowNodeDtos),
                type: formData.type,
            },
        };
        if (
            !this.hideApprovalNode &&
            (!params.approvalFlowDto.approvalFlowNodeDtos || params.approvalFlowDto.approvalFlowNodeDtos.length === 0)
        ) {
            message.warn('未找到审批人');
            return;
        }
        this.addApproval(params);
    };

    editSubmit = (values = {}) => {
        const { formData } = this.state;
        const params = {
            id: this.props.instanceId,
            flowId: formData.selfId === undefined ? formData.id : formData.selfId,
            formId: formData.approvalForm.id,
            name: formData.name,
            approvalInstanceDataDtos: values.approvalInstanceDataDtos || [],
            // approvalNoticers: values.approvalNoticers,
            approvalFlowDto: {
                // approvalFlowNodeDtos: this.checkoutFlowType(values.approvalFlowNodeDtos),
                type: formData.type,
            },
        };
        this.addApproval(params);
    };

    checkoutFlowType = (approvalFlowNodes) => {
        const { formData } = this.state;
        switch (formData.type) {
            case 'freedom': // 自由流程
                return approvalFlowNodes.map((item) => {
                    return { ...item, executorType: 0 };
                }); // executorType用户
            case 'fixed': // 固定流程
                return formData.approvalFlowNodes;
            case 'condition': // 条件流程
                return formData.approvalFlowNodes;
            default:
                return approvalFlowNodes.map((item) => {
                    return { ...item, executorType: 0 };
                });
        }
    };

    onChangeParams = (values, changedValues) => {
        this.onChangeConditonField(changedValues, values);
    };

    onChangeConditonField = (changedValues = {}, values = []) => {
        const keys = Object.keys(changedValues);
        if (keys.length === 0) return;
        const obj =
            values.find((item) => {
                return item.name === keys[0];
            }) || {};
        if (obj.conditonField) {
            const returnValue = [];
            this.conditons.forEach((item) => {
                item.value = item.name === keys[0] ? changedValues[keys[0]] : item.value;
                if ((item.value || item.value === 0) && item.name !== keys[0]) {
                    returnValue.push({
                        ...item,
                        fieldName: item.name,
                        value: item.value,
                        fieldId: item.id || item.fieldId,
                    });
                }
            });
            returnValue.push({
                fieldName: obj.name,
                value: changedValues[obj.name],
                fieldId: obj.id,
            });
            if (returnValue.length === this.conditons.length) {
                this.changeConditonField(returnValue, {
                    value: changedValues[keys[0]],
                    name: keys[0],
                });
            }
        } else return;
    };

    onShow = (obj, type) => {
        this.setState({ visible: true, editType: type });
        if (type === 'edit') {
            this.onRestartForm(obj);
            this.hideApprovalNode = true;
            this.hideNotifyNode = true;
            return;
        }
        if (type === 'approvalReStart') {
            this.onRestartForm(obj);
            return;
        }
        this.getApprlvalFlow(obj.id);
    };

    onRestartForm = async (obj) => {
        const flowId = getFlowId(obj);
        const restartData = await getFlowCompatible(flowId);
        if (restartData && restartData.success) {
            const data = restartData.data || {};
            this.editApprlvalFlow(obj, data.id);
        }
    };

    onShowOtherType = (obj, otherParams = {}) => {
        const { hideApprovalNode, hideNotifyNode, callback } = otherParams || {};
        this.callback = callback;
        this.hideApprovalNode = hideApprovalNode;
        this.hideNotifyNode = hideNotifyNode;
        this.onShow(obj);
    };

    onHide = () => {
        this.props.onCannel && this.props.onCannel();
        this.setState({ visible: false });
    };

    onCancel = () => {
        this.onHide();
    };

    closeHistory = () => {
        this.setState({ historyVisible: false });
    };

    onUseHistory = (data = {}) => {
        const formData = _.cloneDeep(editApprovalParams({ approvalForm: data }, this.state.formData));
        const { approvalForm } = formData;
        this.setState({ formData, approvalForm });
    };

    renderTitle = (formData) => {
        // 自定义
        const choujiangDownloadContent = (
            <Tooltip
                placement="bottom"
                title="选品数量超过5类以上，需下载采购需求表模版，填写完后作为附件上传，并在备注里标注整体金额"
                overlayClassName={styles.tooltip}
            >
                <a
                    className={styles.download}
                    href="https://static.mttop.cn/caigoumoban.xlsx"
                    download="采购需求表模版"
                >
                    {' '}
                    <IconFont type="iconxiazai" />
                    下载采购需求表模版
                </a>
            </Tooltip>
        );
        return (
            <div className="approvalFormTootle">
                <span>{formData.name}</span>
                <Tooltip placement="bottom" title={formData.remark} overlayClassName={styles.tooltip}>
                    <span className={styles.titleDes}>
                        {' '}
                        <Icon type="question" />
                    </span>
                </Tooltip>
                {formData.flowKey === 'flow_key_chou_jiang' && choujiangDownloadContent}
                <ButtonGroup
                    formData={this.state.formData}
                    onUseHistory={this.onUseHistory}
                    buttonData={this.state.buttonData}
                />
                {/* <span className={styles.history} onClick={}>历史记录</span> */}
            </div>
        );
    };

    render() {
        const { visible, approvalForm, formData, submitIng, loading, editType } = this.state;
        const approvalFormFields = approvalForm.approvalFormFields || [];
        if (!visible) return null;
        return (
            <div>
                <BImodel
                    title={this.renderTitle(formData)}
                    width={752}
                    visible={visible}
                    onCancel={this.onCancel}
                    footer={null}
                    maskClosable={false}
                >
                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <GeneralCom
                            onCancel={this.onCancel}
                            data={approvalFormFields}
                            flowData={formData}
                            hideApprovalNode={this.hideApprovalNode}
                            hideNotifyNode={this.hideNotifyNode}
                            approvalFlowNodes={formData.approvalFlowNodes}
                            approvalNoticers={formData.approvalNoticers}
                            onChangeParams={this.onChangeParams}
                            updateNum={this.state.updateNum}
                            loading={submitIng}
                            onSubmit={editType === 'edit' ? this.editSubmit : this.onSubmit}
                        />
                    )}
                </BImodel>
            </div>
        );
    }
}
