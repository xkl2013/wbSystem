export const dataAttrFormat = (item = {}) => {
    const approvalFromFieldAttrs = item.approvalFromFieldAttrs || [];
    const dateFormat = (
        approvalFromFieldAttrs.find((ls) => {
            return ls.attrName === 'dateFormat';
        }) || {}
    ).attrValue;
    const val = dateFormat || '';
    if (!val) {
        // 执行默认展示
        if (item.type === 'timepicker') {
            // timepicker 默认展示时分
            return {
                format: 'YYYY-MM-DD HH:mm',
            };
        }
        return {
            // 其他类型展示 年月日
            format: 'YYYY-MM-DD',
        };
    }
    return {
        format: val.replace(/y/g, 'Y').replace(/d/g, 'D'),
        showTime: /H|m|s/.test(val),
    };
};
export default {
    dataAttrFormat,
};
