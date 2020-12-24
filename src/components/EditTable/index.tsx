import React from 'react';
import { Table, message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import styles from './styles.less';
import { EditableFormRow, EditableCell } from './editTableFormRow';

interface Props {
    visible: boolean,
    title?: string,
    columns?: any,
    dataSource?: object[],
    width?: number,
    value?: any[],
    defaultColumnData: any,
    saveItem?: Function,
    fetchData?: Function,
    deleteItem?: Function,
    onChooseData?: Function,
    onHide?: Function,
}

class EditTable extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            buttonType: 'edit',
            customerId: null,
            custormItems: [],
            dataSource: [],
            chooseData: [],
            selectedRowKeys: this.props.value || [],
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({ selectedRowKeys: nextProps.value });
        }
    }

    rowSelection = () => ({
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(selectedRowKeys)
            this.setState({
                selectedRowKeys,
                chooseData: selectedRows,
            });
        },
        getCheckboxProps: (record: any) => ({
            disabled: !!record.componentId,
            name: record.name,
        }),
        selectedRowKeys: this.state.selectedRowKeys,
        // fixed: true,
    });
    fetchData = async (id: any) => {
        let { dataSource, chooseData, selectedRowKeys } = this.state;
        if (this.props.fetchData) {
            const response = await this.props.fetchData.call(null, id);
            if (response && response.success) {
                dataSource = Array.isArray(response.data) ? response.data : [];
                chooseData = dataSource.filter((item: any) => selectedRowKeys.find((ls: any) => item.id == ls));
            }
            this.setState({ dataSource, chooseData });
        }
    }
    public onShow = (val: any) => {
        this.fetchData(val);
        this.setState({
            customerId: val,
        })
    }
    public onHide = () => {
        this.props.onHide && this.props.onHide()
    }
    private handleEdit = () => {
        this.setState({
            buttonType: 'add'
        })
    }
    private onOk = () => {
        if (this.props.onChooseData) {

            if (this.state.selectedRowKeys.length === 0) {
                message.warn('请勾选关联该线索的联系人');
                return
            }
            const { defaultColumnData } = this.props;
            this.props.onChooseData(this.state.chooseData, String(defaultColumnData.customerTypeId));
        }
        this.onHide();
    }
    private handleAdd = () => {
        const { columns = [] } = this.props;
        const { custormItems } = this.state;
        const newItem: any = {};
        newItem['componentId'] = custormItems.length > 0 ? Math.max.apply(null, custormItems.map((item: any) => item.componentId)) + 1 : 1;
        columns.forEach((item: any) => {
            if (item.editable) {
                newItem[item.dataIndex] = undefined;
            }
        }
        );
        custormItems.push(newItem);
        this.setState({ custormItems })
    }
    private handleDelete = async (record: any) => {
        if (record.hasOwnProperty('componentId')) {
            const { custormItems } = this.state;
            const newData = custormItems.filter((item: any) => item.componentId !== record.componentId);
            this.setState({ custormItems: newData });
        } else if (this.props.deleteItem) {
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
    }
    private deleteValueItem = (id: any) => {
        const { chooseData, selectedRowKeys } = this.state;
        const newValue = chooseData.filter((item: any) => item.id !== id) || [];
        const newSelected = selectedRowKeys.filter((item: any) => item !== id) || [];
        this.setState({ chooseData: newValue, selectedRowKeys: newSelected });
        if (this.props.onChooseData) {
            const { defaultColumnData } = this.props;
            this.props.onChooseData(newValue, String(defaultColumnData.customerTypeId));
        }
    }

    private saveItem = async (values: any) => {
        if (this.props.saveItem) {
            const { componentId, ...others } = values;
            const result = await this.props.saveItem.call(null, { ...others, customerId: this.state.customerId });
            if (result && result.success) {
                message.success('创建成功');
                if (values.hasOwnProperty('componentId')) {
                    const newCustormItems = this.state.custormItems.filter((item: any) => item.componentId !== componentId);
                    this.setState({ custormItems: newCustormItems });
                }
                this.fetchData(this.state.customerId);
            }
        }

    }
    private renderTitle = (col: any) => {
        const { rules } = col;
        if (Array.isArray(rules) && rules.length && rules[0].required) {
            return (
                <span className={styles.tableCeilTitle}>{col.title}</span>
            )
        } else return col.title;
    }
    renderButtonCell = (col: any) => {
        if (col.type !== 'button') return {};
        return {
            onsave: this.saveItem,
            ondelete: this.handleDelete
        }

    }
    private formaterColumn = (data: any) => {
        const newColumndata = data.map((col: any) => {
            if (!col.editable && col.type !== 'button') {
                return col;
            }
            return {
                ...col,
                title: this.renderTitle(col),
                save: () => {
                },
                onCell: (record: any) => ({
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
        return [...newColumndata]
    }
    private formateDataSource = (data: any) => {
        return data.map((item: any, index: number) => {
            return {
                ...item,
                // ...this.props.defaultColumnData||{},
                key: item.id ? item.id : item.componentId ? `custorm${item['componentId']}` : `custorm${index}`,
            }
        })
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
        return (
            !visible ? null : <BIModal
                width={this.props.width || 520}
                bodyStyle={{ paddingTop: '10px' }}
                title={this.props.title}
                visible={visible}
                onCancel={this.onHide}
                onOk={this.onOk}
            >
                <div className={styles.tableCotainer}>
                    <div className={styles.buttonGroup}>
                        {buttonType === 'edit' ? <BIButton className={styles.button} icon="form" size='small'
                            onClick={this.handleEdit}>编辑</BIButton> : null}
                        {buttonType === 'add' ? <BIButton className={styles.button} icon="plus" size='small'
                            onClick={this.handleAdd}>新增</BIButton> : null}
                    </div>
                    <div className={styles.tableBox}>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={allData}
                            columns={this.formaterColumn(this.props.columns || [])}
                            rowSelection={this.rowSelection()}
                            pagination={false}
                        // scroll={{ x: '130%', y: 500 }}
                        />
                    </div>

                </div>
            </BIModal>
        )
    }
}

export default EditTable;
