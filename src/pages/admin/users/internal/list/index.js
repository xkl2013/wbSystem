/* eslint-disable */

import * as tslib_1 from 'tslib';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import styles from '@/theme/listPageStyles.less';
import selfStyle from './styles.less';
import AuthButton from '@/components/AuthButton';
import Quit from '@/pages/admin/users/internal/components/Quit';
import BecomeOffice from '@/pages/admin/users/internal/components/BecomeOffice';
import { user_internal } from '@/utils/pathEnum';
import PageDataView from '@/components/DataView';
import { columnsFn } from '@/pages/admin/users/internal/list/_selfColumn';
import { searchsFn } from '@/pages/admin/users/internal/list/_selfSearch';
import { str2intArr } from '@/utils/utils';
import BIModal from '@/ant_components/BIModal';
import AssociationSearch from '@/components/associationSearch';
import { getUserList as getInnerUserList, connectChange } from '@/services/globalSearchApi';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const regDate = ['employeeContractStart', 'employeeContractEnd', 'employeeEmploymentDate', 'employeeLeaveDate'];
const regIntArr = ['employeeStatusList', 'employeeEmploymentFormList', 'employeeHouseholdTypeList', 'userGenderList'];
const regIntVal = ['userDepartmentId', 'ageMax', 'ageMin', 'pageSize', 'pageNum'];
let List = class List extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            userId: null,
            changeStatus: false,
            connectObj: null,
            handoverUser: {
                handoverUserId: null,
                handoverUserName: '',
            },
        };
        this.fetch = () => {
            const pageDataView = this.refs.pageDataView;
            if (pageDataView != null) {
                pageDataView.fetch();
            }
        };
        this._fetch = (beforeFetch) => {
            const data = beforeFetch();
            // ------------------------int------------------------
            if (data.userRealName) {
                data.userRealName = data.userRealName.label;
            }
            if (data.userChsName) {
                data.userChsName = data.userChsName.label;
            }
            if (data.userDepartmentId) {
                data.userDepartmentId = data.userDepartmentId.value;
            }
            if (data.ageRange) {
                data.ageMin = Number(data.ageRange.min);
                data.ageMax = Number(data.ageRange.max);
                delete data.ageRange;
            }
            // -------------------------array-----------------------
            if (data.employeeStatusList) {
                data.employeeStatusList = str2intArr(data.employeeStatusList);
            }
            if (data.employeeEmploymentFormList) {
                data.employeeEmploymentFormList = str2intArr(data.employeeEmploymentFormList);
            }
            if (data.employeeHouseholdTypeList) {
                data.employeeHouseholdTypeList = str2intArr(data.employeeHouseholdTypeList);
            }
            if (data.userGenderList) {
                data.userGenderList = str2intArr(data.userGenderList);
            }
            // -----------------------日期类-------------------------
            // 合同开始日期范围 daterange
            if (data.employeeContractStart && data.employeeContractStart.length == 2) {
                data.employeeContractStartStart = moment(data.employeeContractStart[0]).format(dateTimeFormat);
                data.employeeContractStartEnd = moment(data.employeeContractStart[1]).format(dateTimeFormat);
                delete data.employeeContractStart;
            }
            // 合同结束日期范围 daterange
            if (data.employeeContractEnd && data.employeeContractEnd.length == 2) {
                data.employeeContractEndStart = moment(data.employeeContractEnd[0]).format(dateTimeFormat);
                data.employeeContractEndEnd = moment(data.employeeContractEnd[1]).format(dateTimeFormat);
                delete data.employeeContractEnd;
            }
            // 入职时间范围 daterange
            if (data.employeeEmploymentDate && data.employeeEmploymentDate.length == 2) {
                data.employeeEmploymentDateStart = moment(data.employeeEmploymentDate[0]).format(dateTimeFormat);
                data.employeeEmploymentDateEnd = moment(data.employeeEmploymentDate[1]).format(dateTimeFormat);
                delete data.employeeEmploymentDate;
            }
            // 离职时间范围 daterange
            if (data.employeeLeaveDate && data.employeeLeaveDate.length == 2) {
                data.employeeLeaveDateStart = moment(data.employeeLeaveDate[0]).format(dateTimeFormat);
                data.employeeLeaveDateEnd = moment(data.employeeLeaveDate[1]).format(dateTimeFormat);
                delete data.employeeLeaveDate;
            }
            this.props.dispatch({
                type: 'internal_user/getUserList',
                payload: data,
            });
        };
        this.toggleModal = (payload) => {
            this.props.dispatch({
                type: 'internal_user/toggleModal',
                payload,
            });
        };
        this.toRoutepath = (pathname, query) => {
            this.props.history.push({
                pathname,
                query,
            });
        };
        // 启用，禁用，重置密码
        this.userDisable = (obj, path) => {
            this.props.dispatch({
                type: `internal_user/${path}`,
                payload: { id: obj.userId, cb: this.fetch },
            });
        };
        //  点击显示弹框
        this.showMoreModal = (obj, isShowObj) => {
            this.setState({
                userId: obj.userId,
            });
            this.toggleModal(isShowObj);
        };
        this.checkoutEventtype = (obj, id) => {
            switch (id) {
                case 1:
                    this.userDisable(obj, obj.userStatus ? 'userDisable' : 'userEnabled');
                    break;
                case 2:
                    this.showMoreModal(obj, { showBecomeOffice: true });
                    break;
                case 3:
                    this.showMoreModal(obj, { showTransferOffice: true });
                    break;
                case 4:
                    this.showMoreModal(obj, { showQuit: true });
                    break;
                case 5:
                    this.userDisable(obj, 'resetPassword');
                    break;
                case 6:
                    this.connectOpen(obj);
                    break;
                default:
                    break;
            }
        };
        this.renderPropOver = (obj) => {
            const filterData = user_internal.filter((item) => {
                return AuthButton.checkPathname(item.path);
            });
            let arr = [];
            switch (obj.employeeStatus) {
                case 1:
                case 2:
                    arr = filterData;
                    break;
                case 3:
                    arr = filterData.slice();
                    arr.splice(1, 1);
                    break;
                default:
                    break;
            }
            return React.createElement(
                'div',
                { className: selfStyle.modalCls },
                arr.map((item) => {
                    return React.createElement(
                        'p',
                        {
                            className: selfStyle.operateItem,
                            key: item.id,
                            onClick: this.checkoutEventtype.bind(this, obj, item.id),
                        },
                        item.id === 1 ? (obj.userStatus ? '禁用' : '启用') : item.name,
                    );
                }),
            );
        };
        this.regularRangeDate = (values) => {
            Object.keys(values).map((item) => {
                // 格式化时间
                regDate.forEach((el) => {
                    if (item === el) {
                        if (values[item] && values[item].length) {
                            values[`${item}Start`] = moment(values[item][0]).format(dateFormat);
                            values[`${item}End`] = moment(values[item][1]).format(dateFormat);
                            delete values[item];
                        }
                    }
                });
                // 字符串数组格式化为数字数组
                regIntArr.forEach((el) => {
                    if (item === el) {
                        if (values[item] && values[item].length) values[item] = values[item].map(Number);
                    }
                });
                // 字符串改为number
                regIntVal.forEach((el) => {
                    if (item === el) {
                        if (values[item]) values[item] = Number(values[item]);
                    }
                });
                if (item === 'userName' && values[item]) values[item] = values[item].label.props.children;
                return values;
            });
            return values;
        };
        this.getData = (params) => {
            const newParams = this.regularRangeDate(params);
            this.props.dispatch({
                type: 'internal_user/getUserList',
                payload: newParams,
            });
        };
        this.regularParam = (values) => {
            Object.keys(values).map((item) => {
                if (item === 'employeePromotionDate' || item === 'employeeLeaveDate') {
                    values[item] = moment(values[item]).format(dateTimeFormat);
                }
                return values;
            });
            return values;
        };
        // 弹框提交
        this.handSubmit = (values, path) => {
            const { userId } = this.state;
            this.props.dispatch({
                type: `internal_user/${path}`,
                payload: { id: userId, values: this.regularParam(values), cb: this.fetch },
            });
        };
        // 数据交接确认
        this.connectOk = () => {
            const { connectObj, handoverUser } = this.state;
            if (connectObj !== null) {
                const data = {
                    handoverUserId: handoverUser.handoverUserId,
                    handoverUserName: handoverUser.handoverUserName,
                    recipientUserId: connectObj.value,
                    recipientUserName: connectObj.label,
                };
                const modal = BIModal.confirm();
                modal.update({
                    title: '提醒',
                    content: `数据转交涉及数据量庞大且不可逆，操作请慎重。
                    是否确定将 ${handoverUser.handoverUserName} 数据转交给 ${connectObj.label}？`,
                    icon: null,
                    cancelText: '取消',
                    onOk: async () => {
                        const res = await connectChange(data);
                        if (res.success) {
                            message.success(res.message);
                            this.fetch();
                        } else {
                            message.error(res.message);
                        }
                        this.connectClose();
                    },
                    onCancel: () => {},
                });
            } else {
                message.warning('请选择交接人');
            }
        };
        // 数据交接关闭
        this.connectClose = () => {
            this.setState({
                changeStatus: false,
                connectObj: null,
            });
        };
        // 数据交接打开
        this.connectOpen = (obj) => {
            this.setState({
                changeStatus: true,
                handoverUser: {
                    handoverUserId: obj.userId,
                    handoverUserName: obj.userRealName,
                },
            });
        };
    }

    componentDidMount() {
        this.fetch();
    }

    render() {
        const columns = columnsFn(this);
        const searchs = searchsFn();
        const { showQuit, showBecomeOffice, userListPage } = this.props;
        const { changeStatus, connectObj } = this.state;
        return React.createElement(
            'div',
            { className: styles.wrap },
            React.createElement(PageDataView, {
                ref: 'pageDataView',
                rowKey: 'userId',
                fetch: this._fetch,
                searchCols: searchs,
                btns: [
                    {
                        label: '新增',
                        onClick: () => {
                            this.props.history.push('/admin/users/internal/add');
                        },
                        authority: '/admin/users/internal/add',
                    },
                ],
                cols: columns,
                pageData: userListPage,
            }),
            showQuit &&
                React.createElement(Quit, {
                    visible: showQuit,
                    title: '离职',
                    handleSubmit: (e) => {
                        return this.handSubmit(e, 'leaveOffice');
                    },
                    handleCancel: () => {
                        return this.toggleModal({ showQuit: false });
                    },
                    onCancel: () => {
                        return this.toggleModal({ showQuit: false });
                    },
                    footer: null,
                }),
            showBecomeOffice &&
                React.createElement(BecomeOffice, {
                    visible: showBecomeOffice,
                    title: '转正',
                    handleSubmit: (e) => {
                        return this.handSubmit(e, 'becomeOffice');
                    },
                    handleCancel: () => {
                        return this.toggleModal({ showBecomeOffice: false });
                    },
                    onCancel: () => {
                        return this.toggleModal({ showBecomeOffice: false });
                    },
                    footer: null,
                }),
            React.createElement(
                BIModal,
                {
                    visible: changeStatus,
                    onOk: () => {
                        return this.connectOk();
                    },
                    onCancel: () => {
                        return this.connectClose();
                    },
                    title: '\u6570\u636E\u4EA4\u63A5',
                    destroyOnClose: true,
                },
                React.createElement(
                    'div',
                    { className: selfStyle.modalLine },
                    React.createElement('span', null, React.createElement('i', null, '*'), '\u4EA4\u63A5\u4EBA\uFF1A'),
                    React.createElement(
                        AssociationSearch,
                        Object.assign(
                            {},
                            {
                                request: (val) => {
                                    return getInnerUserList({
                                        userChsName: val,
                                        pageSize: 50,
                                        pageNum: 1,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'userId', label: 'userChsName' },
                                allowClear: true,
                            },
                            {
                                value: connectObj,
                                className: selfStyle.modalLineContent,
                                placeholder: '\u8BF7\u9009\u62E9\u4EA4\u63A5\u4EBA',
                                getPopupContainer: (trigger) => {
                                    return trigger.parentNode;
                                },
                                labelInValue: true,
                                onChange: (values) => {
                                    if (values === undefined) {
                                        this.setState({
                                            connectObj: null,
                                        });
                                    } else {
                                        this.setState({
                                            connectObj: {
                                                value: values.value,
                                                label: values.label,
                                            },
                                        });
                                    }
                                },
                            },
                        ),
                    ),
                ),
            ),
        );
    }
};
List = tslib_1.__decorate(
    [
        connect(({ internal_user }) => {
            return {
                internal_user,
                showQuit: internal_user.showQuit,
                showBecomeOffice: internal_user.showBecomeOffice,
                userList: internal_user.userList,
                userListPage: internal_user.userListPage,
            };
        }),
    ],
    List,
);
export default List;
