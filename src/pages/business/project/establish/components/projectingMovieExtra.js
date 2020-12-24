import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

const renderProjectingMovieExtra = () => {
    return [
        {
            label: '开机日期',
            key: 'projectingMovieBootupDate',
            placeholder: '请输入',
            type: 'date',
            getFormat: (value, form) => {
                form.projectingMovieBootupDate = moment(value).format(DATETIME_FORMAT);
                return form;
            },
            setFormat: (value) => {
                return moment(value);
            },
        },
        {
            label: '拍摄周期',
            key: 'projectingMovieShootingPeriod',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '拍摄地点',
            key: 'projectingMovieShootingAddress',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
    ];
};
export default renderProjectingMovieExtra;
