/**
 *@author   zhangwenshuai
 *@date     2019-08-02 16:29
 **/
import React, {PureComponent} from 'react';
import BISelect from "@/ant_components/BISelect";
import styles from "@/components/FormView/index.less";
import BIRadio from "@/ant_components/BIRadio";
import BICheckbox from "@/ant_components/BICheckbox";
import BIDatePicker from "@/ant_components/BIDatePicker";
import OrgTreeSelect from "@/components/orgTreeSelect";
import BIInput from "@/ant_components/BIInput";
import BITable from "@/ant_components/BITable";
import AssociationSearch from "@/components/associationSearch";
import AssociationSearchFilter from "@/components/associationSearchFilter";
import EmailInput from "@/components/EmailInput";
import SelectCity from "@/components/selectCitys";
import BICascader from "@/ant_components/BICascader/FormCascader";
import FormTable from "@/components/FormTable";
import TipInput from "@/components/TipInput";
import NumberRatio from "@/components/NumberRatio";
import BIInputNumer from "@/ant_components/BIInputNumber";
import Upload from "@/components/upload";

export default class Item extends PureComponent {
    constructor(props) {
        super(props)
    }
    
    onChange = (id, key, val, force = false, ops) => {
        const {componentAttr = {}} = this.props.col;
        const {onChange} = this.props;
        if (componentAttr.onChange) {
            componentAttr.onChange(id, key, val, force, ops)
        } else {
            onChange(id, key, val, force, ops)
        }
    }
    
    render() {
        const {col, record, form} = this.props;
        const value = col.setFormat ? col.setFormat(this.props.value, form) : this.props.value;
        col.componentAttr = col.componentAttr || {};
        let disabled = typeof col.componentAttr.disabled === 'function' ? col.componentAttr.disabled(form) : col.componentAttr.disabled;
        switch (col.type) {
            case 'select':
                return (
                    <BISelect {...col.componentAttr} value={value} disabled={disabled}
                              onChange={(e) => this.onChange(record.key, col.key, e)}>
                        {col.options.map(option => (
                            <BISelect.Option value={option.id} key={option.id}>
                                {option.name}
                            </BISelect.Option>
                        ))}
                    </BISelect>
                )
            case 'radio':
                return (
                    <BIRadio {...col.componentAttr} value={value} disabled={disabled}
                             onChange={(e) => this.onChange(record.key, col.key, e.target.value)}>
                        {col.options.map(option => (
                            <BIRadio.Radio value={option.id} key={option.id}>
                                {option.name}
                            </BIRadio.Radio>
                        ))}
                    </BIRadio>
                )
            case 'checkbox':
                return (
                    <BICheckbox {...col.componentAttr} value={value} disabled={disabled}
                                onChange={(e) => this.onChange(record.key, col.key, e)}>
                        {col.options.map(option => (
                            <BICheckbox.Checkbox value={option.id} key={option.id}>
                                {option.name}
                            </BICheckbox.Checkbox>
                        ))}
                    </BICheckbox>
                )
            case 'date':
                return (
                    <BIDatePicker {...col.componentAttr} value={value} disabled={disabled}
                                  onChange={(e) => this.onChange(record.key, col.key, e)}/>
                )
            case 'daterange':
                return (
                    <BIDatePicker.BIRangePicker {...col.componentAttr} value={value} disabled={disabled}
                                                onChange={(e) => this.onChange(record.key, col.key, e)}/>
                )
            case 'orgtree':
                return (
                    <OrgTreeSelect mode="org" {...col.componentAttr} value={value} disabled={disabled}
                                   onChange={(e) => this.onChange(record.key, col.key, e)}/>
                )
            case 'textarea':
                return (
                    <BIInput.TextArea {...col.componentAttr} value={value} disabled={disabled}
                                      onChange={(e) => this.onChange(record.key, col.key, e.target.value)}/>
                )
            case 'associationSearch':
                return (
                    <AssociationSearch {...col.componentAttr} disabled={disabled}
                                       request={col.componentAttr.request.bind(this, record)}
                                       value={value != undefined ? col.setFormat(value, form) : value}
                                       onChange={(e) => {
                                           const val = e || {};
                                           return this.onChange(record.key, col.key, col.getFormat(val, form), true, val)
                                       }}>{col.selfCom ? col.selfCom : null}</AssociationSearch>
                );
            case 'associationSearchFilter':
                return (
                    <AssociationSearchFilter
                        {...col.componentAttr} disabled={disabled}
                        request={col.componentAttr.request.bind(this, record)}
                        value={value != undefined ? col.setFormat(value, form) : value}
                        onChange={(e, ops) => {
                            if (!e || !e.value) {
                                this.onChange(record.key, col.key, col.getFormat(e, {}), true, ops)
                            } else {
                                this.onChange(record.key, col.key, col.getFormat(e, form), true, ops)
                            }
                        }}>{col.selfCom ? col.selfCom : null}
                    </AssociationSearchFilter>
                );
            case 'selectCity':
                return <SelectCity {...col.componentAttr} disabled={disabled}
                                   value={value != undefined ? col.setFormat(value, form) : value}
                                   onChange={(e) => this.onChange(record.key, col.key, col.getFormat(e, form), true)}>{col.selfCom ? col.selfCom : null}</SelectCity>
            case 'custom':
                return col.component || (col.render && col.render());
            case 'inputNumber':
                return (
                    <BIInputNumer {...col.componentAttr} disabled={disabled} onChange={(e) => this.onChange(record.key, col.key, e)}/>
                )
            default:
                return (
                    <BIInput {...col.componentAttr} value={value} disabled={disabled}
                             onChange={(e) => this.onChange(record.key, col.key, e.target.value)}/>
                )
        }
    }
}
