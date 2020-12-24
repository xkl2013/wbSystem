import React from 'react';
import SecFilter from '../secFilter';
import KanBan from '../../../_components/kanBoard';
import { getExecuteTimePanel, getPriorityPanel } from '../../services';
import { moveCard } from '../../../services';
import { getUserConfig } from '@/services/airTable';
import BISpin from '@/ant_components/BISpin';
import { formateKanbanData } from './_utils';
import ModalForm from '../../../_components/modalForm';
// import ModalDetail from '../../../_components/calendar/common/commonGroup/detail';
import Card from '../card';

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kanbanType: props.kanbanType,
            loading: false,
            dataSource: [],
            columnData: [],
        };
        Mine.headerMonitor = this.headerMonitor;
    }

    componentDidMount() {
        this.fetchData();
    }

    headerMonitor = () => {};

    willFetch = () => {
        const params = this.props.willFetch ? this.props.willFetch() : {};
        return params;
    };

    fetchData = async () => {
        const params = this.willFetch();
        const { scheduleTypeFlag } = params || {};
        const { kanbanType } = this.state;
        await this.setState({ loading: true });
        switch (Number(kanbanType)) {
            case 1:
                await this.getExecuteTimePanel({ scheduleTypeFlag });
                break;
            case 2:
                await this.getPriorityPanel();
                break;
            default:
                break;
        }
        await this.setState({ loading: false });
    };

    getUserConfig = async (tableId) => {
        const result = await getUserConfig(tableId);
        if (result && result.success) {
            const columnData = Array.isArray(result.data) ? result.data : [];
            this.setState({ columnData });
        }
    };

    /*
     * 获取执行时间看板
     */
    getExecuteTimePanel = async (params) => {
        const { columnData } = this.state;
        const result = await getExecuteTimePanel(params);
        if (result && result.success) {
            const data = Array.isArray(result.data) ? result.data : [];
            const dataSource = formateKanbanData(data, columnData);
            this.setState({ dataSource });
        }
    };

    /*
     * 获取优先级看板
     */
    getPriorityPanel = async () => {
        const { columnData } = this.state;
        const result = await getPriorityPanel();
        if (result && result.success) {
            const data = Array.isArray(result.data) ? result.data : [];
            const dataSource = formateKanbanData(data, columnData);
            this.setState({ dataSource });
        }
    };

    onChangeKanbanType = (kanbanType) => {
        const { onChangeKanbanType } = this.props;
        this.setState({ kanbanType }, this.fetchData);
        if (onChangeKanbanType) {
            onChangeKanbanType(kanbanType);
        }
    };

    goDetail = (card) => {
        // type:0-日程，1-任务,//0-添加，1-修改
        if (this.modalDetail) {
            const params = {
                type: this.props.scheduleTypeFlag,
                isEdit: 1,
                id: card.card.id,
            };
            if (this.modalDetail.showModal) {
                this.modalDetail.showModal(params);
            }
        }
    };

    addCard = (key) => {
        const { scheduleTypeFlag, kanbanType, modelId } = this.props;
        const params = {
            type: scheduleTypeFlag,
            isEdit: 0,
            id: '',
            panelId: Number(kanbanType) === 2 ? key : null, // 看板id(执行时间传null，别的传看板id)
            projectId: kanbanType ? null : modelId, // 项目id（普通项目传，看板项目传null）
        };
        if (this.modalDetail && this.modalDetail.showModal) {
            this.modalDetail.showModal(params);
        }
    };

    endDrugCard = async (drugSource, dropTarget) => {
        const params = {
            movePlaceFlag: 1, // 优先级移动
            nextScheduleId: dropTarget.cardId || 0,
            sourceScheduleId: drugSource.cardId,
            sourcePanelId: drugSource.columnId,
            targetPanelId: dropTarget.columnId,
        };
        await moveCard(params);
        await this.fetchData(); // 不论成功失败都刷新
    };

    renderCard = (card) => {
        return <Card data={card} columnData={this.state.columnData} goDetail={this.goDetail} />;
    };

    render() {
        const { dataSource, kanbanType } = this.state;
        return (
            <>
                <BISpin spinning={this.state.loading}>
                    <SecFilter onChange={this.onChangeKanbanType} kanbanType={kanbanType} />
                    <KanBan
                        dataSource={dataSource}
                        endDrugCard={this.endDrugCard}
                        listConfig={{
                            addCard: this.addCard,
                            canDragList: false,
                        }}
                        cardConfig={{
                            canDragCard: Number(kanbanType) === 2,
                            renderCard: this.renderCard,
                        }}
                    />
                </BISpin>
                <ModalForm
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    // editAuthority="/workbench/project/editKanban"
                    // authority="看板的操作权限"
                    getData={this.fetchData}
                />
                {/* <ModalDetail ref={(dom) => { return this.modalDetail = dom; }} getData={this.fetchData} /> */}
            </>
        );
    }
}
export default Mine;
