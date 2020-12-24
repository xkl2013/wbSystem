import React from 'react';
import styles from './index.less';

export default function Detail(props) {
    const { value, displayTarget } = props;

    if (!value) {
        return null;
    }
    const style = {};
    if (displayTarget === 'detail') {
        style.overflow = 'auto';
        style.whiteSpace = 'normal';
    }
    if (typeof value === 'object') {
        return (
            <div className={styles.container} style={style}>
                {value.map((link, i) => {
                    return (
                        <>
                            <a className={styles.link} href={link.value} target="blank">
                                {link.text}
                            </a>
                            {i < value.length - 1 ? ',' : ''}
                        </>
                    );
                })}
            </div>
        );
    }
    return '数据错误';
}
