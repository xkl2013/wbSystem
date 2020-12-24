import { THREAD_TYPE } from '@/utils/enum';

const changeSource = (obj, value) => {
    obj.changeSelfForm({
        trailSource: value,
    });
};
// 根据线索类型获取不同来源
const getOptions = (obj) => {
    const { trailType } = obj.formData;
    let options = [];
    if (trailType) {
        const source = THREAD_TYPE.find((item) => {
            return item.id === String(trailType);
        });
        options = source && source.child;
    }
    return options;
};

const renderProjectingSource = (obj) => {
    return {
        label: '线索来源',
        key: 'trailSource',
        placeholder: '请选择',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '线索来源不能为空',
                },
            ],
        },
        type: 'select',
        options: getOptions(obj),
        componentAttr: {
            onChange: changeSource.bind(this, obj),
        },
        getFormat: (value, form) => {
            form.trailSource = Number(value);
            return form;
        },
        setFormat: (value) => {
            return String(value);
        },
    };
};
export default renderProjectingSource;
