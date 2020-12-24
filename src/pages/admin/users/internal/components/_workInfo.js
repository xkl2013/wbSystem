import React, { Component } from 'react';
import styles from './index.less';
import BIInput from '@/ant_components/BIInput';
import { Form } from 'antd';
const FormItem = Form.Item;

export default class BaseForm extends Component {
   
    render(){ 
        const { getFieldDecorator } = this.props;
    return (
        <div className={styles.baseWrap}>
        <p className={styles.titleCls}>岗位信息</p>
            <div className={styles.rowWrap}>
                <div className={styles.itemCls}>
                    <FormItem label="聘用形式">
                        {getFieldDecorator('employeeEmploymentForm', {
                            initialValue: '',
                            rules: [{
                                required: true,
                            },
                            ],
                        })(<BIInput placeholder='请输入聘用形式' className={styles.commonWidthCls} />)}
                    </FormItem>
                </div>
                <div className={styles.itemCls}>
                    <FormItem label="入职日期">
                        {getFieldDecorator('name11', {
                            initialValue: '',
                            rules: [{
                                required: true,
                            },
                            ],
                        })(
                            <BIInput placeholder='请输入部门名称' className={styles.commonWidthCls} />
                        )}
                    </FormItem>
                    </div>
                </div> 
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="所属部门">
                            {getFieldDecorator('name12', {
                                initialValue: '',
                                rules: [{
                                    required: true,
                                },
                                ],
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="所属部门">
                            {getFieldDecorator('name22', {
                                initialValue: '',
                                rules: [{
                                    required: true,
                                },
                                ],
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="转正日期">
                            {getFieldDecorator('name32', {
                                initialValue: '',
                                rules: [{
                                    required: true,
                                },
                                ],
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="职级">
                            {getFieldDecorator('name33', {
                                initialValue: '',
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>

                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="合同开始日期">
                            {getFieldDecorator('name42', {
                                initialValue: '',
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="合同结束日期">
                            {getFieldDecorator('name43', {
                                initialValue: '',
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>      
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="聘用期限">
                            {getFieldDecorator('name41', {
                                initialValue: '',
                            })(<BIInput className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>     
            </div>
    );}
}