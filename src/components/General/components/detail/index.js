import React from 'react';
import moment from 'moment';
import Upload from '@/components/upload';

/* eslint-disable */
export const DetailItem = (nodeObj) => {
    const formateValue = (item) => {
        const value = item.value;
        const itemType = item.type;
        if (!value) return value;
        const type = typeof value;
        switch (type) {
            case 'object':
                const isArr = Array.isArray(value);
                return isArr ? returnArrayValue(value, itemType) : formmateDatePicker(value.name, itemType);
            default:
                return formmateDatePicker(value, itemType);
        }
    };
    const formmateDatePicker = (value, type) => {
        const isData = /picker/i.test(type);
        if (!isData || !value) return value;
        return value;
        // return moment(value).format('YYYY-MM-DD');
    };
    const returnArrayValue = (arr, itemType) => {
        const newArr = arr.map((item) => {
            let newitem = item;
            if (typeof item === 'object' && item) {
                newitem = item.name;
            }
            return formmateDatePicker(newitem, itemType);
        });
        return newArr.join(',');
    };
    const checkoutItemType = (item) => {
        const type = item.type;
        switch (type) {
            case 'upload':
                return <Upload.Detail data={item.value} />;
            case 'imageupload':
                return <Upload.Detail data={item.value} />;
            default:
                return formateValue(item);
        }
    };
    const formattingData = (item) => {
        // 格式化日期
        if (item.type == 'datepicker') {
            item.value = item.value && moment(item.value).format('YYYY-MM-DD');
        } else if (item.type == 'timepicker' || item.type == 'rangepicker') {
            item.value = item.value && moment(item.value).format('YYYY-MM-DD HH:mm');
        }
        return item;
    };
    const renderItem = () => {
        const item = formattingData(nodeObj);
        return checkoutItemType(item);
    };
    return renderItem();
};

const Node = (props) => {
    return <div></div>;
};
export default Node;
