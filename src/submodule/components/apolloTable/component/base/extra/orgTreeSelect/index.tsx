import React, { useCallback, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

const TreeNode = TreeSelect.TreeNode;

interface Props {
    initDataType?: undefined | 'onfocus' | 'cache'; // 初始化请求方式
    request: Function;
    list?: any;
    value: any;
    dropdownStyle?: any;
}

const OrgTreeSelect = (props: Props) => {
    const { request } = props;
    const selfProps = antiAssign(props, ['initDataType', 'list', 'request', 'mode', 'dropdownStyle']);
    const [list, setList] = useState(props.list || []);

    useEffect(() => {
        getData();
    }, []);

    const getData = useCallback(async () => {
        const res = await request();
        if (res) {
            setList(res);
        }
    }, [request]);

    const renderTreeNodes = (data: any) => {
        return data.map((item: any) => {
            if (item.subDepartmentList && item.subDepartmentList.length > 0) {
                return (
                    <TreeNode key={String(item.departmentId)} value={item.departmentId} title={item.departmentName}>
                        {renderTreeNodes(item.subDepartmentList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={String(item.departmentId)} value={item.departmentId} title={item.departmentName} />;
        });
    };

    return (
        <TreeSelect
            dropdownClassName={s.treeSelect}
            showSearch={true}
            // 最大高度为clientHeight
            // dropdownStyle={{ maxHeight: '300px', overflow: 'auto', ...dropdownStyle }}
            // allowClear={true}
            treeDefaultExpandAll={true}
            treeNodeFilterProp="title"
            labelInValue={true}
            {...selfProps}
        >
            {renderTreeNodes(list)}
        </TreeSelect>
    );
};
export default OrgTreeSelect;
