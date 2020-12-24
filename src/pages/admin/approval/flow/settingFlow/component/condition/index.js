import React from 'react';
import { message } from 'antd';
import styles from './styles.less';
import ItemGroup from './component/conditionItems';
import SetVariable from './setVariable';
import { parseConditions, conditionTypes, defaultVariables, defaultVar } from '../_utils';
import _ from 'lodash';

export default class Condition extends React.Component {
    state = {
        isShowVariable: false,
        condtionsList: [],
        variableList: [],         // 全量变量
        selectedVariables: [],   // 选择的变量
        approvalFormFields: [],
        subApprovalFlowList: [],
    }
    componentDidMount() {
        this.initData()
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.nextProps)) {
            this.initData(nextProps.dataSource);
        }
    }
    initData = (dataSource = this.props.dataSource) => {
        this.initFormVariable(dataSource, () => {
            this.formaterData(dataSource);
        });


    }
    initFormVariable = (data = {}, callback) => {   //  获取全量变量
        const approvalForm = data.approvalForm || {};
        const approvalFormFields = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
        let variableList = approvalFormFields.filter(item => conditionTypes.includes(item.type));
        variableList = [...variableList, ...defaultVariables];
        this.setState({ variableList }, () => {
            callback && callback()
        })
    }
    initCondtions = (data) => {                        // 初始化变量条件
        return {
            fieldName: data.name,
            type: defaultVar.type,
            value: [],
            symbolId: defaultVar.id,
        }
    }
    /*
    * 初始化已选择变量
    * 涉及到默认审批人部门,一次如果state中有值就不在进行初始化,选用第一条子审批流
    */
    initSelectedVariable = (obj = {}) => {
        const { selectedVariables } = this.state;
        if (selectedVariables && selectedVariables.length) return selectedVariables;
        if (!obj) return [];
        const conditions = Array.isArray(obj.conditions) ? obj.conditions : [];
        const variableList = this.state.variableList || [];
        return conditions.map(ls => (variableList.find(item => item.name === ls.fieldName) || {}));
    }
    /*
   * 初始化审批流
   */
    initSubApprovalFlow = (isDefault) => {
        const { groupId, id, name, flowMark, remark, status } = this.props.dataSource || {};
        return {
            groupId,
            name,
            flowMark,
            remark,
            status,
            parentId: id,
            conditions: isDefault ? 'DEFAULTFLOW' : this.addCondition(),
            approvalFlowNodeList: [],
            noticerList: [],
            defaultSubApprovalFlow: isDefault ? 1 : 0,
        }
    }
    /*
    * 格式化自审批流数据 // "conditions":"DEFAULTFLOW" 为默认审批流,不进行解析,处理成[],再添加字段defaultSubApprovalFlow:1
    */
    formaterData = (data = {}) => {
        let subApprovalFlowList = data.subApprovalFlowList || [];
        //判断集合中是否有默认审批流,如果没有,插入一条默认
        subApprovalFlowList = subApprovalFlowList.map(ls => {
            let isDefaultSubApprovalFlow = ls.defaultSubApprovalFlow || ls.conditions === 'DEFAULTFLOW' ? 1 : 0;
            return {
                ...ls,
                conditions: isDefaultSubApprovalFlow ? [] : _.cloneDeep(parseConditions(ls.conditions)),
                defaultSubApprovalFlow: isDefaultSubApprovalFlow,
            }
        });
        const hasDefaultSubApprovalFlow = subApprovalFlowList.find(ls => ls.defaultSubApprovalFlow);
        subApprovalFlowList = !hasDefaultSubApprovalFlow ? subApprovalFlowList.concat(this.initSubApprovalFlow(true)) : subApprovalFlowList;
        const selectedVariables = this.initSelectedVariable(subApprovalFlowList[0]);
        this.setState({ subApprovalFlowList: this.onSortSubApprovalFlow(subApprovalFlowList), selectedVariables: selectedVariables });
    }
    /*
   * 修改选择变量
   */
    changeVariable = (selectedVariables) => {
        this.setState({ selectedVariables });
    }
    /*
   * 增加默认审批流.每一个条件审批都必须包含
   */
    addDefaultSubApprovalFlow = () => {
        const instance = this.initSubApprovalFlow(true);
        this.onChangeSubApprovalFlow(instance);
    }
    /*
  * 更新审批流.每一个条件审批都必须包含
  */
    updateSubApprovalFlow = (isUpdateNode) => {
        let subApprovalFlowList = this.state.subApprovalFlowList || [];
        let newList = []
        if (isUpdateNode) {
            newList.push(this.initSubApprovalFlow(true));
        } else {
            newList = subApprovalFlowList.map(item => ({
                ...item,
                conditions: this.updateCondition(item.conditions)
            }));
        }
        this.onChangeSubApprovalFlow(newList)
    }
    /*
 * 新增审批流
 * 每个审批流里默认有一条审批,一次新增数量应减一
 */
    addSubApprovalFlow = () => {
        let subApprovalFlowList = this.state.subApprovalFlowList;
        const instance = this.initSubApprovalFlow();
        subApprovalFlowList = subApprovalFlowList.concat(instance)
        message.success(`新增条件  ${subApprovalFlowList.length - 1}  成功,请设置条件`);
        this.onChangeSubApprovalFlow(this.onSortSubApprovalFlow(subApprovalFlowList));
    }
    /*
* 变量弹框确认
*/
    setVariable = (e) => {
        e.preventDefault();
        const instance = this.conMdel.getInstance();
        let subApprovalFlowList = this.state.subApprovalFlowList;
        instance.onSubmit && instance.onSubmit((selectedVariables) => {
            //判断设置的变量是否是发生了变化,如果发生变化需要更新审批流信息
            if (_.isEqual(selectedVariables, this.state.selectedVariables)) {
                this.setState({ isShowVariable: false, selectedVariables });
                return;
            }
            this.setState({ isShowVariable: false, selectedVariables }, () => {
                this.updateSubApprovalFlow(false);

            });


        });
    }
    /*
* 为审批流里新增条件 
*/
    addCondition = () => {
        const selectedVariables = this.state.selectedVariables || [];
        if (!Array.isArray(selectedVariables) || !selectedVariables.length) return []
        return selectedVariables.map(item => this.initCondtions(item));
    }
    /*
* 更新审批流条件 
*/
    updateCondition = (data = []) => {
        const conditions = Array.isArray(data) ? data : []
        const selectedVariables = this.state.selectedVariables || [];
        if (!Array.isArray(selectedVariables) || !selectedVariables.length) return []
        return selectedVariables.map(item => {
            const currentObj = conditions.find(ls => ls.fieldName === item.name);
            return currentObj ? currentObj : this.initCondtions(item)
        });
    }
    /*
* 排序审批流,默认审批在最后;
*/
    onSortSubApprovalFlow = (data) => {
        const defaultSubData = data.splice(data.findIndex(ls => ls.defaultSubApprovalFlow), 1);
        return [...data, ...defaultSubData];
    }
    /*
    * 更改审批流 
 */
    onChangeSubApprovalFlow = (data) => {
        const dataSource = this.props.dataSource;
        const subApprovalFlowList = _.cloneDeep(data);
        dataSource.subApprovalFlowList = subApprovalFlowList;
        this.setState({ subApprovalFlowList })
        this.onChange(dataSource);
    }
    onChange = (data) => {
        this.props.onChange && this.props.onChange(data)
    }
    render() {
        const { isShowVariable } = this.state;
        return (
            <>
                <div className={styles.container}>
                    <div className={styles.settingBox}>
                        <span onClick={this.addSubApprovalFlow}>
                            添加条件
                    </span>
                        <span onClick={() => { this.setState({ isShowVariable: true }) }}>设置变量</span>
                    </div>

                    <ItemGroup
                        {...this.props}
                        onChange={this.onChange}
                        onChangeSubApprovalFlow={this.onChangeSubApprovalFlow}
                        ref={dom => this.itemGroup = dom}
                        selectedVariableList={this.state.selectedVariables}
                        variableList={this.state.variableList}
                        dataSource={this.props.dataSource}
                        subApprovalFlowList={this.state.subApprovalFlowList}
                    />


                </div>
                {isShowVariable ? <SetVariable
                    ref={dom => this.conMdel = dom}
                    value={this.state.selectedVariables}
                    variableList={this.state.variableList}
                    changeVariable={this.changeVariable}
                    visible={isShowVariable}
                    title="设置变量"
                    onOk={this.setVariable}
                    onCancel={() => { this.setState({ isShowVariable: false }) }} /> : null}
            </>
        )
    }
}
