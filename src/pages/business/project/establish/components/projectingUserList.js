import { getUserList } from '@/services/globalSearchApi';

const renderProjectingUserList = () => {
    return {
        key: 'projectingUserList',
        placeholder: '请搜索执行人',
        label: '执行人',
        type: 'associationSearch',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '执行人不能为空',
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
                    projectingParticipantId: item.value,
                    projectingParticipantName: item.label,
                    projectingParticipantType: 10,
                });
            });
            form.projectingUserList = arr;
            return form;
        },
        setFormat: (value) => {
            const arr = [];
            if (value) {
                value.map((item) => {
                    if (item.label && item.value) {
                        arr.push(item);
                    } else if (Number(item.projectingParticipantType) === 10) {
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
export default renderProjectingUserList;
