import React from 'react';
import Link from 'umi/link';
import storage from '@/utils/storage';
import s from './index.less';

const selfCom = (formData) => {
    // console.log(formData, 8787);
    storage.setItem('add_fee_info', formData);
    return (
        <Link to="/foreEnd/business/supplier/add">
            <span className={s.btn}>+ 新增供应商</span>
        </Link>
    );
};
export default selfCom;
