import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { columnsFn } from './_selfColumn';
import BIModal from '@/ant_components/BIModal';
import TreeCom from './tree';
import styles from './index.less';
import AddForm from '../add';
import EditForm from '../edit';
import Detail from '../detail';
import PageDataView from '@/components/DataView';
import { batchTransfer, getDepartmentList, getDepartmentDetail } from '../services';
import BISpin from '@/ant_components/BISpin';

@connect(({ admin_org, loading }) => {
    return {
        userListPage: admin_org.userListPage,
        cachedData: admin_org.cachedData,
        addBtnLoading: loading.effects['admin_org/addDepartment'],
        editBtnLoading: loading.effects['admin_org/editDepartment'],
    };
})
class OrgList extends Component {
    userIds = [];

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showTarget: {},
            showDetail: false,
            showTransDepart: false,
            currentDepartmentId: null, // 当前部门
            transferDepartmentId: null, // 转移部门
            departmentsList: [],
            departmentDetail: {},
            treeLoading: false,
        };
    }

    componentDidMount() {
        const { cachedData } = this.props;
        if (cachedData) {
            this.initCache(cachedData);
            return;
        }
        this.init();
    }

    initCache = (data) => {
        const { departmentsList, departmentDetail, currentDepartmentId } = data;
        this.setState({
            departmentsList,
            currentDepartmentId,
            departmentDetail,
        });
        this.props.dispatch({
            type: 'admin_org/clearCache',
        });
    };

    init = async () => {
        const departmentsList = await this.getDepartmentsList();
        const departmentDetail = departmentsList.length > 0 ? departmentsList[0] : {};
        const currentDepartmentId = departmentDetail.departmentId;
        await this.setState({
            departmentsList,
            currentDepartmentId,
            departmentDetail,
        });
        this.fetch();
    };

    getDepartmentsList = async () => {
        await this.setState({ treeLoading: true });
        const response = await getDepartmentList({});
        await this.setState({ treeLoading: false });
        if (response && response.success && response.data) {
            return [response.data];
        }
        return [];
    };

    setStateDepartmentsList = async () => {
        const departmentsList = await this.getDepartmentsList();
        this.setState({
            departmentsList,
        });
    };

    getDepartmentDetail = async (id) => {
        const response = await getDepartmentDetail(id);
        if (response && response.success && response.data) {
            return response.data;
        }
        return {};
    };

    setStateDepartmentDetail = async (id) => {
        const departmentDetail = await this.getDepartmentDetail(id);
        this.setState({
            departmentDetail,
        });
    };

    // 左树弹框
    /**
     * @target  点击的操作
     * @department  点击的部门
     * */
    handleClickPopover = (target, department) => {
        switch (target.id) {
            case 1:
            case 2:
            case 3:
                this.showModalFn(target, department);
                break;
            case 4:
                this.showDetailFn(department);
                break;
            case 5:
                this.handleDel(department);
                break;
            default:
                break;
        }
    };

    showModalFn = async (target, department) => {
        const detail = await this.getDepartmentDetail(department.departmentId);
        detail.departmentPName = department.departmentPName;
        this.setState({
            show: true,
            showTarget: target,
            departmentDetail: detail,
        });
    };

    hideModal = () => {
        this.setState({
            show: false,
        });
    };

    showDetailFn = async (department) => {
        const detail = await this.getDepartmentDetail(department.departmentId);
        detail.departmentPName = department.departmentPName;
        this.setState({
            showDetail: true,
            departmentDetail: detail,
        });
    };

    hideDetail = () => {
        this.setState({
            showDetail: false,
        });
    };

    // 添加部门
    handleAdd = (values) => {
        const { departmentDetail } = this.state;
        delete values.departmentPName;
        values.departmentPid = departmentDetail.departmentId;
        const payload = {
            cb: () => {
                this.hideModal();
                this.setStateDepartmentsList();
            },
            data: values,
        };
        this.props.dispatch({
            type: 'admin_org/addDepartment',
            payload,
        });
    };

    // 编辑部门
    handleEdit = (values) => {
        const { departmentDetail, showTarget } = this.state;
        delete values.departmentPName;
        values.departmentPid = departmentDetail.departmentPid;
        const payload = {
            id: departmentDetail.departmentId,
            cb: () => {
                this.hideModal();
                this.setStateDepartmentsList();
                this.setStateDepartmentDetail(departmentDetail.departmentId);
            },
            data: values,
        };
        if (showTarget.id === 3) {
            this.props.dispatch({
                type: 'admin_org/editDepartment',
                payload,
            });
        } else if (showTarget.id === 2) {
            payload.data.departmentId = payload.id;
            this.props.dispatch({
                type: 'admin_org/setDepartmentHeader',
                payload,
            });
        }
    };

    // 删除部门
    handleDel = (record) => {
        const that = this;
        BIModal.confirm({
            title: '删除部门',
            content: `确定要删除名为${record.departmentName}的部门吗？`,
            autoFocusButton: null,
            onOk: () => {
                that.props.dispatch({
                    type: 'admin_org/delDepartment',
                    payload: {
                        id: record.departmentId,
                        cb: that.init,
                    },
                });
            },
        });
    };

    jump2Edit = (val) => {
        const { currentDepartmentId, departmentsList, departmentDetail } = this.state;
        this.props.dispatch({
            type: 'admin_org/saveCache',
            payload: { currentDepartmentId, departmentsList, departmentDetail },
        });
        this.props.history.push({
            pathname: '/admin/users/internal/edit',
            query: {
                id: val,
            },
        });
    };

    // 设置/取消boss
    setBossFn = (id, path) => {
        const payload = {
            id,
            cb: this.fetch,
        };
        this.props.dispatch({
            type: `admin_org/${path}`,
            payload,
        });
    };

    // 点击树菜单，获取对应的id
    selectedKey = (currentDepartmentId, departmentDetail) => {
        // 点击当前选中节点直接返回
        if (currentDepartmentId === this.state.currentDepartmentId) {
            return;
        }
        this.setState(
            {
                currentDepartmentId,
                departmentDetail,
            },
            this.fetch,
        );
    };

    fetch = () => {
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        const data = beforeFetch();
        const { currentDepartmentId } = this.state;
        data.userDepartmentId = currentDepartmentId;
        // 查询启用的用户
        // data.userStatus = 1;
        // 查询非离职的用户
        data.employeeStatusList = [1, 2, 3, 5, 6];
        this.props.dispatch({
            type: 'admin_org/getUserListPage',
            payload: data,
        });
    };

    openDepartModal = ({ data }) => {
        const { currentDepartmentId } = this.state;
        const userIds = [];
        if (Array.isArray(data)) {
            data.map((item) => {
                userIds.push(item.userId);
            });
        }
        this.setState({
            showTransDepart: true,
            transferDepartmentId: currentDepartmentId,
        });
        this.userIds = userIds;
    };

    transDepart = async () => {
        const { currentDepartmentId, transferDepartmentId } = this.state;
        if (!transferDepartmentId) {
            message.error('请选择要转移的部门');
            return;
        }
        if (Number(currentDepartmentId) === Number(transferDepartmentId)) {
            message.error('要转移的部门与当前部门相同，无需转移');
            return;
        }
        if (this.userIds.length === 0) {
            message.error('请选择要转移的人员');
            return;
        }
        const data = {
            deptId: Number(transferDepartmentId),
            userIds: this.userIds,
        };
        const response = await batchTransfer(data);
        if (response && response.success) {
            message.success('操作成功');
            this.closeDepartModal();
            this.setStateDepartmentsList();
            this.fetch();
        }
    };

    closeDepartModal = () => {
        this.setState({
            showTransDepart: false,
        });
    };

    render() {
        const {
            show,
            showTarget,
            showDetail,
            currentDepartmentId,
            showTransDepart,
            departmentsList,
            departmentDetail,
            treeLoading,
        } = this.state;
        const columns = columnsFn(this);
        const { userListPage, addBtnLoading, editBtnLoading } = this.props;
        return (
            <div className={styles.wrap}>
                <div className={styles.leftWrap}>
                    <BISpin spinning={treeLoading} style={{ width: '150px' }}>
                        {departmentsList.length > 0 && (
                            <TreeCom
                                dataSource={departmentsList}
                                changeSelectedKeys={(key, data) => {
                                    return this.selectedKey(key, data);
                                }}
                                handleClickPopover={this.handleClickPopover}
                                selectedKeys={currentDepartmentId ? [String(currentDepartmentId)] : []}
                            />
                        )}
                    </BISpin>
                </div>
                <div className={styles.rightWrap}>
                    {show
                        && (showTarget.id === 1 ? (
                            <AddForm
                                visible={show}
                                title={showTarget.name}
                                handleSubmit={this.handleAdd}
                                handleCancel={this.hideModal}
                                onCancel={this.hideModal}
                                footer={null}
                                formData={departmentDetail}
                                addBtnLoading={addBtnLoading}
                            />
                        ) : (
                            <EditForm
                                visible={show}
                                title={showTarget.name}
                                handleSubmit={this.handleEdit}
                                handleCancel={this.hideModal}
                                onCancel={this.hideModal}
                                footer={null}
                                formData={departmentDetail}
                                editType={showTarget.name}
                                editBtnLoading={editBtnLoading}
                            />
                        ))}
                    {showDetail && (
                        <Detail
                            visible={showDetail}
                            title="基本信息"
                            onCancel={this.hideDetail}
                            footer={null}
                            formData={departmentDetail}
                        />
                    )}
                    <PageDataView
                        ref={(dom) => {
                            this.pageDataView = dom;
                        }}
                        rowKey="userId"
                        fetch={this.fetchData}
                        cols={columns}
                        tips={
                            <div className={styles.bossCls}>
                                <span className={styles.bosstxt}>部门主管：</span>
                                {departmentDetail.departmentHeaderName || '未设置'}
                            </div>
                        }
                        btns={[
                            { label: '转移部门', onClick: this.openDepartModal, type: 'multiple', iconBtnSrc: 'none' },
                        ]}
                        pageData={userListPage}
                        isMultiple={true}
                    />
                    {showTransDepart && (
                        <BIModal
                            title="转移部门"
                            maskClosable={false}
                            className={styles.departModal}
                            visible={showTransDepart}
                            onOk={this.transDepart}
                            onCancel={this.closeDepartModal}
                            width={500}
                        >
                            <div className={styles.departModalWrap}>
                                <TreeCom
                                    selectedKeys={currentDepartmentId ? [String(currentDepartmentId)] : []}
                                    dataSource={departmentsList}
                                    blockNode={true}
                                    inModal={true}
                                    changeSelectedKeys={(val) => {
                                        this.setState({
                                            transferDepartmentId: val,
                                        });
                                    }}
                                />
                            </div>
                        </BIModal>
                    )}
                </div>
            </div>
        );
    }
}

export default OrgList;
