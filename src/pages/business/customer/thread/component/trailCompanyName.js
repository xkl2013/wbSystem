const renderTrailCompanyName = (obj) => {
    const { trailCustomerType } = obj.formData;
    // 公司类型为代理时显示代理公司名称
    return (
        Number(trailCustomerType) === 1 && {
            label: '代理公司名称',
            key: 'trailCompanyName',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请输入代理公司名称',
                    },
                ],
            },
            componentAttr: {
                maxLength: 50,
            },
        }
    );
};
export default renderTrailCompanyName;
