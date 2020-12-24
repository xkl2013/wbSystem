import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

const renderProjectingRecordDate = () => {
    return {
        label: '录制日期',
        key: 'projectingVarietyRecordDate',
        placeholder: '请选择',
        type: 'date',
        getFormat: (value, form) => {
            form.projectingVarietyRecordDate = moment(value).format(DATETIME_FORMAT);
            return form;
        },
        setFormat: (value) => {
            return moment(value);
        },
    };
};
export default renderProjectingRecordDate;
