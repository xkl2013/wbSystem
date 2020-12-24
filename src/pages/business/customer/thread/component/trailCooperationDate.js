import moment from 'moment';
import { DATE_FORMAT } from '@/utils/constants';

const renderTrailCooperationDate = () => {
    return {
        label: '预计合作日期',
        key: 'trailCooperationDate',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '合作日期不能为空',
                },
            ],
        },
        placeholder: '请选择合作日期',
        type: 'date',
        getFormat: (value, form) => {
            form.trailCooperationDate = moment(value).format(DATE_FORMAT);
            return form;
        },
        setFormat: (value) => {
            return moment(value);
        },
    };
};
export default renderTrailCooperationDate;
