/**
 *@author   zhangwenshuai
 *@date     2019-06-22 13:38
 * */
import React, { PureComponent } from 'react';
import ApprovalProgress from '@/components/ApprovalProgress';
import styles from './index.less';

class Index extends PureComponent {
    render() {
        const { instanceData } = this.props;
        return (
            <div className={styles.wrap}>
                <ApprovalProgress data={instanceData} />
            </div>
        );
    }
}

export default Index;
