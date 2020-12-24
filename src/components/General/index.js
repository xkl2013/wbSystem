import React from 'react';
import { formConfig } from './config';
import styles from './styles.less';
import ApprovalNode from './components/approvalNode';
import FormView from './components/formView';
// import HandleBehavior from 'apollo_form_pase';
import HandleBehavior from './components/formView/handleBehavior';

class General extends React.Component {
    state = {
        formData: [],
    };

    componentDidMount() {
        this.initFormData(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this.initFormData(nextProps.data);
        }
    }

    /*
     *    处理渲染之前逻辑
     */
    filterHideNode = (data) => {
        return data.filter((ls) => {
            if (ls.approvalFormFields && ls.approvalFormFields.length > 0) {
                /* eslint no-param-reassign: "off" */
                ls.approvalFormFields = this.filterHideNode(ls.approvalFormFields);
            }
            return ls.renderType !== 2;
        });
    };

    beforeInit = (data) => {
        if (!Array.isArray(data)) return [];
        // 将不渲染数据进行过滤
        return this.filterHideNode(data);
    };

    initFormData = (formData) => {
        const newFormData = this.beforeInit(formData);
        this.behaviorInstance = new HandleBehavior({ formData: newFormData, changeCallBack: this.changeFormData });
        this.behaviorInstance.initBehavior();
        this.setState({ formData: this.behaviorInstance.formData || [] });
    };

    // 待优化
    onChangeParams = (formData, changedValues) => {
        if (this.props.onChangeParams) this.props.onChangeParams(formData, changedValues);
        const params = Object.keys(changedValues)[0];
        const componentData = formData.find((ls) => {
            return ls.name === params;
        }) || {};
        this.setState({ formData }, () => {
            this.handleBehavior({
                currentValue: (
                    formData.find((ls) => {
                        return ls.id === componentData.id;
                    }) || {}
                ).value,
                componentData,
                eventType: 'onChange',
            });
        });
    };

    changeFormData = (formData) => {
        this.setState({ formData });
    };

    handleBehavior = ({ currentValue, componentData, eventType }) => {
        if (this.behaviorInstance.handleBehavior) {
            this.behaviorInstance.handleBehavior({
                currentValue,
                componentData,
                eventType,
                formData: this.state.formData,
            });
        }
        this.setState({ formData: this.behaviorInstance.formData });
    };

    handleSubmit = (data) => {
        const approvalNodeObj = this.ApprovalRef && this.ApprovalRef.willSubmit ? this.ApprovalRef.willSubmit() : {};
        const newData = {
            ...data,
            approvalNoticers: approvalNodeObj.approvalNoticers || [],
            approvalFlowNodeDtos: approvalNodeObj.approvalFlowNodes || [],
        };

        if (this.props.onSubmit) this.props.onSubmit(newData);
    };

    render() {
        const { flowData } = this.props;
        const { approvalFlowNodes, approvalNoticers } = flowData || {};
        return (
            <div className={styles.formPanle}>
                <FormView
                    {...this.props}
                    onChangeParams={this.onChangeParams}
                    wrappedComponentRef={(ref) => {
                        this.formView = ref;
                    }}
                    formData={this.state.formData}
                    onSubmit={this.handleSubmit}
                    loading={this.props.loading}
                    onCancel={this.props.onCancel}
                    flowKey={flowData.flowKey}
                >
                    <ApprovalNode
                        ref={(dom) => {
                            this.ApprovalRef = dom;
                        }}
                        hideApprovalNode={this.props.hideApprovalNode}
                        hideNotifyNode={this.props.hideNotifyNode}
                        flowType={flowData.type}
                        approvalFlowNodes={approvalFlowNodes}
                        approvalNoticers={approvalNoticers}
                    />
                </FormView>
            </div>
        );
    }
}

General.config = formConfig;
export default General;
