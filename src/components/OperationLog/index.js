import React, { Component } from 'react';
import moment from 'moment';
import { OPERATION_TYPE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import Rate from '@/components/airTable/component/baseComponent/detail/rate';
import s from './index.less';

export default class Log extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unfold: false,
        };
    }

    componentDidMount() {
        this.initUnfold();
    }

    renderUser = () => {
        const { commentUserName } = this.props;
        return <span className={s.user}>{`${commentUserName} `}</span>;
    };

    renderTime = () => {
        const { commentCreatedAt } = this.props;
        return <span className={s.time}>{` ${moment(commentCreatedAt).format('YYYY-MM-DD HH:mm')}`}</span>;
    };

    renderOp = () => {
        const {
            commentOperationFlowDTO: { operationType },
        } = this.props;
        if (Number(operationType) === 6) return null;
        return <span className={s.op}>{` ${getOptionName(OPERATION_TYPE, operationType)}了`}</span>;
    };

    renderOpCol = () => {
        const {
            commentOperationFlowDTO: { operationChsName, operationType },
        } = this.props;
        if (Number(operationType) === 6) return null;
        return <span className={s.opCol}>{` ${operationChsName}${operationType > 2 ? '：' : ''}`}</span>;
    };

    renderOpContent = () => {
        const {
            commentOperationFlowDTO: { operationType },
        } = this.props;
        switch (operationType) {
            case 3:
                return (
                    <>
                        {this.renderOld()}
                        为
                        {this.renderNew()}
                    </>
                );
            case 4:
                return this.renderNew();
            case 5:
                return this.renderOld();
            case 6:
                return this.renderAction();
            default:
                break;
        }
    };

    renderAction = () => {
        const {
            commentOperationFlowDTO: { showType, actionText },
        } = this.props;
        // showType 1：文本、2：附件、3：评分
        return <span className={s.new}>{this.renderContent(showType, actionText)}</span>;
    };

    renderOld = () => {
        const {
            commentOperationFlowDTO: { showType, oldValue },
        } = this.props;
        // showType 1：文本、2：附件、3：评分
        return <span className={s.old}>{this.renderContent(showType, oldValue)}</span>;
    };

    renderNew = () => {
        const {
            commentOperationFlowDTO: { showType, newValue },
        } = this.props;
        return <span className={s.new}>{this.renderContent(showType, newValue)}</span>;
    };

    renderContent = (showType, value) => {
        const { rateProps } = this.props;
        switch (showType) {
            case 1:
                return value || '<空>';
            case 2:
                // TODO 目前显示文件名，按文本处理
                return value || '<空>';
            case 3:
                return <Rate value={value || 0} rateProps={rateProps} />;
            default:
                return value;
        }
    };

    unfoldContent = () => {
        this.setState({
            unfold: true,
        });
    };

    foldContent = () => {
        this.setState({
            unfold: false,
        });
    };

    initUnfold = () => {
        const height = (this.hiddenDiv && this.hiddenDiv.clientHeight) || 0;
        if (height > 40) {
            this.setState({
                showUnfold: true,
            });
        }
    };

    renderExtend = () => {
        const { unfold } = this.state;
        const height = (this.hiddenDiv && this.hiddenDiv.clientHeight) || 0;
        if (height > 40) {
            if (unfold) {
                return (
                    <span role="presentation" className={s.fold} onClick={this.foldContent}>
                        收起
                    </span>
                );
            }
            return (
                <span role="presentation" className={s.unfold} onClick={this.unfoldContent}>
                    ...
                    <span className={s.unfoldTip}>展开</span>
                </span>
            );
        }
    };

    render() {
        const { commentOperationFlowDTO } = this.props;
        const { unfold, showUnfold } = this.state;
        if (!commentOperationFlowDTO) {
            return null;
        }
        const { operationType } = commentOperationFlowDTO;

        return (
            <>
                <div className={s.container} style={{ height: unfold ? 'auto' : '34px' }}>
                    {this.renderUser()}
                    于
                    {this.renderTime()}
                    {this.renderOp()}
                    {this.renderOpCol()}
                    {operationType > 2 && this.renderOpContent()}
                    {showUnfold && this.renderExtend()}
                </div>
                <div
                    className={s.container1}
                    ref={(dom) => {
                        this.hiddenDiv = dom;
                    }}
                >
                    {this.renderUser()}
                    于
                    {this.renderTime()}
                    {this.renderOp()}
                    {this.renderOpCol()}
                    {operationType > 2 && this.renderOpContent()}
                </div>
            </>
        );
    }
}
