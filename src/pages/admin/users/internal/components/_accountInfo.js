import React, { Component } from 'react';
import styles from './index.less';
import BIInput from '@/ant_components/BIInput';
import { Form } from 'antd';
const FormItem = Form.Item;

export default class BaseForm extends Component {

    render() {
        const { getFieldDecorator,accountInfo={} } = this.props;
        return (
            <div className={styles.baseWrap}>
                <p className={styles.titleCls}>工资/社保帐号信息</p>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="银行名称">
                            {getFieldDecorator('employeeBankName', {
                                initialValue: accountInfo.employeeBankName,
                                rules: [{
                                    required: true,
                                    max:20,
                                },
                                ],
                            })(<BIInput placeholder='如：招商银行' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="开户行">
                            {getFieldDecorator('employeeBankAddress', {
                                initialValue: accountInfo.employeeBankAddress,
                                rules: [{
                                    required: true,max:30,},

                                ],
                            })(
                                <BIInput placeholder='请输入' className={styles.commonWidthCls} />
                            )}
                        </FormItem>
                    </div>

                    <div className={styles.itemCls}>
                        <FormItem label="联行行号">
                            {getFieldDecorator('employeeBankRelate', {
                                initialValue:accountInfo.employeeBankAddress ,
                                rules: [{max:30,}],
                            })(<BIInput placeholder='请输入' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>
            </div>
        );
    }
}
