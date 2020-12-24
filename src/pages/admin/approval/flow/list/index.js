import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import { columnsFn, columnsChildFn } from './_selfColumn';
import styles from './index.less';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import { str2intArr } from "@/utils/utils";
import Dialog from '../components/Dialog';
import EditAuth from '../components/editAuth';
import HistoryBox from '../components/historyApproval';
import { getFlowsList } from "../services";

const moreArr = [
  { id: '1', name: '移动分组' },
  { id: '2', name: '高级设置' },
  { id: '3', name: '上移' },
  { id: '4', name: '下移' },
  { id: '5', name: '禁用/启用' },
  { id: '6', name: '设置权限' },
  { id: '7', name: '历史记录' },
]

@connect(({ admin_approval_flow, loading }) => ({
  flowsListPage: admin_approval_flow.flowsListPage,
  showGroupModal: admin_approval_flow.showGroupModal,
  expandedRowKeys: admin_approval_flow.expandedRowKeys
}))
class Flow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      groupId: {},
      groupList: [],
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { pageDataView } = this.refs;
    if (pageDataView != null) {
      pageDataView.fetch();
    }
  }

  _fetch = (beforeFetch) => {
    let data = beforeFetch();
    if (data.companyName) {
      data.companyName = data.companyName.label;
    }
    if (data.companyTaxTypeList) {
      data.companyTaxTypeList = str2intArr(data.companyTaxTypeList);
    }
    this.props.dispatch({
      type: 'admin_approval_flow/getFlowsList',
      payload: data
    })
  }
  // 新增审批表单
  addFn = () => {
    this.props.history.push({
      pathname: './flow/add',
    });
  }
  // 编辑页面
  editData = (val) => {
    this.props.history.push({
      pathname: './flow/edit',
      query: {
        id: val
      }
    });
  }
  // 高级设置页面
  advancedSetting = (val) => {
    this.props.history.push({
      pathname: './flow/advancedSetting',
      query: {
        id: val.id,
      }
    });
  }
  // 设置审批流
  setFlow = (val) => {
    this.props.history.push({
      pathname: './flow/settingFlow',
      query: {
        id: val.id,
        type: val.type
      }
    });
  }
  // 上下移动
  moveFlow = (val, type) => {
    this.props.dispatch({
      type: 'admin_approval_flow/flowSort',
      payload: {
        id: val.id,
        groupId: val.groupId,
        type
      },
    });
  }
  // 修改启用禁用
  changeFlowStatus = (val) => {
    this.props.dispatch({
      type: 'admin_approval_flow/changeFlowStatus',
      payload: {
        id: val.id,
        status: val.status ? 0 : 1
      },
    });
  }
  toggleModal = (payload) => {
    this.props.dispatch({
      type: 'admin_approval_flow/toggleModal',
      payload,
    });
  };
  // 点击显示移动分组弹框
  showMoreModal = async (obj, isShowObj) => {
    let result = await getFlowsList({})
    if (result.success) {
      this.setState({
        id: obj.id,
        groupId: { groupId: obj.groupId },
        groupList: result.data.list
      });
      this.toggleModal(isShowObj);
    }
  };
  // 移动审批分组
  handSubmit = (record) => {
    const that = this;
    this.props.dispatch({
      type: 'admin_approval_flow/changeGroupList',
      payload: {
        id: this.state.id,
        data: record,
        cb: that.fetch
      }
    })
  }
  // 编辑审批流权限
  editFlowAuth = async (record) => {
    this.editAuth && this.editAuth.onShow(record.id)

  }
  // 设置历史查看
  editFlowHistory = (record) => {
    this.editHistory && this.editHistory.onShow(record.id)
  }
  checkoutEventtype = (obj, id) => {
    switch (Number(id)) {
      case 1:
        this.showMoreModal(obj, { showGroupModal: true });
        break;
      case 2:
        this.advancedSetting(obj);
        break;
      case 3:
        this.moveFlow(obj, 1);
        break;
      case 4:
        this.moveFlow(obj, 2);
        break;
      case 5:
        this.changeFlowStatus(obj);
        break;
      case 6:
        this.editFlowAuth(obj);
        break;
      case 7:
        this.editFlowHistory(obj);
        break;
      default:
        break;
    }
  };
  renderPropOver = (obj) => {
    return (React.createElement("div", { className: styles.modalCls }, moreArr.map((item) => {
      return React.createElement("p", { className: styles.operateItem, key: item.id, onClick: this.checkoutEventtype.bind(this, obj, item.id) }, item.id === '5' ? (obj.status ? '禁用' : '启用') : item.name);
    })));
  };

  //自定义展开icon
  customExpandIcon = props => {
    let text;
    if (props.expanded) {
      text = <img width="14px" height="7px" src={downRow} alt="" />;
    } else {
      text = <img width="7px" height="14px" src={rightRow} alt="" />;
    }
    return (
      <div onClick={e => props.onExpand(props.record, e)} style={{ cursor: 'pointer' }}>
        {text}
      </div>
    );
  };
  render() {
    const { showGroupModal, flowsListPage, expandedRowKeys } = this.props
    const { groupList } = this.state;
    const columns = columnsFn(this);
    return (
      <div className={styles.wrap}>
        <PageDataView
          ref="pageDataView"
          rowKey="id"
          hideForm={true}
          // btns={[
          //   {label: '新增审批表单', onClick: this.addFn, authority: '/admin/orgStructure/company/add'}
          // ]}
          fetch={this._fetch}
          cols={columns}
          pageData={flowsListPage}
          expandIcon={this.customExpandIcon}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={e => this.toggleModal({ expandedRowKeys: e })}
          expandedRowRender={e => columnsChildFn(e, this)}
        />
        <Dialog
          visible={showGroupModal}
          title='移动审批分组'
          handleSubmit={this.handSubmit}
          handleCancel={() => this.toggleModal({ showGroupModal: false })}
          onCancel={() => this.toggleModal({ showGroupModal: false })}
          footer={null}
          groupId={this.state.groupId}
          GROUP_TYPE={groupList}
        />
        {/* 设置审批流权限 */}
        <EditAuth ref={dom => this.editAuth = dom} />
        {/* 设置历史审理字段显示 */}
        <HistoryBox ref={dom => this.editHistory = dom} />
      </div>
    )
  }
}

export default Flow;
