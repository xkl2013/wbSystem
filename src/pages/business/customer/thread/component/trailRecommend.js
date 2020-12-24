import { getUserList } from '@/services/globalSearchApi';

const renderTrailRecommend = (obj) => {
    const {
        formData: { trailSource },
    } = obj;
    // 来源为员工时，显示
    return (
        Number(trailSource) === 5 && {
            label: '推荐人',
            key: 'trailRecommender',
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
                fieldNames: { value: 'userId', label: 'userChsName' },
                allowClear: true,
            },
            getFormat: (value, form) => {
                form.trailRecommender = value.label;
                form.trailRecommenderId = value.value;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.trailRecommender, value: form.trailRecommenderId };
            },
        }
    );
};
export default renderTrailRecommend;
