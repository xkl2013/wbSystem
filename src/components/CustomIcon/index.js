import React from 'react';
import styles from './styles.less';
import config from './config';

const CustomIcon = props =>{
    const {isChecked,type}=props;
    const iconObj=config[type];
    return(
        iconObj?<span><img src={isChecked?iconObj.selectedPath:iconObj.path} alt="icon" className={`${styles.iconCls}`} /></span>:null
    )
};
export default CustomIcon