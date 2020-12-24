// 获取不可编辑状态
import _ from 'lodash';
import { isNumber } from '@/utils/utils';
import { getContentFollowDetail, getCustomerFollowDetail } from '@/pages/business/project/establish/services';
import { follow2projecting } from '@/pages/business/project/establish/components/follow2trailName/transfer';
import { content2projecting } from '@/pages/business/project/establish/components/content2trailName/transfer';
import { getSearch } from '@/utils/urlOp';

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
const changeType = async (obj, value) => {
    const newProjectingType = value[0] && Number(value[0].index);
    let followType; // 线索类型（与后台自定义3、商务客户2、内容客户）
    if (newProjectingType === 1) {
        followType = 3;
    } else if (newProjectingType === 2 || newProjectingType === 3) {
        followType = 2;
    }
    const data = {
        projectingTypeComb: value, // 组件值
        projectingType: newProjectingType, // 项目类型
        projectingTrailType: followType,
    };
    if (newProjectingType === 1) {
        data.trailPlatformOrder = (value[1] && value[1].index) || 0; // 商务需要区分第二级
    }
    const customerFollowId = getSearch('customerFollowId');
    const contentFollowId = getSearch('contentFollowId');

    if (followType === 3 && customerFollowId) {
        const response = await getCustomerFollowDetail(1, customerFollowId);
        if (response && response.success && response.data) {
            data.projectingTrailId = customerFollowId;
            response.data.projectingType = newProjectingType;
            response.data.trailPlatformOrder = data.trailPlatformOrder;
            const projecting = await follow2projecting(response.data);
            _.assign(data, projecting);
        }
    }
    if (followType === 2 && contentFollowId) {
        const response = await getContentFollowDetail(14, contentFollowId);
        if (response && response.success && response.data) {
            data.projectingTrailId = contentFollowId;
            response.data.projectingType = newProjectingType;
            const projecting = await content2projecting(response.data);
            _.assign(data, projecting);
        }
    }
    obj.changeSelfForm(data, true);
};
const renderProjectingType = (obj, { from }) => {
    // projectingType作为基本字段被多处使用，此处修改增加projectingTypeComb作为form表单处理字段，真实逻辑仍使用原业务字段
    let projectTypeOptions = obj.formData.projectType;
    // 新增的电商直播不能立项
    if (from === 'establish') {
        projectTypeOptions = projectTypeOptions.filter((o) => { return Number(o.index) !== 4; });
    }
    return {
        label: '项目类型',
        key: 'projectingTypeComb',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择项目类型',
                },
            ],
        },
        type: 'cascader',
        componentAttr: {
            onChange: changeType.bind(this, obj),
            disabled: getDisabled(obj, from),
            placeholder: '请选择',
            fieldNames: { label: 'value', value: 'index', children: 'children' },
            options: projectTypeOptions,
            changeOnSelect: false,
        },
        getFormat: (value, form) => {
            form.projectingType = Number(value[0]);
            form.trailPlatformOrder = Number(value[1]) || 0;
            return form;
        },
        setFormat: (value, form) => {
            if (Array.isArray(value)) {
                return value.map((item) => {
                    return isNumber(item.index) ? item.index : item;
                });
            }
            // form回填
            if (!form.projectingType) {
                return undefined;
            }
            if (Number(form.projectingType) === 1) {
                return [Number(form.projectingType), Number(form.trailPlatformOrder) || 0];
            }
            return [Number(form.projectingType)];
        },
    };
};
export default renderProjectingType;
