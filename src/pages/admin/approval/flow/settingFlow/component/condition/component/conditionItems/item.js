import React from 'react';
import { Popover } from 'antd';
import NotifyNode from '../../../nodeList';
import BISelect from '@/ant_components/BISelect';
import commonStyle from '../../../common.less';
import ConditionModel from './setConditionModel';
import styles from './styles.less';
import { operators } from '../../../_utils';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            conditions: [], // 定义条件,
        };
    }

    componentDidMount() {
        this.initValue();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.conditions) !== JSON.stringify(this.props.conditions)) {
            this.initValue(nextProps.conditions);
        }
    }

    // "OO开区间 CO前闭后开区间 CC闭区间 OC前开后闭区间 in 包含 not不包含"
    initValue = (data = this.props.dataSource.conditions) => {
        if (!Array.isArray(data)) return;
        const conditions = data.map((item) => {
            return {
                ...item,
                ...this.formaterValue(item),
            };
        });
        this.setState({ conditions });
    };

    formaterValue = (item) => {
        if (!Array.isArray(item.value) || item.value.length < 2) return [];
        let operatorObj = {};
        if (item.symbolId) {
            operatorObj = operators.find((ls) => {
                return ls.id === item.symbolId;
            }) || {};
        } else {
            operatorObj = operators.find((ls) => {
                return ls.type === item.type && ls.value === this.checkSameOperator(item.value);
            }) || {};
        }
        const valueStr = operatorObj.value || '';
        !valueStr && console.warn(item, '条件有误');
        const operatorValueS = valueStr.split(',');
        return {
            symbolId: item.symbolId ? item.symbolId : operatorObj.id,
            value: operatorValueS.map((ls, index) => {
                return ls === '${var}' ? (item.value || [])[index] : ls;
            }),
        };
    };

    checkSameOperator = (data) => {
        // 获取标志符
        let reStr = '';
        if (!Array.isArray(data)) return reStr;
        data.forEach((item, index) => {
            const instead = index > 0 ? ',${var}' : '${var}';
            reStr += ['-', '+'].includes(item) ? (index > 0 ? `,${item}` : item) : instead;
        });
        return reStr;
    };

    onChangePriority = (num) => {
        //  修改优先级
        // debugger
        this.props.onChangePriority && this.props.onChangePriority(this.props.index, num);
    };

    setcondions = (e) => {
        e.preventDefault();
        const instance = this.conMdel.getInstance();
        instance.handleSubmit
            && instance.handleSubmit((data) => {
                this.onChangeCondition(data);
                this.setState({ visible: false });
            });
    };

    onChangeCondition = (data) => {
        this.props.onChangeCondition && this.props.onChangeCondition(data, this.props.index || 0);
    };

    onChangeApprovalNode = (data = []) => {
        // 修改审批节点
        this.props.onChangeApprovalNode && this.props.onChangeApprovalNode(data, this.props.index || 0);
    };

    onChangeNoticeNode = (data) => {
        // 修改知会人节点
        this.props.onChangeNoticeNode && this.props.onChangeNoticeNode(data, this.props.index || 0);
    };

    getSubApprovalFlow = () => {
        // 去除默认审批
        const { groupData } = this.props;
        return groupData.filter((item) => {
            return !item.defaultSubApprovalFlow;
        });
    };

    renderVarTitle = () => {
        const { selectedVariableList = [] } = this.props;
        const conditions = this.state.conditions || [];
        return selectedVariableList.map((item, index) => {
            const conditionsObj = conditions.find((ls) => {
                return ls.fieldName === item.name;
            }) || {};
            const varObj = operators.find((ls) => {
                return ls.id === conditionsObj.symbolId;
            }) || {};
            const tempPbj = conditionsObj.label || conditionsObj.value;
            return (
                <div className={styles.rightTitle} key={index}>
                    <span className={styles.titleLaber}>
                        {item.title}
:
                    </span>
                    <span className={styles.titleValue}>{varObj.formater ? varObj.formater(tempPbj) : tempPbj}</span>
                </div>
            );
        });
    };

    render() {
        const { dataSource = {} } = this.props;
        const { visible } = this.state;
        const index = this.props.index || 0;
        const { defaultSubApprovalFlow } = dataSource;
        console.log(this.getSubApprovalFlow());
        return (
            <div className={commonStyle.flowBox}>
                <div className={commonStyle.title}>
                    {defaultSubApprovalFlow ? (
                        <div className={commonStyle.leftTitle}>
                            <span>默认条件</span>
                        </div>
                    ) : (
                        <>
                            <Popover
                                content={
                                    <div className={commonStyle.leftTitle}>
                                        <span>
                                            条件
                                            {index + 1}
：
                                        </span>
                                        {this.renderVarTitle()}
                                    </div>
                                }
                            >
                                <div className={`${commonStyle.leftTitle} ${styles.leftTitle}`}>
                                    <span>
                                        条件
                                        {index + 1}
：
                                    </span>
                                    {this.renderVarTitle()}
                                    <div className={styles.linearCls} />
                                </div>
                            </Popover>

                            <div className={styles.btnGroup}>
                                <BISelect
                                    size="small"
                                    style={{ width: '120px' }}
                                    onChange={this.onChangePriority}
                                    value={index}
                                >
                                    {this.getSubApprovalFlow().map((item, num) => {
                                        return (
                                            <BISelect.Option value={num} key={index}>
                                                {`优先级${num + 1}`}
                                            </BISelect.Option>
                                        );
                                    })}
                                </BISelect>
                                <span
                                    className={styles.handleBtn}
                                    onClick={() => {
                                        this.setState({ visible: true });
                                    }}
                                >
                                    设置条件
                                </span>
                                <span className={styles.handleBtn} onClick={this.props.onCoopy.bind(this, index)}>
                                    复制
                                </span>
                                <span
                                    className={`${styles.handleBtn} ${styles.deleteBtn}`}
                                    onClick={this.props.onDelete.bind(this, index)}
                                >
                                    删除
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* 设置条件弹框 */}
                {visible ? (
                    <ConditionModel
                        title="设置条件"
                        ref={(dom) => {
                            return (this.conMdel = dom);
                        }}
                        variableList={this.props.selectedVariableList}
                        conditions={this.state.conditions}
                        onCancel={() => {
                            this.setState({ visible: false });
                        }}
                        onOk={this.setcondions}
                        width={800}
                        visible={visible}
                    />
                ) : null}

                <div className={commonStyle.noticeBox}>
                    <span className={commonStyle.noticeTitle}>审批人</span>
                    <NotifyNode
                        data={dataSource.approvalFlowNodeList}
                        onChange={this.onChangeApprovalNode}
                        componentType="approval"
                    />
                </div>
                <div className={commonStyle.noticeBox}>
                    <span className={commonStyle.noticeTitle}>知会人</span>
                    <NotifyNode
                        data={dataSource.noticerList}
                        isShowClear
                        onChange={this.onChangeNoticeNode}
                        componentType="noticer"
                    />
                </div>
            </div>
        );
    }
}
