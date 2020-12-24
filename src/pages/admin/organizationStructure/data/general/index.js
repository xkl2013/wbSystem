/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BIButton from '@/ant_components/BIButton';
import DataTree from './tree';
import DataTreeDetail from './detail';
import { getDataTreeDetail } from '../services';
import { getDictionariesList } from '@/services/globalSearchApi';

import styles from './index.less';

@connect(({ admin_data, loading }) => {
    return {
        dataTree: admin_data.dataTree,
        dataTreeDetail: admin_data.dataTreeDetail,
        admin_data,
        loading: loading.effects[('admin_data/getDataTree', 'admin_data/getDataTreeDetail')],
    };
})
class dataGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailShow: false,
            editBtnStatus: false,
            pushBtnStatus: false,
            dataTypeP: null,
            shareScopeP: null,
            userRoleP: [],
            childIDs: [],
            initialUserRole: [],
            userRoleEnum: [],
        };
    }

    componentWillMount() {
        this.props.dispatch({
            type: 'admin_data/getDataTree',
            payload: {
                cb: () => {},
            },
        });
    }

    componentDidMount() {
        this.getUserRoleEnum();
    }

    componentWillReceiveProps(props, nextProps) {
        if (props.dataTreeDetail !== nextProps.dataTreeDetail) {
            this.setState({
                dataTreeDetail: props.dataTreeDetail,
                initialUserRole: props.dataTreeDetail.dataModuleUserList || [],
            });
        }
    }

    // 获取选中权限ID
    treeSelect = async (treeModuleId) => {
        const { authorityDetail } = this.refs;
        if (authorityDetail) {
            authorityDetail.editChange(false);
            this.setState({
                pushBtnStatus: false,
                editBtnStatus: true,
            });
        }

        const { dataTree } = this.props;
        const chooseIDs = this.getParentsIds(treeModuleId, dataTree);
        const childIDs = this.getChildIds(treeModuleId, dataTree);
        this.setState({
            chooseIDs,
            childIDs,
            dataTypeP: null,
            shareScopeP: null,
            userRoleP: [],
        });
        this.props.dispatch({
            type: 'admin_data/getDataTreeDetail',
            payload: {
                id: treeModuleId,
            },
        });
        if (chooseIDs.length > 0) {
            const res = await getDataTreeDetail(chooseIDs[chooseIDs.length - 1]);
            if (res && res.success) {
                const detailParent = res.data;
                const dataTypeP = detailParent.moduleDataType;
                const shareScopeP = detailParent.moduleDataTypeScope;
                const userRoleP =
                    Array.isArray(detailParent.dataModuleUserList) && detailParent.dataModuleUserList.length > 0
                        ? detailParent.dataModuleUserList.map((item) => {
                              return `${item.dataUserType}`;
                          })
                        : [];
                this.setState({
                    detailShow: true,
                    editBtnStatus: true,
                    pushBtnStatus: false,
                    dataTypeP,
                    shareScopeP,
                    userRoleP,
                });
            }
        } else {
            this.setState({
                detailShow: true,
                editBtnStatus: true,
                pushBtnStatus: false,
            });
        }
    };

    // 根据ID 获取直系父ID集合
    getParentsIds = (currentId, treeData) => {
        const arr = [];
        function getParentsIdsFunc(data) {
            for (let i = 0; i < data.length; i += 1) {
                const temp = data[i];
                if (temp.moduleId === currentId) {
                    // arr.push(temp.moduleId);
                    return 1;
                }
                if (temp && temp.children && temp.children.length > 0) {
                    const t = getParentsIdsFunc(temp.children);
                    if (t === 1) {
                        arr.push(temp.moduleId);
                        return 1;
                    }
                }
            }
        }
        getParentsIdsFunc(treeData);
        return arr;
    };

    // 根据ID 获取直系子ID集合
    getChildIds = (currentId, treeData) => {
        const arr = [];
        function getChildIdsFunc(data) {
            data.map((item) => {
                if (item.moduleId === currentId || arr.includes(item.moduleId)) {
                    if (item.children && item.children.length > 0) {
                        item.children.map((i) => {
                            arr.push(i.moduleId);
                        });
                    }
                }
                if (item.children && item.children.length > 0) {
                    getChildIdsFunc(item.children);
                }
            });
        }
        getChildIdsFunc(treeData);
        return arr;
    };

    // 编辑权限
    changeAuthority = () => {
        const { authorityDetail } = this.refs;
        authorityDetail.editChange(true);
        this.setState({
            detailShow: true,
            pushBtnStatus: true,
            editBtnStatus: false,
        });
    };

    // 取消编辑
    closeEdit = () => {
        const { dataTreeDetail } = this.state;
        this.treeSelect(dataTreeDetail.moduleId);
    };

    // 更新权限
    pushAuthority = () => {
        const { dataTreeDetail, childIDs } = this.state;
        childIDs.unshift(dataTreeDetail.moduleId);
        const result = [];
        if (childIDs.length > 0) {
            childIDs.map((item) => {
                result.push(
                    Object.assign(
                        {},
                        {
                            moduleDataType: dataTreeDetail.moduleDataType,
                            moduleDataTypeScope:
                                Number(dataTreeDetail.moduleDataType) === 1 ||
                                Number(dataTreeDetail.moduleDataType) === 3
                                    ? 0
                                    : dataTreeDetail.moduleDataTypeScope,
                            dataModuleUserList:
                                Array.isArray(dataTreeDetail.dataModuleUserList) &&
                                dataTreeDetail.dataModuleUserList.length > 0
                                    ? dataTreeDetail.dataModuleUserList.map((cItem) => {
                                          return {
                                              dataModuleId: item,
                                              dataUserType: cItem.dataUserType,
                                              dataUserId:
                                                  Object.prototype.toString.call(cItem.dataUserId) ===
                                                  '[object Undefined]'
                                                      ? null
                                                      : Number(cItem.dataUserId.dataUserId),
                                          };
                                      })
                                    : null,
                        },
                        {
                            moduleId: item,
                        },
                    ),
                );
            });
        }

        if (result[0].moduleDataType === 2) {
            if (result[0].moduleDataTypeScope === 0) {
                message.warning('请选择共享范围！');
                return;
            }
            if (result[0].dataModuleUserList === null) {
                message.warning('请选择角色人！');
                return;
            }
        } else if (result[0].moduleDataType === 3) {
            if (result[0].dataModuleUserList === null) {
                message.warning('请选择角色人！');
                return;
            }
        }
        this.props.dispatch({
            type: 'admin_data/pushDataTreeDetail',
            payload: {
                data: { dataModuleList: result },
                cb: this.closeEdit,
            },
        });
    };

    // 更新数据
    refreshData = (value, type) => {
        let result = {};
        switch (type) {
            case 'dataType':
                if (value === 1) {
                    result = Object.assign(
                        {},
                        {
                            moduleDataType: value,
                            moduleDataTypeScope: null,
                            dataModuleUserList: null,
                        },
                    );
                } else if (value === 2) {
                    result = Object.assign(
                        {},
                        { moduleDataType: value, moduleDataTypeScope: 0, dataModuleUserList: [] },
                    );
                } else {
                    result = Object.assign(
                        {},
                        {
                            moduleDataType: value,
                            moduleDataTypeScope: null,
                            dataModuleUserList: [],
                        },
                    );
                }
                break;
            case 'shareScope':
                result = Object.assign({}, { moduleDataTypeScope: value });
                break;
            case 'userRole':
                result = Object.assign({}, { dataModuleUserList: this.formUserRole(value) });
                break;
            default:
                break;
        }
        const dataTreeDetail = Object.assign(this.state.dataTreeDetail, result);
        this.setState({
            dataTreeDetail,
        });
    };

    // 格式化角色人数据
    formUserRole = (data) => {
        const initialData = this.state.initialUserRole;
        return data.map((item) => {
            return {
                dataModuleId: this.state.dataTreeDetail.moduleId,
                dataUserType: item,
                dataUserId: initialData.find((cItem) => {
                    return String(cItem.dataUserType) === String(item);
                }),
            };
        });
    };

    getUserRoleEnum = async () => {
        const res = await getDictionariesList({ parentId: 458 });
        if (res.success) {
            const userRoleEnum = res.data.list.map((item) => {
                return {
                    label: item.value,
                    value: String(item.index),
                };
            });
            this.setState({
                userRoleEnum,
            });
        } else {
            message.error(res.message);
        }
    };

    render() {
        const dataTree = this.props.dataTree || [];
        const { dataTreeDetail, dataTypeP } = this.state;
        const { detailShow, editBtnStatus, pushBtnStatus, shareScopeP, userRoleP, userRoleEnum } = this.state;
        return (
            <div className={styles.dataBox}>
                <div className={styles.dataTree}>
                    <div className={styles.treeTitle}>模块列表</div>
                    <DataTree dataSource={dataTree} treeSelect={this.treeSelect} />
                </div>
                <div className={styles.dataDetail}>
                    {detailShow ? (
                        <>
                            <div className={styles.treeTitle}>
                                数据权限
                                {editBtnStatus ? (
                                    <BIButton
                                        type="primary"
                                        className={styles.headerBtn}
                                        onClick={this.changeAuthority}
                                    >
                                        {' '}
                                        编辑
                                    </BIButton>
                                ) : null}
                            </div>
                            <DataTreeDetail
                                ref="authorityDetail"
                                dataSource={dataTreeDetail}
                                refreshData={this.refreshData}
                                dataTypeP={dataTypeP}
                                shareScopeP={shareScopeP}
                                userRoleP={userRoleP}
                                userRoleEnum={userRoleEnum}
                            />
                            {pushBtnStatus ? (
                                <div className={styles.pushBtn}>
                                    <BIButton type="default" className={styles.detailBtn} onClick={this.closeEdit}>
                                        {' '}
                                        取消
                                    </BIButton>
                                    <BIButton type="primary" className={styles.detailBtn} onClick={this.pushAuthority}>
                                        {' '}
                                        提交
                                    </BIButton>
                                </div>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default dataGeneral;
