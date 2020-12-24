import React, { Component } from 'react';
import { Switch, Popover } from 'antd';
import _ from 'lodash';
import s from './index.less';
import hideIcon from '../../assets/hide.png';
import { Consumer } from '../context';

interface Props {
    columns: any;
    operate: any;
}
interface State {
    visible: boolean;
    columnConfig: any;
}
/**
 * 操作栏显隐控制
 * 参数
 * @configs  操作栏配置
 * @columns  表头列表配置
 * @onChange 显隐变化回调
 */
export default class Hide extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            columnConfig: props.columns,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { columns } = this.props;
        if (JSON.stringify(nextProps.columns) !== JSON.stringify(columns)) {
            const newCols = nextProps.columns.filter((item:any) => {
                return item.enableStatus && item.hideFlag;
            });
            this.setState({
                columnConfig: newCols,
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
        const {
            operate: { onChange },
        } = this.props;
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
        const config: any[] = [];
        temp.map((item: any) => {
            if (item.showStatus === 0) {
                config.push(item.columnName);
            }
        });
        if (typeof onChange === 'function') {
            onChange({ config });
        }
    };

    renderContent = (locale) => {
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
                                    <span className={s.optionName}>{item.columnChsName}</span>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className={s.btns}>
                    <div className={s.btn} role="presentation" onClick={this.changeHide.bind(this, 'all', 0)}>
                        {locale.hideHideAll}
                    </div>
                    <div className={s.btn} role="presentation" onClick={this.changeHide.bind(this, 'all', 1)}>
                        {locale.hideShowAll}
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
            <Consumer>
                {({ locale }) => {
                    const txt = locale.hide === '隐藏' ? `${len}条隐藏` : `${len} fields hidden`;
                    return (
                        <Popover
                            overlayClassName={s.popover}
                            placement="bottomLeft"
                            title={locale.hide}
                            content={this.renderContent(locale)}
                            visible={visible}
                            onVisibleChange={this.toggleOption}
                            trigger="click"
                        >
                            <div className={s.operateContainer} style={{ background: bg }}>
                                <img alt="" className={s.operateIcon} src={hideIcon} />
                                <span className={s.operateName}>
                                    {len > 0 ? txt : locale.hide}
                                </span>
                            </div>
                        </Popover>
                    );
                }}
            </Consumer>
        );
    }
}
