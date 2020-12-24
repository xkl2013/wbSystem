// 列配置
export interface ColumnProps {
    columnType: string; // 组件类型
    columnChsName: string; // 列名
    columnName: string; // 列key
    width?: number; // 列宽度
    columnAttrObj?: any; // 组件属性
    sortFlag?: boolean; // 是否可排序
    sortConfig?: any; // 排序配置（当前已有排序及排序功能）
    columnIndex?: number; // 列下标
    showIndex?: boolean; // 是否前面添加序号
    questionText?: string; // 后面添加问号解释名称
    [propName: string]: any;
}
// 单元格基本数据格式
export interface CellDataProps {
    text: string; // 文本
    value: any; // 值
    extraData?: any; // 额外数据
    readonlyFlag?: boolean; // 单元格只读
}
// 行数据格式
export interface RowDataProps {
    colChsName: string; // 列名
    colName: string; // 列key
    cellValueList: CellDataProps[]; // 单元格数据
    dynamicCellConfigDTO?: any; // 单元格动态配置
    linkObjRowDateList?: any; // 关联数据
}
// 行记录格式
export interface RowProps {
    id: number; // 行id（唯一索引）
    rowData: RowDataProps[]; // 行数据
    [propName: string]: any;
}

export interface OperateConfigProps {
    menusGroup?: Object[]; // 菜单栏（隐藏、筛选、分组、排序四大功能）
    buttonsGroup?: Object[]; // 自定义按钮组
    moreGroup?: Object[]; // 按钮太多时可按更多分组
    renderCustomNode?: Function; // 自定义渲染节点
    showCondition?: boolean; // 是否展示筛选条件
}

export interface LoadConfigProps {
    onScroll?: Function; // 滚动加载功能
    distanceToLoad?: number; // 触发滚动距离
}

export interface TableProps extends LoadConfigProps {
    // 表格必须属性
    tableId: string | number; // 表格唯一id
    columns: ColumnProps[]; // 列配置
    dataSource: RowProps[]; // 数据源
    // 样式
    rowClassName?: string | Function; // 行class
    rowStyle?: Object | Function; // 行style
    bordered?: boolean; // 是否显示边框
    height?: number; // 表格高度
    width?: number; // 表格宽度
    rowHeight?: number; // 初始化行高
    headerHeight?: number; // 初始化表头高度
    columnWidth?: number; // 初始化单元格宽度
    rowRenderer?: Function; // 自定义渲染行（未实现）
    // 第一单元格功能
    showIndex?: boolean; // 是否显示序号
    showExpand?: any; // 是否显示展开详情图标
    rowSelection?: any; // 复选配置
    // 琐碎功能
    cellEditable?: boolean; // 单元格是否可编辑
    emitChangeCell?: Function; // 单元格修改回调
    sortConfig?: any; // 表头快捷排序（正倒序）
    groupConfig?: any; // 表头快捷分组
    paginationConfig?: any; // 分页配置（与onScroll互斥）
    noDataPlaceholder?: any; // 表格无数据时显示文案
    emptyPlaceholder?: string; // 单元格数据为空时默认显示
    contentMenu?: any; // 右键菜单
    loading?: boolean; // 是否加载中
    loadComp?: any; // 自定义加载动画组件
    canFixed?: boolean; // 是否可以拖拽自定义固定列
    canSorted?: boolean; // 是否可以拖拽自定义列排序
    canResized?: boolean; // 是否可以拖拽自定义列伸缩
    onDragSorted?: Function; // 拖拽更改列排序回调
    onDragFixed?: Function; // 拖拽更改列固定回调
    onDragResized?: Function; // 拖拽更改列伸缩回调
    onEmitMsg?: Function; // 是否支持消息协同
    cachedFeAttr?: boolean; // 是否启用前端缓存
    renderFirstLeft?: Function; // 第一个单元格特殊渲染
    leftMargin?: number; // 第一个表头左侧对齐距离
}
export interface TableState {
    columns: ColumnProps[];
    dataSource: RowProps[];
    groupConfig?: any[];
    tableHeight?: number;
    tableWidth?: number;
}
export interface CommonProps extends TableProps {
    operateConfig?: OperateConfigProps; // 操作栏
    tableOperateConfig?: OperateConfigProps; // 表格顶部操作栏
    locale?: any; // 语言
    className?: string; // 整体wrap样式
    tableClassName?: string; // 表格wrap样式
}

export interface CommonState extends TableState {}

export interface BaseComponentProps {
    value: CellDataProps[] | undefined;
    columnConfig: ColumnProps;
    formatter?: Function;
    onChange?: Function;
    onEmitChange?: Function;
}
export interface BaseComponentState {
    columnConfig: ColumnProps;
}
export interface CellProps {
    cellKey: string;
    rowIndex: number;
    columnIndex: number;
    columnConfig: ColumnProps;
    value: CellDataProps[];
    columnData: any;
    record: RowProps;
    columns: ColumnProps[];
    emitChangeCell?: Function;
    cellClassName?: string;
    cellStyle?: any;
    hasFixed?: boolean;
    paginationConfig?: any;
    showIndex?: boolean;
    showExpand?: any;
    emptyPlaceholder?: string;
    cellEditable?: boolean;
    rowSelection?: any;
    contentMenu?: any;
    selectedCell?: any;
    changeSelectedCell?: Function;
    position: string;
    onEmitMsg?: Function;
    tableId?: string | number;
    maxPopHeight?: string | number;
    renderFirstLeft?: Function;
}

export interface EditCellProps {
    columns: ColumnProps[];
    columnConfig: ColumnProps;
    rowData: RowDataProps[];
    value: CellDataProps[];
    tableId: number;
    cellData: CellDataProps[];
    rowId: number;
    component: any;
    onChange: Function;
    componentAttr?: any;
    columnObj?: any;
    record: RowProps;
}
export interface EditCellState {
    prevProps: EditCellProps;
    columnConfig: ColumnProps;
}
