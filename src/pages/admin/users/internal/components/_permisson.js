import React, { Component } from 'react';
import styles from './index.less';
import { Form,Radio } from 'antd';
const FormItem = Form.Item;

export default class Permission extends Component {
    render() {
        const { getFieldDecorator } = this.props;
        return (
            <div className={styles.baseWrap}>
                <p className={styles.titleCls}>访问权限</p>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                         <FormItem label="">
                            {getFieldDecorator('name13', {
                                initialValue: '',
                            })( <Radio.Group>
                                    <Radio value={1}>web</Radio>
                                    <Radio value={2}>App</Radio>
                              </Radio.Group>)}
                        </FormItem>
                    </div>

                </div>
            </div>
        );
    }
}
