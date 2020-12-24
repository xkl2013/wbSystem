import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

const renderProjectingSEDate = (obj) => {
    return {
        label: '起止日期',
        key: 'projectingStartDate',
        placeholder: ['起始日期', '终止日期'],
        type: 'daterange',
        checkOption: {
            validateFirst: true,
            rules: [
                {
                    required: Number(obj.formData.projectingType) === 1,
                    message: '请选择起止日期',
                },
                {
                    validator: (rule, value, callback) => {
                        if (value && value.length === 1) {
                            callback('请选择完整的起止日期');
                        }
                        callback();
                    },
                },
            ],
        },
        getFormat: (value, form) => {
            form.projectingStartDate = value[0] && moment(value[0]).format(DATETIME_FORMAT);
            form.projectingEndDate = value[1] && moment(value[1]).format(DATETIME_FORMAT);
            return form;
        },
        setFormat: (value, form) => {
            if (Array.isArray(value)) {
                return value;
            }
            if (form.projectingEndDate) {
                return [moment(value), moment(form.projectingEndDate)];
            }
            return [moment(value)];
        },
    };
};
export default renderProjectingSEDate;
