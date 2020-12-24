import React, {Component} from 'react';
import BIButton from '@/ant_components/BIButton';
import s from './index.less'

export default class SubmitButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loading !== undefined && this.props.loading !== nextProps.loading) {
            this.setState({
                loading: nextProps.loading
            })
        }
    }

    onClick = (e) => {
        const {onClick, loading} = this.props;
        //默认loading设置
        if (loading === undefined) {
            this.setState({
                loading: true
            });
            let timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
                this.setState({
                    loading: false
                })
            }, 500)
        }
        typeof onClick === 'function' && onClick(e);
    }

    render() {
        const {loading} = this.state;
        return (
            <BIButton className={s.submitBtn} {...this.props} loading={loading} onClick={this.onClick}/>
        )
    }
}
