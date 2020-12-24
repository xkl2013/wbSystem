import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

const renderProjectingSigningDate = () => {
    return {
        label: '预计签约日期',
        key: 'projectingSigningDate',
        type: 'date',
        placeholder: '请选择',
        getFormat: (value, form) => {
            form.projectingSigningDate = moment(value).format(DATETIME_FORMAT);
            return form;
        },
        setFormat: (value) => {
            return moment(value);
        },
    };
};
export default renderProjectingSigningDate;
