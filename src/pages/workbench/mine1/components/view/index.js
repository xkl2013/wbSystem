import React from 'react';
import { withRouter } from 'react-router';
import List from './list';
import Canban from './canban';
import Calender from './calender';
import { myProjectId } from '../../../_enum';
import EditModule from '../../../_components/editModule';

/*
 * hearderParams @params(模块头部信息)
 * scheduleTypeFlag @params (0为日程,1为任务)
 */

export const View = (params) => {
    const { hearderParams = {}, scheduleTypeFlag = 1, modelId } = params || {};
    return (Com) => {
        const ForWardedComponent = React.forwardRef((props, ref) => {
            return (
                <div ref={ref}>
                    <Com {...props} />
                </div>
            );
        });

        class Wrap extends React.Component {
            view = null;

            state = {
                hearderParams,
                scheduleTypeFlag,
                modelId,
            };

            headerMonitor = null;

            willFetch = () => {
                const paramsObj = { ...hearderParams, ...this.state.hearderParams };
                return { hearderParams: paramsObj, scheduleTypeFlag, modelId, projectId: myProjectId };
            };

            getData = () => {
                const { viewType } = this.state.hearderParams || {};
                let ref = this.view;
                if (Number(viewType) === 2) {
                    ref = this.view.getWrappedInstance();
                }
                if (ref && ref.fetchData) ref.fetchData();
            };

            onChangeHeader = (val, headerKey) => {
                if (!headerKey) return;
                const obj = {};
                let hearderParamsObj = this.state.hearderParams || {};
                obj[headerKey] = val;
                hearderParamsObj = { ...hearderParamsObj, ...obj };
                if (this.headerMonitor) {
                    this.headerMonitor(obj, hearderParamsObj);
                }
                this.setState(() => {
                    return { hearderParams: hearderParamsObj };
                });
            };

            // 刷新视图层
            fetchView = () => {
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
                        projectId: myProjectId,
                        panelId,
                        panelName,
                    });
                }
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
                                scheduleTypeFlag={scheduleTypeFlag}
                                modelId={this.state.modelId}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                {...this.state}
                            />
                        );
                    case 2:
                        this.headerMonitor = Calender.headerMonitor;
                        return (
                            <Calender
                                willFetch={this.willFetch}
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                                scheduleTypeFlag={scheduleTypeFlag}
                                modelId={this.state.modelId}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                {...this.state}
                            />
                        );
                    case 3:
                        this.headerMonitor = List.headerMonitor;
                        return (
                            <List
                                willFetch={this.willFetch}
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                                scheduleTypeFlag={scheduleTypeFlag}
                                modelId={this.state.modelId}
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
                            fetchView={this.fetchView}
                            hearderParams={this.state.hearderParams}
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
