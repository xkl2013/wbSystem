/**
 * 新增/编辑公司form
 * */

import { TAX_TYPE, COMPANYS_TYPE } from '@/utils/enum';
import { pureLetterReg, purePosNumberReg } from '@/utils/reg';
import moment from "moment";
import { DATETIME_FORMAT } from "@/utils/constants";
import { columnsFn } from './_selfTable';
import { formatSelfCols } from './_selfForm';
import s from './index.less';
import React from 'react';

export const formatCols = (obj) => {
  return (
    [
      {
        columns:
          [[
            {
              label: '公司名称', key: 'companyName', checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '请输入公司名称'
                }, {
                  max: 30,
                  message: '至多输入30个字'
                }]
              }, placeholder: '请输入公司全称',
            },
            (() => {
              //动态改变公司编码显隐（显示条件：{companyId}=>{true}）
              if (obj && obj.formData && obj.formData.companyId) {
                return {
                  label: '公司编码', key: 'companyCode', componentAttr: {
                    placeholder: '公司编码', disabled: true
                  }
                }
              }
            })(),
            {
              label: '税务资质', key: 'companyTaxType', checkOption: {
                rules: [{
                  required: true,
                  message: '请选择税务资质'
                }]
              }, placeholder: '请选择', type: 'select', options: TAX_TYPE, initialValue: '0', getFormat: (value, form) => {
                form.companyTaxType = Number(value);
                return form;
              }, setFormat: (value) => {
                return String(value);
              }
            },
          ],
          [
            {
              label: '公司类型', key: 'companyType', checkOption: {
                rules: [{
                  required: true,
                  message: '请选择公司类型'
                }]
              }, placeholder: '请选择', type: 'select', options: COMPANYS_TYPE, getFormat: (value, form) => {
                form.companyType = Number(value);
                return form;
              }, setFormat: (value) => {
                return String(value);
              }
            },
            {
              label: '纳税人识别号', key: 'companyTaxpayerNumber', checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '纳税人识别号不能为空'
                }, {
                  max: 30,
                  message: '至多输入30个字'
                }]
              }, placeholder: '请输入'
            },
            {
              label: '编码简称', key: 'companyCodeShort', checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '请输入编码简称'
                }, {
                  pattern: pureLetterReg,
                  message: '只能输入字母'
                },
                {
                  max: 10,
                  message: '至多输入10个字母'
                }]
              }, placeholder: '请输入', disabled: !!(obj && obj.formData && obj.formData.companyId) || false,
              type: 'tipInput',
              componentAttr: {
                selfCom: <div className={s.tipCls}>用于生成员工编码</div>
              }
            },

          ],
          [
            {
              label: '法人代表', key: 'companyLegalPerson', checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '请输入法人代表'
                }, {
                  max: 15,
                  message: '至多输入15个字'
                }]
              }, placeholder: '请输入'
            },
            {
              label: '注册资本', key: 'companyRegisterCapital', checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '请输入注册资本'
                }, {
                  pattern: purePosNumberReg,
                  message: '请填写最多两位小数的数字'
                }]
              }, placeholder: '请输入'
            },
            {
              label: '成立时间', key: 'companyCreatedAt', checkOption: {
                rules: [{
                  required: true,
                  message: '请选择成立时间'
                }]
              }, placeholder: '请选择', type: 'date', getFormat: (value, form) => {
                form.companyCreatedAt = moment(value).format(DATETIME_FORMAT);
                return form;
              }, setFormat: (value) => {
                return moment(value);
              }
            },
          ],
          [
            // {
            //   label: '银行帐号 (报销专用)', key: 'companyBankCardNumber', checkOption: {
            //     rules: [{
            //       required: true, whitespace: true,
            //       message: '银行帐号不能为空'
            //     }]
            //   }, placeholder: '请输入银行帐号'
            // },
            // {
            //   label: '开户行', key: 'companyBankName', checkOption: {
            //     rules: [{
            //       required: true, whitespace: true,
            //       message: '开户行不能为空'
            //     }]
            //   }, placeholder: '请输入开户行'
            // },
            {
              label: '注册地址', key: 'companyRegisterAddress', placeholder: '请输入注册地址', checkOption: {
                rules: [{
                  max: 30,
                  message: '至多输入30个字'
                }]
              }
            },
            {
              label: '办公地址', key: 'companyOfficeAddress', placeholder: '请输入办公地址', checkOption: {
                rules: [{
                  max: 30,
                  message: '至多输入30个字'
                }]
              }
            },
            {
              label: '营业期限',
              key: 'companyBusinessFrom',
              placeholder: ['营业开始时间', '营业结束时间'],
              type: 'daterange',
              getFormat: (value, form) => {
                form.companyBusinessFrom = moment(value[0]).format(DATETIME_FORMAT);
                form.companyBusinessTo = moment(value[1]).format(DATETIME_FORMAT);
                return form;
              },
              setFormat: (value, form) => {
                if (Array.isArray(value)) {
                  return value;
                }
                if (form.companyBusinessTo) {
                  return [moment(value), moment(form.companyBusinessTo)];
                }
                return [];
              }
            },
            {
              label: '附加税比例', key: 'companyAttachedTaxRate', componentAttr: {
                formatter: value => `${(value * 100).toFixed(2)}%`,
                parser: value => Number(value.replace('%', '')) / 100
              }, checkOption: {
                rules: [{
                  pattern: purePosNumberReg,
                  message: '请填写最多两位小数的数字'
                }]
              }, type: 'inputNumber', placeholder: '请输入',
            },
          ],
          ]
      },
      {
        title: '银行帐号',
        fixed: true,
        columns: [
          [
            {
              key: 'companyBankList', type: 'formTable', labelCol: { span: 0 },
              wrapperCol: { span: 24 },
              componentAttr: {
                border: true,
                tableCols: columnsFn,
                formCols: formatSelfCols(),
                initForm: obj.initForm,
                formKey: 'companyBankList',
                addBtnText: '添加帐号',
                editBtnText: '编辑帐号',
                setSpecial: obj.setSpecial,
                changeParentForm: obj.changeParentForm
              },
            }
          ]
        ]
      }
    ])
}

export default {
  formatCols
};
