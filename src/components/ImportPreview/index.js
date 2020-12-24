import React from 'react';
import Left from './left';
import Right from './right';
import s from './index.less';

export default class ImportDetail extends React.PureComponent {
    render() {
        const { leftProps, rightProps } = this.props;
        return (
            <div className={s.container}>
                <div className={s.leftContainer}>
                    <Left {...leftProps} />
                </div>
                <div className={s.rightContainer}>
                    <Right {...rightProps} />
                </div>
            </div>
        );
    }
}
