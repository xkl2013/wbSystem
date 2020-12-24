import React from 'react';
import BIInput from '@/ant_components/BIInput';
import styles from './index.less';

// 提供线索id customerId
class SelfTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue1: props.beforeFansCount || '',
            inputValue2: props.afterFansCount || ''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            if(nextProps.value){
                this.setState({
                    inputValue1: nextProps.value.beforeFansCount,
                    inputValue2: nextProps.value.afterFansCount
                })
            }else{
                this.setState({
                    inputValue1: nextProps.beforeFansCount,
                    inputValue2: nextProps.afterFansCount
                })
            }
            
        }
    }
    handleInputConfirm = () => {
        const { inputValue1, inputValue2 } = this.state;
        const { onChange } = this.props;
        onChange({
            beforeFansCount: inputValue1,
            afterFansCount: inputValue2
        })
        this.setState({
            inputValue1,
            inputValue2
        });
    };
    handleInputChange1 = e => {
        this.setState({ inputValue1: e.target.value });
    };
    handleInputChange2 = e => {
        this.setState({ inputValue2: e.target.value });
    };
    render() {
        const { beforeDate, afterDate } = this.props;
        const { inputValue1, inputValue2 } = this.state;
        return (
            <div className={styles.editTableWrap}>
                <div className={styles.itemLine}>
                    <span></span>
                    <span>粉丝数</span>
                    <span>统计时间</span>
                </div>
                <div className={styles.itemLine}>
                    <span>推广前</span>
                    <span>
                        <BIInput
                            className={styles.inputCls}
                            value={inputValue1}
                            onChange={this.handleInputChange1}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    </span>
                    <span>{beforeDate}</span>
                </div>
                <div className={styles.itemLine}>
                    <span>推广后</span>
                    <span>
                        <BIInput
                            className={styles.inputCls}
                            value={inputValue2}
                            onChange={this.handleInputChange2}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    </span>
                    <span>{afterDate}</span>
                </div>
            </div>
        )
    }
}
export default SelfTable