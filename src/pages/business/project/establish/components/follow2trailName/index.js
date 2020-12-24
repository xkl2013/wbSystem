import _ from 'lodash';
import { getCustomerFollowDetail } from '@/pages/business/project/establish/services';
import { getCustomerFollowList } from '@/services/globalSearchApi';
import { follow2projecting } from './transfer';
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
// 选择商务客户跟进触发联动
const changeCustomerFollow = async (obj, item) => {
    const { projectingType, projectingTrailType, trailPlatformOrder, projectingTypeComb } = obj.formData;
    const temp = {};
    // 项目类型
    temp.projectingType = projectingType;
    temp.trailPlatformOrder = trailPlatformOrder;
    // 线索类型（与后台自定义）
    temp.projectingTrailType = projectingTrailType;
    temp.projectingTypeComb = projectingTypeComb;
    if (item.key) {
        const response = await getCustomerFollowDetail(1, item.key);
        if (response && response.success && response.data) {
            temp.projectingTrailId = item.key;
            response.data.projectingType = projectingType;
            response.data.trailPlatformOrder = trailPlatformOrder;
            const projecting = await follow2projecting(response.data);
            _.assign(temp, projecting);
        }
    }
    obj.changeSelfForm(temp, true);
};
const renderCustomerProjectingName = (obj, { from }) => {
    return {
        label: '商务客户跟进',
        key: 'projectingTrailId',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择商务客户跟进',
                },
            ],
        },
        placeholder: '请选择',
        componentAttr: {
            request: (val) => {
                return getCustomerFollowList(1, {
                    pageNum: 1,
                    pageSize: 50,
                    name: val,
                });
            },
            fieldNames: { value: 'followId', label: 'projectName' },
            onChange: changeCustomerFollow.bind(this, obj),
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
export default renderCustomerProjectingName;
