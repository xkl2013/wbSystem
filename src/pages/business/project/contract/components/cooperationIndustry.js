import { isNumber } from '@/utils/utils';

function changeIndustry(obj, value) {
    obj.changeSelfForm({
        contractCooperateIndustry: value,
    });
}

const renderContractCooperateIndustry = (obj) => {
    const { trailPlatformOrder, contractCooperateIndustry, cooperationIndustry } = obj.formData;
    // 动态改变合作行业显隐（显示条件：{projectingType}=>{1}）
    return (
        (isNumber(trailPlatformOrder) || contractCooperateIndustry) && {
            label: '合作行业',
            key: 'contractCooperateIndustry',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '合作行业不能为空',
                    },
                ],
            },
            type: 'cascader',
            componentAttr: {
                placeholder: '请选择合作行业',
                fieldNames: { label: 'value', value: 'code', children: 'children' },
                options: cooperationIndustry,
                changeOnSelect: true,
                onChange: changeIndustry.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.contractCooperateIndustry = value.join('-');
                return form;
            },
            setFormat: (value) => {
                if (Array.isArray(value)) {
                    return value.map((item) => {
                        return item.code || item;
                    });
                }
                // form回填
                return value.split('-');
            },
        }
    );
};
export default renderContractCooperateIndustry;
