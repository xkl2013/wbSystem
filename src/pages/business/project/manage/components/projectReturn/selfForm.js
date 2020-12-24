/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 * */
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';

export const formatSelfCols = () => {
    return [
        {
            columns: [
                [
                    {
                        label: '回款批次',
                        key: 'batch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入回款批次',
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
                        key: 'projectReturnMoney',
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
                        key: 'projectReturnDate',
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
                            result.projectReturnDate = moment(value).format(DATE_FORMAT);
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
