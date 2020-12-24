import React from 'react';
import { getCustomerList } from '@/services/globalSearchApi';
import { getYearFrame } from '@/pages/business/project/establish/services';
import s from './customerName.less';

// 获取必填状态
const getRequired = (obj) => {
    // 没有数据时，默认非必填
    if (!obj || !obj.formData) {
        return false;
    }
    const { projectingCustomerType, trailPlatformOrder } = obj.formData;
    // 直客类型直客公司必填
    if (Number(projectingCustomerType) === 0) {
        return true;
    }
    // 平台单必填
    if (Number(trailPlatformOrder) === 1) {
        return true;
    }
    // 默认非必填
    return false;
};
// 获取不可编辑状态
const getDisabled = (obj, from) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    if (from === 'establish') {
        return false;
    }
    const { yearFrameCustomerId, projectingCustomerId } = obj.formData;
    // 关联年框时不可编辑
    return yearFrameCustomerId && Number(yearFrameCustomerId) === Number(projectingCustomerId);
};
const changeCustomer = async (obj, value) => {
    const { trailPlatformOrder, projectingCustomerType, realCustomerType } = obj.formData;
    const data = {
        projectingCustomerName: value,
    };
    // 年框客户类型默认为直客
    let customerType = 0;
    if (Number(trailPlatformOrder) === 1) {
        // 平台单客户可选直客和代理，因此用客户真实类型
        customerType = value.customerTypeId;
    } else {
        // 非平台单，如果是代理类型，则直客修改不联动年框
        // eslint-disable-next-line no-lonely-if
        if (Number(projectingCustomerType) === 1) {
            return obj.changeSelfForm(data);
        }
        if (Number(realCustomerType) === 2) {
            customerType = 2;
        }
    }
    const res = await getYearFrame({
        customerId: Number(value.value),
        customerType,
    });
    if (res && res.success) {
        if (res.data && res.data.length > 0) {
            data.showYearFrame = true;
            data.yearFrameCustomerId = Number(value.value);
            data.yearFrameCustomerType = customerType;
        } else {
            data.showYearFrame = false;
            data.yearFrameCustomerId = undefined;
            data.yearFrameCustomerType = undefined;
        }
        data.yearFrameType = undefined;
        data.yearFrameId = undefined;
        data.yearFrameName = undefined;
    }
    obj.changeSelfForm(data);
};
const renderProjectingCustomerName = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    return {
        label: Number(trailPlatformOrder) === 1 ? '下单客户名称' : '直客公司名称',
        key: 'projectingCustomerName',
        checkOption: {
            rules: [
                {
                    required: getRequired(obj),
                    message: '请输入直客公司名称',
                },
            ],
        },
        placeholder: '请输入',
        type: 'associationSearch',
        componentAttr: {
            allowClear: true,
            request: (val) => {
                const data = {
                    customerTypeIdList: [0, 2],
                    customerName: val || '',
                };
                if (Number(trailPlatformOrder) === 1) {
                    delete data.customerTypeIdList;
                }
                return getCustomerList(data);
            },
            fieldNames: { value: 'id', label: 'customerName' },
            initDataType: 'onfocus',
            selfCom: Number(trailPlatformOrder) === 1 && (
                <span className={s.tip}>
                    注：1.请优先填写真实返点公司；2.如果涉及三方下单，且两家公司均无返点协议，请填写其中的主导公司
                </span>
            ),
            onChange: changeCustomer.bind(this, obj),
            disabled: getDisabled(obj, from),
        },
        getFormat: (value, form) => {
            form.projectingCustomerId = value.value;
            form.projectingCustomerName = value.label;
            return form;
        },
        setFormat: (value, form) => {
            if (value.label || value.value || value.value === 0) {
                return value;
            }
            return { label: form.projectingCustomerName, value: form.projectingCustomerId };
        },
    };
};
export default renderProjectingCustomerName;
