'use strict';
import React from 'react';
import ReactToPrint from 'react-to-print';
import BIModal from '@/ant_components/BIModal';
import BIButton from "@/ant_components/BIButton";
import styles from './styles.less'

// 文档:https://www.npmjs.com/package/react-to-print


export default function printFile(Com) {
    return class PrintFile extends React.Component {
        state = {
            visible: false,
        }
        
        onShow = () => {
            this.setState({ visible: true });
        }
        onCancel = () => {
            this.setState({ visible: false });
        }
        onBeforePrint = (e) => {
            this.setState({ visible: false });
            return true;
        }
        render() {
            const { trigger } = this.props;
            const { visible } = this.state;
            return (
                <>
                    <span onClick={this.onShow}>{trigger ? trigger() : '打印'}</span>

                    <BIModal
                        visible={visible}
                        title="打印预览"
                        footer={null}
                    >
                        <Com ref={el => (this.componentRef = el)}/>
                        <div className={styles.footer}>
                            <BIButton
                                onClick={this.onCancel}
                                className={styles.btnCls}
                            >
                                取消
              </BIButton>
                            <ReactToPrint
                                trigger={() => <BIButton
                                    type="primary"
                                    className={styles.btnCls}
                                >确认</BIButton>}
                                content={() => this.componentRef}
                                onBeforePrint={this.onBeforePrint} />
                        </div>
                    </BIModal>
                </>
            )
        }

    }
}