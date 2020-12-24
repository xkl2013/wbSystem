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
        const result = await getInstance(this.props.formData.contract.contractInstanceId);
        if (result && result.success) {
            this.setState({
                instanceData: result.data,
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
