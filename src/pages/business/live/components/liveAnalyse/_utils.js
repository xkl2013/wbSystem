import moment from 'moment';

const getTimeValue = (ls) => {
    const rowData = Array.isArray(ls.rowData) ? ls.rowData : [];
    const cellValueList = (
        rowData.find((ls) => {
            return ls.colName === 'crawlerTime';
        }) || {}
    ).cellValueList || [];
    const value = (cellValueList[0] || {}).value;
    return value;
};
export const formateGMVData = (data, duringTime) => {
    if (!data || data.length === 0) return [];
    const newData = data.filter((ls) => {
        return getTimeValue(ls);
    });
    const returnArr = [];
    const firstDataTime = getTimeValue(newData[0]);
    const lastDataTime = getTimeValue(newData[newData.length - 1]);
    // return newData
    for (
        let i = moment(moment(firstDataTime).format('YYYY-MM-DD HH:mm:00')).valueOf();
        i >= moment(lastDataTime).valueOf();
        i -= duringTime
    ) {
        const arr = [];
        newData.forEach((ls, index) => {
            const timeStep = moment(getTimeValue(ls)).valueOf();
            const preTime = moment(moment(i - duringTime).format('YYYY-MM-DD HH:mm:00')).valueOf();
            const nextTime = moment(moment(i).format('YYYY-MM-DD HH:mm:59')).valueOf();
            if (timeStep >= preTime && timeStep <= nextTime) {
                arr.push(ls);
                newData.splice(index, 1);
            }
        });
        const finalData = arr[0];

        if (finalData) {
            returnArr.push(finalData);
        }
    }
    return returnArr;
};
export const formateLinkData = (data, duringTime) => {
    if (!data || data.length === 0) return [];
    const newData = data.filter((ls) => {
        return getTimeValue(ls);
    });
    const returnArr = [];
    const firstDataTime = getTimeValue(newData[0]);
    const lastDataTime = getTimeValue(newData[newData.length - 1]);
    for (let i = moment(firstDataTime).valueOf(); i >= moment(lastDataTime).valueOf(); i -= duringTime) {
        console.log(i, moment(i).format('YYYY-MM-DD HH:mm'));
        const arr = [];
        newData.forEach((ls, index) => {
            const timeStep = moment(getTimeValue(ls)).valueOf();
            if (timeStep >= i - duringTime && timeStep < i) {
                arr.push(ls);
                newData.splice(index, 1);
            }
        });
        const finalData = arr[arr.length - 1];
        if (finalData) {
            returnArr.push(finalData);
        }
    }
    return returnArr;
};
