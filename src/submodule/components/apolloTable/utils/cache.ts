const cachePrefix = 'TABLE_COLS';

const getKey = (tableId: number | string) => {
    return `${cachePrefix}_${tableId}`;
};

export const saveCache = ({ tableId, data }: { tableId: number | string; data: any }) => {
    localStorage.setItem(getKey(tableId), JSON.stringify(data));
};

export const getCache = ({ tableId }: { tableId: number | string }) => {
    const data = localStorage.getItem(getKey(tableId));
    if (!data) {
        return null;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.warn('获取localStorage失败');
    }
};
