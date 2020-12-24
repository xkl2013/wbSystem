const getExecutorCols = [
    [
        {
            key: 'projectingUserList',
            label: '执行人',
            render: (detail) => {
                const result = [];
                if (detail.projectingUserList) {
                    detail.projectingUserList.map((item) => {
                        result.push(item.projectingParticipantName);
                    });
                }
                return result.join('，');
            },
        },
    ],
];
export default getExecutorCols;
