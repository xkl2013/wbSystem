import React from 'react';
import styles from './RoundsTable.less';
import BITable from '@/ant_components/BITable';

// 轮次业务组件
class RoundsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
        };
    }

    componentDidMount() {}

    render() {
        const { data } = this.state;
        const { columns = [], dataSource = [], rowKey } = this.props;
        return (
            <>
                <div className={styles.roundsTable}>
                    <BITable
                        rowKey={rowKey}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        bordered
                    />
                </div>
            </>
        );
    }
}
export default RoundsTable;
