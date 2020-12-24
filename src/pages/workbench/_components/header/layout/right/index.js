import React from 'react';
import styles from '../../index.less';

const Right = function (props) {
    const { children } = props;
    const newNode = React.Children.map(children, (child, i) => {
        return <div className={styles.leftBtnCls}>{child}</div>;
    });
    return <div className={styles.itemWrap}>{newNode}</div>;
};
export default Right;
