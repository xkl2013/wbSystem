/*
 * 处理组件默认是,根据组件类型进行处理
 */
export const formaterDefaultValue = (val, item) => {
    const type = item.type;
    if (!val || typeof val !== 'object') return item.value;
    switch (type) {
        case 'input':
            return val.fieldValueValue;
        case 'textarea':
            return val.fieldValueValue;
        case 'select':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'radio':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'checkbox':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'number':
            return val.fieldValueValue;
        case 'department':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'business':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'signle_user':
            return [{ value: val.fieldValueValue, name: val.fieldValueName }];
        case 'datepicker':
            return val.fieldValueValue;
        default:
            return item.value;
    }
};
export default formaterDefaultValue;
