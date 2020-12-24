const getParticipateCols = [
    [
        {
            key: 'projectingUsers',
            label: '参与人',
            render: (detail) => {
                const result = [];
                if (detail.projectingUsers) {
                    detail.projectingUsers.map((item) => {
                        result.push(item.projectingParticipantName);
                    });
                }
                return result.join('，');
            },
        },
    ],
];
export default getParticipateCols;
