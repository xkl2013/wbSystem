import React from 'react';
import { withRouter } from 'react-router';
import List from './list';
import Canban from './canban';
import Calender from './calender';
import Organization from '../organization';
import styles from './style.less';
import EditModule from '../../../_components/editModule';
import { myProjectId } from '../../../_enum';

/*
 * hearderParams @params(模块头部信息)
 */

export const View = (params) => {
    const { hearderParams = {}, groupType } = params || {};
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
                organizationIsShow: true,
                memberIds: [],
                memberIdsMap: [],
            };

            headerMonitor = null;

            willFetch = () => {
                const paramsObj = { ...hearderParams, ...this.state.hearderParams };
                return {
                    ...paramsObj,
                    groupType,
                    memberIds: this.state.memberIds || [],
                    memberIdsMap: this.state.memberIdsMap || [],
                };
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
                obj[headerKey] = val;
                if (this.headerMonitor) this.headerMonitor(obj, { ...this.state.hearderParams, ...obj });
                this.setState((state) => {
                    return { hearderParams: { ...state.hearderParams, ...obj } };
                });
            };

            // 修改关注成员回调
            changeMenber = ({ memberIds, memberIdsMap }) => {
                this.setState({ memberIds, memberIdsMap }, this.getData);
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

            hideOrganization = () => {
                this.setState({ organizationIsShow: false });
            };

            showOrganization = () => {
                this.setState({ organizationIsShow: true });
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
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                            />
                        );
                    case 2:
                        this.headerMonitor = Calender.headerMonitor;
                        return (
                            <Calender
                                willFetch={this.willFetch}
                                showDetailPanel={this.showDetailPanel}
                                showAddPanel={this.showAddPanel}
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                            />
                        );
                    case 3:
                        this.headerMonitor = List.headerMonitor;
                        return (
                            <List
                                willFetch={this.willFetch}
                                showDetailPanel={this.showDetailPanel}
                                ref={(dom) => {
                                    this.view = dom;
                                }}
                            />
                        );
                    default:
                        return null;
                }
            };

            render() {
                const { organizationIsShow } = this.state;
                return (
                    <>
                        <ForWardedComponent
                            {...this.props}
                            fetchView={this.fetchView}
                            hearderParams={this.state.hearderParams}
                            showOrganization={this.showOrganization}
                            organizationIsShow={organizationIsShow}
                            onChangeHeader={this.onChangeHeader}
                            showDetailPanel={this.showDetailPanel}
                        />
                        <div className={`${organizationIsShow ? styles.kanbanWrap : ''}`}>
                            <Organization
                                getData={this.changeMenber}
                                hideOrganization={this.hideOrganization}
                                visible={organizationIsShow}
                            />
                            {this.renderView()}
                        </div>
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
