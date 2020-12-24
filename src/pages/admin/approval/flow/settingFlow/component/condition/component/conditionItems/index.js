import React from 'react';
import commonStyle from '../../../common.less';
import Item from './item';
import { message } from 'antd';
import _ from 'lodash';


export default class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupData: [],
        }
    }
    onChangePriority = (current, next) => {              //移动条件
        let { subApprovalFlowList = [] } = this.props;
        const currentObj = subApprovalFlowList[current];
        subApprovalFlowList[current] = null;
        if (next >= current) {
            subApprovalFlowList.splice(next, 1, subApprovalFlowList[next], currentObj);
        } else {
            subApprovalFlowList.splice(next, 1, currentObj, subApprovalFlowList[next]);
        }
        subApprovalFlowList = subApprovalFlowList.filter(item => item);
        this.onChange(subApprovalFlowList);
    }
    onCoopy = (index) => {                              // 复制数据
        let { subApprovalFlowList = [] } = this.props;
        const instanceObj = subApprovalFlowList[index];
        // 处理节点重复,需特殊处理审批人与知会人
        const copyObj = {
            ...instanceObj,
            id: null,
            approvalFlowNodeList: (instanceObj.approvalFlowNodeList || []).map(item => ({ ...item, id: null })),
            noticerList: (instanceObj.noticerList || []).map(item => ({ ...item, id: null })),
        };
        subApprovalFlowList.splice(index, 1, instanceObj, copyObj);
        message.success('条件复制成功')
        this.onChange(subApprovalFlowList);
    }
    onDelete = (index) => {                               // 删除数据
        let { subApprovalFlowList = [] } = this.props;
        subApprovalFlowList.splice(index, 1);
        this.onChange(subApprovalFlowList);
    }
    onChangeApprovalNode = (data, index) => {   //设置审批节点
        const subApprovalFlowList = this.props.subApprovalFlowList || [];
        subApprovalFlowList[index].approvalFlowNodeList = data;
        this.onChange(subApprovalFlowList);
    }
    onChangeNoticeNode = (data, index) => {    // 设置知会人节点
        const subApprovalFlowList = this.props.subApprovalFlowList || [];
        subApprovalFlowList[index].noticerList = data;
        this.onChange(subApprovalFlowList);
    }
    onChangeCondition = (data, index) => {         // 修改条件
        const subApprovalFlowList = this.props.subApprovalFlowList || [];
        subApprovalFlowList[index].conditions = data;
        this.onChange(subApprovalFlowList);
    }
    onChange = (data) => {
        this.props.onChangeSubApprovalFlow && this.props.onChangeSubApprovalFlow(data);
    }

    render() {
        const { subApprovalFlowList = [] } = this.props;
        return (
            <div>
                {subApprovalFlowList.map((item, index) => (
                    <Item
                        key={index}
                        onChangeApprovalNode={this.onChangeApprovalNode}
                        onChangeNoticeNode={this.onChangeNoticeNode}
                        onChangePriority={this.onChangePriority}
                        onChangeCondition={this.onChangeCondition}
                        onCoopy={this.onCoopy}
                        onDelete={this.onDelete}
                        groupData={subApprovalFlowList}
                        dataSource={item}
                        conditions={item.conditions || []}
                        variableList={this.props.variableList}
                        selectedVariableList={this.props.selectedVariableList}
                        index={index} />
                ))}
            </div>
        )
    }
}
