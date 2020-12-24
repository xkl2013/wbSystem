import { getCooperationProduct, getCooperationIndustry, getCooperationBrand } from '@/services/dictionary';
import { getCustomerOrderPlatForm } from '@/pages/business/customer/thread/services';

// 获取下单平台列表
const getCustomerOrderPlatFormFunc = async (cb) => {
    const response = await getCustomerOrderPlatForm();
    if (response && response.success) {
        const data = response.data || {};
        let platformData = data.list || [];
        platformData = platformData.map((item) => {
            return {
                ...item,
                id: item.customerOrderPlatformId,
                name: item.customerOrderPlatformName,
            };
        });
        cb({ platformData });
    }
};

// 获取合作产品列表
const getCooperationProductFunc = async (cb) => {
    const response = await getCooperationProduct();
    if (response && response.success) {
        const cooperationProduct = response.data || [];
        cb({ cooperationProduct });
    }
};

// 获取合作行业列表
const getCooperationIndustryFunc = async (cb) => {
    const response = await getCooperationIndustry();
    if (response && response.success) {
        const cooperationIndustry = response.data || [];
        cb({ cooperationIndustry });
    }
};

// 获取合作品牌列表
const getCooperationBrandFunc = async (cb) => {
    const response = await getCooperationBrand();
    if (response && response.success) {
        const cooperationBrand = response.data || [];
        cb({ cooperationBrand });
    }
};
export const initContract = (cb) => {
    getCustomerOrderPlatFormFunc(cb);
    getCooperationProductFunc(cb);
    getCooperationIndustryFunc(cb);
    getCooperationBrandFunc(cb);
};
export const initContractDetail = (cb) => {
    getCustomerOrderPlatFormFunc(cb);
};
export default initContract;
