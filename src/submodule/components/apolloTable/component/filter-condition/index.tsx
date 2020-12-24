import React, { Component } from 'react';
import { Tag } from 'antd';
import _ from 'lodash';
import styles from './styles.less';
import { config } from '../base/config';
import { transferAttr } from '../base/_utils/transferAttr';
import { ColumnProps } from '../interface';
import { Consumer } from '../context';

const formatTags = (columns: ColumnProps[], tags: any[]) => {
    if (!columns || columns.length === 0 || !tags || !Array.isArray(tags)) {
        return [];
    }

    const textTags: string[] = [];
    tags.map((tag) => {
        const colConfig = columns.find((item) => {
            return item.columnName === tag.colName;
        });
        if (!colConfig) return;
        const { operator = [] } = colConfig;
        let { columnType } = colConfig;
        if (!config[columnType]) {
            columnType = '1';
        }
        const { componentAttr, getFormatter } = config[columnType];
        const newProps = {
            ...(componentAttr || {}),
            ...(colConfig.columnAttrObj || {}),
        };
        const transferColumn = transferAttr(columnType, newProps);
        let value = tag.colValues
            .map((item: any) => {
                return item.text;
            })
            .join(',');
        if (Number(columnType) === 11 && getFormatter) {
            value = getFormatter(tag.colValues, transferColumn);
            if (value.format) {
                value = value.format(transferColumn.format);
            }
        }
        const op =
            operator.find((item: any) => {
                return item.id === tag.operationCode;
            }) || {};
        textTags.push(`${colConfig.columnChsName} ${op.name} ${value}`);
    });
    return textTags;
};
interface Props {
    columns: ColumnProps[];
    value: any;
    onChange: Function;
    onSaveFilter?: Function;
}
interface State {
    tags: any;
    value: any;
    columns: any;
}
class FormFilterButton extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            value: [],
            columns: [],
            tags: formatTags(props.columns, props.value),
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (
            JSON.stringify(nextProps.value) !== JSON.stringify(prevState.value) ||
            JSON.stringify(nextProps.columns) !== JSON.stringify(prevState.columns)
        ) {
            return {
                value: _.cloneDeep(nextProps.value),
                columns: nextProps.columns,
                tags: formatTags(nextProps.columns, nextProps.value),
            };
        }
        return null;
    }

    save = () => {
        const { value, onSaveFilter } = this.props;
        if (typeof onSaveFilter === 'function') {
            const { tags } = this.state;
            const text = tags.join(' & ');
            const params = value.map((item: any) => {
                return item.colName;
            });
            onSaveFilter({ text, params, condition: value });
        }
    };

    reset = () => {
        this.onChange([]);
    };

    removeTag = (index: number) => {
        const { value } = this.props;
        const newValue = _.cloneDeep(value);
        newValue.splice(index, 1);
        this.onChange(newValue);
    };

    onChange = (config: any[]) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange({ type: 'filterConfig', config });
        }
    };

    render() {
        const { tags } = this.state;
        const { onSaveFilter } = this.props;
        return (
            <Consumer>
                {({ locale }) => {
                    return (
                        <div className={styles.container}>
                            <div className={styles.title}>{locale.selectedConditions}</div>
                            <div className={styles.footer}>
                                <div className={styles.chooseItem}>
                                    {tags.map((item: any, i: number) => {
                                        return (
                                            <Tag
                                                key={i}
                                                color="#f1f4f7"
                                                visible={true}
                                                closable
                                                onClose={this.removeTag.bind(this, i)}
                                            >
                                                <span className={styles.tag}>{item}</span>
                                            </Tag>
                                        );
                                    })}
                                </div>
                                <div className={styles.buttonGroup}>
                                    {onSaveFilter && (
                                        <div onClick={this.save} className={styles.saveBtn}>
                                            {locale.saveShortcut}
                                        </div>
                                    )}
                                    <div onClick={this.reset} className={styles.resetBtn}>
                                        {locale.clearFilter}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Consumer>
        );
    }
}

export default FormFilterButton;
