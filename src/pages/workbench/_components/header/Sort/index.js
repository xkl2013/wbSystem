import React from 'react';
import styles from './index.less';

class Sort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return <div className={styles.btnCls}>排序</div>;
    }
}
export default Sort;
