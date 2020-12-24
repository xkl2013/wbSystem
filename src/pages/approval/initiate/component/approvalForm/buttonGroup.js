import React from 'react';
import ApprovalHistory from '../approvalHistory';
import styles from './styles.less';

export default class ButtonGroup extends React.Component {
    state = {
        historyVisible: false,
    }
    closeHistory = () => {
        this.setState({ historyVisible: false })
    }
    checkButtonType = (item) => {
        const { visibleFlag } = item;
        if (visibleFlag === 2) return null;   //状态是2为隐藏状态
        switch (item.buttonType) {
            case 1:   // 历史记录
                return <span key={item.id} className={styles.btn} onClick={() => { this.setState({ historyVisible: true }) }}>{item.buttonName}</span>
            case 2:   // 稍后填写,只有移动端有
                return null
            default:
                return null

        }
    }
    renderButton = () => {
        const buttonData = this.props.buttonData;
        return buttonData.map(ls => this.checkButtonType(ls))
    }
    render() {
        const { historyVisible } = this.state;
        const { formData } = this.props
        return (
            <div className={styles.btnGroup}>
                {this.renderButton()}
                {!historyVisible ? null : <ApprovalHistory closeHistory={this.closeHistory} visible={historyVisible} onUseHistory={this.props.onUseHistory} flowId={formData.id} />}
            </div>
        )
    }

}