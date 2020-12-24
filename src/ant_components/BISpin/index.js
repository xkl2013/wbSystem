/**
 *@author   zhangwenshuai
 *@date     2019-07-01 14:42
 * */
import React, { Component } from 'react';
import lottie from 'lottie-web';
import classnames from 'classnames';
import animationData from './loading.json';
import s from './index.less';

export default class BISpin extends Component {
    componentDidMount() {
        lottie.loadAnimation({
            container: this.loading, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData,
            // path: './loading.json', // the path to the animation json
        });
    }

    render() {
        const { spinning = true, size, style, className, loadingClassName } = this.props;
        return (
            <>
                <div className={classnames(s.wrap, className)}>
                    <div className={s.spinning} style={{ display: spinning ? 'block' : 'none' }}>
                        <div
                            style={style}
                            className={classnames(s.loading, s[size], loadingClassName)}
                            ref={(dom) => {
                                this.loading = dom;
                            }}
                        />
                    </div>
                    <div>{this.props.children}</div>
                </div>
            </>
        );
    }
}
