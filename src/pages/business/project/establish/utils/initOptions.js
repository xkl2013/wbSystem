import {
    getProjectType,
    getCooperationProduct,
    getCooperationIndustry,
    getCooperationBrand,
} from '@/services/dictionary';
import { getCustomerOrderPlatForm } from '@/pages/business/customer/thread/services';
import { PROJECT_TYPE } from '@/utils/enum';
// 获取项目类型列表
export const getProjectTypeFunc = async (cb) => {
    const response = await getProjectType();
    if (response && response.success) {
        const projectType = response.data || PROJECT_TYPE;
        cb({ projectType });
    }
};

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
export const initProjecting = (cb) => {
    getProjectTypeFunc(cb);
    getCustomerOrderPlatFormFunc(cb);
    getCooperationProductFunc(cb);
    getCooperationIndustryFunc(cb);
    getCooperationBrandFunc(cb);
};
export const initProjectingDetail = (cb) => {
    getProjectTypeFunc(cb);
    getCustomerOrderPlatFormFunc(cb);
};
export default initProjecting;
