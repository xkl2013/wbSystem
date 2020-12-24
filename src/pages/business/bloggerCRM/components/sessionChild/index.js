/* eslint-disable */
import React, { useState } from 'react';
import modalfy from '@/components/modalfy';
import IconFont from '@/components/CustomIcon/IconFont';
import { config } from '@/submodule/components/apolloTable';
import { getFormat } from '@/submodule/components/apolloTable/component/base';
import Talent from '@/pages/business/live/talentChild';
import s from './index.less';

const ModalfyChild = modalfy(Talent);
const TalentChild = (props) => {
    const { columnConfig, rowData, value, origin } = props;
    const { columnType, columnName } = columnConfig;

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

    const [visible, setVisible] = useState(false);
    const openChild = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        setVisible(true);
    };
    const closeChild = () => {
        setVisible(false);
    };

    return (
        <div className={s.container}>
            <div className={s.cellDetail}>
                {formatValue.length > 0 ? (
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
            {origin !== 'detailForm' && <IconFont className={s.icon} type="iconzhankai1" onClick={openChild} />}
            {visible && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopPropagation();
                    }}
                >
                    <ModalfyChild
                        visible={visible}
                        title="意向合作主播"
                        onCancel={closeChild}
                        width={748}
                        footer={null}
                        parentRowId={rowData.id}
                        from="session"
                    />
                </div>
            )}
        </div>
    );
};

export default TalentChild;
