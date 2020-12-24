import services from './services';
import Step from '../components/step';
import Detail from '../components/step/detail';
// 兼容消息模块
const defaultConfig = {
    ...services,
    cellRender: ({ columnConfig }) => {
        const { columnName } = columnConfig || {};
        Step.Detail = Detail;
        if (columnName === 'pointGress') {
            return { component: Step };
        }
    },
    noDel: true,
    noAdd: true,
};
export default defaultConfig;
