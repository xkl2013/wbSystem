import {
    renderProjectingType,
    renderProjectingTalent,
    renderProjectingName,
    renderProjectingDescription,
} from '../../establish/components';

const formatCols = (obj) => {
    return [
        {
            title: '项目基本信息',
            columns: [
                [renderProjectingType(obj, { from: 'manage' })],
                renderProjectingTalent(obj, { from: 'manage' }),
                [renderProjectingName(obj, { from: 'manage' }), renderProjectingDescription()],
            ],
        },
    ];
};

export default formatCols;
