import React from 'react';
import businessConfig from '@/config/business';
import Information from '@/components/informationModel';
import { getOptionName } from '@/utils/utils';
import { COMPANY_TYPE } from '@/utils/enum';

const getCompanyCols = (formData) => {
    const customerType = {
        key: 'projectingCustomerType',
        label: '公司类型',
        render: (detail) => {
            return getOptionName(COMPANY_TYPE, detail.projectingCustomerType);
        },
    };
    // 直客
    const customerName = {
        key: 'projectingCustomerName',
        label: Number(formData.trailPlatformOrder) === 1 ? '下单客户名称' : '直客公司名称',
        render: (detail) => {
            if (detail) {
                const customConfig = businessConfig[3];
                const data = {
                    id: detail.projectingCustomerId,
                    name: detail.projectingCustomerName,
                    path: customConfig.pathname,
                };
                return <Information data={[data]} />;
            }
        },
    };
    // 代理
    const companyName = {
        key: 'projectingCompanyName',
        label: '代理公司名称',
        render: (detail) => {
            if (detail) {
                const customConfig = businessConfig[3];
                const data = {
                    id: detail.projectingCompanyId,
                    name: detail.projectingCompanyName,
                    path: customConfig.pathname,
                };
                return <Information data={[data]} />;
            }
        },
    };
    // 直客
    if (Number(formData.projectingCustomerType) === 0) {
        return [[customerType, customerName, {}, {}]];
    }
    // 代理
    if (Number(formData.projectingCustomerType) === 1) {
        return [[customerType, companyName, customerName, {}]];
    }
    return [[]];
};
export default getCompanyCols;
