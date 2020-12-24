import { isNumber } from '@/utils/utils';

function changeProduct(obj, value) {
    obj.changeSelfForm({
        contractCooperateProduct: value,
    });
}

const renderContractCooperateProduct = (obj) => {
    const { trailPlatformOrder, contractCooperateProduct, cooperationProduct } = obj.formData;
    // 动态改变合作产品显隐（显示条件：{projectingType}=>{1}）
    return (
        (isNumber(trailPlatformOrder) || contractCooperateProduct) && {
            label: '合作产品',
            key: 'contractCooperateProduct',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '合作产品不能为空',
                    },
                ],
            },
            type: 'cascader',
            componentAttr: {
                placeholder: '请选择合作产品',
                fieldNames: { label: 'value', value: 'code', children: 'children' },
                options: cooperationProduct,
                changeOnSelect: true,
                onChange: changeProduct.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.contractCooperateProduct = value.join('-');
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
export default renderContractCooperateProduct;
