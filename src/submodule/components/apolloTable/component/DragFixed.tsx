import React from 'react';
import { ResizableBox } from 'react-resizable';
import styles from './DragFixed.less';
import { getCache, saveCache } from '../utils/cache';

const DragFixed = (props: any) => {
    const {
        tableId,
        initLeft,
        initTop,
        onResizeStart,
        showColumns,
        columnWidth,
        columns,
        onResizeStop,
        cachedFeAttr,
        onDragFixed,
    } = props;
    // 表格
    const container: any = document.querySelector(`#apolloTable_${tableId}`);
    // 滑块wrap
    const handleWrap: any = document.querySelector('#leftFixedHandleWrap');
    // 滑块
    const handle: any = document.querySelector('#leftFixedHandle');
    // 分割线wrap
    const dividerWrap: any = document.querySelector(`#dividerWrap_${tableId}`);
    // 分割线
    const divider: any = document.querySelector(`#divider_${tableId}`);
    const onMouseEnterWrap = (e: any) => {
        // 滑块wrap添加hovered样式
        handleWrap.classList.add(styles.hovered);
        // 滑块初始化位置，显示
        handle.style.top = `${e.clientY}px`;
        handle.style.opacity = 1;
    };

    const onMouseMoveWrap = (e: any) => {
        // 滑块位置跟随鼠标上下移动
        const handleWrapRect = handleWrap.getBoundingClientRect();
        if (e.clientY < handleWrapRect.y) {
            return;
        }
        handle.style.top = `${e.clientY}px`;
    };

    const onMouseLeaveWrap = () => {
        // 滑块wrap移除hovered样式
        handleWrap.classList.remove(styles.hovered);
        // 滑块隐藏
        handle.style.opacity = 0;
    };

    const onResizeStartHandle = (e: any) => {
        if (typeof onResizeStart === 'function') {
            onResizeStart();
        }
        const originLeft = container.getBoundingClientRect().x || 0;
        // handleWrap.style.top = 0;
        handleWrap.style.left = `${e.x - originLeft}px`;
    };

    const onResizeHandle = (e: any) => {
        const containerRect: any = container.getBoundingClientRect();
        let inTableLeft = e.x - containerRect.x;
        // left不能超过表格一半宽度
        if (inTableLeft > containerRect.width / 2) {
            inTableLeft = containerRect.width / 2;
        }
        let fixedWidth = 0;
        let index = 0;
        // 计算固定列宽度及索引
        for (let i = 0; i < showColumns.length; i++) {
            fixedWidth += showColumns[i].width || columnWidth;
            if (fixedWidth > inTableLeft) {
                index = i;
                break;
            }
        }
        const leftHandleLeft = fixedWidth - (showColumns[index].width || columnWidth);
        // 拖动时显示分割线
        dividerWrap.style.display = 'block';
        // 分割线取列的边侧位置
        divider.style.left = `${leftHandleLeft}px`;
        // 拖动线取鼠标位置
        handleWrap.style.left = `${inTableLeft}px`;
        // 滑动过程中滑块始终显示
        // 滑块wrap添加hovered样式
        handleWrap.classList.add(styles.hovered);
        // 滑块初始化位置，显示
        handle.style.opacity = 1;
    };

    const onResizeStopHandle = () => {
        // 当前固定列宽度为分割线的left
        const fixedWidth: string = divider.style.left;
        // 样式转数值
        const fixedWidthNum: string = fixedWidth.slice(0, -2);
        // 分隔线wrap隐藏
        dividerWrap.style.display = 'none';
        // 滑块wrap移除hovered样式
        handleWrap.classList.remove(styles.hovered);
        // handleWrap.style.top = `${initTop}px`;
        handleWrap.style.left = fixedWidth;
        // 滑块隐藏
        handle.style.opacity = 0;
        handle.parentNode.style.width = 0;

        let leftFixedWidth = 0;
        const fixedCol: any = {};
        const fixedColOrder: any = [];
        // 计算获取固定列
        for (let i = 0; i < showColumns.length; i++) {
            leftFixedWidth += showColumns[i].width || columnWidth;
            if (leftFixedWidth <= Number(fixedWidthNum)) {
                fixedColOrder.push(showColumns[i].columnName);
                // 固定列修改排序到最前面
                fixedCol[showColumns[i].columnName] = {
                    ...showColumns[i],
                    fixed: 'left',
                    orderNo: i + 1,
                };
            } else {
                break;
            }
        }
        let newColumns: any = [];
        fixedColOrder.map((temp: any) => {
            newColumns.push(fixedCol[temp]);
        });
        // 新的列数组包含刚固定的列（排在最前面）和原来的所有列，需要将后面重复的列剔除
        newColumns = newColumns.concat(columns);

        // 为固定列增加fixed属性
        const updateCache = (item: any) => {
            // 缓存
            if (cachedFeAttr) {
                const cachedCols = getCache({ tableId });
                if (cachedCols) {
                    cachedCols[item.columnName] = {
                        ...cachedCols[item.columnName],
                        fixed: item.fixed,
                        orderNo: item.orderNo,
                    };
                    saveCache({ tableId, data: cachedCols });
                }
            }
        };
        const sortedColumns: any = [];
        newColumns.map((item: any, i: number) => {
            if (i >= fixedColOrder.length) {
                // 除了新增加的固定列，之前的固定列都还原为未固定
                if (item.fixed === 'left') {
                    item.fixed = '';
                }
                // 剔除重复列
                if (!fixedCol[item.columnName]) {
                    // 重新排序
                    item.orderNo = sortedColumns.length + 1;
                    updateCache(item);
                    sortedColumns.push(item);
                }
            } else {
                updateCache(item);
                sortedColumns.push(item);
            }
        });
        // 业务回调
        if (typeof onDragFixed === 'function') {
            onDragFixed(sortedColumns);
        }
        // table回调
        if (typeof onResizeStop === 'function') {
            onResizeStop(sortedColumns);
        }
    };

    return (
        <div
            id="leftFixedHandleWrap"
            className={styles.leftFixedHandleWrap}
            style={{
                left: `${initLeft}px`,
                top: `${initTop}px`,
            }}
            onMouseEnter={onMouseEnterWrap}
            onMouseMove={onMouseMoveWrap}
            onMouseLeave={onMouseLeaveWrap}
        >
            <ResizableBox
                width={2}
                height={1}
                handle={
                    <span
                        id="leftFixedHandle"
                        className={styles.leftFixedHandle}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                }
                onResizeStart={onResizeStartHandle}
                onResize={onResizeHandle}
                onResizeStop={onResizeStopHandle}
                draggableOpts={{ enableUserSelectHack: false }}
            />
        </div>
    );
};
export default DragFixed;
