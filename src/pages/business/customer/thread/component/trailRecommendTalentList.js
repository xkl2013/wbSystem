import { getTalentList } from '@/services/globalSearchApi';

const renderTrailRecommendTalentList = (obj) => {
    const { trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) !== 2 && {
            label: '推荐艺人或博主',
            key: 'trailRecommendTalentList',
            componentAttr: {
                request: (val) => {
                    return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                },
                fieldNames: {
                    value: (val) => {
                        return `${val.talentId}_${val.talentType}`;
                    },
                    label: 'talentName',
                },
                mode: 'multiple',
                initDataType: 'onfocus',
            },
            placeholder: '请选择',
            type: 'associationSearch',
            getFormat: (value, form) => {
                const arr = [];
                value.map((item) => {
                    arr.push({
                        trailTalentId: Number(item.value.split('_')[0]),
                        trailTalentName: item.label,
                        trailTalentType: Number(item.value.split('_')[1]),
                        trailTalentTargetType: 1,
                    });
                });
                form.trailRecommendTalentList = arr;
                return form;
            },
            setFormat: (value) => {
                const arr = [];
                if (!value) return value;
                value.map((item) => {
                    if (item.trailTalentId !== undefined) {
                        arr.push({
                            value: `${item.trailTalentId}_${item.trailTalentType}`,
                            label: item.trailTalentName,
                        });
                    } else if (item.value !== undefined) {
                        arr.push({ value: item.value, label: item.label });
                    } else return item;
                });
                return arr;
            },
        }
    );
};
export default renderTrailRecommendTalentList;
