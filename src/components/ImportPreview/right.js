import React from 'react';
import BITable from '@/ant_components/BITable';
import s from './right.less';
import BIButton from '@/ant_components/BIButton';
import addKey2List from '@/utils/addKey2List';

export default class Right extends React.PureComponent {
    render() {
        const { onSubmit, onCancel, columns, dataSource, scroll } = this.props;
        const newData = addKey2List(dataSource);
        return (
            <div className={s.rightContainer}>
                <div className={s.title}>解析结果预览</div>
                <div className={s.tableContainer}>
                    <BITable
                        className={s.table}
                        columns={columns}
                        dataSource={newData}
                        pagination={false}
                        scroll={scroll}
                        bordered
                    />
                </div>
                <div className={s.btnContainer}>
                    <BIButton onClick={onCancel}>取 消</BIButton>
                    <BIButton type="primary" className={s.confirmBtn} onClick={onSubmit}>
                        确 定
                    </BIButton>
                </div>
            </div>
        );
    }
}
