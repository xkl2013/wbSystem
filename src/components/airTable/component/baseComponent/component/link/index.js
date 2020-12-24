import React from 'react';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';
import BIButton from '@/ant_components/BIButton';
import addIcon from '@/assets/airTable/addRow.png';

class Link extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            value,
        });
    }

    addLink = () => {
        const { value } = this.state;
        const newValue = (value && value.slice()) || [];
        newValue.push({});
        this.setState({
            value: newValue,
        });
    };

    changeLinkValue = (index, e) => {
        const { value } = this.state;
        const temp = value[index];
        temp.value = e.target.value;
        this.setState(
            {
                value,
            },
            this.changeLink,
        );
    };

    changeLinkText = (index, e) => {
        const { value } = this.state;
        const temp = value[index];
        temp.text = e.target.value;
        this.setState(
            {
                value,
            },
            this.changeLink,
        );
    };

    changeLink = () => {
        const { onChange } = this.props;
        const { value } = this.state;
        if (typeof onChange === 'function') {
            onChange(value);
        }
    };

    render() {
        const { value } = this.state;
        return (
            <div className={styles.container}>
                {value
                    && value.map((link, i) => {
                        return (
                            <div key={i}>
                                <div>
                                    <span>链接地址：</span>
                                    <Input
                                        className={styles.input}
                                        value={link.value}
                                        onChange={this.changeLinkValue.bind(this, i)}
                                    />
                                </div>
                                <div>
                                    <span>显示文字：</span>
                                    <Input
                                        className={styles.input}
                                        value={link.text}
                                        onChange={this.changeLinkText.bind(this, i)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                <BIButton type="primary" className={styles.btn} onClick={this.addLink}>
                    <img className={styles.icon} src={addIcon} alt="" />
                    <span className={styles.text}>新增</span>
                </BIButton>
            </div>
        );
    }
}
export default Link;
