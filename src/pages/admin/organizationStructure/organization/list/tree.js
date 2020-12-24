import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { Tree, Popover, Icon } from 'antd';
import moreIcon from '@/assets/moreIcon.png';
import styles from './index.less';
import { checkPathname } from '@/components/AuthButton';
import BISearch from '@/ant_components/BISearch';

const { TreeNode } = Tree;

const domList = [
    { id: 1, name: '添加子部门', path: '/admin/orgStructure/organization/add' },
    { id: 2, name: '设置部门主管', path: '/admin/orgStructure/organization/setHeader' },
    { id: 3, name: '编辑部门', path: '/admin/orgStructure/organization/edit' },
    { id: 4, name: '查看部门', path: '/admin/orgStructure/organization/detail' },
    { id: 5, name: '删除', path: '/admin/orgStructure/organization/delete' },
];
// 将部门数据转化为一维数组，方便搜索时过滤
const reduceDimension = (dataSource) => {
    let list = [];
    if (Array.isArray(dataSource)) {
        dataSource.map((item) => {
            list.push(item);
            if (item.subDepartmentList) {
                list = list.concat(reduceDimension(item.subDepartmentList));
            }
        });
    }
    return list;
};
// 获取部门数据的第一级
const initExpandedKeys = (dataSource) => {
    const expandedKeys = [];
    dataSource.forEach((item) => {
        expandedKeys.push(String(item.departmentId));
    });
    return expandedKeys;
};
export default class TreeComponent extends Component {
    getDataList = memoizeOne(reduceDimension);

    getDefaultExpandedKeys = memoizeOne(initExpandedKeys);

    debounceSearch = _.debounce((val) => {
        return this.search(val);
    }, 400);

    state = {
        visible: false, // 控制popover显隐
        id: '', // 控制哪个部门的popover显隐
        expandedKeys: [], // 展开的key
        selectedKeys: [], // 选中的key
        searchValue: '', // 搜索内容
        autoExpandParent: false, // 是否自动展开父级（用于搜索展示）
    };

    componentDidMount() {
        // 初始化默认展开一级
        this.initExpandedKeys();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { dataSource } = this.props;
        if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
            return true;
        }
        // props中只有dataSource改变时才更新
        return JSON.stringify(dataSource) !== JSON.stringify(nextProps.dataSource);
    }

    addNodes = (id) => {
        this.setState({
            id,
        });
    };

    hideNodes = () => {
        this.setState({
            id: '',
        });
    };

    changeVisible = (visible) => {
        this.setState({
            visible,
        });
    };

    handleClick = (item, department) => {
        const { handleClickPopover } = this.props;
        if (typeof handleClickPopover === 'function') {
            handleClickPopover(item, department);
            this.hideNodes();
        }
    };

    renderTreeNodes = (dataSource, parent) => {
        return dataSource.map((item) => {
            if (parent) {
                item.departmentPName = parent.departmentName;
            }
            if (item.subDepartmentList) {
                return (
                    <TreeNode key={String(item.departmentId)} title={this.renderTitle(item)} dataRef={item}>
                        {this.renderTreeNodes(item.subDepartmentList, item)}
                    </TreeNode>
                );
            }
            return <TreeNode key={String(item.departmentId)} title={this.renderTitle(item)} dataRef={item} />;
        });
    };

    renderTitle = (item) => {
        const { visible, id, searchValue, selectedKeys } = this.state;
        const { inModal } = this.props;
        const btnList = domList.filter((ls) => {
            return checkPathname(ls.path);
        });
        let title = item.departmentName;
        if (searchValue) {
            // 搜索内容样式
            const index = item.departmentName.indexOf(searchValue);
            if (index > -1) {
                const beforeStr = item.departmentName.substr(0, index);
                const afterStr = item.departmentName.substr(index + searchValue.length);
                title = (
                    <span>
                        {beforeStr}
                        <span style={{ color: '#f50' }}>{searchValue}</span>
                        {afterStr}
                    </span>
                );
            }
        }
        if (inModal) {
            // 弹框中的展示形式
            return (
                <div className={styles.inModalTitleCls}>
                    <div className={styles.title}>{title}</div>
                    {String(item.departmentId) === selectedKeys[0] && <Icon type="check" className={styles.icon} />}
                </div>
            );
        }
        // 默认左侧组织数展示形式
        return (
            <div className={styles.titleCls}>
                <Popover content={`${item.departmentName}(${item.allSubUserTotal}人)`} placement="top">
                    <div className={styles.title}>
                        {title}
                        {`(${item.allSubUserTotal}人)`}
                    </div>
                </Popover>
                <Popover
                    placement="rightTop"
                    visible={Number(item.departmentId) === Number(id) && visible}
                    onVisibleChange={this.changeVisible}
                    content={
                        <div className={styles.modalCls}>
                            {btnList.map((dom) => {
                                return (
                                    <p
                                        className={styles.operateItem}
                                        key={dom.id}
                                        onClick={this.handleClick.bind(this, dom, item)}
                                    >
                                        {dom.name}
                                    </p>
                                );
                            })}
                        </div>
                    }
                    trigger="click"
                >
                    <div
                        className={styles.moreIconContainer}
                        onClick={() => {
                            return this.addNodes(item.departmentId);
                        }}
                    >
                        <img alt="" src={moreIcon} className={styles.moreIcon} />
                    </div>
                </Popover>
            </div>
        );
    };

    onSelect = (selectedKeys, { node }) => {
        if (selectedKeys.length === 0) {
            return;
        }
        const { changeSelectedKeys } = this.props;
        const departmentDetail = node.props.dataRef;
        if (typeof changeSelectedKeys === 'function') {
            changeSelectedKeys(selectedKeys[0], departmentDetail);
        }
        this.setState({
            selectedKeys,
        });
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    initExpandedKeys = () => {
        const { dataSource, selectedKeys } = this.props;
        let expandedKeys = this.getDefaultExpandedKeys(dataSource);
        expandedKeys = expandedKeys.concat(selectedKeys);
        this.setState({
            expandedKeys,
            selectedKeys,
            autoExpandParent: true,
        });
    };

    search = (value) => {
        if (!value) {
            this.setState({
                searchValue: '',
            });
            return;
        }
        const { dataSource } = this.props;
        const expandedKeys = [];
        this.getDataList(dataSource).map((item) => {
            if (item.departmentName.indexOf(value) > -1) {
                expandedKeys.push(String(item.departmentId));
            }
        });
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    changeSearchValue = (e) => {
        const { value } = e.target;
        this.debounceSearch(value);
    };

    render() {
        const { dataSource, blockNode } = this.props;
        const { expandedKeys, autoExpandParent, selectedKeys } = this.state;
        return (
            <>
                <BISearch
                    allowClear={true}
                    style={{ marginBottom: 8 }}
                    placeholder="搜索组织"
                    onSearch={this.debounceSearch}
                    onChange={this.changeSearchValue}
                />
                <Tree
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    blockNode={blockNode}
                >
                    {this.renderTreeNodes(dataSource || [])}
                </Tree>
            </>
        );
    }
}
