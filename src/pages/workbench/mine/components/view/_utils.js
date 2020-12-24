import moment from 'moment';
import { getOptionName } from '@/utils/utils';

const formateStr = 'YYYY/MM/DD';
const formateTime = (beginTime, endTime) => {
    if (!beginTime && !endTime) return '无排期';
    if (!beginTime && !endTime) return '- -';
    return `${beginTime ? moment(beginTime).format(formateStr) : '- -'} - ${
        endTime ? moment(endTime).format(formateStr) : '- -'
    } `;
};
export const returnValue = (value) => {
    if (!Array.isArray(value)) return '';
    return value[0] || {};
};
export const returnExtraData = (value) => {
    const newVal = value;
    if (!Array.isArray(newVal)) return '';
    newVal.forEach((item, i) => {
        const newItem = { ...item };
        newItem.tagName = item.text;
        newItem.tagId = item.value;
        newItem.tagColor = item.extraData.backGroundColor;
        newVal[i] = newItem;
    });
    return newVal || [];
};
export const returnCards = (value, sonColumnList) => {
    if (!Array.isArray(value)) return [];
    const columnList = Array.isArray(sonColumnList) ? sonColumnList : [];
    return value.map((ls) => {
        let finishFlag;
        let overdueFlag;
        let beginTime;
        let endTime;
        let scheduleName;
        let type;
        let isHaveChildTask;
        let schedulePriority;
        let parentSchedule;
        let scheduleTags;
        let leadingUser = null;
        const rowData = [];
        if (Array.isArray(ls.rowData)) {
            ls.rowData.forEach((item) => {
                const { cellValueList } = item;
                // 任务内容
                if (item.colName === 'scheduleName') {
                    scheduleName = returnValue(cellValueList).value;
                }
                // 执行状态
                // if (item.colName === 'finishFlag') {
                //     finishFlag = returnValue(cellValueList).value
                // }
                // 完成状态
                if (item.colName === 'finishFlag') {
                    finishFlag = returnValue(cellValueList).value;
                }
                // 逾期状态
                if (item.colName === 'overdue') {
                    overdueFlag = returnValue(cellValueList).value;
                }
                // 开始时间
                if (item.colName === 'beginTime') {
                    beginTime = returnValue(cellValueList).value;
                }
                // 结束时间
                if (item.colName === 'endTime') {
                    endTime = returnValue(cellValueList).value;
                }
                // 创建人
                if (item.colName === 'leadingUser') {
                    leadingUser = returnValue(cellValueList).text;
                }
                // 日程/任务
                if (item.colName === 'type') {
                    type = returnValue(cellValueList).value;
                }
                // 是否有子任务标志：1有，2没有
                if (item.colName === 'isHaveChildTask') {
                    isHaveChildTask = returnValue(cellValueList).value;
                }
                // 任务优先级
                if (item.colName === 'schedulePriority') {
                    schedulePriority = returnValue(cellValueList).value;
                }
                // 主任务
                if (item.colName === 'parentSchedule') {
                    parentSchedule = returnValue(cellValueList);
                }
                // 任务标签
                if (item.colName === 'scheduleTags') {
                    scheduleTags = returnExtraData(cellValueList);
                }

                // 结束时间
                rowData.push({
                    ...item,
                    columnObj:
                        columnList.find((list) => {
                            return list.columnName === item.colName;
                        }) || {},
                });
            });
        }
        return {
            ...ls,
            rangeTime: formateTime(beginTime, endTime),
            finishFlag,
            beginTime,
            overdueFlag,
            scheduleName,
            leadingUser,
            rowData,
            type,
            isHaveChildTask,
            schedulePriority,
            parentSchedule,
            scheduleTags,
        };
    });
};
export const formateKanbanData = (data, clumnData) => {
    // if (!data.length || !clumnData.length) return [];
    return data.map((item) => {
        const rowData = Array.isArray(item.rowData) ? item.rowData : [];
        // 写死key值,之后需做优化
        const pannelNameObj = rowData.find((ls) => {
            return ls.colName === 'panelName';
        }) || {};
        const pannelBodyObj = rowData.find((ls) => {
            return ls.colName !== 'panelName';
        }) || {};
        const columnObj = clumnData.find((ls) => {
            return ls.columnName === pannelBodyObj.colName;
        }) || {};
        return {
            ...item,
            key: item.id,
            title: returnValue(pannelNameObj.cellValueList).text,
            columnObj,
            tempMap: new Date().valueOf(),
            cards: returnCards(pannelBodyObj.linkObjRlowDateList, columnObj.sonColumnList),
        };
    });
};
export const operateAuth = (type) => {
    // type：1-添加看板，2-编辑看板，3-删除看板，4-任务查看，5-添加任务，6-编辑任务，7-删除任务
    const authConfig = [
        { id: '1', name: '/workbench/project/addKanban' },
        { id: '2', name: '/workbench/project/editKanban' },
        { id: '3', name: '/workbench/project/deleteKanban' },
        { id: '4', name: '/workbench/project/taskDetail' },
        { id: '5', name: '/workbench/project/addTask' },
        { id: '6', name: '/workbench/project/editTask' },
        { id: '7', name: '/workbench/project/deleteTask' },
    ];
    return getOptionName(authConfig, type);
};
