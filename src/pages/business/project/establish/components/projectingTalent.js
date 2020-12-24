import { getLiveTalentList } from '@/pages/business/live/service';
import moment from 'moment';
import { DATETIME_FORMAT, SPECIAL_DATETIME_FORMAT } from '@/utils/constants';

const renderProjectingTalent = () => {
    return [
        {
            label: 'Talent',
            key: 'talentId',
            placeholder: '请选择',
            type: 'associationSearch',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择Talent',
                    },
                ],
            },
            componentAttr: {
                request: () => {
                    return getLiveTalentList();
                },
                fieldNames: {
                    value: (item) => {
                        return `${item.talentId}_${item.talentType}`;
                    },
                    label: 'talentName',
                },
                initDataType: 'onfocus',
            },
            getFormat: (value, form) => {
                const arr = value.value.split('_');
                form.talentId = arr[0];
                form.talentType = arr[1];
                form.talentName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (!value) return value;
                if (value.value && value.label) {
                    return value;
                }
                return {
                    value: `${form.talentId}_${form.talentType}`,
                    label: form.talentName,
                };
            },
        },
        {
            label: '直播时间',
            key: 'liveTime',
            placeholder: '请选择',
            type: 'datetime',
            checkOption: {
                validateFirst: true,
                rules: [
                    {
                        required: true,
                        message: '请选择直播时间',
                    },
                ],
            },
            componentAttr: {
                showTime: true,
                format: SPECIAL_DATETIME_FORMAT,
            },
            getFormat: (value, form) => {
                form.liveTime = value && moment(value).format(DATETIME_FORMAT);
                return form;
            },
            setFormat: (value) => {
                return moment(value);
            },
        },
    ];
};
export default renderProjectingTalent;
