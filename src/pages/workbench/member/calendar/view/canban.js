import React from 'react';
import { getUserConfig } from '@/services/airTable';
import BISpin from '@/ant_components/BISpin';
import { formateKanbanData } from './_utils';
import Card from '../../../mine/components/card';
import KanBan from '../../../_components/kanBoard';
import styles from './style.less';
import { getMemberPanelPaging, getMemberSchedulePaging } from '../../services';

const panelSize = 5;
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            columnData: [],
            pageParams: {},
        };
        this.initPageNum = 1;
        this.initPageSize = 10;
        this.isUpdate = true;
        this.tempNum = null;
        Mine.headerMonitor = this.headerMonitor;
    }

    componentDidMount() {
        this.isUpdate = true;
        this.fetchData();
    }

    componentWillUnmount() {
        this.isUpdate = false;
        this.tempNum = new Date().valueOf();
    }

    willFetch = () => {
        const params = this.props.willFetch ? this.props.willFetch() : {};
        return params;
    };

    /*
     * 用于关注成员发生变化,或者是初始化看板视图请求数据使用,在后台默认请求数据
     */

    initPageParams = () => {
        if (!this.isUpdate) return;
        const params = this.willFetch() || {};
        const memberIdsMap = params.memberIdsMap;
        if (!memberIdsMap) return;
        const pageParams = {};
        const dataSource = [];
        memberIdsMap.forEach((el) => {
            pageParams[el.memberId] = {
                ...(pageParams[el.memberId] || {}),
                loading: true,
                pageNum: this.initPageNum,
                pageSize: this.initPageSize,
                panelName: el.memberName,
            };
            dataSource.push({
                title: el.memberName,
                cards: [],
                key: el.memberId,
            });
        });
        this.setState({ pageParams, dataSource });
    };

    /*
     *   用于初始化请求数据,根据memberIdList进行数据请求
     */
    fetchData = async () => {
        if (!this.isUpdate) return;
        this.tempNum = new Date().valueOf();
        // await cancel();
        await this.initPageParams(this.tempNum);
        await this.fetchFirstPageData(this.tempNum);
    };

    fetchFirstPageData = async (tempNum) => {
        if (!this.isUpdate) return;
        const params = this.willFetch() || {};
        const pageNum = 1;
        const memberIds = params.memberIds;
        if (!memberIds) return;
        await this.handleDataCallback(
            {
                memberIdList: memberIds,
                pageNum,
                pageSize: panelSize,
            },
            tempNum,
        );
    };

    handleDataCallback = async (paramsData, tempNum) => {
        if (!this.isUpdate) return;
        if (tempNum !== this.tempNum) return;
        const params = this.willFetch() || {};
        const { columnData = [] } = params;
        const result = await getMemberPanelPaging(paramsData);
        if (tempNum !== this.tempNum) return;
        const { dataSource, pageParams } = this.state;
        if (result && result.success && tempNum === this.tempNum) {
            const data = result.data || {};
            const list = Array.isArray(data.list) ? data.list : [];
            const cardData = formateKanbanData(list, columnData);
            cardData.forEach((item) => {
                const listIndex = dataSource.findIndex((ls) => {
                    return ls.key === item.key;
                });
                dataSource[listIndex] = { ...dataSource[listIndex], ...item };
                // dataSource = dataSource.concat([], item);
                pageParams[item.key] = {
                    ...pageParams[item.key],
                    loading: false,
                    pageNum: this.initPageNum + 1,
                    total: (item || {}).total,
                    hasInit: true,
                };
            });
            // 递归请求接下来的数据
            const hasInitLen = Object.values(pageParams).filter((ls) => {
                return ls.hasInit;
            }).length;
            if ((result.data || {}).total > hasInitLen) {
                this.handleDataCallback({ ...paramsData, pageNum: paramsData.pageNum + 1 }, tempNum);
            }
        }
        // 处理闪烁,接口时间相应时间
        if (tempNum === this.tempNum) {
            await this.setState({ dataSource, pageParams });
        }
    };

    getUserConfig = async (tableId) => {
        if (!this.isUpdate) return;
        const result = await getUserConfig(tableId);
        if (result && result.success) {
            const columnData = Array.isArray(result.data) ? result.data : [];
            this.setState({ columnData });
        }
    };

    /*
     * 用于获取某一条看板更多数据
     */
    gatMoreCard = async (memberId) => {
        const params = this.willFetch() || {};
        const { columnData = [] } = params;
        const { pageParams } = this.state;
        const panelPageParams = pageParams[memberId] || {};
        // if (panelPageParams.loading) return;
        pageParams[memberId] = { ...panelPageParams, loading: true };
        await this.setState({ pageParams });
        if (!memberId) return;
        // 获取该panel下最后一条数据
        const { dataSource } = this.state;
        const sourcePanelIndex = dataSource.findIndex((ls) => {
            return ls.id === memberId;
        });
        const res = await getMemberSchedulePaging({
            memberId,
            pageNum: panelPageParams.pageNum || 1,
            pageSize: panelPageParams.pageSize,
        });
        if (res && res.data) {
            const data = res.data || {};
            const formateData = formateKanbanData(Array.isArray(data.list) ? data.list : [], columnData);
            const cards = (formateData[0] || {}).cards;
            const sourcePanel = dataSource[sourcePanelIndex] || {};
            dataSource[sourcePanelIndex] = { ...sourcePanel, cards: sourcePanel.cards.concat([], cards) };
            this.setState({ dataSource });
        }
        pageParams[memberId] = {
            ...panelPageParams,
            loading: false,
            pageNum: (panelPageParams.pageNum || 1) + 1,
        };
        await this.setState({ pageParams });
    };

    hasMore = (panelId) => {
        const { pageParams, dataSource } = this.state;
        const sourcePanel = dataSource.find((ls) => {
            return ls.id === panelId;
        }) || {};
        const pageObj = pageParams[panelId];
        return pageObj && !pageObj.loading && (sourcePanel.cards || []).length < pageObj.total;
    };

    renderCard = (card) => {
        return (
            <Card
                data={card}
                getData={this.fetchData}
                columnData={this.state.columnData}
                goDetail={this.props.showDetailPanel}
            />
        );
    };

    renderLoading = (panelId) => {
        const { pageParams } = this.state;
        if (pageParams[panelId] && pageParams[panelId].loading) {
            return <div className={styles.loadingBox}>加载中</div>;
        }
        return null;
    };

    render() {
        const { dataSource } = this.state;
        return (
            <>
                <BISpin spinning={this.state.loading} className={styles.kanban} style={{ overflow: 'hidden' }}>
                    <KanBan
                        showNoFinishTask
                        dataSource={dataSource}
                        addFn={this.props.showAddPanel}
                        cardConfig={{
                            renderCard: this.renderCard,
                            canDragCard: false,
                        }}
                        InfiniteScroll={{
                            getMore: this.gatMoreCard,
                            hasMore: this.hasMore,
                        }}
                        listConfig={{
                            canAddCard: false,
                            renderLoading: this.renderLoading,
                            canDragList: false,
                        }}
                        className={styles.kanban}
                    />
                </BISpin>
            </>
        );
    }
}
export default Mine;
