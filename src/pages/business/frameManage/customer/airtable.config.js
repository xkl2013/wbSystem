import services from './services';
import Step from '../components/step';
import Detail from '../components/step/detail';
import DateArea from '../components/dateArea';
// 兼容消息模块
const defaultConfig = {
    ...services,
    cellRender: ({ columnConfig }) => {
        const { columnName } = columnConfig || {};
        if (columnName === 'greesRole') {
            Step.Detail = Detail;
            return { component: Step };
        }
        if (columnName === 'checkDate') {
            return { component: DateArea };
        }
    },
    noCopy: true,
};
export default defaultConfig;
