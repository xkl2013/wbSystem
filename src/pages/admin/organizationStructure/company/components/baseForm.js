import React, {Component} from 'react';
import BIButton from '@/ant_components/BIButton';
import BIInput from '@/ant_components/BIInput';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BISelect from '@/ant_components/BISelect';
import {Form, Spin} from 'antd';
import styles from './index.less';
import SubmitButton from "@/components/SubmitButton";

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const {Option} = BISelect;
const {BIRangePicker} = BIDatePicker;

class BaseForm extends Component {
  constructor(props) {
    super(props);

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };
  onSelectPage = e => {
    console.log(e)
  };
  goback = () => {
    window.history.go(-1)
  };
  roleListFun = () => {
    const list = [{name: '一般纳税人', id: 1}, {name: '小额纳税人', id: 2}]
    return (
      <BISelect className={styles.commonWidthCls} placeholder="请选择" onSelect={this.onSelectPage}>
        {list.map(item => (
          <Option value={item.name} key={item.id}>
            {item.name}
          </Option>
        ))}
      </BISelect>
    );
  };
  labelTxt = (name1, name2) => {
    return <span className={styles.moreTxtCls}><i>{name1}</i><br/>{name2}</span>
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit} layout='inline' className={styles.wrap}>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label="公司名称">
                {getFieldDecorator('companyName', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '公司名称不能为空'
                  },
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="公司编码">
                {getFieldDecorator('companyCode', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="税务资质">
                {getFieldDecorator('companyTaxType', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(
                  this.roleListFun()
                )}
              </FormItem>
            </div>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label="纳说人识别号">
                {getFieldDecorator('companyTaxpayerNumber', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="编码简称">
                {getFieldDecorator('companyCodeShort', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="法人代表">
                {getFieldDecorator('companyLegalPerson', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label="公司类型">
                {getFieldDecorator('companyType', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="成立时间">
                {getFieldDecorator('companyCreatedAt', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label='注册资本'>
                {getFieldDecorator('companyRegisterCapital', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label={this.labelTxt('银行帐号', '(报销专用)')}>
                {getFieldDecorator('name5', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="开户行">
                {getFieldDecorator('name3', {
                  initialValue: '',
                  rules: [
                    {required: true,}
                  ],
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="注册地址">
                {getFieldDecorator('companyRegisterAddress', {
                  initialValue: '',
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label="办公地址">
                {getFieldDecorator('companyOfficeAddress', {
                  // initialValue: '',
                })(<BIInput className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
              <FormItem label="营业期限">
                {getFieldDecorator('companyBusinessFrom', {
                  // initialValue: '',
                })(<BIRangePicker
                  format={dateFormat} className={styles.commonWidthCls}/>)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
            </div>
          </div>
          <div className={styles.buttonWrap}>
            <FormItem>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <BIButton
                  onClick={this.goback}
                  className={styles.btnCls}
                >
                  取消
                </BIButton>
                <SubmitButton
                  htmlType="submit"
                  type="primary"
                  className={styles.btnCls}
                  // loading={submit}
                >
                  提交
                </SubmitButton>
              </div>
            </FormItem>
          </div>

        </Form>
      </Spin>
    );
  }
}

export default BaseForm;
