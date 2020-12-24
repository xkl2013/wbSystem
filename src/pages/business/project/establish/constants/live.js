import {
    renderProjectingType,
    renderProjectingTalent,
    renderProjectingName,
    renderProjectingDescription,
} from '../components';

const formatCols = (obj) => {
    return [
        {
            title: '项目基本信息',
            columns: [
                [renderProjectingType(obj, { from: 'establish' })],
                renderProjectingTalent(obj, { from: 'establish' }),
                [renderProjectingName(obj, { from: 'establish' }), renderProjectingDescription()],
            ],
        },
    ];
};

export default formatCols;
