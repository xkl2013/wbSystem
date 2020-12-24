import React, { Component } from 'react';
import { Button } from 'antd';
import Hide from '../hide';
import Filter from '../filter';
import Sort from '../sort';
import Group from '../setgroup';
import FilterCondition from '../filter-condition';

import s from './index.less';
import { OperateConfigProps, ColumnProps } from '../interface';

interface Props {
    operateConfig?: OperateConfigProps;
    columns: ColumnProps[];
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
    renderOperate = (operate: any) => {
        const { columns } = this.props;
        switch (operate.type) {
            case 'hide':
                return <Hide columns={columns} operate={operate} />;
            case 'filter':
                return <Filter columns={columns} operate={operate} />;
            case 'group':
                return <Group columns={columns} operate={operate} />;
            case 'sort':
                return <Sort columns={columns} operate={operate} />;
            default:
                break;
        }
    };

    renderBtn = (btn: any) => {
        const { render, label, onClick } = btn;
        if (typeof render === 'function') {
            return render(btn);
        }
        return <Button onClick={onClick}>{label}</Button>;
    };

    render() {
        const { operateConfig, columns } = this.props;
        const { menusGroup, buttonsGroup, renderCustomNode, showCondition }: any = operateConfig || {};

        const filter: any = menusGroup
            && menusGroup.find((item: any) => {
                return item.type === 'filter';
            });
        return (
            <div className={s.container}>
                {renderCustomNode && typeof renderCustomNode === 'function' ? renderCustomNode() : null}
                <div className={s.headerContainer}>
                    {menusGroup && (
                        <div className={s.defaultMenus}>
                            {menusGroup.map((item: any, i: number) => {
                                return (
                                    <div className={s.operate} key={i}>
                                        {this.renderOperate(item)}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {buttonsGroup && (
                        <div className={s.btns}>
                            {buttonsGroup.map((item: any, i: number) => {
                                return (
                                    !item.hidden && (
                                        <div className={s.operate} key={i}>
                                            {this.renderBtn(item)}
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    )}
                </div>
                {showCondition && (
                    <FilterCondition
                        columns={columns}
                        value={filter.value}
                        onChange={filter.onChange}
                        onSaveFilter={filter.onSaveFilter}
                    />
                )}
            </div>
        );
    }
}
