import React, { useState, useEffect, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
// import Loading from '@/ant_components/BISpin';
import { Drawer, Icon, Tabs, Empty } from 'antd';
import classnames from 'classnames';
import { getLiveStatus } from '../../service';
// import Empty from '@/components/RenderEmpty';
import Table from './table';
import LinkTable from './linkTable';
import styles from './styles.less';

/**
 * live status 1 待直播 2直播中 4已结束
 */
const minWidth = 680;
const Analyse = (props) => {
    const [width, setWidth] = useState(minWidth);
    const GMVTableRef = useRef(null);
    const productTableRef = useRef(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [type, setType] = useState('1');
    const [collapsed, setCollapsed] = useState(false);
    const getMaxWidth = () => {
        return document.documentElement.clientWidth - 70;
    };
    const getLiveStatusFn = async () => {
        const res = await getLiveStatus(props.liveId);
        if (res && res.success) {
            const data = res.data || {};
            setLiveStatus(data.status);
            return data.status;
        }
        return null;
    };
    useEffect(() => {
        getLiveStatusFn();
    }, []);
    // 列伸缩回调
    const onResizeWidth = (e) => {
        const sideDom = document.getElementById('drug_side_custom_div');
        if (sideDom) {
            sideDom.style.left = `${e.x}px`;
        }
    };
    const onResizeWidthStart = (e) => {
        let dom = document.getElementById('drug_modals_custom_div');
        let sideDom = document.getElementById('drug_side_custom_div');
        if (!dom) {
            dom = document.createElement('div');
            dom.id = 'drug_modals_custom_div';
            dom.className = styles.drugWrap;
        }
        if (!sideDom) {
            sideDom = document.createElement('div');
            sideDom.id = 'drug_side_custom_div';
            sideDom.className = styles.drugSideWrap;
        }
        sideDom.style.left = `${e.clientX}px`;
        sideDom.style.top = collapsed ? 0 : '61px';
        dom.appendChild(sideDom);
        document.getElementById('root').appendChild(dom);
    };
    const onResizeWidthStop = (e) => {
        const dom = document.getElementById('drug_modals_custom_div');
        let sideWidth = document.documentElement.clientWidth - e.x;
        sideWidth = sideWidth < 400 ? 400 : sideWidth;
        setWidth(sideWidth);
        dom.remove();
    };
    const setCollapsedWidth = (bol) => {
        const newWidth = bol ? getMaxWidth() : minWidth;
        setCollapsed(bol);
        setWidth(newWidth);
    };
    const onReload = async () => {
        await getLiveStatusFn();

        if (liveStatus < 2) return;
        if (type === '1' && GMVTableRef && GMVTableRef.current) {
            await GMVTableRef.current.onRefresh();
            return;
        }

        if (type === '2' && productTableRef && productTableRef.current) {
            await productTableRef.current.onRefresh();
        }
    };

    const renderHeader = () => {
        return (
            <div className={styles.header}>
                <div className={styles.drugWrap} />
                <Tabs
                    activeKey={type}
                    onChange={(val) => {
                        getLiveStatusFn();
                        return setType(val);
                    }}
                >
                    <Tabs.TabPane tab="GMV实时分析" key="1" />
                    <Tabs.TabPane tab="链接实时分析" key="2" />
                </Tabs>
                <div className={styles.btnWrap}>
                    <Icon type="reload" onClick={onReload} className={styles.btn} />
                    {collapsed ? null : (
                        <Icon type="arrows-alt" className={styles.btn} onClick={setCollapsedWidth.bind(null, true)} />
                    )}
                    {!collapsed ? null : (
                        <Icon type="shrink" className={styles.btn} onClick={setCollapsedWidth.bind(null, false)} />
                    )}

                    <Icon type="close" className={styles.btn} onClick={props.onClose} />
                </div>
            </div>
        );
    };
    return (
        <>
            <Drawer
                title={renderHeader()}
                placement="right"
                closable={false}
                mask={false}
                width={width}
                className={styles.drawerClass}
                // onClose={props.onClose}
                visible={props.visible}
                style={{
                    position: 'fixed',
                    top: collapsed ? 0 : '61px',
                    height: `calc(100vh - ${collapsed ? '20px' : '80px'})`,
                }}
            >
                <ResizableBox
                    width={width}
                    handle={
                        <span
                            className={styles.handleWidth}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <span className={styles.drugIcon}>
                                <i />
                                <i />
                                <i />
                            </span>
                        </span>
                    }
                    minConstraints={[100, 100]}
                    onResizeStart={onResizeWidthStart}
                    onResizeStop={onResizeWidthStop}
                    onResize={onResizeWidth}
                />
                <div className={styles.modalBody}>
                    <div className={classnames(styles.content, collapsed ? styles.enlargeContent : '')}>
                        {liveStatus === 1 || liveStatus === null ? (
                            <Empty />
                        ) : (
                            <>
                                {type === '1' ? (
                                    <Table
                                        liveId={props.liveId}
                                        liveStatus={liveStatus}
                                        getLiveStatus={getLiveStatusFn}
                                        ref={GMVTableRef}
                                    />
                                ) : null}
                                {type === '2' ? (
                                    <LinkTable
                                        ref={productTableRef}
                                        liveId={props.liveId}
                                        liveStatus={liveStatus}
                                        getLiveStatus={getLiveStatusFn}
                                    />
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    );
};
export default Analyse;
