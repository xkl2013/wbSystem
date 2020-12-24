import React from 'react';
import styles from './styles.less';
import _ from 'lodash';
import RadioGroup from '@/ant_components/BIRadio';
import Button from '@/ant_components/BIButton';
import Freedom from './component/freedom';
import Fixed from './component/fixed';
import Condition from './component/condition';
import { getflowCud, updateFlowCud } from '../../services'
import { message } from 'antd';

const flowGroup = [{ id: 'freedom', name: '自由流程', com: Freedom }, { id: 'fixed', name: '固定流程', com: Fixed }, { id: 'condition', name: '分条件审批', com: Condition }];
export default class SettingFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flowType: 'freedom',
            dataSource: {},
            updateing: false,
        }
    }
    componentDidMount() {
        this.getApprovalFlowData();
    }
    getApprovalFlowData = async () => {
        let { query: { id = '', type } } = this.props.location || {}
        const response = await getflowCud({ type, id });
        if (response && response.success) {
            const dataSource = response.data || {};
            const flowType = dataSource.type || 'freedom';
            this.setState({ dataSource, flowType });
        }
    }
    updateData = async (data) => {
        this.setState({ updateing: true });
        const reponse = await updateFlowCud(data);
        if (reponse && reponse.success) {
            message.success('设置成功');
            this.props.history.push('/admin/approval/flow');
        }
        this.setState({ updateing: false });

    }
    onChangeType = (e) => {
        const flowType = e.target.value;
        let dataSource = this.state.dataSource;
        dataSource.type = flowType;
        dataSource = this.onInitData();
        this.setState({ flowType, dataSource })
    }
    onInitData = () => {
        let dataSource = this.state.dataSource;
        dataSource.noticerList = [];
        dataSource.approvalFlowNodeList = [];
        dataSource.subApprovalFlowList = [];
        return dataSource
    }
    onStringSubApprovalFlowList = (data) => {
        data.subApprovalFlowList = data.subApprovalFlowList.map(item => {

            const str = typeof item.conditions === 'string' ? item.conditions : JSON.stringify(item.conditions);
            const conditions = item.defaultSubApprovalFlow || item.conditions === 'DEFAULTFLOW' ? 'DEFAULTFLOW' : decodeURI(str);
            return {
                ...item,
                conditions,
            }
        });
        return data;

    }
    onChange = (dataSource) => {
        this.setState({ dataSource: _.cloneDeep(dataSource) })
    }
    onOk = () => {
        let dataSource = this.state.dataSource;
        dataSource = dataSource.type === 'condition' ? this.onStringSubApprovalFlowList(dataSource) : dataSource;
        this.updateData(dataSource)
    }
    onCancel = () => {
        this.props.history.goBack();
    }
    render() {
        const { flowType } = this.state;
        return (
            <div className={styles.container}>
                <ul className={styles.panleBox}>
                    <RadioGroup value={flowType} onChange={this.onChangeType}>
                        {flowGroup.map(item => <li className={styles.item} key={item.id}>
                            <RadioGroup.Radio value={item.id}>{item.name}</RadioGroup.Radio>
                            {item.id === flowType ? <item.com
                                dataSource={this.state.dataSource}
                                onChange={this.onChange}
                                changeNotifyNode={this.changeNotifyNode}
                                changeApprovalNode={this.changeApprovalNode}
                            ></item.com> : null}

                        </li>)}
                    </RadioGroup>

                    <div className={styles.btnGroup}
                    ><Button className={styles.button} onClick={this.onCancel} type="default">取消</Button>
                        <Button className={styles.button} onClick={this.onOk} loading={this.state.updateing} type="primary">确认</Button>
                    </div>
                </ul>

            </div>
        )
    }
}