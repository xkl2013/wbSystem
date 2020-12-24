import React, { PureComponent } from 'react';
import moment from 'moment';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';
import DownLoad from '@/components/DownLoad';
import style from '../index.less';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';

export default class Return extends PureComponent {
    exportData = ({ btn }) => {
        const attr = businessConfig[17] || {};
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
        const attr = businessConfig[17] || {};
        return (
            <AriTable
                {...attr}
                btns={[
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
