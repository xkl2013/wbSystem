import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './approvalNode.less';
import addIcon from '@/assets/addIcon.png';
import { formModalLayout } from '../General/utils/layout';
import ModalDialog from '@/rewrite_component/user_org_jole/modalFiles';
import deleteIcon from '@/assets/closeIcon.png';

/**
 *
 *  审批流组件
 *  props：
 *  data // 数据源对象，包含 approvalFlowNodeDtos = [], approvalTaskLogDtos = []
 *  title1 // 审批预览title
 *  title2  // 审批记录title
 *
 * */

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            toolTipList: [], // tip 数据
            visible: false,
        };
    }

    tipNode = () => {
        // tip节点
        const toolTipList = this.state.toolTipList || [];
        if (toolTipList.legnth === 0) {
            return null;
        }
        const node = toolTipList.map((item, index) => {
            return (
                <p key={index} style={{ textAlign: 'center' }}>
                    {item}
                </p>
            );
        });
        return <div>{node}</div>;
    };

    tipsEnter = async (item) => {
        // hover事件
        this.setState({
            toolTipList: [],
        });
        const { executorId, executorType } = item || {};
        const { approvalTaskLogDtos = [] } = this.props.data || {};
        const { instanceId } = approvalTaskLogDtos[0] || {};
        const result = await this.getExecutors({
            instanceId,
            executorId,
            executorType,
        });
        if (result && result.success) {
            const { list = [] } = result.data || {};
            let toolTipList = [];
            if (list && list.length > 0 && list[0]) {
                toolTipList = list.map((ls) => {
                    if (ls) {
                        return ls.userName;
                    }
                });
            } else {
                toolTipList = ['暂无数据'];
            }
            this.setState({
                toolTipList,
            });
        }
    };

    addNodes = () => {
        this.setState({ visible: true });
    };

    onChange = (data) => {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };

    handleOk = (value) => {
        this.onChange(value);
        this.setState({ visible: false });
    };

    onCancel = () => {
        this.setState({ visible: false });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    removeUsers = (obj) => {
        if (this.props.onChange) {
            const newData = this.props.data.filter((item) => {
                return item.id !== obj.id;
            });
            this.props.onChange(newData);
        }
    };

    render() {
        const { title = '审批人' } = this.props;
        const data = this.props.data || [];
        const Layout = this.props.layout || formModalLayout;
        return (
            <div>
                <Row>
                    <Col {...Layout.labelCol.sm}>
                        <div className={styles.title}>{title}</div>
                    </Col>
                    <Col {...Layout.wrapperCol.sm}>
                        <div className={styles.content}>
                            <div className={styles.list}>
                                {/* -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批 */}
                                {data.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.item} ${item.status === 1 ? styles.itemWait : null} ${
                                                item.status === 0 ? styles.itemReject : null
                                            }  ${item.status === 2 ? styles.itemAgree : null}  ${
                                                item.status === -1 ? styles.itemCancel : null
                                            }`}
                                        >
                                            <div className={styles.itemTop}>
                                                <p>{item.executorName || item.name}</p>
                                                <div className={styles.itemTopIcon} />
                                                {this.props.isShowAddBtn ? (
                                                    <img
                                                        src={deleteIcon}
                                                        className={styles.clearIcon}
                                                        onClick={this.removeUsers.bind(this, item)}
                                                        alt=""
                                                    />
                                                ) : null}
                                            </div>
                                            <div className={styles.itemBottom}>
                                                <div
                                                    className={`${styles.itemLine} ${
                                                        index === 0 ? styles.itemLineNone : null
                                                    } ${
                                                        item.status !== 3 || item.status !== 5
                                                            ? styles.itemLinePass
                                                            : null
                                                    }`}
                                                />
                                                <div className={styles.itemIcon} />
                                                <div
                                                    className={`${styles.itemLine} ${
                                                        item.status === 2 ? styles.itemLinePass : null
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {this.props.isShowAddBtn ? (
                                    <div className={`${styles.lastItem}`}>
                                        <img src={addIcon} className={styles.addIcon} onClick={this.addNodes} alt="" />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Col>
                </Row>

                <ModalDialog
                    {...this.props}
                    ref={(dom) => {
                        this.modal = dom;
                    }}
                    title="添加用户"
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    onCancel={this.onCancel}
                    value={data}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}
