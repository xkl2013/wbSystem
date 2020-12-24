import React from 'react';
import icon from '@/assets/transferSuccess@2x.png';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import s from './index.less';

const Success = (props) => {
    const { title, tableId, liveId, handleCancel, successCb } = props;
    const close = () => {
        handleCancel();
        if (typeof successCb === 'function') {
            successCb();
        }
    };
    const toCheck = () => {
        let url;
        switch (tableId) {
            case 28:
                url = '/foreEnd/business/live/session/first';
                break;
            case 29:
                url = '/foreEnd/business/live/session/second';
                break;
            case 30:
                url = '/foreEnd/business/live/session/final';
                break;
            case 31:
                url = '/foreEnd/business/live/session/sorted';
                break;
            case 34:
                url = '/foreEnd/business/live/bloggerSession/first';
                break;
            case 35:
                url = '/foreEnd/business/live/bloggerSession/second';
                break;
            case 36:
                url = '/foreEnd/business/live/bloggerSession/final';
                break;
            case 37:
                url = '/foreEnd/business/live/bloggerSession/sorted';
                break;
            default:
                break;
        }
        if (!url || !liveId) {
            return;
        }
        window.open(`${url}?liveId=${liveId}`, '_blank');
        close();
    };
    return (
        <div className={s.container}>
            <img className={s.icon} alt="" src={icon} />
            <p className={s.tip}>{`${title}成功`}</p>
            <div className={s.btnContainer}>
                <BIButton onClick={close} className={s.btnCls}>
                    关闭
                </BIButton>
                <SubmitButton onClick={toCheck} type="primary" className={s.btnCls}>
                    去查看
                </SubmitButton>
            </div>
        </div>
    );
};
export default Success;
