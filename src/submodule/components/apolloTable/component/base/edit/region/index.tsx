import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { getCitys } from '@/services/api';
import { formateCity, getCityOps } from './_utils';

const formateVal = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((ls) => { return ls.value; });
};
const Picker = (props) => {
    const [citys, saveCitys] = useState([]);
    const [val, saveVal] = useState(formateVal(props.value));
    useEffect(() => { saveVal(formateVal(props.value)); }, [props.value]);
    const getAllCity = async () => {
        if (citys && citys.length > 0) return;
        let city = await getCitys();
        city = Array.isArray(city) ? city : [];
        city = formateCity(city);
        saveCitys(city);
    };
    const onChange = (v) => {
        const val = getCityOps(v, citys);
        if (props.onChange) {
            props.onChange(val);
        }
    };
    const onFocus = () => {
        getAllCity();
    };
    return (
        <Cascader
            placeholder="请选择"
            {...props}

            value={val}
            options={citys}
            onChange={onChange}
            onFocus={onFocus}
        />
    );
};
export default Picker;
