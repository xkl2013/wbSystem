import React from 'react';
import IconFont from '@/components/CustomIcon/IconFont';
import { privateHideFlag, privatePublicFlag } from '../../../../_enum';
import styles from './styles.less';

function Private(props, ref) {
    const { submitParams = {}, onChange } = props;
    const { privateFlag } = submitParams;
    const onChangeprivate = (val) => {
        if (onChange) {
            onChange({ privateFlag: val });
        }
    };
    return (
        <span className={styles.private} ref={ref}>
            {Number(privateFlag) === privateHideFlag ? (
                <span onClick={onChangeprivate.bind(this, privatePublicFlag)}>
                    {' '}
                    <IconFont type="iconliebiaoye-suoding" className={styles.privateIcon} />
                    隐私
                </span>
            ) : (
                <span onClick={onChangeprivate.bind(this, privateHideFlag)}>
                    {' '}
                    <IconFont type="iconliebiaoye-jiesuo" className={styles.privateIcon} />
                    公开
                </span>
            )}
        </span>
    );
}
export default React.forwardRef(Private);
