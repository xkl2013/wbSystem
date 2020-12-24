import React from 'react';
import { Table, message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import styles from './styles.less';
import { EditableFormRow, EditableCell } from './editTableFormRow';
class EditTable extends React.Component {
    constructor(props) {
        super(props);
        this.rowSelection = () => ({
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys);
                this.setState({
                    selectedRowKeys,
                    chooseData: selectedRows,
                });
            },
            getCheckboxProps: (record) => ({
                disabled: !!record.componentId,
                name: record.name,
            }),
            selectedRowKeys: this.state.selectedRowKeys,
        });
        this.fetchData = async (id) => {
            let { dataSource, chooseData, selectedRowKeys } = this.state;
            if (this.props.fetchData) {
                const response = await this.props.fetchData.call(null, id);
                if (response && response.success) {
                    dataSource = Array.isArray(response.data) ? response.data : [];
                    chooseData = dataSource.filter((item) => selectedRowKeys.find((ls) => item.id == ls));
                }
                this.setState({ dataSource, chooseData });
            }
        };
        this.onShow = (val) => {
            this.fetchData(val);
            this.setState({
                customerId: val,
            });
        };
        this.onHide = () => {
            this.props.onHide && this.props.onHide();
        };
        this.handleEdit = () => {
            this.setState({
                buttonType: 'add'
            });
        };
        this.onOk = () => {
            if (this.props.onChooseData) {
                if (this.state.selectedRowKeys.length === 0) {
                    message.warn('请勾选关联该线索的联系人');
                    return;
                }
                const { defaultColumnData } = this.props;
                this.props.onChooseData(this.state.chooseData, String(defaultColumnData.customerTypeId));
            }
            this.onHide();
        };
        this.handleAdd = () => {
            const { columns = [] } = this.props;
            const { custormItems } = this.state;
            const newItem = {};
            newItem['componentId'] = custormItems.length > 0 ? Math.max.apply(null, custormItems.map((item) => item.componentId)) + 1 : 1;
            columns.forEach((item) => {
                if (item.editable) {
                    newItem[item.dataIndex] = undefined;
                }
            });
            custormItems.push(newItem);
            this.setState({ custormItems });
        };
        this.handleDelete = async (record) => {
            if (record.hasOwnProperty('componentId')) {
                const { custormItems } = this.state;
                const newData = custormItems.filter((item) => item.componentId !== record.componentId);
                this.setState({ custormItems: newData });
            }
            else if (this.props.deleteItem) {
                const response = await this.props.deleteItem.call(null, {
                    customerId: record.customerId,
                    contactId: record.id
                });
                if (response && response.success) {
                    message.success('已删除');
                    this.deleteValueItem(record.id);
                    this.fetchData(this.state.customerId);
                }
            }
        };
        this.deleteValueItem = (id) => {
            const { chooseData, selectedRowKeys } = this.state;
            const newValue = chooseData.filter((item) => item.id !== id) || [];
            const newSelected = selectedRowKeys.filter((item) => item !== id) || [];
            this.setState({ chooseData: newValue, selectedRowKeys: newSelected });
            if (this.props.onChooseData) {
                const { defaultColumnData } = this.props;
                this.props.onChooseData(newValue, String(defaultColumnData.customerTypeId));
            }
        };
        this.saveItem = async (values) => {
            if (this.props.saveItem) {
                const { componentId, ...others } = values;
                const result = await this.props.saveItem.call(null, { ...others, customerId: this.state.customerId });
                if (result && result.success) {
                    message.success('创建成功');
                    if (values.hasOwnProperty('componentId')) {
                        const newCustormItems = this.state.custormItems.filter((item) => item.componentId !== componentId);
                        this.setState({ custormItems: newCustormItems });
                    }
                    this.fetchData(this.state.customerId);
                }
            }
        };
        this.renderTitle = (col) => {
            const { rules } = col;
            if (Array.isArray(rules) && rules.length && rules[0].required) {
                return (React.createElement("span", { className: styles.tableCeilTitle }, col.title));
            }
            else
                return col.title;
        };
        this.renderButtonCell = (col) => {
            if (col.type !== 'button')
                return {};
            return {
                onsave: this.saveItem,
                ondelete: this.handleDelete
            };
        };
        this.formaterColumn = (data) => {
            const newColumndata = data.map((col) => {
                if (!col.editable && col.type !== 'button') {
                    return col;
                }
                return {
                    ...col,
                    title: this.renderTitle(col),
                    save: () => {
                    },
                    onCell: (record) => ({
                        edittype: this.state.buttonType,
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        type: col.type,
                        options: col.options || [],
                        buttongroup: col.buttonGroup || [],
                        rules: col.rules,
                        componentattr: col.componentAttr || {},
                        buttoncallback: this.renderButtonCell(col) || {},
                    }),
                };
            });
            return [...newColumndata];
        };
        this.formateDataSource = (data) => {
            return data.map((item, index) => {
                return {
                    ...item,
                    // ...this.props.defaultColumnData||{},
                    key: item.id ? item.id : item.componentId ? `custorm${item['componentId']}` : `custorm${index}`,
                };
            });
        };
        this.state = {
            visible: false,
            buttonType: 'edit',
            customerId: null,
            custormItems: [],
            dataSource: [],
            chooseData: [],
            selectedRowKeys: this.props.value || [],
        };
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({ selectedRowKeys: nextProps.value });
        }
    }
    render() {
        const { buttonType, custormItems, dataSource } = this.state;
        const { visible } = this.props;
        const allData = this.formateDataSource([...dataSource, ...custormItems] || []);
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        return (!visible ? null : React.createElement(BIModal, { width: this.props.width || 520, bodyStyle: { paddingTop: '10px' }, title: this.props.title, visible: visible, onCancel: this.onHide, onOk: this.onOk },
            React.createElement("div", { className: styles.tableCotainer },
                React.createElement("div", { className: styles.buttonGroup },
                    buttonType === 'edit' ? React.createElement(BIButton, { className: styles.button, icon: "form", size: 'small', onClick: this.handleEdit }, "\u7F16\u8F91") : null,
                    buttonType === 'add' ? React.createElement(BIButton, { className: styles.button, icon: "plus", size: 'small', onClick: this.handleAdd }, "\u65B0\u589E") : null),
                React.createElement("div", { className: styles.tableBox },
                    React.createElement(Table, { components: components, rowClassName: () => 'editable-row', bordered: true, dataSource: allData, columns: this.formaterColumn(this.props.columns || []), rowSelection: this.rowSelection(), pagination: false })))));
    }
}
export default EditTable;
