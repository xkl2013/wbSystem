import { PROJECT_SOURCE } from '@/utils/enum';

const changeSource = (obj, value) => {
    obj.changeSelfForm({
        projectingSource: value,
    });
};
// 根据项目类型获取不同来源
const getOptions = (obj) => {
    const { projectingType } = obj.formData;
    let options = [];
    if (projectingType) {
        const source = PROJECT_SOURCE.find((item) => {
            return item.id === String(projectingType);
        });
        options = source && source.child;
    }
    return options;
};

const renderProjectingSource = (obj) => {
    return {
        label: '项目来源',
        key: 'projectingSource',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择项目来源',
                },
            ],
        },
        placeholder: '请选择',
        type: 'select',
        componentAttr: {
            onChange: changeSource.bind(this, obj),
        },
        options: getOptions(obj),
        getFormat: (value, form) => {
            form.projectingSource = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingSource;
