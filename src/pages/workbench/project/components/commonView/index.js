import React from 'react';
import Hearder from '../../../_components/header';
import { View } from './components/view';

@View({ hearderParams: { viewType: 1 } })
class Mine extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    willFetch = () => {
        return {
            projectId: this.props.projectId,
            groupType: 3, // 用于搜索模块
        };
    };

    fetchData = () => {
        if (this.props.initData) this.props.initData();
    };

    checkAuth = (type) => {
        const { authButtons } = this.props;
        if (!authButtons || !authButtons.length) return false;
        return authButtons.find((ls) => {
            return ls.menuPath === type;
        });
    };

    render() {
        const hearderParams = this.props.hearderParams || {};
        const { viewType } = hearderParams;
        const { authButtons } = this.props;
        const canRecoveryTask = this.checkAuth('/workbench/project/recoveryTask');
        const canDeleteTask = this.checkAuth('/workbench/project/deleteTask');
        return (
            <>
                <Hearder
                    willFetch={this.willFetch}
                    fetchView={this.props.fetchView}
                    authButtons={authButtons}
                    value={hearderParams}
                    showDetailPanel={this.props.showDetailPanel}
                    left={[
                        { type: 'KanBoard', key: 'viewType' },
                        String(viewType) !== '2' ? { type: 'Filter', key: 'filter' } : {},
                    ]}
                    right={[
                        {
                            type: 'Search',
                            key: 'search',
                            attr: { scheduleType: 1 },
                            willFetch: () => {
                                return {
                                    groupType: 1,
                                    projectId: Number(this.props.projectId),
                                };
                            },
                        },
                        { type: 'Participant', key: 'participant', willFetch: this.willFetch },
                        {
                            type: 'Setting',
                            key: 'Setting',
                            attr: {
                                recoveryAuth: !!canRecoveryTask,
                                deleteAuth: !!canDeleteTask,
                            },
                        },
                    ]}
                    onChange={this.props.onChangeHeader}
                />
            </>
        );
    }
}

export default Mine;
