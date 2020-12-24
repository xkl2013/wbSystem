import React from 'react';
import { Icon } from 'antd';
import { toChinesNum } from '@/utils/utils';
import ChooseBox from './chooseBox';
import RenderSearch from './search';
import styles from './styles.less';

interface Props {
    onChange?: Function,
    value?: any,
    length?: number,        // 选择数量
    instanceName?: string,   // 实体名称
    request?: Function,
}
interface State {
    value: any[] | undefined,
    length?: number,    // 选择数据的数据
}
export default class DropDown extends React.Component<Props, State> {
    state: State = {
        value: [],
    }
    public componentDidMount() {
        this.initUser(this.props.value);

    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initUser(nextProps.value);
        }
    }
    public initUser = (data = []) => {
        const newData = data.map((item: any, index: number) => {
            return { ...item }
        });
        this.setState({ value: newData })
    }
    onCheckIndex = (obj: any) => {
        const value = this.state.value || [];
        return value.findIndex((ls: any) => String(ls.id) === String(obj.id));
    }
    private willChange = (data: any, originValue = this.state.value) => {
        let value = originValue || [];
        const length = this.props.length;
        const index = this.onCheckIndex(data);
        if (index >= 0) {
            value.splice(index, 1)
        } else {
            length === value.length && value.splice(0, 1);
            value = [...value, data];
        }
        return value
    }
    public onChange = (data: any, obj: any) => {
        const value = this.willChange(data);
        if (this.props.onChange) {
            this.props.onChange(value, obj);
        }
        this.setState({ value });
    }
    public remove = (obj: any) => {
        const { value = [] } = this.state;
        const index = value.findIndex((item: any) => item.id === obj.id);
        index >= 0 && value.splice(index, 1);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({ value });
    }
    public removeAll = () => {
        if (this.props.onChange) {
            this.props.onChange([]);
        }
        this.setState({ value: [] });
    }
    public render() {
        const value = this.state.value || [];
        return (
            <div className={styles.panleContainer}>
                <div className={styles.leftBox}>
                    <div className={styles.searchBox}>
                        <RenderSearch
                            instanceName={this.props.instanceName}
                            value={value}
                            onChange={this.onChange}
                            request={this.props.request}
                        />
                    </div>


                </div>
                <div className={styles.maddleSplit}><Icon type="right" style={{ fontSize: '16px' }} /></div>
                <div className={styles.rightBox}>
                    <div className={styles.rightBoxHeader}>
                        <span className={styles.chooseTitle}>已选择{this.props.instanceName || ''}({this.props.length ? value.length + '/' + this.props.length : value.length})</span>
                        <span className={styles.chooseClear} onClick={this.removeAll}>清空</span>
                    </div>
                    <div className={styles.chooseBox}>
                        <ChooseBox userData={value} remove={this.remove} />
                    </div>

                </div>

            </div>
        )
    }
}
