import { getUserList } from '@/services/globalSearchApi';

const renderProjectingRecommend = (obj) => {
    const {
        formData: { projectingSource },
    } = obj;
    const numProjectingSource = Number(projectingSource);
    // 来源为员工时，显示
    return (
        numProjectingSource === 5 && {
            label: '推荐人',
            key: 'projectingRecommender',
            placeholder: '请输入',
            type: 'associationSearch',
            componentAttr: {
                request: (val) => {
                    return getUserList({
                        userChsName: val,
                        pageSize: 50,
                        pageNum: 1,
                    });
                },
                initDataType: 'onfocus',
                fieldNames: { value: 'userId', label: 'userChsName' },
                allowClear: true,
            },
            getFormat: (value, form) => {
                form.projectingRecommenderId = value.value;
                form.projectingRecommender = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.projectingRecommender, value: form.projectingRecommenderId };
            },
        }
    );
};
export default renderProjectingRecommend;
