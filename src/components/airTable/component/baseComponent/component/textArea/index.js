import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';

export default function (props) {
    const { maxLength, value } = props;
    return (
        <div className={styles.container}>
            <Input.TextArea className={styles.input} {...props} autoSize={{ minRows: 3 }} />
            {maxLength ? (
                <span className={styles.wordNumber}>{`已输入${(value || '').length || 0}/${maxLength}`}</span>
            ) : null}
        </div>
    );
}
