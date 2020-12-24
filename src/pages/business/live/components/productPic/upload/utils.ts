import { fileType } from './fileType';

export const checkoutFileType = (url = '') => {
    const typeArr = url.match(/\.[a-zA-Z0-9]+$/);
    let type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
    type = type.toLowerCase();
    if (type === 'png' || type === 'jpg' || type === 'gif' || type === 'bmp' || type === 'jpeg' || type === 'heic') {
        return { thumbUrl: `${url}?imageView2/1/w/120/h/120`, fileType: type };
    }
    if (!type) {
        return { thumbUrl: url, fileType: 'image' };
    }
    return fileType[type] ? fileType[type] : fileType.other;
};
