import React, { forwardRef } from 'react';
import classnamse from 'classnames';
import Setting from '../../../_component/setting';
import Private from '../../../_component/private';
import styles from './styles.less';

/*
 * params(dataSource)  数据源
 * submitParams 用于数据处理提交的数据源
 *
 */

const Header = (props, ref) => {
    const { submitParams, onChange, isEdit } = props;
    return (
        <div ref={ref} className={styles.headerStyle}>
            <span>日程</span>
            <div className={styles.btnsWrap}>
                <span className={classnamse(styles.btn, styles.subTask)}>
                    <Private submitParams={submitParams} onChange={onChange} />
                </span>
                {isEdit ? (
                    <span className={classnamse(styles.btn, styles.setting)}>
                        <Setting {...props} settingBtns={[1]} />
                    </span>
                ) : null}
            </div>
        </div>
    );
};
export default forwardRef(Header);
