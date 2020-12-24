import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { projectingType, trailPlatformOrder } = obj.formData;
    // 商务非长期必填
    if (Number(projectingType) === 1 && Number(trailPlatformOrder) !== 2) {
        return true;
    }
    // 默认非必填
    return false;
};
const renderProjectingOnlineDate = (obj) => {
    return {
        label: '上线日期',
        key: 'projectingOnlineDate',
        placeholder: '请选择',
        type: 'date',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请选择上线日期',
                },
            ],
        },
        getFormat: (value, form) => {
            form.projectingOnlineDate = moment(value).format(DATETIME_FORMAT);
            return form;
        },
        setFormat: (value) => {
            return moment(value);
        },
    };
};
export default renderProjectingOnlineDate;
