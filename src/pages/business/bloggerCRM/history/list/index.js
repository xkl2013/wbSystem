import React, { Component } from 'react';
import { Timeline, message } from 'antd';
import moment from 'moment';
import IconFont from '@/components/CustomIcon/IconFont';
import s from './index.less';

class HistoryList extends Component {
    // componentWillReceiveProps(nextProps) {
    //     if (
    //         nextProps.historyList
    //         && nextProps.historyList.length > 0
    //         && JSON.stringify(nextProps.historyList) !== JSON.stringify(this.props.historyList)
    //     ) {
    //         // 历史列表更新时滚动到最下面
    //         let timeout = setTimeout(() => {
    //             const bottomDom = document.getElementById('goBottom');
    //             if (bottomDom) {
    //                 bottomDom.scrollTop = bottomDom.scrollHeight;
    //             }
    //             clearTimeout(timeout);
    //             timeout = null;
    //         }, 100);
    //     }
    // }

    // 追加历史记录
    addHistory = () => {
        const { historyList, showAddPage } = this.props;
        if (!historyList || historyList.length === 0) {
            message.error('还没有跟进记录，请前往添加');
            return;
        }
        const lastData = historyList[historyList.length - 1];
        const { rowData, id } = lastData;
        if (typeof showAddPage === 'function') {
            showAddPage({ rowId: id, rowData });
        }
    };

    // 编辑历史记录
    editHistory = (record) => {
        const { showEditPage } = this.props;
        if (typeof showEditPage === 'function') {
            showEditPage({ rowId: record.id });
        }
    };

    // 历史列表详情标题
    getModalTitle = (rowData) => {
        const { historyColumnConfig } = this.props;
        const titleCol = historyColumnConfig.find((item) => {
            return item.historyTitleFlag;
        });
        if (!titleCol) {
            return '';
        }
        const titleData = rowData.find((item) => {
            return item.colName === titleCol.columnName;
        });
        if (!titleData) {
            return '';
        }
        const title = titleData.cellValueList
            .map((item) => {
                return item.text;
            })
            .join(',');
        return title;
    };

    // 自定义时间轴节点
    renderDot = (item) => {
        const { rowId } = this.props;
        return <div className={s.outerDiv}>{item.id !== rowId && <div className={s.innerDiv} />}</div>;
    };

    renderItem = (item) => {
        const { historyColumnConfig, noEdit } = this.props;
        const { rowData, createTime, creatorName } = item;
        // 标题栏
        const title = this.getModalTitle(rowData);
        return (
            <div className={s.container}>
                <div className={s.headerCls}>
                    <span className={s.headerTitle}>{title}</span>
                    {!noEdit && (
                        <div className={s.headerIconCls} onClick={this.editHistory.bind(this, item)}>
                            <IconFont className={s.headerIcon} type="iconxiangqingye-bianji" />
                        </div>
                    )}
                </div>
                <div className={s.timeCls}>
                    {`${creatorName} 于 ${moment(createTime).format('YYYY-MM-DD HH:mm:ss')} 创建`}
                </div>
                <div className={s.cardCls}>
                    {historyColumnConfig
                        && historyColumnConfig.map((config) => {
                            // 将标题从详情内容中剔除
                            if (config.historyTitleFlag || config.historyDetailTitleFlag) {
                                return null;
                            }
                            const temp = rowData.find((d) => {
                                return d.colName === config.columnName;
                            });
                            const text = temp.cellValueList
                                .map((c) => {
                                    return c.text;
                                })
                                .join(',');
                            return (
                                <div className={s.row}>
                                    <span className={s.rowLabel}>{`${config.columnChsName}：`}</span>
                                    <span className={s.rowContent}>{text}</span>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    render() {
        const { historyList, noAdd } = this.props;
        return (
            <div className={s.pageWrap}>
                <div className={s.titleCls}>跟进记录</div>
                <div className={s.contentCls} id="goBottom">
                    <Timeline>
                        {historyList
                            && historyList.map((item) => {
                                return (
                                    <Timeline.Item dot={this.renderDot(item)}>{this.renderItem(item)}</Timeline.Item>
                                );
                            })}
                    </Timeline>
                </div>
                {!noAdd && (
                    <div className={s.bottomCls}>
                        <div className={s.addBtnCls} onClick={this.addHistory}>
                            <IconFont className={s.addIcon} type="iconxinzeng" />
                            <span className={s.addBtn}>继续添加</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default HistoryList;
