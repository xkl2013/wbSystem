import React from 'react';
import Cascader from '@/ant_components/BICascader';
import { dictionaryTree } from '@/services/dictionary';

function filter(inputValue, path) {
    return path.some((option) => {
        return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
}
export default function (props) {
    const {
        requestCode,
        allowClear = true,
        fieldNames = { label: 'label', value: 'value', children: 'children' },
        changeOnSelect = true,
        showSearch,
        placeholder,
        onChange,
        value,
    } = props;
    const [options, setOptions] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            const res = await dictionaryTree(requestCode);
            if (res && res.success && res.data) {
                setOptions(res.data);
            }
        };
        if (requestCode) {
            fetchData(requestCode);
        }
    }, [requestCode]);
    const selfProps = {
        fieldNames,
        allowClear,
        changeOnSelect,
        placeholder,
        onChange,
        value,
    };
    return <Cascader options={options} showSearch={showSearch ? { filter } : false} {...selfProps} />;
}
