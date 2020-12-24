const getHeaderCols = [
    [
        { key: 'projectingHeaderName', label: '负责人' },
        {
            key: 'projectingHeaderDepartName',
            label: '所属部门',
            render: (d) => {
                if (d.projectingHeaderDepartName && d.projectingHeaderDepartName.indexOf('null -') > -1) {
                    return d.projectingHeaderDepartName.split('-')[1];
                }
                return d.projectingHeaderDepartName;
            },
        },
        {},
        {},
    ],
];
export default getHeaderCols;
