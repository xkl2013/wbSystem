/* eslint-disable */
import React, { useRef } from 'react';
import IconFont from '@/components/CustomIcon/IconFont';
import { config } from '@/submodule/components/apolloTable';
import { getFormat } from '@/submodule/components/apolloTable/component/base';
import Talent from './index';
import s from './modal.less';
import { Popover } from 'antd';

const TalentChild = (props) => {
    const { columnConfig, rowData, value, cellRenderProps, origin, form, getInstanceDetail } = props;
    const { columnType, columnName } = columnConfig;
    const { onParentRowSync } = cellRenderProps || {};

    let itemConfig = config[columnType] || config['1'];
    let formatValue = value;
    if (columnName === 'talent') {
        itemConfig = config['13'];
    } else {
        const text = [];
        if (Array.isArray(value)) {
            value.map((item) => {
                text.push(getFormat(itemConfig, columnConfig, [item]));
            });
        }
        const textStr = text.join('、');
        formatValue = [{ text: textStr, value: textStr }];
        itemConfig = config['1'];
    }
    const Detail = itemConfig.detailComp;

    let style = {};
    if (origin === 'editForm') {
        style = {
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '0 4px',
        };
        if (columnName === 'talent') {
            style.padding = '5px 4px 0';
        }
    }
    const container = useRef(null);

    const extra = {};
    if (origin === 'editForm') {
        // 将子弹框定位到父弹框中
        extra.getPopupContainer = () => {
            return container.current;
        };
    }

    return (
        <div className={s.container} style={style} ref={container}>
            <div className={s.cellDetail}>
                {formatValue && formatValue.length > 0 ? (
                    <Detail
                        {...props}
                        value={formatValue}
                        formatter={itemConfig.getFormatter}
                        componentAttr={{ ...props.componentAttr, mode: 'multiple' }}
                    />
                ) : (
                    '-'
                )}
            </div>
            {origin !== 'detailForm' && (
                <Popover
                    trigger="click"
                    placement="right"
                    overlayClassName={s.overlayClassName}
                    {...extra}
                    content={
                        <Talent
                            parentRowId={rowData.id}
                            onParentRowSync={onParentRowSync}
                            form={form}
                            getInstanceDetail={getInstanceDetail}
                        />
                    }
                >
                    <IconFont className={s.icon} type="iconzhankai11" />
                </Popover>
            )}
        </div>
    );
};

export default TalentChild;
