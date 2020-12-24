const renderProjectingTotalWork = () => {
    return {
        label: '总工作量',
        key: 'projectingBusinessTotalWork',
        placeholder: '请输入',
        type: 'textarea',
        checkOption: {
            rules: [
                {
                    max: 140,
                    message: '至多输入140个字',
                },
            ],
        },
    };
};
export default renderProjectingTotalWork;
