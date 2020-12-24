import React from 'react';
import { formConfig } from '@/components/General/config';
import BISelect from '@/ant_components/BISelect';
import { operators } from '../../../../_utils';
import styles from './conditions.less';



export default class extends React.Component {
    state = {
        value: {},
        defaultSymbol: 'CC_3',
    }
    checkoutFormItem = (item, { value, nodeType, label }) => {
        let newVal = ['-', '+'].includes(value) ? undefined : value;
        const Dom = formConfig[item.type];
        if (Dom === undefined) return null;
        const options = item.approvalFormFieldValues || [];
        const selfAttr = Dom.componentAttr ? Dom.componentAttr(item) : {};
        const comAttr = {
            ...selfAttr,
            onChange: (val) => {
                const newValue = Dom.formatter ? Dom.formatter(val, item) : val;
                this.onChangeNode(newValue, nodeType);
            },
            value: isNaN(newVal) ? newVal : Number(newVal),
            style: { width: '100%' },
            placeholder: item.fieldMessage || `${Dom.placeholder}${item.title || ''}`
        }
        switch (item.type.toLocaleLowerCase()) {
            case 'select':
                return <Dom.component {...comAttr} key={item.name} style={{ width: '100%' }}>{options.map(ls => <Dom.component.Option value={ls.fieldValueValue} key={ls.fieldValueValue}>{ls.fieldValueName}</Dom.component.Option>)}</Dom.component>
            case 'radio':
                return <Dom.component {...comAttr} key={item.name}>{options.map(ls => <Dom.component.Radio value={ls.fieldValueValue} key={ls.fieldValueValue}>{ls.fieldValueName}</Dom.component.Radio>)}</Dom.component>
            case 'checkbox':
                return <Dom.component {...comAttr} key={item.name}>{options.map(ls => <Dom.component.Checkbox value={ls.fieldValueValue} key={ls.fieldValueValue}>{ls.fieldValueName}</Dom.component.Checkbox>)}</Dom.component>
            case 'department':
                const partValue = Dom.parser ? Dom.parser({ value: comAttr.value, name: label }) : comAttr.value;
                return <Dom.component {...comAttr} value={partValue} key={item.name}>{options.map(ls => <Dom.component.Checkbox value={ls.fieldValueValue} key={ls.fieldValueValue}>{ls.fieldValueName}</Dom.component.Checkbox>)}</Dom.component>
            default:
                return <Dom.component {...comAttr} />
        }
    }
    onChangeNode = (val, nodeType) => {
        let value = this.props.value || {};
        let nodeValue = value.value || [];
        let nodeLabel = value.nodeLabel || nodeValue || [];
        let tempObj = Array.isArray(val) && val.length ? val[0] : { value: val, name: val };
        if (nodeType === 2) {
            nodeValue = nodeValue.length < 2 ? ['-', tempObj.value] : [nodeValue[0], tempObj.value];
            nodeLabel = nodeValue.length < 2 ? ['-', tempObj.name] : [nodeValue[0], tempObj.name];
        } else {
            switch (value.symbolId) {
                case 'OO_1':
                    nodeValue = ['-', tempObj.value];
                    nodeLabel = ['-', tempObj.name];
                    break;
                case 'OC_2':
                    nodeValue = ['-', tempObj.value];
                    nodeLabel = ['-', tempObj.name];
                    break;
                case 'CC_3':
                    nodeValue = [tempObj.value, tempObj.value];
                    nodeLabel = [tempObj.name, tempObj.name];
                    break;
                case 'OO_4':
                    nodeValue = [tempObj.value, '+'];
                    nodeLabel = [tempObj.name, '+'];
                    break;
                case 'CO_5':
                    nodeValue = [tempObj.value, '+'];
                    nodeLabel = [tempObj.name, '+'];
                    break;
                case 'CC_6':
                    nodeValue = [tempObj.value, nodeValue[1] || '+'];
                    nodeLabel = [tempObj.name, nodeLabel[1] || '+'];

                    break;
                case 'CO_7':
                    nodeValue = [tempObj.value, nodeValue[1] || '+'];
                    nodeLabel = [tempObj.name, nodeLabel[1] || '+'];
                    break;
                case 'OC_8':
                    nodeValue = [tempObj.value, nodeValue[1] || '+'];
                    nodeLabel = [tempObj.name, nodeLabel[1] || '+'];
                    break
                case 'in_9':
                    nodeValue = [tempObj.value, nodeValue[1] || '+'];
                    nodeLabel = [tempObj.name, nodeLabel[1] || '+'];
                    break
                case 'notin_10':
                    nodeValue = [tempObj.value, nodeValue[1] || '+'];
                    nodeLabel = [tempObj.name, nodeLabel[1] || '+'];
                    break

            }
        }
        value = { ...value, value: nodeValue, label: nodeLabel };
        this.onChange(value)
    }
    onChangeVar = (val) => {
        let value = this.props.value || {};
        const varObj = operators.find(ls => ls.id === val);
        value = { ...value, symbolId: varObj.id, type: varObj.type, value: [] };
        this.onChange(value)
    }
    getVarValue = () => {
        const value = this.props.value || {};
        const symbolId = value.symbolId || this.state.defaultSymbol;
        return operators.find(ls => ls.id === symbolId) || {};
    }
    onChange = (data) => {
        this.props.onChange && this.props.onChange(data, this.props.fieldName);
    }
    renderVarNode = () => {
        const data = this.props.data || {};
        const varObj = this.getVarValue();
        const itemValue = this.props.value || {};
        let comValue = Array.isArray(itemValue.value) ? itemValue.value : [];
        let comLabel = Array.isArray(itemValue.label) ? itemValue.label : [];
        comValue = comValue.filter(ls => !['-', '+'].includes(ls));
        comLabel = comLabel.filter(ls => !['-', '+'].includes(ls));
        return (
            <div className={styles.varItem}>
                {this.checkoutFormItem(data, { value: comValue[0], nodeType: 1, label: comLabel[1] })}
                {varObj.nodeCount > 1 ? <>-{this.checkoutFormItem(data, { value: comValue[1], nodeType: 2, label: comLabel[2] })}</> : null}

            </div>
        );
    }

    render() {

        const value = this.props.value || {};
        return (
            <div className={styles.box}>
                <span className={styles.varBox}> <BISelect
                    style={{ width: '200px' }}
                    onChange={this.onChangeVar}
                    getPopupContainer={() => document.getElementById('com_generalForm')}
                    value={value.symbolId || this.state.defaultSymbol}>
                    {operators.map((item, num) => (<BISelect.Option value={item.id} key={item.id}>{item.name}</BISelect.Option>))}
                </BISelect></span>
                <span className={styles.varBox}>
                    {this.renderVarNode()}
                </span>
            </div>
        )


    }
}