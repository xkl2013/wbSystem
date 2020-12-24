import React from 'react';
import BIModel from '@/ant_components/BIModal/index.js';
import BICheckbox from '@/ant_components/BICheckbox'
import { getApprovalHistory, setApprovalHistory } from '../../services';
import { getApprlvalFlow } from '@/pages/approval/services'
import styles from './style.less';
import tipIcon from '@/assets/yiwen.png'
import { message } from 'antd';

export default class HistoryBox extends React.Component {
    state = {
        historyData: [],
        visible: false,
        approvalData: [],
        selectIds: [],
        flowId: null,
    }
    onShow = (id) => {
        this.getApprlvalFlow(id);
        this.getHistoryData(id);
        this.setState({ flowId: id })

    }
    getHistoryData = async (id) => {
        const result = await getApprovalHistory(id);
        let selectIds = [];
        let historyData = [];
        if (result && result.success) {
            const data = result.data || {};
            historyData = Array.isArray(data.approvalFlowHistoryFieldList) ? data.approvalFlowHistoryFieldList : [];
            selectIds = historyData.map(ls => ls.fieldName);

        }
        this.setState({ historyData, visible: true, selectIds })
    }
    getApprlvalFlow = async (id) => {
        const result = await getApprlvalFlow(id);
        if (result && result.success) {
            const data = result.data || {};
            const approvalForm = data.approvalForm || {};
            const approvalData = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
            this.setState({ approvalData })
        }
    }
    updateHistoryNode = async (data) => {
        const result = await setApprovalHistory(data);
        if (result && result.success) {
            message.success('更新成功');
            this.setState({ visible: false })
        }
    }
    onChange = (selectIds) => {
        if (selectIds.length > 4) {
            message.warn('最多选择4个');
            return
        }
        this.setState({ selectIds })
    }
    handleOk = () => {
        const approvalFlowHistoryFieldList = this.state.selectIds.map(ls => {
            const nodeObj = this.state.approvalData.find(item => item.name === ls) || {};
            return {
                fieldId: nodeObj.id,
                fieldName: nodeObj.name,
                fieldTitle: nodeObj.title,
                id: nodeObj.id,
                formId: nodeObj.formId,
            }
        });
        this.updateHistoryNode({ approvalFlowHistoryFieldList, flowId: this.state.flowId })
    }
    onCancel = () => {
        this.setState({ visible: false })
    }
    render() {
        const { visible, historyData, approvalData, selectIds } = this.state;
        return (
            <BIModel
                title="历史记录"
                onOk={this.handleOk}
                onCancel={this.onCancel}
                width={650}
                visible={visible}>
                <div className={styles.contentWrap}>
                    <div className={styles.title}>
                        关键展示字段
                        <div className={styles.tipWrap}>
                            <img className={styles.tipIconCls} src={tipIcon} />
                            <p className={styles.tipCls}>展示字段最多可显示四个</p>
                        </div>

                    </div>
                    <div className={styles.checkboxCls}>
                        <BICheckbox
                            value={selectIds}
                            onChange={this.onChange}
                            options={approvalData.map(ls => ({ ...ls, label: ls.title, value: ls.name }))}
                        ></BICheckbox>
                    </div>
                </div>
            </BIModel>
        )
    }
}