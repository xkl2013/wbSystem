import React from 'react';
import icon from '@/assets/transferSuccess@2x.png';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import s from './index.less';

const Success = (props) => {
    const { title, tableId, handleCancel, successCb } = props;
    const close = () => {
        handleCancel();
        if (typeof successCb === 'function') {
            successCb();
        }
    };
    const toCheck = () => {
        let url;
        switch (tableId) {
            case 46:
                url = '/foreEnd/business/bloggerCRM/first';
                break;
            case 47:
                url = '/foreEnd/business/bloggerCRM/second';
                break;
            case 48:
                url = '/foreEnd/business/bloggerCRM/communicating';
                break;
            case 49:
                url = '/foreEnd/business/bloggerCRM/final';
                break;
            default:
                break;
        }
        if (!url) {
            return;
        }
        window.open(url, '_blank');
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
