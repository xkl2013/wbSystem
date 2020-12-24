import React, { Component } from 'react';
import { Switch, Popover } from 'antd';
import _ from 'lodash';
import s from './index.less';
import hideIcon from '@/assets/airTable/hide.png';
/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class Hide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            columnConfig: props.columnConfig,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { columnConfig } = this.props;
        if (nextProps.columnConfig !== columnConfig) {
            this.setState({
                columnConfig: nextProps.columnConfig,
            });
        }
    }

    toggleOption = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    changeHide = (index, value) => {
        const { updateHideConfig } = this.props;
        const { columnConfig } = this.state;
        const temp = _.cloneDeep(columnConfig);
        if (index === 'all') {
            temp.map((item) => {
                const itemData = item;
                if (item.hideFlag) {
                    itemData.showStatus = value;
                    return itemData;
                }
            });
        } else {
            temp[index].showStatus = value;
        }
        const config = [];
        temp.map((item) => {
            if (item.showStatus === 0) {
                config.push(item.key);
            }
        });
        updateHideConfig({ config });
    };

    renderContent = () => {
        const { columnConfig } = this.state;
        return (
            <div className={s.optionsModal}>
                <div className={s.optionList}>
                    {columnConfig.map((item, i) => {
                        if (item.hideFlag) {
                            return (
                                <div
                                    key={i}
                                    role="presentation"
                                    className={s.optionItem}
                                    onClick={this.changeHide.bind(this, i, Number(item.showStatus) === 1 ? 0 : 1)}
                                >
                                    <Switch checked={!!item.showStatus} size="small" />
                                    <span className={s.optionName}>{item.title}</span>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className={s.btns}>
                    <div className={s.btn} role="presentation" onClick={this.changeHide.bind(this, 'all', 0)}>
                        全部隐藏
                    </div>
                    <div className={s.btn} role="presentation" onClick={this.changeHide.bind(this, 'all', 1)}>
                        显示所有
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { visible, columnConfig } = this.state;
        const len = columnConfig.filter((item) => {
            return item.showStatus !== 1;
        }).length;
        let bg = '';
        if (len > 0) {
            bg = 'rgba(66,202,196,0.1)';
        }
        return (
            <Popover
                overlayClassName={s.popover}
                placement="bottomLeft"
                content={this.renderContent()}
                visible={visible}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                <div className={s.operateContainer} style={{ background: bg }}>
                    <img alt="" className={s.operateIcon} src={hideIcon} />
                    <span className={s.operateName}>{len > 0 ? `${len}条隐藏` : '可见设置'}</span>
                </div>
            </Popover>
        );
    }
}
