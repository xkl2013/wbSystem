function changeBrand(obj, value) {
    obj.changeSelfForm({
        contractCooperateBrand: value,
    });
}
function filter(inputValue, path) {
    return path.some((option) => {
        return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
}
const renderContractCooperateBrand = (obj) => {
    const { cooperationBrand, contractCooperateBrand } = obj.formData;
    return (
        contractCooperateBrand && {
            label: '合作品牌',
            key: 'contractCooperateBrand',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '合作品牌不能为空',
                    },
                ],
            },
            type: 'cascader',
            componentAttr: {
                placeholder: '请选择合作品牌',
                fieldNames: { label: 'value', value: 'code', children: 'children' },
                options: cooperationBrand,
                changeOnSelect: true,
                onChange: changeBrand.bind(this, obj),
                showSearch: { filter },
            },
            getFormat: (value, form) => {
                form.contractCooperateBrand = value.join('-');
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
export default renderContractCooperateBrand;
