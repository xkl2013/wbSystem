import React from 'react';
import s from './index.less';

function renderTitle(title, required = true) {
    return required ? <div className={s.requireTitle}>{title}</div> : <div className={s.noRequireTitle}>{title}</div>;
}
// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: renderTitle('银行账号'),
            dataIndex: 'supplierBankNo',
        },
        {
            title: renderTitle('开户行'),
            dataIndex: 'supplierBankName',
        },
        {
            title: renderTitle('开户行编码', false),
            dataIndex: 'supplierBankCode',
        },
        {
            title: renderTitle('开户地', false),
            dataIndex: 'supplierBankCity',
        },
        {
            title: renderTitle('操作', false),
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <span
                        className={s.btn}
                        onClick={() => {
                            return props.delTableLine(record);
                        }}
                    >
                        删除
                    </span>
                );
            },
        },
    ];
    return columns || [];
}
