import React from 'react';
import styles from './styles.less';
import {Form} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import BIInput from '@/ant_components/BIInput';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import {STAFF_STATUS, EMPLOY_TYPE, JOB_POSITION, RESIDENCS_TYPE, SEX_TYPE} from '@/utils/enum';
import FormFilterButton from '@/components/form-FilterButton2';
import OrgTreeSelect from '@/components/orgTreeSelect';
import _ from 'lodash';
import moment from 'moment';

const {BIRangePicker} = BIDatePicker;

interface Props extends FormComponentProps {
  form: any,
  onChangeParams: Function,
  params: any,
}

interface State {
}

const formJson = [[{
  key: 'userName',
  initValue: undefined,
  component: OrgTreeSelect,
  componentAttr: {
    className: styles.input,
    placeholder: '请输入名字',
    mode: 'user'
  }
}, {
  key: 'employeePosition',
  initValue: undefined,
  component: BIInput,
  componentAttr: {
    className: styles.input,
    placeholder: '请输入岗位',
  }
}, {
  key: 'userDepartmentId',
  initValue: undefined,
  component: OrgTreeSelect,
  componentAttr: {
    className: styles.input,
    placeholder: '请输入部门',
    mode: 'org'
  },
  componentChildren: null,
}, {}], [{
  key: 'employeeContractStart',
  initValue: undefined,
  component: BIRangePicker,
  componentAttr: {
    className: styles.input,
    placeholder: ['合同开始开始日期', '合同开始结束日期'],
  }

}, {
  key: 'employeeContractEnd',
  initValue: undefined,
  component: BIRangePicker,
  componentAttr: {
    className: styles.input,
    placeholder: ['合同结束开始日期', '合同结束结束日期'],
  }

}, {
  key: 'employeeEmploymentDate',
  initValue: undefined,
  component: BIRangePicker,
  componentAttr: {
    className: styles.input,
    placeholder: ['入职开始日期', '入职结束日期'],
  }

}, {
  key: 'employeeLeaveDate',
  initValue: undefined,
  component: BIRangePicker,
  componentAttr: {
    className: styles.input,
    placeholder: ['离职开始日期', '离职结束日期'],
  },
  componentChildren: null,

}]]

function formatUser(obj: any) {
  let name = obj.label;
  if (typeof name != 'string') {
    name = obj.label.props.children
  }
  return {id: obj.value, name};
}

function formatArr(arr: any, options: any) {
  let temp: any[] = [];
  arr.map((key: any) => {
    temp.push({id: key, name: options.find((item: any) => item.id == key).name})
  })
  return temp;
}

function formatForm(formData: any) {
  // console.log(formData)
  let result: any[] = [];
  Object.keys(formData).map((key: string) => {
    if (!formData[key]) {
      return;
    }
    switch (key) {
      case 'userName':
      case 'userDepartmentId':
        result.push({key, value: formatUser(formData[key])});
        break;
      case 'employeeStatusList':
        result.push({key, value: formatArr(formData[key], STAFF_STATUS)});
        break;
      case 'employeeEmploymentFormList':
        result.push({key, value: formatArr(formData[key], EMPLOY_TYPE)});
        break;
      case 'employeePositionLevelList':
        result.push({key, value: formatArr(formData[key], JOB_POSITION)});
        break;
      case 'employeeHouseholdTypeList':
        result.push({key, value: formatArr(formData[key], RESIDENCS_TYPE)});
        break;
      case 'userGenderList':
        result.push({key, value: formatArr(formData[key], SEX_TYPE)});
        break;
      case 'employeeContractStart':
      case 'employeeContractEnd':
      case 'employeeEmploymentDate':
      case 'employeeLeaveDate':
        let temp: any[] = [];
        formData[key].map((time: any, index: number) => {
          temp.push({id: index, name: moment(time).format('YYYY-MM-DD')})
        })
        result.push({key, value: temp})
        break;
      default:
        result.push({key, value: formData[key]})
        break;
    }
  })
  return result;
}

function removeItem(formData: any, removeItem: any) {
  // console.log(formData)
  let data = _.assign({}, formData);
  let item = data[removeItem.key];
  if (Array.isArray(item)) {
    if (moment.isMoment(item[0])) {
      data[removeItem.key] = undefined;
      // item.splice(removeItem.id, 1);
    } else {
      let index = item.findIndex((t: any) => t == removeItem.id);
      if (index > -1) {
        item.splice(index, 1);
      }
    }
  } else {
    data[removeItem.key] = undefined;
  }
  return data;
}

class FilterForm extends React.Component<Props, State> {

