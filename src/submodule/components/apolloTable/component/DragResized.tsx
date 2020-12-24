import React from 'react';
import classNames from 'classnames';
import { ResizableBox } from 'react-resizable';
import { getCache, saveCache } from '../utils/cache';
import styles from './DragResized.less';

const DragResized = (props: any) => {
    const {
        style,
        columnName,
        tableId,
        canResized,
        onDragResized,
        onDragResizedCb,
        cachedFeAttr,
        columns,
        position,
    } = props;
    if (!canResized) {
        return <div style={style}>{props.children}</div>;
    }
    // 表格
    const container: any = document.querySelector(`#apolloTable_${tableId}`);
    // 分割线wrap
    const dividerWrap: any = document.querySelector(`#dividerWrap_${tableId}`);
    // 分割线
    const divider: any = document.querySelector(`#divider_${tableId}`);

    // 列伸缩开始
    const onResizeWidthStart = (e: any) => {
        const { x } = container.getBoundingClientRect();
        divider.style.left = `${e.x - x}px`;
        dividerWrap.style.display = 'block';
    };
    // 列伸缩回调
    const onResizeWidth = (e: any) => {
        const { x } = container.getBoundingClientRect();
        divider.style.left = `${e.x - x}px`;
    };

    // 列伸缩结束
    const onResizeWidthStop = (e: any, { size }: { size: { width: number } }) => {
        dividerWrap.style.display = 'none';
        const newColumns: any = [];
        columns.map((item: any) => {
            if (item.columnName === columnName) {
                item.width = size.width;
            }
            newColumns.push(item);
        });
        // 缓存操作
        if (cachedFeAttr) {
            const cachedCols = getCache({ tableId });
            if (cachedCols) {
                cachedCols[columnName] = {
                    ...cachedCols[columnName],
                    width: size.width,
                };
                saveCache({ tableId, data: cachedCols });
            }
        }
        // 业务回调
        if (typeof onDragResized === 'function') {
            onDragResized(newColumns);
        }
        // table回调
        if (typeof onDragResizedCb === 'function') {
            onDragResizedCb(newColumns);
        }
    };

    return (
        <ResizableBox
            style={style}
            width={style.width}
            height={style.height}
            handle={
                <span
                    className={position === 'right' ? classNames(styles.handleWidth, styles.right) : styles.handleWidth}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            minConstraints={[100, 100]}
            onResizeStart={onResizeWidthStart}
            onResize={onResizeWidth}
            onResizeStop={onResizeWidthStop}
            draggableOpts={{ enableUserSelectHack: false }}
            resizeHandles={position === 'right' ? ['w'] : ['e']}
        >
            {props.children}
        </ResizableBox>
    );
};
export default DragResized;
