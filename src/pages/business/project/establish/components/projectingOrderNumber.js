const renderProjectingOrderNumber = (obj) => {
    const { trailPlatformOrder, projectingOrderType } = obj.formData;
    return (
        Number(trailPlatformOrder) === 1
        && Number(projectingOrderType) === 1 && {
            label: '星图任务ID',
            key: 'projectingOrderNumber',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请输入星图任务ID',
                    },
                    {
                        pattern: /^[\d|,]+$/,
                        message: '请输入数字或英文逗号',
                    },
                ],
            },
            placeholder: '请输入数字ID，多个ID用英文逗号隔开',
            componentAttr: {
                maxLength: 300,
            },
        }
    );
};
export default renderProjectingOrderNumber;
