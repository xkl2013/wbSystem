import React from 'react';
import BImodel from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import styles from "./index.less";
import yiwen from "@/assets/yiwen.png";
import TableCom from "./table";
import { message } from 'antd';

class ApprovalHistory extends React.Component {
    state = {
        submitData: {}
    }
    handleCancel = () => {
        this.props.closeHistory && this.props.closeHistory()
    }
    submitDataFn = submitData => {
        console.log(submitData)
        this.setState({ submitData })
    }
    handleOk = () => {
        if (!this.state.submitData || this.state.submitData.id === void 0) {
            message.warn('请选择数据');
            return
        }
        this.props.onUseHistory && this.props.onUseHistory(this.state.submitData, this.props.flowId)
        this.handleCancel()
    }
    renderTitle = () => {
        return (
            <div className={styles.titleWrap}>历史记录
                <div className={styles.showTipWrap}>
                    <img className={styles.iconCls} src={yiwen} />
                    <div className={styles.tipCls}>选择历史记录可快捷复制表单</div>
                </div>
            </div>
        )
    }
    render() {
        const { visible } = this.props;
        const { flowId = 1579 } = this.props;
        return (
            <BImodel
                title={this.renderTitle()}
                width={755}
                visible={visible}
                onCancel={this.handleCancel}
                footer={[
                    <BIButton className={styles.btnCls} key="取消" onClick={this.handleCancel}>
                        取消
                    </BIButton>,
                    <BIButton key="复制到表单" type="primary" onClick={this.handleOk}>
                        复制到表单
                    </BIButton>,
                ]}
                maskClosable={false}
            >
                <TableCom submitDataFn={this.submitDataFn} flowId={flowId} />
            </BImodel>
        )
    }

}
export default ApprovalHistory
