import React, { Component } from 'react';
import BIButton from '@/ant_components/BIButton';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import { Form, Spin } from 'antd';
import styles from './index.less';
import SubmitButton from "@/components/SubmitButton";

const FormItem = Form.Item;
const { Option } = BISelect;

class BaseForm extends Component {
  constructor(props) {
    super(props);

  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  };
  onSelectPage = e => {
    console.log(e)
  };
  goback= () => {
    window.history.go(-1)
  };
  roleListFun = () => {
    const list =[{name: 'dhjfa',id:1},{name: 'dhjcevefa',id:2},{name: 'ewq',id:3}]
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
    return <span className={styles.moreTxtCls}><i>{name1}</i><br />{name2}</span>
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit} layout='inline' className={styles.wrap}>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
              <FormItem label="姓名">
                {getFieldDecorator('name13', {
                  initialValue: '',
                  rules: [{required: true}],
                })(<BIInput className={styles.commonWidthCls} />)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>
            </div>
            <div className={styles.itemCls}>

            </div>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.itemCls}>
            <FormItem label="手机号">
                {getFieldDecorator('name12', {
                  initialValue: '',
                  rules: [
                    { required: true, }
                  ],
                })(<BIInput className={styles.commonWidthCls} />)}
              </FormItem>
            </div>
            <div className={styles.itemCls}>

            </div>
            <div className={styles.itemCls}>

            </div>
          </div>

          <div className={styles.buttonWrap}>
            <FormItem>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
