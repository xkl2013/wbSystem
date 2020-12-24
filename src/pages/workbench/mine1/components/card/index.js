import React from 'react';
import { Checkbox } from 'antd';
import { renderTxt } from '@/utils/hoverPopover';
import IconFont from '@/components/CustomIcon/IconFont';
import { fetchCardFinishflagStatus } from '../../../_components/modalForm/task/components/subTask/_utils';
import TagCom from '../../../_components/modalForm/task/components/tag';
import styles from './index.less';

const Card = (props) => {
    const { data = {}, getData } = props || {};
    const card = data.card || {};
    const goDetailPage = (val = {}) => {
        const params = {
            type: Number(val.card.type),
            isEdit: 1,
            id: val.card.id,
        };
        props.goDetail(params);
    };
    // 已完成
    const showDelCls = (val) => {
        if (val === '1') {
            return `${styles.wrap} ${styles.delWrap}`;
        }
        return `${styles.wrap}`;
    };
    // 执行状态
    // const showIconCls = (finishFlag, beginTime) => {
    //     const isStart = moment().isBefore(beginTime);
    //     if (finishFlag === '1') {
    //         return '#8C97A3';
    //     }
    //     if (finishFlag === '0') {
    //         if (isStart) {
    //             return '#F7B500';
    //         }
    //         return '#04B4AD';
    //     }
    // };
    // 主任务
    const mainTaskDom = (dataCard) => {
        if (!dataCard.parentSchedule.text) return null;
        return (
            <div className={styles.mainTaskCls}>
                父任务:
                {renderTxt(dataCard.parentSchedule.text, 15)}
            </div>
        );
    };
    // 优先级和子任务
    const titleDom = (dataCard) => {
        const color = () => {
            switch (Number(dataCard.schedulePriority)) {
                case 2:
                    return { color: '#F7B500', icon: 'iconjinji' };
                case 3:
                    return { color: '#F05969', icon: 'iconfeichangjinji' };
                default:
                    break;
            }
        };
        const colorObj = color() || {};
        const isShowJinji = JSON.stringify(colorObj) === '{}';
        return (
            <div className={styles.titleDomCls}>
                {isShowJinji ? null : (
                    <IconFont
                        className={styles.iconTitleCls}
                        style={{ color: colorObj.color }}
                        type={`${colorObj.icon}`}
                    />
                )}
                {dataCard.isHaveChildTask === '1' ? (
                    <IconFont className={styles.iconTitleCls} type="iconzirenwu" />
                ) : null}
            </div>
        );
    };
    // 卡片内容
    const renderContent = () => {
        return (
            <>
                {card.type === '1' && card.parentSchedule.value !== '0' ? mainTaskDom(card) : null}
                <div className={styles.content}>
                    <div className={styles.itemWrap}>
                        <IconFont type="iconziduan-ren" className={styles.itemIcon} />
                        <div className={styles.itemContent}>
                            <p className={styles.nameCls}>{card.leadingUser}</p>
                        </div>
                    </div>
                    <div className={styles.itemWrap}>
                        <IconFont type="iconziduan-riqi" className={styles.itemIcon} />
                        <div
                            className={styles.itemContent}
                            style={{ color: `${String(card.overdueFlag) === '1' ? '#F05969' : '#2C3F53'}` }}
                        >
                            {card.rangeTime}
                        </div>
                    </div>
                    {card.type === '1' && card.scheduleTags.length ? (
                        <div className={`${styles.itemWrap} ${styles.tagItem}`}>
                            <IconFont type="iconbiaoqian" className={styles.itemIcon} />
                            <div
                                className={styles.itemContent}
                                style={{ color: `${String(card.overdueFlag) === '1' ? '#F05969' : '#2C3F53'}` }}
                            >
                                <TagCom hideAddBtn tagList={card.scheduleTags} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </>
        );
    };
    // 点击复选框的时候需要修改完成状态
    const onChange = (e, status) => {
        e.stopPropagation();
        const params = {
            currentId: Number(data.card.id),
            status: status === '1' ? 0 : 1,
            callBack: () => {
                if (getData) getData(data.card.id);
            },
        };
        fetchCardFinishflagStatus(params);
    };
    return (
        <div
            className={showDelCls(card.finishFlag)}
            onClick={() => {
                return goDetailPage(data);
            }}
        >
            <div className={styles.titleWrap}>
                {card.type === '1' ? (
                    <>
                        <div
                            className={styles.modalCls}
                            onClick={(e) => {
                                return onChange(e, card.finishFlag);
                            }}
                        />
                        <Checkbox checked={card.finishFlag === '1'} />
                    </>
                ) : (
                    <span className={styles.iconCls} style={{ background: '#04B4AD' }} />
                )}
                <span className={styles.titleCls}>
                    {renderTxt(card.scheduleName, 16)}
                    {''}
                    {card.type === '1' ? titleDom(card) : null}
                </span>
            </div>
            {card.finishFlag !== '1' ? renderContent() : null}
        </div>
    );
};
export default Card;
