function changeProduct(obj, value) {
    obj.changeSelfForm({
        projectingCooperateProduct: value,
    });
}
function filter(inputValue, path) {
    return path.some((option) => {
        return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
}
const renderProjectingCooperateProduct = (obj) => {
    const { cooperationProduct } = obj.formData;
    return {
        label: '合作产品',
        key: 'projectingCooperateProduct',
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
            showSearch: { filter },
        },
        getFormat: (value, form) => {
            form.projectingCooperateProduct = value.join('-');
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
    };
};
export default renderProjectingCooperateProduct;
