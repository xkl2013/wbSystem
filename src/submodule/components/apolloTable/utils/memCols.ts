import memoizeOne from 'memoize-one';
import { ColumnProps, RowProps } from '../component/interface';
import { getCache, saveCache } from '@/submodule/components/apolloTable/utils/cache';

// 获取左侧固定列数量
export const getLeftColumns = (columns: ColumnProps[]) => {
    return columns.filter((item) => {
        return !!item.showStatus && item.fixed && item.fixed !== 'right';
    });
};

// 获取右侧固定列数量
export const getRightColumns = (columns: ColumnProps[]) => {
    return columns.filter((item) => {
        return !!item.showStatus && item.fixed === 'right';
    });
};

// 获取表格显示列
export const getShowColumns = (columns: ColumnProps[]) => {
    return columns.filter((item) => {
        return !!item.showStatus && (!item.hideScope || item.hideScope.indexOf('LIST') === -1);
    });
};

// 获取右侧列总宽度
export const getTotalWidth = (columns: ColumnProps[], columnWidth: number) => {
    let configWidth = 0;
    let configWidthLen = 0;
    let defaultWidth = 0;
    let defaultWidthLen = 0;
    columns.map((item: any) => {
        if (item.width) {
            configWidth += item.width;
            configWidthLen += 1;
        } else {
            defaultWidth += columnWidth;
            defaultWidthLen += 1;
        }
    });
    const totalWidth = configWidth + defaultWidth;
    return {
        configWidth,
        defaultWidth,
        totalWidth,
        configWidthLen,
        defaultWidthLen,
    };
};
// 获取分组级别
export const getGroupLevel = (classList) => {
    let len = 0;
    if (classList) {
        classList.map((item) => {
            if (item) {
                len++;
            }
        });
    }
    return len;
};
// 获取每列的宽度
export const getRowHeight = (
    { dataSource, rowHeight }: { dataSource: RowProps[]; rowHeight: number },
    { index }: { index: number },
) => {
    const { classList } = dataSource[index];
    let len = 1;
    if (classList) {
        classList.map((item) => {
            if (item) {
                len++;
            }
        });
    }
    return rowHeight * len;
};

// 获取数据总高度
export const getTotalHeight = (dataSource: RowProps[], rowHeight: number) => {
    let height = 0;
    dataSource.map((item: any, index: number) => {
        height += getRowHeight({ dataSource, rowHeight }, { index });
    });
    return height;
};

// 获取左侧固定列总宽度
export const getLeftWidth = (
    leftColumns: ColumnProps[],
    columns: ColumnProps[],
    columnWidth: number,
    tableWidth: number,
) => {
    const { totalWidth, configWidth, defaultWidthLen } = memoizeOne(getTotalWidth(columns, columnWidth));
    let colWidth = columnWidth;
    if (totalWidth < tableWidth) {
        colWidth = Math.floor((tableWidth - configWidth) / defaultWidthLen);
    }
    let total = 0;
    leftColumns.map((item) => {
        total += item.width || colWidth;
    });
    return total;
};

// 格式化列数据（添加缓存的前端属性）
export const getFormatColumns = (columns: ColumnProps[], cachedFeAttr: boolean, tableId: number | string) => {
    if (cachedFeAttr) {
        let shouldSave = false;
        let cachedCols = getCache({ tableId });
        if (cachedCols) {
            columns = columns.map((item: any) => {
                if (!cachedCols[item.columnName]) {
                    shouldSave = true;
                    cachedCols[item.columnName] = {
                        columnName: item.columnName,
                        width: item.width,
                        align: item.align,
                        fixed: item.fixed,
                        orderNo: item.orderNo,
                    };
                }
                return {
                    ...item,
                    ...cachedCols[item.columnName],
                };
            });
        } else {
            cachedCols = {};
            columns.map((item: any) => {
                cachedCols[item.columnName] = {
                    columnName: item.columnName,
                    width: item.width,
                    align: item.align,
                    fixed: item.fixed,
                    orderNo: item.orderNo,
                };
            });
            if (columns.length > 0) {
                shouldSave = true;
            }
        }
        if (shouldSave) {
            saveCache({ tableId, data: cachedCols });
        }
    }
    columns.sort((a, b) => {
        return a.orderNo - b.orderNo;
    });
    return columns;
};
