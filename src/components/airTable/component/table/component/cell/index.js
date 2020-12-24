import React from 'react';
import { message, Popover } from 'antd';
import _ from 'lodash';
// eslint-disable-next-line import/no-cycle
import { config } from '@/components/airTable/config';
import FormHelper from '@/utils/formHelper';
import BIModal from '@/ant_components/BIModal';
import insertMenu from '@/assets/airTable/insertMenu.png';
import copyMenu from '@/assets/airTable/copyMenu.png';
import extendMenu from '@/assets/airTable/extendMenu.png';
import delMenu from '@/assets/airTable/delMenu.png';
import style from './index.less';

class CellInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemConfig: {},
        };
    }

    componentDidMount() {
        const { columnObj, record } = this.props;
        this.formHelp(columnObj, record);
    }

    componentWillReceiveProps(nextProps) {
        const { columnObj, record } = nextProps;
        this.formHelp(columnObj, record);
    }

    formHelp = async (item, record) => {
        const list = this.formatData(record.rowData);
        const { noEdit } = this.props; // 是否锁表
        const customCheckLocked = (cellData) => {
            // 临时用于是否可编辑cell的处理,在KOL刊例审核中时不能编辑
            return cellData.approvalStatus === 1 || cellData.approvalStatus === 5;
        };
        const itemsConfig = await FormHelper.getFormData({
            list,
            rowLocked: noEdit || record.isLocked || customCheckLocked(record),
        });
        const itemConfig = itemsConfig.find((temp) => {
            return temp.columnName === item.columnName;
        });
        if (itemConfig) {
            this.setState({
                itemConfig,
            });
        }
    };

    formatData = (rowData) => {
        const { columns } = this.props;
        const temp = [];
        columns.forEach((item) => {
            const value = rowData.find((itemData) => {
                return itemData.colName === item.key;
            });
            temp.push({
                ...item,
                value: (value && value.cellValueList) || [{ text: '', value: '' }],
                type: item.columnType,
                dynamicCellConfigDTO: value && value.dynamicCellConfigDTO,
            });
        });
        return temp;
    };

    handleChange = (newValue, originValue, emitFlag) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange(newValue, originValue, emitFlag);
        }
    };

    render() {
        const { itemConfig } = this.state;
        const {
            component, value, tableId, cellData, rowId, columnConfigCallback,
        } = this.props;
        const Component = component;
        return (
            <Component
                value={value}
                changeParams={this.handleChange}
                columnConfig={itemConfig}
                columnConfigCallback={columnConfigCallback}
                autoFocus={true}
                style={{ width: '100%' }}
                tableId={tableId}
                cellData={cellData}
                rowId={rowId}
            />
        );
    }
}

/**
 * 表格单元格（cell）
 * 1）表头 columns
 * 2）单元格内容 value
 */
