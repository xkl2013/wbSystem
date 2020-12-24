import React, { Component } from 'react';
import BIInputNumber from '@/ant_components/BIInputNumber';
import BIModal from '@/ant_components/BIModal';
import styles from './styles.less';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            cellData: [],
        };
    }

    componentDidMount() {
        const { value, cellData } = this.props;
        this.setState({
            value,
            cellData,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { value, cellData } = this.props;
        if (JSON.stringify(nextProps.value) !== JSON.stringify(value)) {
            this.setState({
                value: nextProps.value,
            });
        }
        if (JSON.stringify(nextProps.cellData) !== JSON.stringify(cellData)) {
            this.setState({
                cellData: nextProps.cellData,
            });
        }
    }

    onChange = (changedValue) => {
        this.setState({
            value: changedValue,
        });
    };

    resetValue = () => {
        const { cellData } = this.state;
        this.setState({
            value: cellData.length > 0 ? cellData[0].value : undefined,
            cellData,
        });
    };

    onBlur = (e) => {
        // 该值为inputNumber onBlur处理过的数据，保证为数字类型
        const value = e.target.value;
        const {
            onChange,
            floatRange,
            columnConfig: { columnChsName },
            rowId,
        } = this.props;
        const { cellData } = this.state;
        const originValue = Array.isArray(cellData) && cellData.length > 0 ? cellData[0].value : undefined;
        // 检测浮动条件：编辑时，有浮动标记，原值不为0
        if (rowId && floatRange && originValue && Number(originValue) !== 0) {
            // 新值默认取0只用于计算，对应清空操作
            const changedValue = value || 0;
            const range = Math.abs(Number(changedValue) - Number(originValue)) / Number(originValue);
            if (Number(range) > Number(floatRange)) {
                const confirm = BIModal.confirm({
                    title: '确认提示',
                    content: `${columnChsName}变更浮动较大，是否确认提交？`,
                    onOk: () => {
                        onChange(value, true);
                    },
                    onCancel: () => {
                        this.resetValue();
                        confirm.destroy();
                    },
                });
                return;
            }
        }
        if (Number(originValue) !== Number(value)) {
            onChange(value, true);
        }
    };

    render() {
        const { value } = this.state;
        return (
            <div className={styles.container}>
                <BIInputNumber {...this.props} onChange={this.onChange} onBlur={this.onBlur} value={value} />
            </div>
        );
    }
}
