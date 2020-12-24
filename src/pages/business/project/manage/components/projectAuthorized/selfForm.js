/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';
import { getCustomerList } from '@/services/globalSearchApi';
/* eslint-disable no-use-before-define */

export const formatSelfCols = () => {
    return [
        {
            columns: [
                [
                    {
                        label: '授权公司主体',
                        key: 'companyName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '授权公司主体不能为空',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                            request: (val) => {
                                const data = {
                                    customerName: val || '',
                                };
                                return getCustomerList(data);
                            },
                            fieldNames: { value: 'id', label: 'customerName' },
                            initDataType: 'onfocus',
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.companyId = value.value;
                            form.companyName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { label: form.companyName, value: form.companyId };
                        },
                    },
                ],
                [
                    {
                        label: '授权签单额（元）',
                        key: 'amount',
                        type: 'inputNumber',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入授权签单额',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 9999999999.99,
                        },
                    },
                ],
                [
                    {
                        label: '授权链接',
                        key: 'url',
                        placeholder: '请输入',
                        type: 'textarea',
                        componentAttr: {
                            rows: 3,
                            maxLength: 500,
                            placeholder: '多个链接以英文逗号分隔',
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入授权链接',
                                },
                            ],
                        },
                    },
                ],
                [
                    {
                        label: '授权起止时间',
                        key: 'startTime',
                        placeholder: ['授权开始时间', '授权结束时间'],
                        checkOption: {
                            rules: [
                                {
                                    validator: async (rule, value, callback) => {
                                        if (
                                            value
                                            && value.length > 0
                                            && (!value[0]
                                                || !value[1]
                                                || moment(value[0]).unix() > moment(value[1]).unix())
                                        ) {
                                            callback('请填写正确的授权起止时间');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        type: 'daterange',
                        componentAttr: {
                            format: DATE_FORMAT,
                        },
                        getFormat: (value, form) => {
                            form.startTime = value[0] && moment(value[0]).format(DATE_FORMAT);
                            form.endTime = value[1] && moment(value[1]).format(DATE_FORMAT);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            return [moment(form.startTime), moment(form.endTime)];
                        },
                    },
                ],
                [
                    {
                        label: '备注',
                        key: 'remark',
                        placeholder: '请输入',
                        type: 'textarea',
                        componentAttr: {
                            rows: 3,
                            maxLength: 500,
                            placeholder: '请输入备注',
                        },
                    },
                ],
            ],
        },
    ];
};

export default {
    formatSelfCols,
};
