import React from 'react';
import { TreeSelect } from 'antd';
import { connect } from 'dva';
import memoizeOne from 'memoize-one';
import { getAllUaers } from './utils';
import s from './index.less';

const TreeNode = TreeSelect.TreeNode;

interface Props {
    initDataType?: undefined | 'onfocus' | 'cache'; // 初始化请求方式
    dispatch: Function;
    departmentsList: any;
    value: any;
    mode: string; // 'user'or 'org
    dropdownStyle?: any;
}
@connect(({ admin_global, loading }: any) => ({
    departmentsList: admin_global.departmentsList,
    isloading: loading.effects['admin_global/getDepartmentList'],
}))
class OrgTreeSelecte extends React.Component<Props> {
    state = {
        value: undefined,
    };

    memoizeOneGetData = memoizeOne(getAllUaers);

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        if (this.props.departmentsList && this.props.departmentsList.length && this.props.initDataType === 'cache') {
            return;
        }
        this.props.dispatch({
            type: 'admin_global/getDepartmentList',
        });
    };

    renderTreeNodes = (data: any) => {
        return data.map((item: any) => {
            if (item.subDepartmentList && item.subDepartmentList.length > 0) {
                return (
                    <TreeNode key={String(item.departmentId)} value={item.departmentId} title={item.departmentName}>
                        {this.renderTreeNodes(item.subDepartmentList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={String(item.departmentId)} value={item.departmentId} title={item.departmentName} />;
        });
    };

    renderTitle = (title: string) => {
        return <span>{title}</span>;
    };

    renderUsersNodes = (data: any) => {
        const users = Array.isArray(data) && data.length > 0 ? this.memoizeOneGetData(data) : [];
        return users.map((item: any) => {
            return <TreeNode key={String(item.userId)} isLeaf={true} value={item.userId} title={item.userChsName} />;
        });
    };

    render() {
        const { departmentsList, mode = 'user', dropdownStyle = {} } = this.props;
        return (
            <TreeSelect
                dropdownClassName={s.treeSelect}
                showSearch={true}
                // 最大高度为clientHeight
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto', ...dropdownStyle }}
                allowClear={true}
                treeDefaultExpandAll={true}
                treeNodeFilterProp="title"
                labelInValue={true}
                {...this.props}
            >
                {mode === 'org' ? this.renderTreeNodes(departmentsList) : this.renderUsersNodes(departmentsList)}
            </TreeSelect>
        );
    }
}
export default OrgTreeSelecte;
