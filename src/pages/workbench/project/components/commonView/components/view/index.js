/*
 * hearderParams @params(模块头部信息)
 * kanbanType @params (1为按执行时间2为按优先级)
 * scheduleTypeFlag @params (0为日程,1为任务)
 */
import React from 'react';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from 'react-router';
import List from './list';
import Canban from './canban';
import EditModule from '../../../../../_components/editModule';
import Calender from './calender';

/*
 * hearderParams @params(模块头部信息)
 * kanbanType @params (1为按执行时间2为按优先级)
 * scheduleTypeFlag @params (0为日程,1为任务)
 */

export const View = (params) => {
    const { hearderParams = {}, kanbanType = 2, scheduleTypeFlag = 1, modelId } = params || {};
    return (Com) => {
        const ForWardedComponent = React.forwardRef((props, ref) => {
            return (
                <div ref={ref}>
                    <Com {...props} />
                </div>
            );
        });

        class Wrap extends React.Component {
            state = {
                hearderParams,
                scheduleTypeFlag,
                kanbanType,
                modelId,
            };

            headerMonitor = null;

            getData = () => {
                const { viewType } = this.state.hearderParams || {};
                let ref = this.view;
                if (Number(viewType) === 2) {
                    ref = this.view.getWrappedInstance();
                }
                if (ref && ref.fetchData) ref.fetchData();
            };

            willFetch = () => {
                const paramObj = { ...hearderParams, ...this.state.hearderParams };
                return { hearderParams: paramObj, scheduleTypeFlag, modelId, projectId: this.props.projectId };
            };

            onChangeHeader = (val, headerKey) => {
                if (!headerKey) return;
                const obj = {};
                obj[headerKey] = val;
                if (this.headerMonitor) this.headerMonitor(obj, { ...this.state.hearderParams, ...obj });
                this.setState((state) => {
                    return { hearderParams: { ...state.hearderParams, ...obj } };
                });
            };

            onChangeKanbanType = () => {};

            changePage = () => {
                this.getData();
            };

            // 显示数据详情信息
            showDetailPanel = (dataParams) => {
                if (this.editModule && this.editModule.showModal) {
                    this.editModule.showModal(dataParams);
                }
            };

            // 新增数据
            showAddPanel = (obj = {}) => {
                const { type, panelId, panelName } = obj;
                if (this.editModule && this.editModule.showAddModal) {
                    this.editModule.showAddModal({
                        type,
                        projectId: this.props.projectId,
                        projectName: '',
                        panelId,
                        panelName,
                    });
                }
            };

            // 刷新视图层
            fetchView = () => {
                this.getData();
            };

            renderView = () => {
                const { viewType } = this.state.hearderParams || {};
                switch (Number(viewType)) {
                    case 1:
                        this.headerMonitor = Canban.headerMonitor;
                        return (
                            <Canban
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                                willFetch={this.willFetch}
                                onChangeKanbanType={this.onChangeKanbanType}
                                scheduleTypeFlag={scheduleTypeFlag}
                                projectId={this.props.projectId}
                                authButtons={this.props.authButtons}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                {...this.state}
                            />
                        );
                    case 2:
                        this.headerMonitor = Calender.headerMonitor;
                        return (
                            <Calender
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                                willFetch={this.willFetch}
                                scheduleTypeFlag={scheduleTypeFlag}
                                projectId={this.props.projectId}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                {...this.state}
                            />
                        );
                    case 3:
                        this.headerMonitor = List.headerMonitor;
                        return (
                            <List
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                                willFetch={this.willFetch}
                                scheduleTypeFlag={scheduleTypeFlag}
                                projectId={this.props.projectId}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                {...this.state}
                            />
                        );
                    default:
                        return null;
                }
            };

            render() {
                return (
                    <>
                        <ForWardedComponent
                            {...this.props}
                            willFetch={this.willFetch}
                            hearderParams={this.state.hearderParams}
                            changePage={this.changePage}
                            fetchView={this.fetchView}
                            onChangeHeader={this.onChangeHeader}
                            showDetailPanel={this.showDetailPanel}
                        />
                        {this.renderView()}
                        <EditModule
                            ref={(dom) => {
                                this.editModule = dom;
                            }}
                            fetchView={this.fetchView}
                        />
                    </>
                );
            }
        }
        return withRouter(Wrap);
    };
};
export default View;
