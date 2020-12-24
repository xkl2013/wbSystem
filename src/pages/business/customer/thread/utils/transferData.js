import _ from 'lodash';

// 详情转化为form表单
export const detail2form = (detail) => {
    const formData = _.cloneDeep(detail);
    formData.trailType = '1';
    formData.trailTypeComb = true;
    return formData;
};
// 表单转化为提交数据
export const form4submit = (form) => {
    const temp = _.cloneDeep(form);
    // 删除临时数据
    delete temp.projectType;
    delete temp.platformData;
    delete temp.cooperationIndustry;
    delete temp.cooperationProduct;
    delete temp.trailSigningCompany;
    delete temp.trailTypeComb;
    return temp;
};
export default {
    detail2form,
    form4submit,
};
