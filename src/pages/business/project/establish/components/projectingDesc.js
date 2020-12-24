const renderProjectingDescription = () => {
    return {
        label: '备注',
        key: 'projectingDescription',
        checkOption: {
            rules: [
                {
                    max: 500,
                    message: '至多输入500个字',
                },
            ],
        },
        type: 'textarea',
        componentAttr: {
            placeholder: '请输入',
            rows: 3,
        },
    };
};
export default renderProjectingDescription;
