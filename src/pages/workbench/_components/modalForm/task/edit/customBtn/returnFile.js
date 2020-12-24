import React from 'react';
import { message } from 'antd';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import { returnSchedule } from '../../../services';
import styles from './index.less';

function renderFileTitle() {
    return (
        <>
            <p className={styles.fileTitle}>确认将任务归档么？</p>
            <p className={styles.fileContent}>归档后可在 “更多/已归档” 查看,彻底删除在已归档里进行</p>
        </>
    );
}
// 归档任务
function handleDelete(props) {
    const { getData, id, isShowModalFn } = props;
    BIModal.confirm({
        title: renderFileTitle(),
        autoFocusButton: null,
        onOk: async () => {
            const response = await returnSchedule({ fileStatus: 2, scheduleIds: [id] });
            if (response && response.success) {
                message.success('归档成功');
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
            归 档
        </BIButton>
    );
}
export default function ReturnFileBtn(props) {
    const { authority } = props;
    return <>{authority === false ? null : renderBtn(props)}</>;
}
