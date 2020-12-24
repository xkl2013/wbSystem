/*
 * operateId:4，只能看操作记录
 */
import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import Dynamic from '@/components/airTable/component/dynamic';
import s from './index.less';

@modalfy
class DynamicCom extends Component {
    render() {
        const { interfaceName, commentId } = this.props;
        return (
            <div className={s.wrap}>
                <div className={s.titleBox}>
                    <p className={s.msgTitle}>动态记录</p>
                </div>
                <Dynamic
                    id={Number(commentId)}
                    operateId="4"
                    commentSort={1} // 正序排列
                    hideMenu={true}
                    hideAddComment
                    interfaceName={interfaceName}
                />
            </div>
        );
    }
}

export default DynamicCom;
