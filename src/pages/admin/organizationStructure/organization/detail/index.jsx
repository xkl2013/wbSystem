import React, { Component } from 'react';
import FlexDetail from '@/components/flex-detail';
import styles from './index.less';
import modalfy from '@/components/modalfy';
import { getOptionName } from '@/utils/utils';
import { DEPARTMENT_TYPE } from '@/utils/enum';

const LabelWrap = [
    [
        { key: 'departmentName', label: '部门名称' },
        { key: 'departmentPName', label: '上级部门' },
        { key: 'departmentHeaderName', label: '负责人' },
    ],
    [
        {
            key: 'departmentProperty',
            label: '部门属性',
            render: (detail) => {
                return getOptionName(DEPARTMENT_TYPE, detail.departmentProperty);
            },
        },
        { key: 'departmentDesc', label: '备注' },
    ],
];

@modalfy
class Detail extends Component {
    render() {
        const { formData } = this.props;
        // 编辑时上级部门名称若id=0为顶级部门
        formData.departmentPName = formData.departmentPName || '顶级部门';
        return (
            <div className={styles.wrap}>
                <FlexDetail detailWrapCls={styles.detailWrap} LabelWrap={LabelWrap} detail={formData} />
            </div>
        );
    }
}

export default Detail;
