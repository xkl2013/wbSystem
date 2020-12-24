export const getCityOps = ([pId, cityId, countyId]: any, citys) => {
    const priviceObj = citys.find((ls: any) => { return ls.value === pId; }) || {};
    const cityObj = (priviceObj.children || []).find((ls: any) => { return ls.value === cityId; }) || {};
    const countryObj = (cityObj.children || []).find((ls: any) => { return ls.value === countyId; }) || {};
    return [priviceObj, cityObj, countryObj].filter((ls: any) => { return ls && ls.value; }).map((ls) => { return { value: ls.code, label: ls.label }; });
};
export const formateCity = (arr: any) => {
    if (!arr || arr.length === 0) return [];
    return arr.map((ls: any) => {
        if (ls.cityList || ls.areaList) {
            return {
                ...ls,
                label: ls.name,
                value: ls.code,
                children: formateCity(ls.cityList || ls.areaList),
            };
        }
        return {
            ...ls,
            label: ls.name,
            value: ls.code,
        };
    });
};
