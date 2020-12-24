import React, { forwardRef } from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';

function TextArea(props, ref) {
    const { maxLength, value } = props;
    return (
        <div className={styles.container} ref={ref}>
            <Input.TextArea className={styles.input} {...props} autoSize={{ minRows: 3 }} />
            {maxLength ? (
                <span className={styles.wordNumber}>{`已输入${(value || '').length || 0}/${maxLength}`}</span>
            ) : null}
        </div>
    );
}
export default forwardRef(TextArea);
