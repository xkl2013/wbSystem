import React from 'react';
import FormTable from '@/components/FormTable';
import { formatSelfCols } from '../../../components/projectObligation/selfForm';
import { columnsFn } from '../../../components/projectObligation/selfTable';
import { isNumber } from '@/utils/utils';

const AppointTable = (props) => {
    const { trailPlatformOrder, trailOrderPlatformId } = props.formData;
    return (
        <FormTable
            tableCols={columnsFn.bind(this, { formData: props.formData, from: 'detail' })}
            formCols={formatSelfCols.bind(this, props)}
            value={props.value}
            bordered={true}
            initForm={(record) => {
                record.projectId = props.formData.projectingId;
                if (Number(trailPlatformOrder) === 1) {
                    // 平台项目默认推广平台为下单平台
                    record.projectPopularizePlatform = trailOrderPlatformId;
                    record.hasShoppingCart = isNumber(record.hasShoppingCart) ? record.hasShoppingCart : '0';
                }
                if (Number(trailPlatformOrder) === 2) {
                    // 长期项目默认执行进度类型为手动输入
                    record.projectAppointmentProgressType = isNumber(record.projectAppointmentProgressType)
                        ? record.projectAppointmentProgressType
                        : '1';
                }
                return record;
            }}
            disabled={props.disabled}
            submitCallback={(type, data, cb) => {
                return props.editAppoint(type, data, cb);
            }}
            delCallback={(data) => {
                return props.delAppoint(data);
            }}
            delKeys={['shoppingCartUrl', 'shoppingCartProduct', 'productSoldOutTime']}
            scroll={{ x: 2500 }}
        />
    );
};

export default AppointTable;
