/**
 *@author   zhangwenshuai
 *@date     2019-06-22 13:33
 * */
import React from 'react';
import BIRadio from '@/ant_components/BIRadio';
import { FEE_TYPE } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed, dataMask4Number } from '@/utils/utils';
import BIInputNumber from '@/ant_components/BIInputNumber';
import Information from '@/components/informationModel';
import businessConfig from '@/config/business';
import s from './index.less';

// 获取table列表头
export function columnsFn(props) {
    const { editable, formData } = props.props;
    const { yearFrameType } = formData;
    const noEdit = Number(yearFrameType) === 1 || Number(yearFrameType) === 2;
    const renderItem = ({ inputKey, radioKey, disabled }, text, record) => {
        if (editable) {
            return (
                <>
                    <div className={s.tableInput}>
                        <BIInputNumber
                            placeholder="请输入(元)"
                            value={text}
                            style={{ width: '100%' }}
                            min={0}
                            max={9999999999.99}
                            precision={2}
                            onChange={props.changeInput.bind(this, inputKey, record)}
                            disabled={disabled}
                        />
                    </div>
                    <div className={s.tableRadio}>
                        <BIRadio
                            value={record && record[radioKey] && String(record[radioKey])}
                            onChange={props.changeRadio.bind(this, radioKey, record)}
                            disabled={disabled}
                        >
                            {FEE_TYPE.map((fee) => {
                                return (
                                    <BIRadio.Radio style={{ display: 'block' }} key={fee.id} value={fee.id}>
                                        {fee.name}
                                    </BIRadio.Radio>
                                );
                            })}
                        </BIRadio>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className={s.tableDiv}>
                    <span className={s.tableSpan}>
                        {disabled ? '-' : `${dataMask4Number(text || 0, 0, thousandSeparatorFixed)}(元)`}
                    </span>
                </div>
                <div className={s.tableDiv}>
                    <span className={s.tableSpanbg}>
                        {disabled
                            ? '-'
                            : record
                            && record[radioKey]
                            && dataMask4Number(record[radioKey], 0, (value) => {
                                return getOptionName(FEE_TYPE, String(value));
                            })}
                    </span>
                </div>
            </>
        );
    };

    function renderTitle(title, required = true) {
        return editable && required ? (
            <div className={s.requireTitle}>{title}</div>
        ) : (
                <div className={s.noRequireTitle}>{title}</div>
            );
    }
    const columns = [
        {
            title: renderTitle('艺人/博主', false),
            dataIndex: 'talentName',
            width: '180px',
            render: (name, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.talentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.talentId,
                    name,
                    path,
                };
                return (
                    <span style={{ textAlign: 'center' }}>
                        <Information data={[data]} />
                    </span>
                );
            },
        },
        {
            title: renderTitle('预估妆发及拍摄费'),
            dataIndex: 'makeupCost',
            width: '180px',
            render: renderItem.bind(this, { inputKey: 'makeupCost', radioKey: 'makeupCostType' }),
        },
        {
            title: renderTitle('预估渠道营销费', !noEdit),
            dataIndex: 'intermediaryCost',
            width: '180px',
            render: (text, record) => {
                if (noEdit) {
                    return renderItem(
                        { inputKey: 'intermediaryCost', radioKey: 'intermediaryCostType', disabled: true },
                        text,
                        record,
                    );
                }
                return renderItem({ inputKey: 'intermediaryCost', radioKey: 'intermediaryCostType' }, text, record);
            },
        },
        {
            title: renderTitle('预估差旅费'),
            dataIndex: 'tripCost',
            width: '180px',
            render: renderItem.bind(this, { inputKey: 'tripCost', radioKey: 'tripCostType' }),
        },
        {
            title: renderTitle('预估业务招待费'),
            dataIndex: 'invitationCost',
            width: '180px',
            render: renderItem.bind(this, { inputKey: 'invitationCost', radioKey: 'invitationCostType' }),
        },
        {
            title: renderTitle('预估制作费'),
            dataIndex: 'makeCost',
            width: '180px',
            render: renderItem.bind(this, { inputKey: 'makeCost', radioKey: 'makeCostType' }),
        },
        {
            title: renderTitle('预估其他费用'),
            dataIndex: 'otherCost',
            width: '180px',
            render: renderItem.bind(this, { inputKey: 'otherCost', radioKey: 'otherCostType' }),
        },
    ];
    return columns || [];
}
export default columnsFn;
