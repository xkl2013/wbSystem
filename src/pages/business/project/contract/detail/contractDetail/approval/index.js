import React, { Component } from 'react';
import styles from './index.less';
import { getInstance } from '../../services';
import Approval from '@/pages/business/project/common/components/detail/_approval';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instanceData: {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const result = await getInstance(222);
        if (result && result.success) {
            let instanceData = result.data;
            instanceData.approvalFlowNodeDtos = instanceData.approvalNoticers.map(ls => ({ ...ls, executorName: ls.userName }))
            instanceData.approvalTaskLogDtos = []
            this.setState({
                instanceData,
            });
        }
    };

    render() {
        const { instanceData } = this.state;
        return (
            <div className={styles.detailPage}>
                <Approval instanceData={instanceData} />
            </div>
        );
    }
}

export default Index;
