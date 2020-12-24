import React from 'react';
import styles from './index.less';

import BITable from '@/ant_components/BITable';
import { columns5 } from './labelWrap';

import throw_manage_icon1 from '@/assets/trowManage/throw_manage_icon1@2x.png';
import throw_manage_icon2 from '@/assets/trowManage/throw_manage_icon2@2x.png';
import throw_manage_icon3 from '@/assets/trowManage/throw_manage_icon3@2x.png';
import throw_manage_icon4 from '@/assets/trowManage/throw_manage_icon4@2x.png';
import throw_manage_icon5 from '@/assets/trowManage/throw_manage_icon5@2x.png';

// 推广状态
const Status = (props) => {
    if (props.type === 1) {
        return <div className={`${styles.statusIcon} ${styles.statusIcon2}`}>待投放</div>;
    }
    if (props.type === 2) {
        return <div className={`${styles.statusIcon} ${styles.statusIcon3}`}>投放中</div>;
    }
    if (props.type === 3) {
        return <div className={`${styles.statusIcon}`}>投放成功</div>;
    }
    if (props.type === 4) {
        return <div className={`${styles.statusIcon} ${styles.statusIcon1}`}>投放失败</div>;
    }
    return null;
};

// 卡片
const CardItem = (props) => {
    const { autoFansUpCount, fansUpDrift, autoFansPrice, fansPriceDrift } = props.generalizeDetail;
    if (props.type === 1) {
        // 涨粉量
        return (
            <div className={styles.cardItem}>
                <div className={styles.cardItemTit}>涨粉量</div>
                <div className={styles.cardItemCon}>
                    <div className={styles.cardItemConLeft}>
                        <span>{autoFansUpCount}</span>
                        {fansUpDrift === 1 && <img src={throw_manage_icon3} alt="" />}
                        {fansUpDrift === 2 && <img src={throw_manage_icon4} alt="" />}
                        {fansUpDrift === 3 && <img src={throw_manage_icon5} alt="" />}
                    </div>
                    <img src={throw_manage_icon2} alt="" className={styles.cardItemConRight} />
                </div>
            </div>
        );
    }
    if (props.type === 2) {
        // 粉丝单价(元)
        return (
            <div className={styles.cardItem}>
                <div className={styles.cardItemTit}>粉丝单价(元)</div>
                <div className={styles.cardItemCon}>
                    <div className={styles.cardItemConLeft}>
                        <span>{autoFansPrice < 0 ? '--' : autoFansPrice}</span>
                        {fansPriceDrift === 1 && <img src={throw_manage_icon3} alt="" />}
                        {fansPriceDrift === 2 && <img src={throw_manage_icon4} alt="" />}
                        {fansPriceDrift === 3 && <img src={throw_manage_icon5} alt="" />}
                    </div>
                    <img src={throw_manage_icon1} alt="" className={styles.cardItemConRight} />
                </div>
            </div>
        );
    }
    return null;
};

const Index = (props) => {
    // 整理table数据
    const { putType, afterCartClickCount, shoppingCartClickCount } = props.generalizeDetail || {};
    const shoppingCartNum = putType === 7 || putType === 8 ? shoppingCartClickCount : afterCartClickCount;
    const tableData = [];
    tableData[0] = {
        index: 1,
        name: '推广前',
        number: props.generalizeDetail.beforeFansCount,
        time: props.generalizeDetail.beforeDate,
        playCount: props.generalizeDetail.beforePlayCount,
        shoppingCartNum: null,
        thumbUpNum: props.generalizeDetail.beforeGiveUpCount,
    };
    tableData[1] = {
        index: 2,
        name: '推广后',
        number: props.generalizeDetail.afterFansCount,
        time: props.generalizeDetail.afterDate,
        playCount: props.generalizeDetail.playCount,
        shoppingCartNum,
        thumbUpNum: props.generalizeDetail.giveUpCount,
    };
    return (
        <div>
            <div className={styles.statusTit}>
                <span className={styles.statusTitSpan}>推广状态:</span>
                <Status type={props.generalizeDetail.putStatus} />
            </div>
            {props.generalizeDetail.putStatus === 3 && (
                <>
                    <div className={styles.cardList}>
                        <CardItem type={1} {...props} />
                        <CardItem type={2} {...props} />
                    </div>
                    <div className={styles.tableCon}>
                        <BITable
                            rowKey="index"
                            columns={columns5(putType)}
                            dataSource={tableData}
                            bordered={true}
                            pagination={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Index;
