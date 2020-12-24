import React from 'react';
import { message } from 'antd';
import KanBan from '@/pages/workbench/_components/kanBoard';
import { moveCard } from '../../../../../services';
import BISpin from '@/ant_components/BISpin';
import { formateKanbanData } from './_utils';
import Card from '@/pages/workbench/mine/components/card';
import { getProjectsPanelsSchedules, getMorePagesProjectsPanelsSchedules } from '../../../../services';

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            columnData: [],
            pageParams: {},
            pageNum: 1, // 初始化请求所有看板参数
            pageSize: 5,
        };
        this.isUpdate = true;
        Mine.headerMonitor = this.headerMonitor;
    }

    componentDidMount() {
        this.isUpdate = true;
        this.fetchData();
    }

    componentWillUnmount() {
        this.isUpdate = false;
    }

    headerMonitor = () => {};

    willFetch = () => {
        const params = this.props.willFetch ? this.props.willFetch() : {};
        return params;
    };

    fetchData = async () => {
        if (!this.isUpdate) return;
        const { pageSize } = this.state;
        const params = this.willFetch();
        const { projectId } = params || {};
        await this.setState({ pageParams: {}, dataSource: [] });
        await this.getProjectsPanelsSchedules({ projectId, pageSize, pageNum: 1 });
    };

    initData = async () => {};

    initPageParams = (dataSource) => {
        if (!this.isUpdate) return;
        const { pageParams, pageNum } = this.state;
        dataSource.forEach((el) => {
            pageParams[el.id] = {
                ...(pageParams[el.id] || {}),
                loading: false,
                pageNum: pageNum + 1,
                relationTimestamp: el.relationTimestamp,
                total: Number(el.total),
            };
        });
        this.setState({ pageParams });
    };

    getProjectsPanelsSchedules = async (params) => {
        if (!this.isUpdate) return;
        const { columnData, dataSource } = this.state;
        if (params.pageNum === 1) {
            // 第一页添加loading
            await this.setState({ loading: true });
        }
        const result = await getProjectsPanelsSchedules(params);
        await this.setState({ loading: false });
        if (result && result.success) {
            const data = result.data || {};
            const list = Array.isArray(data.list) ? data.list : [];
            const cards = formateKanbanData(list, columnData);
            this.initPageParams(cards);
            this.setState({ dataSource: dataSource.concat([], cards) });
            if (data.total > dataSource.length) {
                await this.getProjectsPanelsSchedules({ ...params, pageNum: params.pageNum + 1 });
            }
        }
    };

    goDetail = (card) => {
        const canAddCard = this.checkAuth('/workbench/project/taskDetail');
        if (canAddCard) {
            // type:0-日程，1-任务,//isEdit:0-添加，1-修改
            const params = {
                type: this.props.scheduleTypeFlag,
                isEdit: 1,
                id: card.card.id,
            };
            if (this.modalFrom && this.modalFrom.showModal) {
                this.modalFrom.showModal(params);
            }
        } else {
            message.error('您暂无权限查看该任务');
        }
    };

    endDrugCard = async (drugSource, dropTarget) => {
        if (!this.isUpdate) return;
        const params = this.willFetch();
        const { projectId } = params || {};
        const data = {
            movePlaceFlag: 2, // 普通项目
            projectId,
            nextScheduleId: dropTarget.cardId || 0,
            sourceScheduleId: drugSource.cardId,
            sourcePanelId: drugSource.columnId,
            targetPanelId: dropTarget.columnId,
        };
        await moveCard(data);
        await this.fetchData(); // 不论成功失败都刷新
    };

    // addCard = (key) => {
    //     const { scheduleTypeFlag, kanbanType, projectId } = this.props;
    //     const params = {
    //         type: scheduleTypeFlag,
    //         isEdit: 0,
    //         id: '',
    //         panelId: Number(kanbanType) === 2 ? key : null, // 看板id(执行时间传null，别的传看板id)
    //         projectId, // 项目id（普通项目传，看板项目传null）
    //     };
    //     addFn = { this.props.showAddPanel }
    // };

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

    checkAuth = (type) => {
        const { authButtons } = this.props;
        if (!authButtons || !authButtons.length) return false;
        return authButtons.find((ls) => {
            return ls.menuPath === type;
        });
    };

    gatMoreCard = async (panelId) => {
        if (!this.isUpdate) return;
        const params = this.willFetch();
        const { projectId } = params || {};
        const { columnData, pageParams, pageSize } = this.state;
        const panelPageParams = pageParams[panelId] || {};
        let relationTimestamp = panelPageParams.relationTimestamp;
        pageParams[panelId] = { ...panelPageParams, loading: true };
        this.setState({ pageParams });
        if (!panelId) return;
        // 获取该panel下最后一条数据
        const { dataSource } = this.state;
        const sourcePanel = dataSource.find((ls) => {
            return ls.id === panelId;
        });
        const sourcePanelIndex = dataSource.findIndex((ls) => {
            return ls.id === panelId;
        });
        if (!sourcePanel) return;
        const res = await getMorePagesProjectsPanelsSchedules({
            panelId,
            projectId,
            relationTimestamp,
            pageNum: panelPageParams.pageNum || 1,
            pageSize,
        });
        if (res && res.data) {
            const formateData = formateKanbanData([res.data], columnData);
            const cards = (formateData[0] || {}).cards;
            relationTimestamp = (formateData[0] || {}).relationTimestamp;
            dataSource[sourcePanelIndex] = { ...sourcePanel, cards: sourcePanel.cards.concat([], cards) };
            this.setState({ dataSource });
        }
        pageParams[panelId] = {
            ...panelPageParams,
            loading: false,
            relationTimestamp,
            pageNum: (panelPageParams.pageNum || 1) + 1,
        };
        this.setState({ pageParams });
    };

    loadCard = () => {};

    hasMore = (panelId) => {
        const { pageParams, dataSource } = this.state;
        const sourcePanel = dataSource.find((ls) => {
            return ls.id === panelId;
        }) || {};
        const pageObj = pageParams[panelId];
        return pageObj && !pageObj.loading && (sourcePanel.cards || []).length < pageObj.total;
    };

    render() {
        const { dataSource } = this.state;
        const canAddCard = this.checkAuth('/workbench/project/addTask');
        // const canEditTask = this.checkAuth('/workbench/project/editTask');
        // const canFileTask = this.checkAuth('/workbench/project/fileTask');
        return (
            <>
                <BISpin spinning={this.state.loading}>
                    <KanBan
                        taskParams={this.willFetch()}
                        onRefresh={() => {
                            return this.fetchData();
                        }}
                        showNoFinishTask
                        dataSource={dataSource}
                        endDrugCard={this.endDrugCard}
                        addFn={this.props.showAddPanel}
                        InfiniteScroll={{
                            getMore: this.gatMoreCard,
                            hasMore: this.hasMore,
                        }}
                        listConfig={{
                            canDragList: false,
                            canAddCard: !!canAddCard,
                            renderAddBtn: this.renderAddBtn,
                            canListSetting: true,
                        }}
                        cardConfig={{
                            renderCard: this.renderCard,
                        }}
                        panelAuthData={this.props.authButtons}
                    />
                </BISpin>
            </>
        );
    }
}
export default Mine;
