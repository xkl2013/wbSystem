import React from 'react';
import { message } from 'antd';
import AuthButton from '@/components/AuthButton';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import { deleteSchedule } from '../../../services';
import styles from './index.less';

// 删除日程
function handleDelete(props) {
    const { getData, id, isShowModalFn } = props;
    BIModal.confirm({
        title: '确认要删除该日程吗？',
        autoFocusButton: null,
        onOk: async () => {
            const response = await deleteSchedule({ scheduleId: id });
            if (response && response.success) {
                message.success('删除成功');
                if (getData) getData();
                if (isShowModalFn) isShowModalFn(1);
            }
        },
    });
}
function renderBtn(props) {
    return (
        <BIButton
            loading={props.loading}
            onClick={() => {
                handleDelete(props);
            }}
            type="link"
            className={styles.delBtnCls}
        >
            删 除
        </BIButton>
    );
}
export default function DelBtn(props) {
    const { authority } = props;
    console.log('删除权限', authority);
    return <>{authority ? <AuthButton authority={authority}>{renderBtn(props)}</AuthButton> : renderBtn(props)}</>;
}
