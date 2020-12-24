import React from 'react';
import styles from './DetailInfoTemplate.less';

class DetailInfoFlex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailData: [],
        };
    }

    componentDidMount() {}

    render() {
        const { title } = this.props;
        return (
            <dl className={styles.detailBox}>
                {/* 详情页title */}
                <dt>
                    <p>
                        <span className={styles.detailTitle}>{title}</span>
                    </p>
                </dt>
                {/* 详情页模块内容 */}
                <dd>{this.props.children}</dd>
            </dl>
        );
    }
}
export default DetailInfoFlex;