export default class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditVisible: false,
            isMenuVisible: false,
            inputValue: [],
            originValue: [],
        };
    }

    componentDidMount() {
        const { cellValueList } = this.props;
        this.setState({
            inputValue: cellValueList,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { cellValueList } = this.props;
        if (JSON.stringify(cellValueList) !== JSON.stringify(nextProps.cellValueList)) {
            this.setState({
                inputValue: nextProps.cellValueList,
            });
        }
    }

    handleVisibleChange = (visible) => {
        if (!visible) {
            this.emitChange();
        }
        this.setState({ isEditVisible: visible, isMenuVisible: false });
    };

    menuVisibleChange = (visible) => {
        this.setState({ isMenuVisible: visible, isEditVisible: false });
    };

    handleChange = (newValue, originValue, emitFlag) => {
        this.setState(
            {
                inputValue: newValue,
                originValue,
            },
            () => {
                if (emitFlag) {
                    this.emitChange();
                }
            },
        );
    };

    emitChange = () => {
        const { inputValue } = this.state;
        const { cellValueList } = this.props;
        if (_.isEqual(inputValue, cellValueList)) {
            return;
        }
        // 后端添加了额外字段，导致格式化数据与原数据不一致，此处比较做特殊处理
        const temp = _.cloneDeep(cellValueList);
        temp.map((item) => {
            delete item.extraData;
            return item;
        });
        if (_.isEqual(inputValue, temp)) {
            return;
        }
        this.changeValue();
    };

    changeValue = () => {
        const { inputValue, originValue } = this.state;
        const {
            updateData,
            record,
            columnObj,
            columnObj: { key, requiredFlag },
        } = this.props;
        // 校验必填项
        if (requiredFlag) {
            const recordData = record.rowData.find((item) => {
                return item.colName === key;
            }).cellValueList;
            if (!inputValue || inputValue.length === 0) {
                message.error('该字段为必填项');
                this.setState({
                    inputValue: recordData,
                    originValue: [],
                });
                return;
            }
            if (inputValue.length === 1) {
                const data = inputValue[0];
                if (!data.value && !data.text) {
                    message.error('该字段为必填项');
                    this.setState({
                        inputValue: recordData,
                        originValue: [],
                    });
                    return;
                }
            }
        }
        const extraData = FormHelper.changeTableData({
            item: columnObj,
            changedKey: key,
            changedValue: inputValue,
            originValue,
        });
        extraData.push({
            columnCode: key,
            cellValueList: inputValue,
        });
        if (typeof updateData === 'function') {
            updateData({
                rowId: record.id,
                value: extraData,
            });
        }
        this.setState({
            // inputValue: [],
            originValue: [],
        });
    };

    copy = (record) => {
        const { showForm } = this.props;
        if (typeof showForm === 'function') {
            showForm({ rowData: record.rowData });
        }
    };

    delData = (record) => {
        const { delData, getData, hasGroup, tableId } = this.props;
        // 拆分情况需检查数据是否原始数据
        if (hasGroup) {
            if (record.id === record.groupId) {
                BIModal.warning({ title: '删除', content: '不能删除原始拆分数据' });
                return;
            }
        }
        BIModal.confirm({
            title: '确认要删除该条数据吗？',
            autoFocusButton: null,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const response = await delData({ tableId, data: { id: record.id } });
                if (response && response.success) {
                    message.success('删除成功');
                    if (typeof getData === 'function') {
                        getData({ isClean: true });
                    }
                }
            },
        });
    };

    clickExtraMenu = (menu, record) => {
        if (menu.check && typeof menu.check === 'function') {
            menu.check({ data: [record] }, this.menuClickFunc.bind(this, menu, record));
        } else {
            this.menuClickFunc(menu, record);
        }
    };

    menuClickFunc = async (menu, record) => {
        const { flush } = this.props;
        if (typeof menu.onClick === 'function') {
            await menu.onClick({ data: [record], flush });
        }
        if (!menu.noNeedFlush) {
            if (typeof flush === 'function') {
                flush();
            }
        }
    };

    renderNode = ({ type, cellData, rowData, columnConfig }) => {
        const nodeObj = config[String(type) || '1'];
        const { cellRender } = this.props;
        if (cellRender && typeof cellRender === 'function') {
            const obj = cellRender({
                cellData,
                rowData,
                columnConfig,
            });
            if (obj && obj.component) {
                obj.component.Detail = obj.component.Detail || nodeObj.component.Detail;
                return obj.component;
            }
        }
        return nodeObj.component;
    };

    renderCellContent = () => {
        const {
            columnObj,
            record,
            columns,
            showForm,
            extraMenu,
            noAdd,
            noEdit,
            noDel,
            noCopy,
            hasGroup,
            cellValueList,
            tableId,
            columnConfigCallback,
        } = this.props;
        const { isEditVisible, isMenuVisible, inputValue } = this.state;
        const { readOnlyFlag, type } = columnObj || {};
        let { columnAttrObj } = columnObj || {};
        columnAttrObj = columnAttrObj || {};
        columnAttrObj.disabled = readOnlyFlag || noEdit || false;
        const component = this.renderNode({
            cellData: cellValueList,
            rowData: record.rowData || [],
            columnConfig: columnObj,
            type,
        });
        const showDel = !noDel && !record.isLocked && (!hasGroup || (hasGroup && record.id !== record.groupId));
        return (
            <Popover
                overlayClassName={style.editPop}
                trigger="click"
                visible={isEditVisible}
                onVisibleChange={this.handleVisibleChange}
                content={
                    <CellInput
                        value={inputValue}
                        onChange={this.handleChange}
                        component={component}
                        componentAttr={columnAttrObj}
                        columnConfigCallback={columnConfigCallback}
                        columns={columns}
                        columnObj={columnObj}
                        record={record}
                        tableId={tableId}
                        rowId={record.id}
                        cellData={cellValueList}
                        noEdit={noEdit}
                    />
                }
            >
                <Popover
                    overlayClassName={style.menuPop}
                    trigger="contextMenu"
                    visible={isMenuVisible}
                    onVisibleChange={this.menuVisibleChange}
                    placement="rightTop"
                    content={
                        <div
                            role="presentation"
                            className={style.menuContainer}
                            onClick={this.menuVisibleChange.bind(this, false)}
                        >
                            {!noAdd && (
                                <div role="presentation" className={style.menu} onClick={showForm}>
                                    <img alt="插入" className={style.menuIcon} src={insertMenu} />
                                    <span className={style.menuTitle}>插入</span>
                                </div>
                            )}
                            {!noAdd && !noCopy && (
                                <div role="presentation" className={style.menu} onClick={this.copy.bind(this, record)}>
                                    <img alt="复制" className={style.menuIcon} src={copyMenu} />
                                    <span className={style.menuTitle}>复制</span>
                                </div>
                            )}
                            <div
                                role="presentation"
                                className={style.menu}
                                onClick={showForm.bind(this, { rowId: record.id })}
                            >
                                <img alt="展开" className={style.menuIcon} src={extendMenu} />
                                <span className={style.menuTitle}>展开</span>
                            </div>
                            {showDel && (
                                <div
                                    role="presentation"
                                    className={style.menu}
                                    onClick={this.delData.bind(this, record)}
                                >
                                    <img alt="删除" className={style.menuIcon} src={delMenu} />
                                    <span className={style.menuTitle}>删除</span>
                                </div>
                            )}
                            {extraMenu && extraMenu.length > 0 && (
                                <>
                                    <div className={style.splitLine} />
                                    {extraMenu.map((item, i) => {
                                        if (typeof item.hidden === 'function' && item.hidden({ record, menu: item })) {
                                            return;
                                        }
                                        return (
                                            <div
                                                key={i}
                                                role="presentation"
                                                className={style.menu}
                                                onClick={this.clickExtraMenu.bind(this, item, record)}
                                            >
                                                {item.icon
                                                    && (typeof item.icon === 'string' ? (
                                                        <img className={style.menuIcon} src={item.icon} alt="" />
                                                    ) : (
                                                        <span className={style.menuIcon}>{item.icon}</span>
                                                    ))}
                                                <span className={style.menuTitle}>{item.label}</span>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    }
                >
                    <div className={style.cellContent}>
                        <component.Detail value={cellValueList} columnConfig={columnObj} tableId={tableId} />
                    </div>
                </Popover>
            </Popover>
        );
    };

    render() {
        const { columnObj, overlayClassName } = this.props;
        const { width } = columnObj || {};
        return (
            <div className={overlayClassName ? `${style.cell} ${overlayClassName}` : style.cell} style={{ width }}>
                {this.renderCellContent()}
            </div>
        );
    }
}
