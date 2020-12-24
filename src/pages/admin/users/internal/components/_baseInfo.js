import React, { Component } from 'react';
import styles from './index.less';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import BIDatePicker from '@/ant_components/BIDatePicker';
import { Form } from 'antd';
import {RESIDENCS_TYPE,SEX_TYPE,CREDENTIAL_TYPE,MARRY_STATUES}from '@/utils/enum';
const FormItem = Form.Item;
const { Option } = BISelect;
export default class BaseForm extends Component {

    render() {
        const { getFieldDecorator,baseInfo={} } = this.props;
        return (
            <div className={styles.baseWrap}>
                <p className={styles.titleCls}>个人信息</p>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="姓名">
                            {getFieldDecorator('userName', {
                                initialValue: baseInfo.userName,
                                rules: [{
                                    required: true,
                                    max:10,
                                },
                                ],
                            })(<BIInput placeholder='请输入' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="性别">
                            {getFieldDecorator('userGender', {
                                initialValue: baseInfo.userGender,
                            })(
                                <BISelect placeholder='请选择' className={styles.commonWidthCls}>
                                {SEX_TYPE.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                </BISelect>
                            )}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="户口性质">
                            {getFieldDecorator('employeeHouseholdType', {
                                initialValue: baseInfo.employeeHouseholdType,
                            })( <BISelect placeholder='请选择' className={styles.commonWidthCls}>
                            {RESIDENCS_TYPE.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                            </BISelect>)}
                        </FormItem>
                    </div>
                </div>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="证件类型">
                            {getFieldDecorator('employeeCredentialId', {
                                initialValue: baseInfo.employeeCredentialId,
                                rules: [{
                                    required: true,
                                },
                                ],
                            })(<BISelect placeholder='请选择' className={styles.commonWidthCls}>
                            {CREDENTIAL_TYPE.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                            </BISelect>)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="出生日期">
                            {getFieldDecorator('userBirth', {
                                initialValue: baseInfo.userBirth,
                            })(
                                <BIDatePicker placeholder='请输入出生日期' className={styles.commonWidthCls} />
                            )}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="手机号">
                            {getFieldDecorator('userPhone', {
                                initialValue: baseInfo.userPhone,
                                max:15,
                            })(<BIInput placeholder='请输入手机号' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="现居地址">
                            {getFieldDecorator('employeeCurrentAddress', {
                                initialValue: baseInfo.employeeCurrentAddress,
                                rules: [{
                                    required: true,
                                    max:40,
                                },
                                ],
                            })(<BIInput placeholder='请输入现居地址' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="婚姻状况">
                            {getFieldDecorator('employeeMaritalStatus', {
                                initialValue: baseInfo.employeeMaritalStatus,
                            })(
                                <BISelect placeholder='请选择' className={styles.commonWidthCls}>
                                {MARRY_STATUES.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                </BISelect>
                            )}
                        </FormItem>
                    </div>
                    <div className={styles.itemCls}>
                        <FormItem label="血型">
                            {getFieldDecorator('employeeBloodType', {
                                initialValue: baseInfo.employeeBloodType,
                            })( <BISelect placeholder='请选择' className={styles.commonWidthCls}>
                            {MARRY_STATUES.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                            </BISelect>)}
                        </FormItem>
                    </div>
                    </div>
                    <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <FormItem label="民族">
                            {getFieldDecorator('employeeNation', {
                                initialValue: baseInfo.employeeNation,
                            })(<BIInput placeholder='请输入民族' className={styles.commonWidthCls} />)}
                        </FormItem>
                    </div>
                </div>
            </div>
        );
    }

}
