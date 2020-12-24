import React from 'react';
import BITable from '@/ant_components/BITable';
import { DetailItem } from '@/components/General/components/detail'
import { getApprovalHistoryList, getApprovalHistory } from '../../../services';


const defaultcolumnKey = [{
  title: '发起日期',
  dataIndex: 'instanceCreateTime',
  align: 'right',
  width:108,
  key: 'instanceCreateTime',
  render: (text) => {
    let newDate = text && text.slice(0, 10);
    return newDate
  }
}]
class ApprovalHistoryTable extends React.Component {
  state = {
    loading: false,
    approvalFormList: [],
    columns: [],

  };
  componentDidMount() {
    this.getList();

    this.getColumnKeys()
  }
  getList = async () => {
    const { flowId } = this.props;
    const response = await getApprovalHistoryList({ flowId, params: { pageNum: 1, pageSize: 10 } });
    if (response && response.success) {
      const { approvalFormList = [] } = response.data || {};
      this.setState({ approvalFormList: approvalFormList.map((ls, index) => ({ ...ls, index })) })
    }
  };
  getColumnKeys = async () => {
    const { flowId } = this.props;
    const result = await getApprovalHistory(flowId);
    if (result && result.success) {
      const data = result.data || {};
      const approvalFlowHistoryFieldList = Array.isArray(data.approvalFlowHistoryFieldList) ? data.approvalFlowHistoryFieldList : [];
      let columns = approvalFlowHistoryFieldList.map(ls => ({
        key: ls.fieldName,
        title: ls.fieldTitle,
      }));
      this.handleColumns(columns)
    }
  }
  handleColumns = (columns) => {
    columns = columns.map(item => ({
      ...item,
      render: (obj = {}) => {
        const approvalFormFields = obj.approvalFormFields || []
        const nodeObj = this.filterColumnKey(approvalFormFields, item.key);
        const Node = DetailItem(nodeObj);
        return Node

      }
    }));
    this.setState({ columns })
  }
  filterColumnKey = (data, key) => {
    return data.find(ls => ls.name === key) || {};
  }
  render() {
    const { approvalFormList } = this.state;
    const rowSelection = {
      type: 'radio',
      columnTitle: "",
      onSelect: (selectedRowKeys) => {
        this.props.submitDataFn(selectedRowKeys)

      },
    };
    const columnsConfig = [...this.state.columns, ...defaultcolumnKey];
    return (
      <BITable
        dataSource={approvalFormList}
        columns={columnsConfig}
        rowKey='index'
        bordered
        rowSelection={rowSelection}
        pagination={false}
      ></BITable>
    )
  }

}
export default ApprovalHistoryTable