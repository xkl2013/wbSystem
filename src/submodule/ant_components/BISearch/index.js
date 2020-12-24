import React from 'react';
import BIInput from '@/ant_components/BIInput';
import './style.less';
import IconFont from '@/components/CustomIcon/IconFont';

/*
 * Input 组件
 *
 * 基于原 ant Input
 * 只扩展自定义样式
 * */
class BISearch extends React.PureComponent {
    state = {
        value: '',
    };

    onChange = (e) => {
        const value = e.target.value;
        const { onChange } = this.props;
        this.setState({
            value,
        });
        if (typeof onChange === 'function') {
            onChange(e);
        }
    };

    onSearch = () => {
        const { onSearch } = this.props;
        const { value } = this.state;
        if (typeof onSearch === 'function') {
            onSearch(value);
        }
    };

    render() {
        const { value } = this.state;
        return (
            <span className="BISearch">
                <BIInput
                    {...this.props}
                    ref={(dom) => {
                        this.input = dom;
                    }}
                    prefix={
                        <IconFont
                            type="iconziduan-lianxiangdanxuan"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                            onClick={this.onSearch}
                        />
                    }
                    onChange={this.onChange}
                    onPressEnter={this.onSearch}
                    value={value}
                />
            </span>
        );
    }
}

export default BISearch;
