import React from 'react';
import { Icon } from 'antd';
import ChooseBox from './chooseBox';
import RenderSearch from './search';
import styles from './styles.less';
export default class DropDown extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: [],
        };
        this.initUser = (data = []) => {
            const newData = data.map((item, index) => {
                return { ...item };
            });
            this.setState({ value: newData });
        };
        this.onCheckIndex = (obj) => {
            const value = this.state.value || [];
            return value.findIndex((ls) => String(ls.id) === String(obj.id));
        };
        this.willChange = (data, originValue = this.state.value) => {
            let value = originValue || [];
            const length = this.props.length;
            const index = this.onCheckIndex(data);
            if (index >= 0) {
                value.splice(index, 1);
            } else {
                length === value.length && value.splice(0, 1);
                value = [...value, data];
            }
            return value;
        };
        this.onChange = (data, obj) => {
            const value = this.willChange(data);
            if (this.props.onChange) {
                this.props.onChange(value, obj);
            }
            this.setState({ value });
        };
        this.remove = (obj) => {
            const { value = [] } = this.state;
            const index = value.findIndex((item) => item.id === obj.id);
            index >= 0 && value.splice(index, 1);
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.setState({ value });
        };
        this.removeAll = () => {
            if (this.props.onChange) {
                this.props.onChange([]);
            }
            this.setState({ value: [] });
        };
    }
    componentDidMount() {
        this.initUser(this.props.value);
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initUser(nextProps.value);
        }
    }
    render() {
        const value = this.state.value || [];
        return React.createElement(
            'div',
            { className: styles.panleContainer },
            React.createElement(
                'div',
                { className: styles.leftBox },
                React.createElement(
                    'div',
                    { className: styles.searchBox },
                    React.createElement(RenderSearch, {
                        instanceName: this.props.instanceName,
                        value: value,
                        onChange: this.onChange,
                        request: this.props.request,
                    }),
                ),
            ),
            React.createElement(
                'div',
                { className: styles.maddleSplit },
                React.createElement(Icon, { type: 'right', style: { fontSize: '16px' } }),
            ),
            React.createElement(
                'div',
                { className: styles.rightBox },
                React.createElement(
                    'div',
                    { className: styles.rightBoxHeader },
                    React.createElement(
                        'span',
                        { className: styles.chooseTitle },
                        '\u5DF2\u9009\u62E9',
                        this.props.instanceName || '',
                        '(',
                        this.props.length ? value.length + '/' + this.props.length : value.length,
                        ')',
                    ),
                    React.createElement(
                        'span',
                        { className: styles.chooseClear, onClick: this.removeAll },
                        '\u6E05\u7A7A',
                    ),
                ),
                React.createElement(
                    'div',
                    { className: styles.chooseBox },
                    React.createElement(ChooseBox, { userData: value, remove: this.remove }),
                ),
            ),
        );
    }
}
