/* eslint-disable max-len */
import storage from '@/utils/storage';

export const colorList = ['#5C99FF', '#FAA72C', '#0AC8DC', '#6D75F9', '#F05969', '#61BC52', '#FFD133', '#FF7FD0', '#44D7B6', '#2E67C5'];

export const getColor = (index) => {
    let i = 0;
    if (index) {
        i = Number(String(index).slice(-1));
    }
    return colorList[i];
};


// 组装 userlist 数据
export const changeUserListData = (arr) => {
    if (!arr || !Array.isArray(arr)) {
        return [];
    }
    const { userId } = storage.getUserInfo() || {};
    const newArr = [];
    arr.map((item, index) => {
        if (item.userId !== userId) {
            newArr.push({
                id: `cellUnit_${item.tableId}_${item.rowId}_${item.columnCode}`,
                color: getColor(index),
                ...item,
            });
        }
    });
    return newArr;
};


interface IProps {
    userName:string;
    id: string;
    color: string;
    [propsName:string]:any;
}
// 创建 正在编辑的 style
export const createStyle = (arr:IProps[] = []) => {
    const newList:IProps[] = []; // 归并数组
    arr.map((item) => {
        const obj = newList.find((i) => { return i.id === item.id; });
        if (obj) {
            obj.userNameList = [...obj.userNameList, item.userName];
        } else {
            newList.push({
                ...item,
                userNameList: [item.userName],
            });
        }
    });
    const style = newList.map((item) => {
        let userNameStr = item.userNameList.join(',');
        if (item.userNameList.length > 3) {
            userNameStr = `${item.userNameList.slice(0, 3).join(',')}...`;
        }
        return `
            #${item.id}{
                border: 1px dashed ${item.color};
            }
            #${item.id}::before{
                background: ${item.color};
                content: '${userNameStr}';
                position: absolute;
                top: -18px;
                right: 0;
                font-size: 12px;
                color: #fff;
                padding: 0 5px;
                border-radius: 2px;
                z-index:1000;
            }
        `;
    }).join('');
    return `
        <style>
            ${style}
            .row_0::before{
                top:0 !important;
            }
        </style>
    `;
};
