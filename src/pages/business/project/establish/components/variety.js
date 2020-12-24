import { GUEST_TYPE, PROGRAMME_TYPE } from '@/utils/enum';

const renderVariety = () => {
    return [
        {
            label: '节目类型',
            key: 'projectingProgrammeType',
            placeholder: '请选择',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择节目类型',
                    },
                ],
            },
            type: 'select',
            options: PROGRAMME_TYPE,
            getFormat: (value, form) => {
                form.projectingProgrammeType = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        },
        {
            label: '嘉宾类型',
            key: 'projectingGuestType',
            placeholder: '请选择',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择嘉宾类型',
                    },
                ],
            },
            type: 'select',
            options: GUEST_TYPE,
            getFormat: (value, form) => {
                form.projectingGuestType = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        },
        {
            label: '其他嘉宾',
            key: 'projectingGuestOther',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 20,
                        message: '至多输入20个字',
                    },
                ],
            },
        },
    ];
};
export default renderVariety;
