import _ from 'lodash';
import { getTrailList } from '@/pages/business/project/establish/services';
import { trail2projecting } from './transfer';
// 获取不可编辑状态
const getDisabled = (obj, from) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { fromTrailDetail, projectingId } = obj.formData;
    if (from === 'establish') {
        // 从线索详情过来的不允许编辑
        if (fromTrailDetail) {
            return true;
        }
        // 重新提交不允许编辑
        if (projectingId) {
            return true;
        }
    } else if (from === 'manage') {
        // 项目不允许编辑
        return true;
    }
    // 默认可编辑
    return false;
};
// 选择线索触发联动
const changeTrail = async (obj, item) => {
    const { projectingType, projectingTrailType, projectingTypeComb } = obj.formData;
    const temp = {};
    temp.projectingType = projectingType;
    temp.projectingTrailType = projectingTrailType;
    temp.projectingTypeComb = projectingTypeComb;
    const projecting = await trail2projecting(item);
    _.assign(temp, projecting);
    obj.changeSelfForm(temp, true);
};
const renderProjectingTrailName = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    return {
        label: '线索名称',
        key: 'projectingTrailId',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请输入姓名',
                },
            ],
        },
        placeholder: '请输入',
        componentAttr: {
            request: (val) => {
                return getTrailList({
                    pageNum: 1,
                    pageSize: 50,
                    trailName: val,
                    trailStatusList: [1],
                    trailPlatformOrderList: [trailPlatformOrder || 0],
                });
            },
            fieldNames: { value: 'trailId', label: 'trailName' },
            onChange: changeTrail.bind(this, obj),
            allowClear: true,
            initDataType: 'onfocus',
        },
        type: 'associationSearch',
        disabled: getDisabled(obj, from),
        getFormat: (value, form) => {
            form.projectingTrailId = value.value;
            form.projectingTrailName = value.label;
            return form;
        },
        setFormat: (value, form) => {
            if (value.label || value.value || value.value === 0) {
                return value;
            }
            return {
                value: form.projectingTrailId,
                label: form.projectingTrailName,
            };
        },
    };
};
export default renderProjectingTrailName;
