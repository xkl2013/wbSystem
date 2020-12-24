import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';

export default function (props) {
    const { value } = props;
    const { approvalFromFieldAttrs, ...others } = props;
    const maxLengthAttr = approvalFromFieldAttrs.find((ls) => {
        return ls.attrName === 'maxLength';
    }) || {};

    return (
        <div className={styles.container}>
            <Input.TextArea
                className={styles.input}
                {...others}
                maxLength={maxLengthAttr.attrValue || 1000}
                autoSize={{ minRows: 3 }}
            />
            {maxLengthAttr.attrValue ? (
                <span className={styles.wordNumber}>
                    {`已输入${(value || '').length || 0}/${maxLengthAttr.attrValue}`}
                </span>
            ) : null}
        </div>
    );
}
