// import moment from 'moment';
import React from 'react';
import { LOCK_PERIOD, UNLOCK_MONTH } from '@/utils/enum';
// import { DATETIME_FORMAT } from '@/utils/constants';
import { int2strArr, str2intArr } from '@/utils/utils';
import TimePanel from '../timePanel';
// import s from './index.less';

const changeLockPeriod = (obj, value) => {
    obj.changeSelfForm({
        lockPeriod: value.target.value,
        lockMonths: [],
    });
};
const onChangeDateTime = (obj, val) => {
    obj.changeSelfForm({
        unlockBeginTime: val,
    });
};
// function disabledDate(current) {
//     // Can not select days before today and today
//     return current && (current < moment('2019-07-01').startOf('day') || current > moment('2019-07-31').endOf('day'));
// }
export const formatCols = (obj) => {
    const { lockPeriod } = obj.formData;
    return [
        {
            columns: [
                [
                    {
                        label: '锁定周期',
                        key: 'lockPeriod',
                        type: 'radio',
                        labelCol: { span: 4 },
                        wrapperCol: { span: 20 },
                        options: LOCK_PERIOD,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择锁定周期',
                                },
                            ],
                        },
                        componentAttr: {
                            onChange: changeLockPeriod.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            form.lockPeriod = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                (() => {
                    if (Number(lockPeriod) === 1) {
                        return [
                            {
                                label: '解锁月份',
                                key: 'lockMonths',
                                type: 'checkbox',
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 },
                                options: UNLOCK_MONTH,
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择解锁月份',
                                        },
                                    ],
                                },
                                getFormat: (value, form) => {
                                    form.lockMonths = str2intArr(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    let arr = [];
                                    if (Array.isArray(value)) {
                                        arr = value;
                                    } else {
                                        arr = value && value.split(',');
                                    }
                                    return int2strArr(arr);
                                },
                            },
                        ];
                    }
                    return [];
                })(),
                [
                    {
                        label: '解锁日期',
                        key: 'unlockBeginTime',
                        type: 'custom',
                        labelCol: { span: 4 },
                        wrapperCol: { span: 20 },
                        render: () => {
                            return <TimePanel onChange={onChangeDateTime.bind(this, obj)} />;
                        },
                        getFormat: (value, form) => {
                            form.unlockBeginTime = value[0];
                            form.unlockEndTime = value[1];
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return [...value];
                            }
                            return [form.unlockBeginTime, form.unlockEndTime];
                        },
                    },
                ],
            ],
        },
    ];
};
export default formatCols;
