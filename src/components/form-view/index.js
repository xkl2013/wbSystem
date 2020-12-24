import React, { Component } from 'react';
import BIForm from '@/ant_components/BIForm';
import BISelect from '@/ant_components/BISelect';
import BIInput from '@/ant_components/BIInput';
import BIButton from "@/ant_components/BIButton";
import styles from './index.less'
import { Form, DatePicker, Radio, Checkbox } from "antd";
import OrgTreeSelect from '@/components/orgTreeSelect';

const FormItem = Form.Item;
const getColClass = function (cols) {
  let colClass = styles.colWrap;
  switch (cols) {
    case 2:
      colClass += ' ' + styles.half;
      break;
    case 3:
      colClass += ' ' + styles.three;
      break;
    case 4:
      colClass += ' ' + styles.four;
      break;
    case 5:
      colClass += ' ' + styles.five;
      break;
    default:
      break;
  }
  return colClass;
}

class FormView extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { formData } = this.props;
    this._initForm(formData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formData != this.props.formData) {
      this._initForm(nextProps.formData)
    }
  }

  _initForm = (formData) => {
    if (!formData) {
      return
    }
    const { setFieldsValue, resetFields } = this.props.form;
    resetFields();
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        let temp = {};
        temp[key] = formData[key];
        setFieldsValue(temp);
      }
    }
  }

  renderItem = (col) => {
    switch (col.type) {
      case 'select':
        return (
          <BISelect placeholder={col.placeholder || "请选择"} className={styles.itemContent} disabled={col.disabled}>
            {col.options.map(option => (
              <BISelect.Option value={option.id} key={option.id}>
                {option.name}
              </BISelect.Option>
            ))}
          </BISelect>
        )
      case 'selectMult':
        return (
          <BISelect className={styles.itemContent} mode="multiple" placeholder={col.placeholder || "请选择"}
            disabled={col.disabled}>
            {col.options.map(option => (
              <BISelect.Option value={option.id} key={option.id}>
                {option.name}
              </BISelect.Option>
            ))}
          </BISelect>
        )
      case 'radio':
        return (
          <Radio.Group className={styles.itemContent} disabled={col.disabled}>
            {col.options.map(option => (
              <Radio value={option.id} key={option.id}>
                {option.name}
              </Radio>
            ))}
          </Radio.Group>
        )
      case 'checkbox':
        return (
          <Checkbox.Group className={styles.itemContent} disabled={col.disabled}>
            {col.options.map(option => (
              <Checkbox value={option.id} key={option.id}>
                {option.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )
      case 'date':
        return (
          <DatePicker className={styles.itemContent} placeholder={col.placeholder} disabled={col.disabled} />
        )
      case 'datetime':
        return (
          <DatePicker className={styles.itemContent} showTime disabled={col.disabled} />
        )
      case 'daterange':
        return (
          <DatePicker.RangePicker className={styles.itemContent} disabled={col.disabled} />
        )
      case 'orgtree':
        return (
          <OrgTreeSelect className={styles.itemContent} disabled={col.disabled} mode="org" />
        )
      case 'usertree':
        return (
          <OrgTreeSelect className={styles.itemContent} disabled={col.disabled} mode="user" />
        )
      case 'custom':
        return col.render();
      default:
        return (
          <BIInput className={styles.itemContent} placeholder={col.placeholder} disabled={col.disabled} />
        )
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };
  handleCancel = e => {
    this.props.handleCancel();
  }
  renderLabel = (txt) => {
    return (
      <span className={styles.newLableCls}>
      {
          txt&&txt.length> 6 ? (
            <>
              <span className={styles.lineSpanCls}>{txt.slice(0,6)}</span><br/><span className={styles.lineSpanCls}>{txt.slice(6,txt.length)}</span>
            </>
          ):txt
        }

        {/* {
          txt&&txt.indexOf('/r') > -1 ? (
            <>
              <span className={styles.lineSpanCls}>{txt.split('/r')[0]}</span><br/><span className={styles.lineSpanCls}>{txt.split('/r')[1]}</span>
            </>
          ):txt
        } */}

      </span>

    )
  }
  render() {
    const {
      formItemLayout, cols, btnWrapStyle
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.wrap}>
        <BIForm className={styles.formWrap} {...formItemLayout} onSubmit={this.handleSubmit}>
          {
            cols.map((group, index) => {
              return (
                <div key={index} className={styles.groupWrap}>
                  {group.title && <div className={styles.groupTitle}>{group.title}</div>}
                  {
                    group.columns && group.columns.map((row, index) => {
                      let colClass = getColClass(row.length);
                      return (
                        <div className={styles.rowWrap} key={index}>
                          {
                            row.map((col, index) => {
                              if (!col.key) {
                                return null;
                              }
                              return (
                                <div className={colClass} key={index}>
                                  <FormItem label={this.renderLabel(col.label)} className={styles.colItem}>
                                    {getFieldDecorator(col.key, col.checkOption)(
                                      this.renderItem(col)
                                    )}
                                  </FormItem>
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
          <div className={styles.buttonWrap} style={btnWrapStyle}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <BIButton
                onClick={this.handleCancel}
                className={styles.btnCls}
              >
                取消
              </BIButton>
              <BIButton
                htmlType="submit"
                type="primary"
                className={styles.btnCls}
              // loading={submit}
              >
                提交
              </BIButton>
            </div>
          </div>
        </BIForm>
      </div>
    )
  }
}

export default FormView;
