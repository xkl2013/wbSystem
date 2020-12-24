/* eslint max-classes-per-file: ["error", 2] */
import React from 'react';
import { transferAttr } from './_utils/transferAttr';
import { BaseComponentProps, BaseComponentState } from '../interface';

export const setFormat = (config: any, columnConfig: any, value: any, option?: any) => {
    const { columnAttrObj, columnType } = columnConfig || {};
    const transferColumn = transferAttr(columnType, {
        ...(config.componentAttr || {}),
        ...(columnAttrObj || {}),
    });
    if (config.setFormatter) return config.setFormatter(value, transferColumn, option);
    return value;
};

export const getFormat = (config: any, columnConfig: any, value: any) => {
    const { columnAttrObj, columnType } = columnConfig || {};
    if (!value || !Array.isArray(value) || value.length <= 0) return undefined;
    const transferColumn = transferAttr(columnType, {
        ...(config.componentAttr || {}),
        ...(columnAttrObj || {}),
    });
    if (config.getFormatter) {
        return config.getFormatter(value, transferColumn);
    }
    return value;
};
export const getEditComponent = (config: any, inCell: boolean = false) => {
    const EditComp = inCell ? config.cellComp : config.editComp;
    if (!EditComp) {
        console.error('编辑组件未定义');
        return;
    }
    const setFormat = (columnConfig: any, value: any, option?: any) => {
        const { columnAttrObj, columnType } = columnConfig || {};
        const transferColumn = transferAttr(columnType, {
            ...(config.componentAttr || {}),
            ...(columnAttrObj || {}),
        });
        if (config.setFormatter) return config.setFormatter(value, transferColumn, option);
        return value;
    };

    const getFormat = (columnConfig: any, value: any) => {
        const { columnAttrObj, columnType } = columnConfig || {};
        if (!value || !Array.isArray(value) || value.length <= 0) return undefined;
        const transferColumn = transferAttr(columnType, {
            ...(config.componentAttr || {}),
            ...(columnAttrObj || {}),
        });
        if (config.getFormatter) {
            return config.getFormatter(value, transferColumn);
        }
        return value;
    };

    return class EditBase extends React.Component<BaseComponentProps, BaseComponentState> {
        static getDerivedStateFromProps(nextProps: BaseComponentProps, prevState: BaseComponentState) {
            const { columnConfig } = prevState;

            const nextState: BaseComponentState = {
                ...prevState,
            };
            if (JSON.stringify(columnConfig) !== JSON.stringify(nextProps.columnConfig)) {
                nextState.columnConfig = nextProps.columnConfig;
            }
            return nextState;
        }

        constructor(props: BaseComponentProps) {
            super(props);
            const { columnConfig } = props;
            this.state = {
                columnConfig,
            };
        }

        onChange = (changedValue: any, option: any) => {
            const { columnConfig } = this.state;
            const { onChange } = this.props;
            const value = setFormat(columnConfig, changedValue, option);
            if (typeof onChange === 'function') {
                onChange(value);
            }
        };

        // 触发修改回调
        onEmitChange = (changedValue: any, option: any) => {
            const { columnConfig } = this.state;
            const { onEmitChange } = this.props;
            const value = setFormat(columnConfig, changedValue, option);
            if (typeof onEmitChange === 'function') {
                onEmitChange(value, option);
            }
        };

        render() {
            const { value, ...others } = this.props;
            const { columnConfig } = this.state;
            const { columnAttrObj, columnType } = columnConfig || {};
            const transferColumn = transferAttr(columnType, {
                ...(config.componentAttr || {}),
                ...(columnAttrObj || {}),
            });
            const newProps = {
                ...others,
                ...(transferColumn || {}),
            };
            return (
                <EditComp
                    {...newProps}
                    value={getFormat(columnConfig, value)}
                    onChange={this.onChange}
                    onEmitChange={this.onEmitChange}
                />
            );
        }
    };
};
export const getDetailComponent = (config: any) => {
    const DetailComp = config.detailComp;
    if (!DetailComp) {
        console.warn('详情组件暂未定义');
    }
    return class DetailBase extends React.PureComponent<BaseComponentProps> {
        render() {
            const {
                columnConfig: { columnAttrObj, columnType },
                value,
            } = this.props;
            const newProps = {
                ...(config.componentAttr || {}),
                ...(columnAttrObj || {}),
            };
            const transferColumn = transferAttr(columnType, newProps);

            return (
                <DetailComp
                    {...this.props}
                    componentAttr={transferColumn}
                    formatter={config.getFormatter}
                    value={value}
                />
            );
        }
    };
};
