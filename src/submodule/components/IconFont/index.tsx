import React from 'react';
import IconFont from './IconFont';
import styles from './styles.less';

interface IProps {
    type?: string;
    src?: string;
}
const CustomIcon = (props:IProps) => {
    const { type, src } = props;
    const isHttp = /^((https|http)?:\/\/)[^\s]+/.test(src || '');
    if (type) {
        return <IconFont type={type} />;
    } if (src && isHttp) {
        return <img src={src} alt="icon" className={`${styles.iconCls}`} />;
    }
    return null;
};
export default CustomIcon;
