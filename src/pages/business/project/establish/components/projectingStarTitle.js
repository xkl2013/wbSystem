const renderProjectingStarTitle = () => {
    return {
        label: '艺人头衔',
        key: 'projectingBusinessStarTitle',
        placeholder: '请输入',
        checkOption: {
            rules: [
                {
                    max: 10,
                    message: '至多输入10个字',
                },
            ],
        },
    };
};
export default renderProjectingStarTitle;
