import React from 'react';
import BrandManage from '@/pages/business/project/establish/components/brandManage';
import { SetFormatter } from '@/components/airTable/component/baseComponent/_utils/setFormatter';
import { GetFormatter } from '@/components/airTable/component/baseComponent/_utils/getFormatter';

const AddBrand = (props) => {
    const { value, changeParams, columnConfig } = props;
    const { columnAttrObj } = columnConfig;

    const formatValue = GetFormatter.CASCADER(value);

    const changeBrand = (brand, selectOptions) => {
        if (typeof changeParams === 'function') {
            const formatBrand = SetFormatter.CASCADER(brand, columnAttrObj, selectOptions);
            changeParams(formatBrand, selectOptions);
        }
    };
    return <BrandManage {...columnAttrObj} {...props} value={formatValue} onChange={changeBrand} />;
};
export default AddBrand;
