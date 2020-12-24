import React, { Component } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import s from './index.less';
import { OperateConfigProps } from '../interface';

interface Props {
    operateConfig?: OperateConfigProps;
}
/**
 * 操作栏
 * @展示格式  未设置
 * @显隐控制  Hide
 * @过滤控制  Filter
 * @排序控制  Sort
 * @分组控制  Group
 */
export default class Operate extends Component<Props> {
    renderBtn = (btn: any) => {
        const { render, label, onClick, type, className } = btn;
        if (typeof render === 'function') {
            return render(btn);
        }
        return (
            <Button
                className={type === 'primary' ? classNames(s.btn, s.primary, className) : classNames(s.btn, className)}
                onClick={onClick}
            >
                {label}
            </Button>
        );
    };

    render() {
        const { operateConfig } = this.props;
        const { buttonsGroup }: any = operateConfig || {};

        return (
            <div className={s.container}>
                {buttonsGroup && (
                    <div className={s.btns}>
                        {buttonsGroup.map((item: any, i: number) => {
                            return (
                                <div className={s.operate} key={i}>
                                    {this.renderBtn(item)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}
