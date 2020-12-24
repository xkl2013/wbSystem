import { getUserList } from '@/services/globalSearchApi';

const renderProjectingUsers = () => {
    return {
        label: '参与人',
        key: 'projectingUsers',
        placeholder: '请选择',
        type: 'associationSearch',
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
                    projectingParticipantId: item.value,
                    projectingParticipantName: item.label,
                    projectingParticipantType: 6,
                });
            });
            form.projectingUsers = arr;
            return form;
        },
        setFormat: (value) => {
            const arr = [];
            if (value) {
                value.map((item) => {
                    if (item.label && item.value) {
                        arr.push(item);
                    } else if (Number(item.projectingParticipantType) === 6) {
                        arr.push({
                            label: item.projectingParticipantName,
                            value: item.projectingParticipantId,
                        });
                    }
                });
            }
            return arr;
        },
    };
};
export default renderProjectingUsers;
