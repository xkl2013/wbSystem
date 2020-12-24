import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';

export default function (props) {
    const { value, maxLength } = props;
    const { approvalFromFieldAttrs, ...others } = props;
    return (
        <div className={styles.container}>
            <Input className={styles.input} {...others} />
            {maxLength ? (
                <span className={styles.wordNumber}>{`已输入${(value || '').length || 0}/${maxLength}`}</span>
            ) : null}
        </div>
    );
}
