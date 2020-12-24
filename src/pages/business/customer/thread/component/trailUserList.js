import { getUserList } from '@/services/globalSearchApi';

const renderTrailUserList = () => {
    return [
        {
            key: 'trailUserList',
            placeholder: '请选择',
            label: '执行人',
            type: 'associationSearch',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择执行人',
                    },
                ],
            },
            componentAttr: {
                mode: 'multiple',
                request: (val) => {
                    return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                },
                fieldNames: { value: 'userId', label: 'userChsName' },
                initDataType: 'onfocus',
            },
            getFormat: (value, form) => {
                const arr = [];
                value.map((item) => {
                    arr.push({
                        userId: item.value,
                        userChsName: item.label,
                        trailParticipantType: 10,
                    });
                });
                form.trailUserList = arr;
                return form;
            },
            setFormat: (value) => {
                const arr = [];
                if (value) {
                    value.map((item) => {
                        if (item.label || item.value || item.value === 0) {
                            arr.push(item);
                        } else if (Number(item.trailParticipantType) === 10) {
                            arr.push({
                                label: item.trailParticipantName || item.userChsName,
                                value: item.trailParticipantId || item.userId,
                            });
                        }
                    });
                }
                return arr;
            },
        },
        {},
        {},
    ];
};
export default renderTrailUserList;
