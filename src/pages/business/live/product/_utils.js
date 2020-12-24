export const formateColumn = (arr) => {
    return arr.map((ls) => {
        console.log(ls);
        if (ls.columnName === 'pitPrice') {
            // 坑位费时单位为完
            return {
                ...ls,
                columnAttrObj: {
                    ...(ls.columnAttrObj || {}),
                    unit: {
                        code: 'wan',
                        codeName: '万',
                    },
                },
            };
        }
        return {
            ...ls,
        };
    });
};
