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
        paddingRight,
        cachedFeAttr,
        onDragFixed,
    } = props;
    // 表格
    const container: any = document.querySelector(`#apolloTable_${tableId}`);
    // 滑块wrap
    const handleWrap: any = document.querySelector('#rightFixedHandleWrap');
    // 滑块
    const handle: any = document.querySelector('#rightFixedHandle');
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
        let inTableRight = containerRect.right - e.x;
        // left不能超过表格一半宽度
        if (inTableRight > containerRect.width / 2) {
            inTableRight = containerRect.width / 2;
        }
        let fixedWidth = 0;
        let index = 0;
        // 计算固定列宽度及索引
        for (let i = showColumns.length - 1; i >= 0; i--) {
            fixedWidth += showColumns[i].width || columnWidth;
            if (fixedWidth > inTableRight) {
                index = i;
                break;
            }
        }

        let rightHandleLeft = fixedWidth - (showColumns[index].width || columnWidth);
        if (fixedWidth === inTableRight) {
            rightHandleLeft = fixedWidth;
        }
        // 拖动时显示分割线
        dividerWrap.style.display = 'block';
        // 分割线取列的边侧位置
        divider.style.left = `${containerRect.width - paddingRight - rightHandleLeft}px`;
        // 拖动线取鼠标位置
        handleWrap.style.left = `${containerRect.width - paddingRight - inTableRight}px`;
        // 滑动过程中滑块始终显示
        // 滑块wrap添加hovered样式
        handleWrap.classList.add(styles.hovered);
        // 滑块初始化位置，显示
        handle.style.opacity = 1;
    };

    const onResizeStopHandle = () => {
        const containerRect: any = container.getBoundingClientRect();
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

        let leftFixedWidth = 0;
        const fixedCol: any = {};
        // 计算获取固定列
        for (let i = showColumns.length - 1; i >= 0; i--) {
            leftFixedWidth += showColumns[i].width || columnWidth;
            if (leftFixedWidth <= containerRect.width - paddingRight - Number(fixedWidthNum)) {
                fixedCol[showColumns[i].columnName] = 1;
            } else {
                break;
            }
        }
        const newColumns: any = [];
        // 为固定列增加fixed属性
        columns.map((item: any) => {
            if (fixedCol[item.columnName] === 1) {
                item.fixed = 'right';
            } else {
                if (!!item.showStatus && item.fixed === 'right') {
                    item.fixed = '';
                }
            }
            // 缓存
            if (cachedFeAttr) {
                const cachedCols = getCache({ tableId });
                if (cachedCols) {
                    cachedCols[item.columnName] = {
                        ...cachedCols[item.columnName],
                        fixed: item.fixed,
                    };
                    saveCache({ tableId, data: cachedCols });
                }
            }
            newColumns.push(item);
        });
        // 业务回调
        if (typeof onDragFixed === 'function') {
            onDragFixed(newColumns);
        }
        // table回调
        if (typeof onResizeStop === 'function') {
            onResizeStop(newColumns);
        }
    };

    return (
        <div
            id="rightFixedHandleWrap"
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
                        id="rightFixedHandle"
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
