/* eslint-disable max-len */
import { fileConfig } from '../config';

export const checkoutFileType = (url = '') => {
    const typeArr = url.match(/\.[a-zA-Z]+$/);
    let type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
    type = type.toLowerCase();
    if (type === 'png' || type === 'jpg' || type === 'gif' || type === 'bmp' || type === 'jpeg' || type === 'heic') {
        return { thumbUrl: `${url}?imageView2/1/w/120/h/120`, fileType: type };
    }
    return fileConfig[type] ? fileConfig[type] : fileConfig.other;
};
export const previewFile = (url) => {
    const typeArr = url.match(/\.[a-zA-Z]+$/);
    let type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
    type = type.toLowerCase();
    if (
        type === 'png'
        || type === 'jpg'
        || type === 'gif'
        || type === 'bmp'
        || type === 'jpeg'
        || type === 'pdf'
        || type === 'heic'
    ) {
        window.open(url, '_blank');
    } else {
        const new_url = `https://view.officeapps.live.com/op/view.aspx?src=${url}`;
        window.open(new_url, '_blank');
    }
};
export const handleName = (url) => {
    const typeArr = url.match(/\.[a-zA-Z]+$/);
    if (!typeArr || typeArr.length === 0) return [url];
    const newStr = url.replace(typeArr[0], '');
    return [newStr, typeArr[0]];
};
