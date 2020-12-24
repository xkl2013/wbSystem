import React from 'react';
import { Cascader, Icon } from 'antd';
import { citys } from '@/utils/city.json';
import s from './index.less';
class SearchCom extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: this.props.value || undefined,
        };
        this.onChange = (val, ops) => {
            const cityNames = ops.map((item) => item.label).filter((item) => item);
            const cityValues = ops.map((item) => item.value).filter((item) => item);
            const value = {
                label: cityNames.join('/'),
                value: cityValues.join('/'),
            };
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.setState({ value });
        };
        this.formaterValue = (value) => {
            if (!value)
                return value;
            if (Array.isArray(value))
                return value;
            if (typeof value === 'string')
                return value.split('/').map((item) => Number(item));
            if (typeof value === 'object' && value.value) {
                return value.value.split('/').map((item) => Number(item));
            }
        };
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({ value: nextProps.value });
        }
    }
    render() {
        const { value } = this.state;
        console.log(s);
        return (React.createElement(Cascader, Object.assign({ popupClassName: s.view }, this.props, { options: citys, value: this.formaterValue(value), showSearch: true, suffixIcon: React.createElement(Icon, { type: "search", style: { fontSize: '16px' } }), allowClear: true, onChange: this.onChange })));
    }
}
export default SearchCom;
