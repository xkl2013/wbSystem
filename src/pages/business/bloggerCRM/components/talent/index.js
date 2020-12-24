import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { ApolloSearch } from '@/submodule/components/apolloTable/component/base/edit';
import { getSearchList } from '@/services/globalSearchApi';

const TalentSearch = (props) => {
    const {
        type, form, aipService, url, rowData, origin, ...others
    } = props;

    let productType;
    if (origin === 'editForm') {
        // 表单
        productType = form.getFieldValue('productType');
    } else {
        // 表格
        const productTypeObj = rowData.rowData.find((item) => {
            return item.colName === 'productType';
        });
        if (productTypeObj) {
            productType = productTypeObj.cellValueList[0].value;
        }
    }

    const newRequest = (val) => {
        const data = { name: val, fieldValueName: type };
        if (productType && (Number(productType) === 0 || Number(productType) === 1)) {
            data.paramsJson = JSON.stringify({ talentType: productType });
        }
        return getSearchList({ prefix: aipService, url, data });
    };
    return <ApolloSearch {...others} request={newRequest} />;
};
export default TalentSearch;
