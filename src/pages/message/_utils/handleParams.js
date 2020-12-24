import qs from 'qs';
import { Base64 } from 'js-base64';

export const getParams = (listParams, props) => {
    const newParams = listParams;
    const {
        match: { params },
    } = props;
    try {
        let pathParams = Base64.decode(params.id) || {};
        pathParams = qs.parse(pathParams);
        const keys = Object.keys(newParams);
        Object.keys(pathParams).forEach((ls) => {
            if (keys.includes(ls)) {
                newParams[ls] = pathParams[ls] || undefined;
            }
        });
    } catch (e) {
        console.wran(222, e);
    }
    return newParams;
};
export const setParams = (params, props) => {
    const path = `/foreEnd/message/${Base64.encode(qs.stringify(params))}`;
    props.history.replace(path);
};
