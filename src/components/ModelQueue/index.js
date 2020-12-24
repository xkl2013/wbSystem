import React, { Component } from 'react';
import styles from './index.less';
import iconNum from '@/assets/queue-num-iocn.png';
import iconSuccess from '@/assets/queue-success-icon.png';

// 任务队列组件
class ModelQueue extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    taskDomList = data => {
        const domArr = data.map(item => (
            <div
                className={`${styles.taskListDom} ${data.length > 5 ? styles.lastChild : ''}`}
                key={item.id}
            >
                {item.taskPlan < 100 ? (
                    <p className={styles.queueLine}>
                        <span style={{ width: `${item.taskPlan}%` }} />
                    </p>
                ) : (
                    <p className={styles.queueLine}>
                        <span style={{ width: `100%`, opacity: '0' }} />
                    </p>
                )}
                <div>
                    <span>
                        <img className={styles.iconNum} src={iconNum} alt="" />
                        {item.realLedgerNum}条
                    </span>
                </div>
                <div>
                    <span className={styles.queue2}>{item.startTime}</span>
                </div>
                <div>
                    <span className={styles.queue2}>{item.endTime}</span>
                </div>
                <div>
                    {item.status === 0 ? (
                        <span>{`${item.taskPlan}%`}</span>
                    ) : (
                        <span>
                            <img className={styles.iconSuccess} src={iconSuccess} alt="传送完成" />
                            传送完成
                        </span>
                    )}
                </div>
                <div>
                    <span className={styles.queue2}>
                        成功 {item.successLedgerNum} 条
                        <br />
                        失败 {item.failLedgerNum} 条
                    </span>
                </div>
            </div>
        ));
        return domArr;
    };
    onShow() {
        this.props.showBack(true);
    }
    onHide() {
        this.props.showBack(false);
    }
    render() {
        const { titleText, data, showState, modelShow } = this.props;
        return (
            <>
                {modelShow ? (
                    <div className={styles.modelqueue}>
                        <p className={styles.queueTitle}>
                            <span>{titleText}</span>
                            <span
                                className={styles.btnmini}
                                onClick={() => {
                                    showState ? this.onHide() : this.onShow();
                                }}
                            >
                                <i className={showState ? styles.taskHide : styles.taskShow} />
                            </span>
                        </p>
                        <dl
                            className={`${styles.queueBox} ${
                                showState ? styles.queueShow : styles.queueHide
                            }`}
                        >
                            <dt>
                                <span>总条数</span>
                                <span>开始时间</span>
                                <span>结束时间</span>
                                <span>传送状态</span>
                                <span>传送结果</span>
                            </dt>
                            <dd>{this.taskDomList(data)}</dd>
                        </dl>
                    </div>
                ) : null}
            </>
        );
    }
}
export default ModelQueue;
