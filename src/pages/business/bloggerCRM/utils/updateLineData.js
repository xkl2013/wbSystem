import { fromJS } from 'immutable';

export const updateLineData = (
    dataSource,
    { index, value, operateType = 'edit', force = false, insert = 'before' },
) => {
    const immutableDataSource = fromJS(dataSource);
    let newDataSource;
    if (operateType === 'del') {
        newDataSource = immutableDataSource.delete(index).toJS();
    } else if (operateType === 'add') {
        if (insert === 'after') {
            newDataSource = immutableDataSource.push(value).toJS();
        } else {
            newDataSource = immutableDataSource.unshift(value).toJS();
        }
    } else if (force) {
        newDataSource = immutableDataSource.set(index, value).toJS();
    } else {
        const updateItem = dataSource[index].rowData;
        const newRowData = [];
        // 将老数据中对应的修改字段替换掉
        updateItem.map((item) => {
            const updateNewIndex = value.rowData.findIndex((temp) => {
                return temp.columnCode === item.colName;
            });
            if (updateNewIndex > -1) {
                newRowData.push({
                    ...item,
                    ...value.rowData[updateNewIndex],
                });
            } else {
                newRowData.push(item);
            }
        });
        const newRow = {
            ...dataSource[index],
            rowData: newRowData,
        };
        newDataSource = immutableDataSource.set(index, newRow).toJS();
    }
    // console.log(newDataSource);
    return newDataSource || dataSource;
};
