import React from 'react';
import BIRate from '@/ant_components/BIRate';
import s from './index.less';

export default function (props) {
    return (
        <div className={s.rateContainer}>
            <BIRate {...props} />
        </div>
    );
}
