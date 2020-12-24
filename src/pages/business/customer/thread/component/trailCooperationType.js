import { COOPERATION_TYPE_SW } from '@/utils/enum';

const renderTrailCooperationType = (obj) => {
    const { trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) !== 2 && {
            label: '合作类型',
            key: 'trailCooperationType1',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择合作类型',
                    },
                ],
            },
            type: 'cascader',
            getFormat: (value, form) => {
                if (value[0].value !== undefined) {
                    // 选择过的数据
                    form.trailCooperationType1 = Number(value[0].value);
                    form.trailCooperationType2 = value[1] && value[1].value ? Number(value[1].value) : undefined;
                } else {
                    // 带出来的数据未修改
                    form.trailCooperationType1 = Number(value[0]);
                    form.trailCooperationType2 = value[1] ? Number(value[1]) : undefined;
                }
                return form;
            },
            setFormat: (value, form) => {
                if (Array.isArray(value)) {
                    return value;
                }
                if (form.trailCooperationType1 !== undefined && form.trailCooperationType2 !== undefined) {
                    return [String(form.trailCooperationType1), String(form.trailCooperationType2)];
                }
                if (form.trailCooperationType1 !== undefined) {
                    return [String(form.trailCooperationType1)];
                }
                return [];
            },
            componentAttr: {
                options: COOPERATION_TYPE_SW,
                changeOnSelect: true,
                placeholder: '请选择',
            },
        }
    );
};
export default renderTrailCooperationType;
