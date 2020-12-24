export const getDefaultTableConfig = (config: any) => {
    const { rowHeight, headerHeight, columnWidth } = config;
    return {
        overscanColumnCount: 5,
        overscanRowCount: 5,
        columnWidth: columnWidth || 150,
        rowHeight: rowHeight || 80,
        headerHeight: headerHeight || 60,
    };
};
