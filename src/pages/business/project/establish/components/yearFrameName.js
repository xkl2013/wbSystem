import { getYearFrame } from '@/pages/business/project/establish/services';

const renderYearFrameName = (obj, { from }) => {
    const { showYearFrame, yearFrameType, yearFrameCustomerId, yearFrameCustomerType } = obj.formData;
    // 年框类型为抖音或微博时显示关联年框
    return (
        showYearFrame
        && yearFrameType && {
            label: '关联年框',
            key: 'yearFrameId',
            placeholder: '请选择',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择关联年框',
                    },
                ],
            },
            type: 'associationSearch',
            componentAttr: {
                allowClear: true,
                request: async () => {
                    const data = {
                        pageNum: 1,
                        pageSize: 50,
                        customerId: yearFrameCustomerId,
                        customerType: yearFrameCustomerType,
                    };
                    const res = await getYearFrame(data);
                    if (res && res.success && res.data) {
                        let list = res.data.filter((item) => {
                            return Number(item.yearFramePlatform) === Number(yearFrameType);
                        });
                        if (Number(yearFrameType) === 3) {
                            list = res.data;
                        }
                        return {
                            success: true,
                            data: list,
                        };
                    }
                },
                fieldNames: { value: 'id', label: 'yearFrameName' },
                initDataType: 'onfocus',
                disabled: from === 'manage',
            },
            getFormat: (value, form) => {
                form.yearFrameId = value.value;
                form.yearFrameName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.yearFrameName, value: form.yearFrameId };
            },
        }
    );
};
export default renderYearFrameName;
