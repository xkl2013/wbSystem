import { isNumber } from '@/utils/utils';

const formatOptions = (options) => {
    return options.filter((item) => {
        return Number(item.index) === 1;
    });
};
const changeType = (obj, value) => {
    obj.changeSelfForm(
        {
            trailTypeComb: value,
            trailType: value[0] && value[0].index,
            trailPlatformOrder: (value[1] && value[1].index) || 0,
        },
        true,
    );
};
const renderTrailType = (obj) => {
    const { projectType } = obj.formData;
    return {
        label: '线索类型',
        key: 'trailTypeComb',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择线索类型',
                },
            ],
        },
        type: 'cascader',
        componentAttr: {
            onChange: changeType.bind(this, obj),
            placeholder: '请选择',
            fieldNames: { label: 'value', value: 'index', children: 'children' },
            options: formatOptions(projectType),
            changeOnSelect: false,
        },
        getFormat: (value, form) => {
            form.trailType = Number(value[0]);
            form.trailPlatformOrder = Number(value[1]) || 0;
            return form;
        },
        setFormat: (value, form) => {
            if (Array.isArray(value)) {
                return value.map((item) => {
                    return isNumber(item.index) ? item.index : item;
                });
            }
            // form回填
            if (!form.trailType) {
                return undefined;
            }
            if (Number(form.trailType) === 1) {
                return [Number(form.trailType), Number(form.trailPlatformOrder) || 0];
            }
            return [Number(form.trailType)];
        },
    };
};
export default renderTrailType;
