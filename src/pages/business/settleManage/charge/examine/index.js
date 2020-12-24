import React, { Component } from 'react';
import { message } from 'antd';
import moment from 'moment';
import AriTable from '@/components/airTable';
import { process } from '../service';
import BIModal from '@/ant_components/BIModal';
import businessConfig from '@/config/business';
import { getKeys } from '@/utils/utils';
import DownLoad from '@/components/DownLoad';
import style from '../index.less';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';

export default class Examine extends Component {
    process = async (operationType, { data }) => {
        const groupIds = getKeys(data, 'groupId');
        const response = await process({ data: { groupIds, operationType } });
        if (response && response.success) {
            message.success(operationType === 3 ? '审核成功' : '退回成功');
        }
    };

    check = ({ data }, callback) => {
        const groupIds = getKeys(data, 'groupId');
        BIModal.confirm({
            title: '审核',
            content: `您本次共选择审核数量为${groupIds.length}条，审核通过后会触发生成项目合同收款数据，此过程不可逆 ，是否确定审核？`,
            onOk: callback,
        });
    };

    checkFail = ({ data }, callback) => {
        const groupIds = getKeys(data, 'groupId');
        BIModal.confirm({
            title: '退回',
            content: `您本次共选择退回数量为${groupIds.length}条，此过程不可逆 ，是否确定退回？`,
            onOk: callback,
        });
    };

    exportData = ({ btn }) => {
        const attr = businessConfig[16] || {};
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/contract/receipt/export/${attr.tableId}`}
                params={{ method: 'post', data: {} }}
                fileName={() => {
                    return `${attr.name}数据导出${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                }}
                textClassName={style.exportContainer}
                text={
                    <BIButton type="default" className={style.btn}>
                        {btn.icon}
                        <span className={style.text}>{btn.label}</span>
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    render() {
        const attr = businessConfig[16] || {};
        return (
            <AriTable
                {...attr}
                btns={[
                    {
                        label: '审核',
                        icon: 'iconliebiaoye-shenhe',
                        onClick: this.process.bind(this, 3),
                        type: 'multiple',
                        check: this.check,
                    },
                    {
                        label: '退回',
                        icon: 'iconhuitui',
                        onClick: this.process.bind(this, 4),
                        type: 'multiple',
                        check: this.checkFail,
                    },
                    {
                        label: '导出',
                        icon: <IconFont type="iconliebiaoye-daochu" />,
                        download: this.exportData,
                        type: 'multiple',
                    },
                ]}
            />
        );
    }
}
