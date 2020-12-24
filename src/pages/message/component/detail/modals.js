import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AriTableDetail from '@/components/airTable/detail';
import AriTableHistory from '@/components/airTable/history';
import CalendarDetail from '@/pages/workbench/_components/editModule';
import TalentScheduleDetail from '@/pages/business/talent/schedule/common/detail/detail';
import LiveDetail from '@/pages/business/live/detail';
import RecruitDetail from '@/pages/business/recruit/detail';
import ThreadManageDetail from '@/pages/business/threadManage/detail';
import BloggerCRMApprovalDetail from '@/pages/business/bloggerCRM/components/approval/detail';

const modalInstance = {
    dom: undefined,
    modalDetail: undefined,
    formatParams: undefined,
    checkType: async (businessModule, messageObj) => {
        if (messageObj.business === 'flow_key_talent_expand') {
            modalInstance.formatParams = (params) => {
                return { tableId: businessModule.tableId, instanceId: params.messageInstanceId };
            };
            return (
                // eslint-disable-next-line no-underscore-dangle
                <Provider store={window.g_app._store}>
                    <BloggerCRMApprovalDetail
                        ref={(dom) => {
                            modalInstance.modalDetail = dom;
                        }}
                        onClose={modalInstance.close}
                        detailType="detailPage"
                        maskClosable
                        {...businessModule}
                    />
                </Provider>
            );
        }
        switch (Number(messageObj.moduleType)) {
            case 12: // 客户跟进
            case 14: // 款项登记
            case 15: // 款项认领
            case 16: // 认领审核
            case 17: // 项目回款
            case 21: // KOL刊例-双微
            case 22: // KOL刊例-小红书
            case 23: // KOL刊例-抖音
            case 24: // KOL刊例-B站
            case 25: // KOL刊例-快手
            case 26: // 内容客户
            case 33: // 年框项目明细
            case 34: // 年框客户
            case 35: // 年框项目
                modalInstance.formatParams = (params) => {
                    return { tableId: businessModule.tableId, rowId: params.moduleId };
                };
                if (messageObj.moduleOrigin === 'history') {
                    return (
                        // eslint-disable-next-line no-underscore-dangle
                        <Provider store={window.g_app._store}>
                            <AriTableHistory
                                ref={(dom) => {
                                    modalInstance.modalDetail = dom;
                                }}
                                onClose={modalInstance.close}
                                detailType="detailPage"
                                maskClosable
                                {...businessModule}
                            />
                        </Provider>
                    );
                }
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <AriTableDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            onClose={modalInstance.close}
                            detailType="detailPage"
                            maskClosable
                            {...businessModule}
                        />
                    </Provider>
                );
            case 13: // 日历
                modalInstance.formatParams = (params) => {
                    return { id: params.moduleId };
                };
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <CalendarDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            onClose={modalInstance.close}
                            maskClosable
                        />
                    </Provider>
                );
            case 18: // 档期详情
                modalInstance.formatParams = (params) => {
                    return params.moduleId;
                };
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <TalentScheduleDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            maskClosable
                        />
                    </Provider>
                );
            case 37: //  直播产品库,初赛,二筛聚合接口,需要反查
            case 38: //  直播产品库,初赛,二筛聚合接口,需要反查
                modalInstance.formatParams = (params) => {
                    return { tableId: businessModule.tableId, rowId: params.moduleId };
                };
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <LiveDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            onClose={modalInstance.close}
                            detailType="detailPage"
                            maskClosable
                            {...businessModule}
                        />
                    </Provider>
                );
            case 41: //  全球招募
                modalInstance.formatParams = (params) => {
                    return { tableId: businessModule.tableId, rowId: params.moduleId };
                };
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <RecruitDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            onClose={modalInstance.close}
                            detailType="detailPage"
                            maskClosable
                            {...businessModule}
                        />
                    </Provider>
                );
            case 44: //  商务线索管理
                modalInstance.formatParams = (params) => {
                    return { tableId: businessModule.tableId, rowId: params.moduleId };
                };
                return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Provider store={window.g_app._store}>
                        <ThreadManageDetail
                            ref={(dom) => {
                                modalInstance.modalDetail = dom;
                            }}
                            onClose={modalInstance.close}
                            detailType="detailPage"
                            maskClosable
                            {...businessModule}
                        />
                    </Provider>
                );
            default:
                return null;
        }
    },
    showModal: async (businessModule, extraMsgObj) => {
        modalInstance.dom = document.getElementById('message_business_modals_custom');
        if (!modalInstance.dom) {
            modalInstance.dom = document.createElement('div');
            modalInstance.dom.id = 'message_business_modals_custom';
        }
        const JSXdom = await modalInstance.checkType(businessModule, extraMsgObj);
        if (!JSXdom) return;
        await ReactDOM.render(JSXdom, modalInstance.dom);
        document.getElementById('root').appendChild(modalInstance.dom);
        if (modalInstance.modalDetail && modalInstance.modalDetail.showModal) {
            setTimeout(() => {
                modalInstance.modalDetail.showModal(modalInstance.formatParams(extraMsgObj) || {});
            }, 100);
        }
    },
    close: () => {
        if (modalInstance.dom) {
            modalInstance.dom.remove();
        }
    },
};
export default modalInstance;
