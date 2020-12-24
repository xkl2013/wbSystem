// import BrandManage from '@/pages/business/project/establish/components/brandManage';
import AddBrand from './addBrand';
import services from './service';
// 兼容消息模块
const defaultConfig = {
    ...services,
    cellRender: ({ columnConfig }) => {
        const { columnName } = columnConfig || {};
        if (columnName === 'cooperationBrand') {
            return { component: AddBrand };
        }
    },
};
export default defaultConfig;
