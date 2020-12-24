import React, {Component} from 'react';
import BIButton from '@/ant_components/BIButton';
import AccountInfo from './_accountInfo';
import BaseInfo from './_baseInfo';
import WorkInfo from './_workInfo';
import PermissionInfo from './_permisson';
import {Form, Spin} from 'antd';
import styles from './index.less';
import SubmitButton from "@/components/SubmitButton";

const FormItem = Form.Item;

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
  goback = () => {
    window.history.go(-1)
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {params: {baseInfo}} = this.props;
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit} layout='inline' className={styles.wrap}>
          <BaseInfo getFieldDecorator={getFieldDecorator} baseInfo={baseInfo}/>
          <AccountInfo getFieldDecorator={getFieldDecorator}/>
          <WorkInfo getFieldDecorator={getFieldDecorator}/>
          <PermissionInfo getFieldDecorator={getFieldDecorator}/>
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