  onSubmit = () => {
    this.props.form.validateFields((err: any, fieldsValue: any) => {
      if (err) return;
      this.onChangeParams(fieldsValue);
    })
  }
  onResert = () => {
    console.log('重置')
    if (this.props.onChangeParams) {
      this.props.onChangeParams({})
    }
  }
  onRemoveItem = (values: any) => {
    const {params} = this.props;
    let newData = removeItem(params, values);
    if (this.props.onChangeParams) {
      this.props.onChangeParams(newData)
    }
  }
  public onChangeParams = (values: any) => {
    if (this.props.onChangeParams) {
      this.props.onChangeParams(values)
    }
  }
  public renderInputitem = () => {
    const {getFieldDecorator} = this.props.form;
    return formJson.map((item: any[], index: number) => {
      return (
        <div className={styles.inputRowWrap} key={index}>
          {item.map(((ls: any, num: number) => {
            const {component, key, initValue, componentChildren, componentAttr = {}, ...others} = ls;
            return (<span className={styles.inputItemCls} key={key + num}>
              {!ls.component ? null : getFieldDecorator(ls.key, {
                initialValue: ls.initValue,
              })(
                <ls.component key={key + ls.id} className={ls.className}
                              placeholder={ls.placeholder || '请输入'} {...componentAttr} {...others}>
                  {componentChildren ? componentChildren : null}
                </ls.component>
              )}
            </span>)
          }))}
        </div>
      )
    })

  }

  public render() {
    const { getFieldDecorator,getFieldsValue } = this.props.form;
    return (
      <div className={styles.formCotainer}>
        <Form
          layout="inline"
          className="ant-advanced-search-form"
        >
          {this.renderInputitem()}
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>员工状态:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('employeeStatusList', {
                initialValue: undefined,
              })(
                <BICheckbox name="radiogroup" onChange={(value: any) => {
                  console.log(value);
                }}>
                  {STAFF_STATUS.map((item: any) => <BICheckbox.Checkbox key={item.id} value={item.id}
                                                                        className={styles.radio}>{item.name}</BICheckbox.Checkbox>)}
                </BICheckbox>
              )}
            </span>
          </div>
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>聘用形式:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('employeeEmploymentFormList', {
                initialValue: undefined,
              })(
                <BICheckbox name="radiogroup">
                  {EMPLOY_TYPE.map((item: any) => <BICheckbox.Checkbox key={item.id} value={item.id}
                                                                       className={styles.radio}>{item.name}</BICheckbox.Checkbox>)}
                </BICheckbox>
              )}
            </span>

          </div>
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>职别:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('employeePositionLevelList', {
                initialValue: undefined,
              })(
                <BICheckbox name="radiogroup">
                  {JOB_POSITION.map((item: any) => <BICheckbox.Checkbox key={item.id} value={item.id}
                                                                        className={styles.radio}>{item.name}</BICheckbox.Checkbox>)}
                </BICheckbox>
              )}
            </span>

          </div>
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>户口性质:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('employeeHouseholdTypeList', {
                initialValue: undefined,
              })(
                <BICheckbox name="radiogroup">
                  {RESIDENCS_TYPE.map((item: any) => <BICheckbox.Checkbox key={item.id} value={item.id}
                                                                          className={styles.radio}>{item.name}</BICheckbox.Checkbox>)}
                </BICheckbox>
              )}
            </span>

          </div>
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>性别:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('userGenderList', {
                initialValue: undefined,
              })(
                <BICheckbox name="radiogroup">
                  {SEX_TYPE.map((item: any) => <BICheckbox.Checkbox key={item.id} value={item.id}
                                                                    className={styles.radio}>{item.name}</BICheckbox.Checkbox>)}
                </BICheckbox>
              )}
            </span>
          </div>
          <div className={styles.selectRowWrap}>
            <span className={styles.itemLabel}>年龄:</span>
            <span className={styles.checkboxGroup}>
              {getFieldDecorator('ageMin', {
                initialValue: undefined,
              })(
                <BIInput className={styles.ageInput} placeholder='请输入'/>
              )}
              <span className={styles.line}></span>
              {getFieldDecorator('ageMax', {
                initialValue: undefined,
              })(
                <BIInput className={styles.ageInput} placeholder='请输入'/>
              )}

            </span>
          </div>
        </Form>
        <div>
          <FormFilterButton onSubmit={this.onSubmit} onResert={this.onResert} onRemoveItem={this.onRemoveItem}
                            chooseItems={formatForm(getFieldsValue())}/>
        </div>
      </div>
    )
  }
}
function onFieldsChange(props:any, fields:any) {
  if (props.onChange) {
    const params:any = {}
    Object.keys(fields).forEach(item => {
      const { value } = fields[item];
      params[item] = value
    })
    props.onChange(params);
  }
}
function mapPropsToFields(props: any) {
  const {params} = props
  const returnObj: any = {};
  if (!params || typeof params !== 'object') return returnObj;
  Object.keys(params).forEach(item => {
    let value = params[item];
    if (Array.isArray(params[item])) {
      value = params[item].slice();
    }
    returnObj[item] = Form.createFormField({
      value
    });
  })
  return returnObj
}


function onValuesChange(props: any, changedValues: any, allValues: any) {
  props.formChange(allValues)
}

export default Form.create<Props>({name: 'horizontal_login', mapPropsToFields, onValuesChange})(FilterForm);
