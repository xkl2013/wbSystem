import { PROJECT_LEVEL } from '@/utils/enum';

const renderProjectingLevel = () => {
    return {
        label: '项目级别',
        key: 'projectingLevel',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择项目级别',
                },
            ],
        },
        placeholder: '请选择',
        type: 'select',
        options: PROJECT_LEVEL,
        getFormat: (value, form) => {
            form.projectingLevel = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingLevel;
