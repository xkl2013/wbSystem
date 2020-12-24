import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import Invoice from './Invoice';
import Return from './Return';
import storage from '@/utils/storage';

@connect(() => {
    return {};
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIsCreater: false, // 当前登录用户是否为创建者
        };
    }

    componentDidMount() {
        if (this.props.formData.contract.contractCreatedId === storage.getUserInfo().userId) {
            this.setState({
                currentIsCreater: true,
            });
        } else {
            this.setState({
                currentIsCreater: false,
            });
        }
    }

    componentWillReceiveProps() { }

    render() {
        const { currentIsCreater } = this.state;
        return (
            <div className={styles.detailPage}>
                <Invoice {...this.props} currentIsCreater={currentIsCreater} />
                <Return {...this.props} currentIsCreater={currentIsCreater} />
            </div>
        );
    }
}

export default Index;
