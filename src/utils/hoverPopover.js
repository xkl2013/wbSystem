import React from 'react';
import { Popover, Table } from 'antd';

// import BITable from '@/ant_components/BITable';

// 获取字符长度
export function getStrLeng(str) {
    return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
}

// 格式化文字
export function renderTxt(text, len, placement) {
    const tLen = len || 10;
    if (!text) return null;
    if (text.length > tLen) {
        return (
            <Popover overlayStyle={{ wordBreak: 'break-all' }} content={text} placement={placement || 'top'}>
                <span>{`${text.slice(0, tLen)}...`}</span>
            </Popover>
        );
    }
    return <span>{text}</span>;
}
// 格式化文字
export function renderDoubleTxt(text, len, placement) {
    const tLen = len || 10;
    let j = 0;
    for (let i = 0; i < len; j += 1) {
        if (text[j] === undefined) {
            break;
        }
        i += getStrLeng(text[j]);
    }
    if (!text) return null;
    if (getStrLeng(text) > tLen) {
        return (
            <Popover overlayStyle={{ wordBreak: 'break-all' }} content={text} placement={placement || 'top'}>
                <span>{`${text.slice(0, j)}...`}</span>
            </Popover>
        );
    }
    return <span>{text}</span>;
}

// 格式化文字
export function renderArrText(arr, len) {
    if (!Array.isArray(arr)) {
        return '';
    }
    const content = arr.join('，');
    if (arr.length > len) {
        const text = arr.splice(0, len).join('，');
        return (
            <Popover content={content} placement="top">
                {`${text}...`}
            </Popover>
        );
    }
    return content;
}

// 表格
export function renderPopTable(text, columns, data, style, placement) {
    return (
        <Popover
            content={
                <Table
                    size="small"
                    rowKey="index"
                    bordered={false}
                    className={style}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            }
            placement={placement || 'bottom'}
        >
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{text}</span>
        </Popover>
    );
}

export default {
    getStrLeng,
    renderTxt,
    renderDoubleTxt,
};
