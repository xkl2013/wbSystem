function changeProduct(obj, value) {
    obj.changeSelfForm({
        trailCooperateProduct: value,
    });
}
const renderTrailCooperateProduct = (obj) => {
    const { cooperationProduct, trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) !== 2 && {
            label: '合作产品',
            key: 'trailCooperateProduct',
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
                form.trailCooperateProduct = value.join('-');
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
export default renderTrailCooperateProduct;
