/*
 * 非必传：defaultCurrent,  （展示第几页，默认是1）
 *        defaultPageSize, （每页展示条数，默认30条）
 *        pageSizeOptions, （配合onShowSizeChange方法使用，array类型，现默认【30】）
 *        onShowSizeChange,（控制每页展示条数的方法，现在默认30条，目前该方法不用传，留已后备用）
 *        showPageSize,     (大于该值则展示分页,默认是30)
 *
 * 必 传： onChange，（点击页码的方法回调  function类型）
 *         total,   （总条数  number类型）
 * */
import React from 'react';
import BIPagination from '@/ant_components/BIPagination';
import styles from './index.less';

function Index(props) {
    const {
        pageSize,
        total,
        current,
        onChange,
        onShowSizeChange,
        showPageSize,
        showTotal,
        showQuickJumper,
        showSizeChanger,
        pageSizeOptions,
    } = props;
    const isShowPage = showPageSize ? total > showPageSize : total > 0;
    const lastPage = Math.ceil(Number(total) / Number(pageSize));
    return isShowPage ? (
        <div className={styles.pageWrap}>
            <span className={styles.btnCls} disabled={current === 1} onClick={onChange.bind(this, 1)}>
                首页
            </span>
            <BIPagination
                // showQuickJumper
                showTotal={showTotal}
                style={{ marginTop: '40px' }}
                onChange={onChange}
                onShowSizeChange={onShowSizeChange}
                current={current}
                total={total}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
            />
            <span className={styles.btnCls} disabled={current === lastPage} onClick={onChange.bind(this, lastPage)}>
                尾页
            </span>
        </div>
    ) : null;
}

export default Index;
