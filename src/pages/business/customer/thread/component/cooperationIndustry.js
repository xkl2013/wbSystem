function changeIndustry(obj, value) {
    obj.changeSelfForm({
        trailCooperateIndustry: value,
    });
}
const renderTrailCooperateIndustry = (obj) => {
    const { cooperationIndustry, trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) !== 2 && {
            label: '合作行业',
            key: 'trailCooperateIndustry',
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
                form.trailCooperateIndustry = value.join('-');
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
export default renderTrailCooperateIndustry;
