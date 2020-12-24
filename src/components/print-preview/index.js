import React, { Component } from 'react';
import styles from './index.less';

class Index extends Component {
    render() {
        const { name, company_name, company_num, currentPage } = this.props;
        return (
            <>
                <dl className={styles.wrap}>
                    <dt className={styles.title}>
                        <h2>{name}</h2>
                    </dt>
                    <dd className={styles.cont}>
                        {/* 报销单主体 */}
                        <p className={styles.company_info}>
                            <span className={styles.company_name}>
                                费用承担主体：{company_name}
                            </span>
                            <span className={styles.company_num}>编号：{company_num}</span>
                        </p>
                        {/* 报销单内容 */}
                        {this.props.children}
                    </dd>
                    <dd>
                        <p className={styles.current}>
                            <span>第{currentPage}页</span>
                        </p>
                    </dd>
                </dl>
            </>
        );
    }
}
export default Index;
