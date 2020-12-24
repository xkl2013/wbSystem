import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { renderTxt } from '@/utils/hoverPopover';
import IconFont from '@/components/CustomIcon/IconFont';

const Card = (props) => {
    const { data = {} } = props || {};
    const card = data.card || {};
    const goDetailPage = (val) => {
        props.goDetail(val);
    };
    // 已完成
    const showDelCls = (val) => {
        if (val === '1') {
            return `${styles.wrap} ${styles.delWrap}`;
        }
        return `${styles.wrap}`;
    };
    // 执行状态
    const showIconCls = (finishFlag, beginTime) => {
        const isStart = moment().isBefore(beginTime);
        if (finishFlag === '1') {
            return '#8C97A3';
        }
        if (finishFlag === '0') {
            if (isStart) {
                return '#F7B500';
            }
            return '#04B4AD';
        }
    };
    return (
        <div
            className={showDelCls(card.finishFlag)}
            onClick={() => {
                return goDetailPage(data);
            }}
        >
            <div className={styles.title}>
                <span className={styles.iconCls} style={{ background: showIconCls(card.finishFlag, card.beginTime) }} />
                <span>{renderTxt(card.scheduleName, 12)}</span>
            </div>
            <div className={styles.content}>
                <div className={styles.itemWrap}>
                    <div className={styles.itemTitleWrap}>
                        <IconFont type="iconziduan-ren" className={styles.itemIcon} />
                        <span className={styles.itemTitle}>负责人：</span>
                    </div>
                    <div className={styles.itemContent}>
                        <p className={styles.nameCls}>{card.leadingUser}</p>
                    </div>
                </div>
                <div className={styles.itemWrap}>
                    <IconFont type="iconziduan-riqi" className={styles.itemIcon} />
                    <span className={styles.itemTitle}>起止时间：</span>
                    <div
                        className={styles.itemContent}
                        style={{ color: `${String(card.overdueFlag) === '1' ? '#F05969' : '#2C3F53'}` }}
                    >
                        {card.rangeTime}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Card;
