import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import s from './DragSorted.less';
import { getCache, saveCache } from '../utils/cache';

const DragSorted = (props: any) => {
    const {
        columnName,
        orderNo,
        onDragSortedCb,
        onDragSortedMove,
        tableId,
        canSorted,
        onDragSorted,
        columns,
        cachedFeAttr,
        position,
        columnChsName,
    } = props;
    if (!canSorted) {
        return <div className={s.sortedWrap}>{props.children}</div>;
    }
    // 按下鼠标
    const pressed: any = useRef(false);
    // copyDiv显示
    const copyDivShow: any = useRef(false);
    // 拖动列
    const dragCol: any = useRef();
    // 放置列
    const dropCol: any = useRef();
    // 表格滚动计时器
    const timerInterval: any = useRef(null);
    // 表格
    const container: any = document.querySelector(`#apolloTable_${tableId}`);
    // 拖拽列时的影子div
    const columnCopyDiv: any = document.querySelector('#columnCopyDiv');
    // 分割线wrap
    const dividerWrap: any = document.querySelector(`#dividerWrap_${tableId}`);
    // 分割线
    const divider: any = document.querySelector(`#divider_${tableId}`);
    // 左侧固定列分割线
    const leftFixedHandleWrap: any = document.querySelector('#leftFixedHandleWrap');
    const rightFixedHandleWrap: any = document.querySelector('#rightFixedHandleWrap');
    // 监听鼠标移动
    const onMouseMove = useCallback((e) => {
        if (!pressed.current) {
            // 移除全局事件
            document.body.removeEventListener('mousemove', onMouseMove, false);
            document.body.removeEventListener('mouseup', onMouseUp, false);
            return;
        }
        if (!copyDivShow.current) {
            initCopyDiv(e);
        }
        const tableRect = container.getBoundingClientRect();
        const detaX = columnCopyDiv.getAttribute('data-deta-x');
        // 所有列
        const draggableColumns = document.querySelectorAll('.draggableColumn');
        const leftFixedHandleWrapRectX = (leftFixedHandleWrap && leftFixedHandleWrap.getBoundingClientRect().x) || 0;
        const rightFixedHandleWrapRectX =
            (rightFixedHandleWrap && rightFixedHandleWrap.getBoundingClientRect().x) || tableRect.right;

        const left = e.clientX - tableRect.x - Number(detaX);
        // 影子div随鼠标移动
        // 鼠标在左侧固定列与右侧固定列之间有效
        if (e.clientX > tableRect.x && e.clientX < tableRect.right) {
            columnCopyDiv.style.left = `${left}px`;
        }
        draggableColumns.forEach((dom) => {
            const domRect = dom.getBoundingClientRect();
            // 当前节点在左侧固定列与右侧固定列之间有效
            if (e.clientX > domRect.x && e.clientX < domRect.x + domRect.width / 2) {
                // 影子div中点在投放目标中
                divider.style.left = `${domRect.x - tableRect.x}px`;
                // 收集投放目标的信息
                const dropColumn = dom.getAttribute('data-column-name') || '';
                dropCol.current = {
                    columnName: dropColumn,
                    move: -1,
                };
            } else if (e.clientX > domRect.x + domRect.width / 2 && e.clientX < domRect.x + domRect.width) {
                // 影子div中点在投放目标中
                divider.style.left = `${domRect.x - tableRect.x + domRect.width}px`;
                // 收集投放目标的信息
                const dropColumn = dom.getAttribute('data-column-name') || '';
                dropCol.current = {
                    columnName: dropColumn,
                    move: 1,
                };
            }
        });

        if (typeof onDragSortedMove === 'function') {
            let dir = '';
            let step = 10;
            // 设置鼠标超出表格左右固定列两侧时的滚动事件
            if (e.clientX > rightFixedHandleWrapRectX - 50) {
                dir = 'right';
                step = 100;
            } else if (e.clientX > rightFixedHandleWrapRectX - 100) {
                dir = 'right';
                step = 30;
            } else if (e.clientX < leftFixedHandleWrapRectX + 50) {
                dir = 'left';
                step = 100;
            } else if (e.clientX < leftFixedHandleWrapRectX + 100) {
                dir = 'left';
                step = 30;
            } else {
                dir = '';
            }
            if (dir) {
                // 需要滚动，如果已有计时器，先清除再重新设置计时器
                if (timerInterval.current) {
                    clearInterval(timerInterval.current);
                }
                timerInterval.current = setInterval(() => {
                    onDragSortedMove(dir, step);
                }, 150);
            } else {
                // 需要停止，清除已有计时器
                // eslint-disable-next-line no-lonely-if
                if (timerInterval.current) {
                    clearInterval(timerInterval.current);
                    timerInterval.current = null;
                }
            }
        }
    }, []);
    // 监听鼠标抬起
    const onMouseUp = useCallback(() => {
        // 获取分割线上挂载的拖动列和投放列信息
        const dragColumn = dragCol.current && dragCol.current.columnName;
        const dropColumn = dropCol.current && dropCol.current.columnName;
        const dropMove = dropCol.current && dropCol.current.move;
        // 清理操作
        clean();
        // 没有列信息或没有移动位置
        if (!dragColumn || !dropColumn || dragColumn === dropColumn) {
            return;
        }
        // 拖动回调
        let newColumns: any[] = [...columns];
        const dragIndex = newColumns.findIndex((item) => item.columnName === dragColumn);
        const dragObj = newColumns[dragIndex];
        newColumns.splice(dragIndex, 1);
        const dropIndex = newColumns.findIndex((item) => item.columnName === dropColumn);
        newColumns.splice(dropIndex + dropMove + 1, 0, dragObj);
        const lenLeft = newColumns.filter((item) => item.fixed === 'left').length;
        const lenRight = newColumns.filter((item) => item.fixed === 'right').length;
        const len = newColumns.length;
        newColumns = newColumns.map((item: any, i: number) => {
            if (i < lenLeft) {
                return {
                    ...item,
                    orderNo: i + 1,
                    fixed: 'left',
                };
            }
            if (i >= len - lenRight) {
                return {
                    ...item,
                    orderNo: i + 1,
                    fixed: 'right',
                };
            }
            return {
                ...item,
                orderNo: i + 1,
                fixed: '',
            };
        });

        if (cachedFeAttr) {
            const cachedCols = getCache({ tableId });
            if (cachedCols) {
                newColumns.map((item: any) => {
                    cachedCols[item.columnName] = {
                        ...cachedCols[item.columnName],
                        orderNo: item.orderNo,
                        fixed: item.fixed,
                    };
                });
                saveCache({ tableId, data: cachedCols });
            }
        }
        if (typeof onDragSorted === 'function') {
            onDragSorted(newColumns);
        }
        if (typeof onDragSortedCb === 'function') {
            onDragSortedCb(newColumns);
        }
    }, [onDragSortedCb, onDragSorted, columns]);
    // 监听鼠标按下
    const onMouseDown = useCallback(
        (e) => {
            // 不是左键点击不作处理
            if (e.button !== 0) {
                return;
            }
            // 鼠标按下标记
            pressed.current = true;
            // 记录拖动列
            dragCol.current = {
                columnName,
                orderNo,
            };
            // 全局添加监听鼠标移动和松开事件
            document.body.addEventListener('mousemove', onMouseMove, false);
            document.body.addEventListener('mouseup', onMouseUp, false);
        },
        [onMouseMove, onMouseUp],
    );
    // 初始化影子div位置
    const initCopyDiv = useCallback(
        (e) => {
            // 表格初始位置x点
            const originLeft = container.getBoundingClientRect().x || 0;
            // 拖动列矩形
            if (!e.target.offsetParent) {
                // 兼容处理
                return;
            }
            const targetRect = e.target.offsetParent.getBoundingClientRect();
            const curX = e.clientX;
            // 影子div显示
            columnCopyDiv.style.display = 'block';
            // 影子div初始x位置=拖动列x点-表格x点
            columnCopyDiv.style.left = `${targetRect.x - originLeft}px`;
            // 影子div宽度=拖动列宽度
            columnCopyDiv.style.width = `${targetRect.width}px`;
            columnCopyDiv.innerText = columnChsName;
            // 鼠标x点与拖动列x点之间的距离（记录下来方便后续使用）
            const detaX = curX - targetRect.x;
            columnCopyDiv.setAttribute('data-deta-x', String(detaX));
            // 分割线初始位置为当前列
            divider.style.left = `${targetRect.x - originLeft}px`;
            dividerWrap.style.display = 'block';
            copyDivShow.current = true;
        },
        [columnName, orderNo],
    );
    const clean = useCallback(() => {
        // 鼠标松开
        pressed.current = false;
        // 清空计时器
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
        // 移除全局事件
        document.body.removeEventListener('mousemove', onMouseMove, false);
        document.body.removeEventListener('mouseup', onMouseUp, false);
        // 停止拖动时隐藏影子div
        columnCopyDiv.style.display = 'none';
        dividerWrap.style.display = 'none';
        copyDivShow.current = false;
        dragCol.current = null;
        dropCol.current = null;
    }, [onMouseMove, onMouseUp]);

    return (
        <div
            className={classNames('draggableColumn', s.sortedWrap, s.sortedAble)}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            data-column-name={columnName}
            data-column-order={orderNo}
        >
            {props.children}
        </div>
    );
};
export default DragSorted;
