/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';

export const formatSelfCols = (obj) => {
    const { trailPlatformOrder } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: Number(trailPlatformOrder) === 2 ? '回款批次' : '预计回款期数',
                        key: 'contractReturnPeriod',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: Number(trailPlatformOrder) === 2 ? '请输入回款批次' : '请输入预计回款期数',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        placeholder: '请输入',
                        componentAttr: {
                            precision: 0,
                            min: 0,
                            max: 100,
                        },
                    },
                ],
                [
                    {
                        label: '预计回款金额',
                        key: 'contractReturnMoney',
                        placeholder: '请输入',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入预计回款金额',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 1000000000000,
                        },
                    },
                ],
                [
                    {
                        label: '预计回款时间',
                        key: 'contractReturnDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择预计回款时间',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'date',
                        getFormat: (value, form) => {
                            const result = form;
                            result.contractReturnDate = moment(value).format(DATE_FORMAT);
                            return result;
                        },
                        setFormat: (value) => {
                            return moment(value);
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
