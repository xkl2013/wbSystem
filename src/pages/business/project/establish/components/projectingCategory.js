import { PROJECT_INFO_TYPE } from '@/utils/enum';

const renderProjectingCategory = () => {
    return {
        label: '项目明细分类',
        key: 'projectingCategory',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择项目明细',
                },
            ],
        },
        placeholder: '请选择',
        type: 'select',
        options: PROJECT_INFO_TYPE,
        getFormat: (value, form) => {
            form.projectingCategory = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingCategory;
