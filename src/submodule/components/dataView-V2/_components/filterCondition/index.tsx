import React, { Component } from 'react';
import { Button, } from 'antd';
// import ChooseItem from '@/components/choose-Item2';
import styles from './styles.less';
// import { setSift } from '@/services/comment';
// import { getOptionName } from '@/utils/utils';
// import { SIFT_TYPE } from '@/utils/enum';
/* eslint-disable react/sort-comp */
const searchIcon = 'https://static.mttop.cn/admin/sousuo.png';

interface Props {
    onSubmit: Function
    onResert: Function
}

const FormFilterButton = (props: Props) => {
    const { onSubmit, onResert } = props;
    return (
        <>
            {/* <dl className={`${styles.quickSift} ${siftDataArr.length > 0 ? styles.show : styles.hide}`}> */}
            {/* <dt>快捷筛选:</dt> */}
            {/* <dd>{this.templateSift(siftDataArr)}</dd> */}
            {/* </dl> */}
            <div className={styles.formFooter}>
                <div className={styles.chooseItem}>
                    {/* <ChooseItem
                            params={chooseItems}
                            onChange={onRemoveItem.bind(this)}
                            creatSiftTag={this.creatSiftTag.bind(this)}
                        /> */}
                </div>
                <div className={styles.buttonGroup}>
                    <Button type="primary" onClick={onSubmit} className={styles.btnCls}>
                        <img className={styles.searchIconCls} src={searchIcon} alt="查询" />
                            查询
                        </Button>
                    <span className={styles.resertButton}>
                        <Button onClick={onResert} className={styles.btnCls}>
                            重置
                            </Button>
                    </span>
                </div>
            </div>
        </>
    );
}

export default FormFilterButton;
