import React from 'react';
import ItemNode from './item';

export default class extends React.Component {
    handleValue = (val, item) => {
        let value = null;
        switch (item.type) {
            case 'input':
                value = val.target.value;
                break;
            case 'textarea':
                value = val.target.value;
                break;
            default:
                value = val;
                break;
        }
        return value;
    };

    onChange = (...arg) => {
        const item = this.props.item || {};
        const val = Array.isArray(arg) ? arg[0] : arg;
        const value = this.handleValue(val, item);
        if (this.props.onChange) this.props.onChange(value);
        if (
            item.events
            && Array.isArray(item.events)
            && this.props.handleBehavior
            && item.events.find((ls) => {
                return ls.eventValue === 'onChange';
            })
        ) {
            this.props.handleBehavior({ currentValue: value, componentData: item, eventType: 'onChange' });
        }
    };

    render() {
        const { handleBehavior, ...others } = this.props;
        return <ItemNode {...others} onChange={this.onChange} />;
    }
}
