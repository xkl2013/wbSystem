import React from 'react';
import KanBan from '../../../_components/kanBoard';
import { getMyPanel } from '../../services';
import { moveCard } from '../../../services';
import { getUserConfig } from '@/services/airTable';
import BISpin from '@/ant_components/BISpin';
import { formateKanbanData } from './_utils';
import ModalForm from '../../../_components/modalForm';
import Card from '../card';

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        await this.setState({ loading: true });
        const { columnData } = this.state;
        const result = await getMyPanel();
        if (result && result.success) {
            const data = Array.isArray(result.data) ? result.data : [];
            const dataSource = formateKanbanData(data, columnData);
            this.setState({ dataSource });
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

    endDrugCard = async (drugSource, dropTarget) => {
        const params = {
            movePlaceFlag: 3,
            nextScheduleId: dropTarget.cardId || 0,
            sourceScheduleId: drugSource.cardId,
            sourcePanelId: drugSource.columnId,
            targetPanelId: dropTarget.columnId,
        };
        await moveCard(params);
        await this.fetchData(); // 不论成功失败都刷新
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

    render() {
        const { dataSource } = this.state;
        return (
            <>
                <BISpin spinning={this.state.loading}>
                    <KanBan
                        taskParams={this.willFetch()}
                        onRefresh={() => {
                            return this.fetchData();
                        }}
                        dataSource={dataSource}
                        endDrugCard={this.endDrugCard}
                        addFn={this.props.showAddPanel}
                        listConfig={{
                            canDragList: false,
                            canListSetting: true,
                        }}
                        cardConfig={{
                            canDragCard: (e) => {
                                return e.data.type === '1';
                            },
                            renderCard: this.renderCard,
                        }}
                    />
                </BISpin>
                <ModalForm
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    getData={this.fetchData}
                />
            </>
        );
    }
}
export default Mine;
