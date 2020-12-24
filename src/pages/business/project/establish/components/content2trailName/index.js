import _ from 'lodash';
import { getContentFollowDetail } from '@/pages/business/project/establish/services';
import { getContentFollowList } from '@/services/globalSearchApi';
import { content2projecting } from './transfer';

// 选择内容客户项目触发联动
const changeContentProject = async (obj, item) => {
    const { projectingType, projectingTrailType, projectingTypeComb } = obj.formData;
    const temp = {};
    // 项目类型
    temp.projectingType = projectingType;
    // 线索类型（与后台自定义）
    temp.projectingTrailType = projectingTrailType;
    temp.projectingTypeComb = projectingTypeComb;
    if (item.key) {
        const response = await getContentFollowDetail(14, item.key);
        if (response && response.success && response.data) {
            temp.projectingTrailId = item.key;
            response.data.projectingType = projectingType;
            const projecting = await content2projecting(response.data);
            _.assign(temp, projecting);
        }
    }
    obj.changeSelfForm(temp, true);
};

const renderContentProjectingName = (obj) => {
    return {
        label: '内容客户跟进',
        key: 'projectingTrailId',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择内容客户跟进',
                },
            ],
        },
        placeholder: '请选择',
        componentAttr: {
            request: (val) => {
                return getContentFollowList(14, { pageNum: 1, pageSize: 50, name: val });
            },
            fieldNames: { value: 'followId', label: 'projectName' },
            onChange: changeContentProject.bind(this, obj),
            allowClear: true,
            initDataType: 'onfocus',
        },
        type: 'associationSearch',
        disabled: !!(obj && obj.formData && obj.formData.projectingId),
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
export default renderContentProjectingName;
