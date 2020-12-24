/* eslint-disable max-len */
import React from 'react';
import styles from './styles.less';

/**
 *   hover tips 卡片
 *
 *   props
 *   mouseX -- 鼠标x
 *   mouseY -- 鼠标y
 *   tipsIsShow - 是否显示
 */

export default class Tips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionTop: 0, // fixed top
            positionLeft: 0, // fixed left
            isHover: false,
        };
    }

    componentDidMount() {
        const { mouseX = 0, mouseY = 0 } = this.props;
        this.setPosition(mouseX, mouseY);
        this.tipRef.addEventListener('mouseenter', this.bindmouseoverFun);
        this.tipRef.addEventListener('mouseleave', this.bindmouseoutFun);
    }

    componentWillReceiveProps(nextProps) {
        const { mouseX = 0, mouseY = 0 } = nextProps;
        this.setPosition(mouseX, mouseY);
    }

    componentWillUnmount() {
        this.tipRef.removeEventListener('mouseenter', this.bindmouseoverFun);
        this.tipRef.removeEventListener('mouseleave', this.bindmouseoutFun);
    }

    bindmouseoverFun = () => {
        // 鼠标移入
        this.setState({
            isHover: true,
        });
    };

    bindmouseoutFun = () => {
        // 鼠标移出
        this.setState({
            isHover: false,
        });
    };

    setPosition = (mouseX, mouseY) => {
        const { canCopy } = this.props;
        const width = this.tipRef && this.tipRef.offsetWidth; // tip 宽
        const height = this.tipRef && this.tipRef.offsetHeight; // tip 高
        const bodyWidth = document.body.clientWidth; // 可见区域 宽
        const bodyHeight = document.body.clientHeight; // 可见区域 高
        let positionLeft = mouseX + (canCopy ? 0 : 10);
        let positionTop = mouseY + (canCopy ? 0 : 10);

        if (mouseX + width > bodyWidth && mouseY + height <= bodyHeight) {
            // 右侧遮挡检测
            positionLeft = bodyWidth - width;
        }

        if (mouseY + height > bodyHeight && mouseX + width <= bodyWidth) {
            // 底部遮挡检测
            positionTop = bodyHeight - height;
        }

        if (mouseX + width > bodyWidth && mouseY + height > bodyHeight) {
            // 右下遮挡检测
            positionLeft = mouseX - width - 5;
            positionTop = mouseY - height - 5;
        }

        this.setState({
            positionTop,
            positionLeft,
        });
    };

    render() {
        const { positionTop, positionLeft, isHover } = this.state;
        const { tipsIsShow } = this.props;
        return (
            <div
                className={`${styles.tips} tipsClass`}
                style={{
                    top: `${positionTop}px`,
                    left: `${positionLeft}px`,
                    display: `${tipsIsShow || isHover ? 'block' : 'none'}`,
                }}
                ref={(dom) => {
                    this.tipRef = dom;
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
