/* eslint-disable */
import React, { PureComponent } from 'react';
import IconFont from '@/components/CustomIcon/IconFont';
import { Tooltip } from 'antd';
import { config } from '../../../../config';
import s from './index.less';

export default class TableColumn extends PureComponent {
    render() {
        const { type, title, width, columnAttrObj = {}, requiredFlag } = this.props;
        let icon = config[type] && config[type].icon;
        const { isMultiple, questionText } = columnAttrObj || {};
        if (String(type) === '13' && !isMultiple) {
            icon = 'iconziduan-lianxiangdanxuan';
        }
        return (
            <div className={s.colContainer} style={{ width }}>
                <div className={s.colBrief}>
                    {icon && (typeof icon === 'string' ? <IconFont className={s.colIcon} type={icon} /> : icon)}
                    <span className={requiredFlag ? `${s.colTitle} ${s.required}` : s.colTitle}>
                        {title}
                        {questionText && (
                            <Tooltip title={questionText}>
                                <div className={s.tipContainer}>?</div>
                            </Tooltip>
                        )}
                    </span>
                </div>
            </div>
        );
    }
}
