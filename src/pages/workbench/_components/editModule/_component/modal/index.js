import React, { forwardRef } from 'react';
import BIModal from '@/ant_components/BIModal';
import SlefProgress from '@/components/airTable/component/dynamic';
import { workspaceId } from '../../../../_enum';
import styles from './styles.less';

const style = {
    width: '80%',
    minWidth: '1100px',
    maxWidth: '1540px',
};

const Modal = (props, ref) => {
    const { scheduleId, isEdit, onOk, ...others } = props;
    const newProps = { ...others };
    if (isEdit) {
        newProps.footer = null;
    } else {
        newProps.style = {
            width: '900px',
        };
        newProps.closable = false;
    }
    return (
        <BIModal
            wrapClassName={styles.modalCla}
            width="80%"
            style={style}
            // closable={false}
            onOk={onOk}
            {...newProps}
        >
            <div className={styles.wrap}>
                <div className={styles.leftContainer} style={{ width: isEdit ? '60%' : '100%' }}>
                    {props.children}
                </div>
                {isEdit ? (
                    <div className={styles.rightContainer}>
                        <SlefProgress
                            disableInitData
                            commentSort={1} // 动态排序1:正序，2:倒序
                            ref={ref}
                            id={Number(scheduleId)}
                            interfaceName={workspaceId}
                            {...props}
                        />
                    </div>
                ) : null}
            </div>
        </BIModal>
    );
};
export default forwardRef(Modal);
