import React from 'react';
import s from './index.less';
import { antiAssign } from '../../../../utils/utils';

interface Props {
    onEmitChange: Function;
    tableId: string | number;
}
interface State {
    value: any;
    option: any;
    propsValue: any;
}
export default function CellContainer<P extends Props>(Comp) {
    return class extends React.Component<P & Props, State> {
        container: any;
        constructor(props) {
            super(props);
            this.state = {
                propsValue: props.value, // 组件的原值
                value: props.value, // 组件的值
                option: undefined, // 选择项
            };
            this.container = React.createRef();
        }
        // 编辑单元格实时更新
        // static getDerivedStateFromProps(nextProps: any, prevState: any) {
        //     if (JSON.stringify(prevState.propsValue) !== JSON.stringify(nextProps.value)) {
        //         return {
        //             propsValue: nextProps.value,
        //             value: nextProps.value,
        //         };
        //     }
        //     return null;
        // }
        componentDidMount(): void {
            document.addEventListener('click', this.onBlur, false);
        }
        componentWillUnmount(): void {
            document.removeEventListener('click', this.onBlur, false);
        }
        changeValue = (value: any, option: any) => {
            this.setState({ value, option });
        };
        onBlur = (e: any) => {
            const { tableId, onEmitChange } = this.props;
            const { value, option } = this.state;
            const doms = document.querySelectorAll(`.cellUnit.table_${tableId}`);
            let editing = false;
            if (doms) {
                for (let i = 0; i < doms.length; i++) {
                    // 检测当前是否有编辑中的组件，没有则重置编辑框（因业务需求，可能直接删除掉当前编辑单元格的编辑状态）
                    if (doms[i].getAttribute('data-editing-cell') === '1') {
                        editing = true;
                        break;
                    }
                }
            }
            if (!editing) {
                if (typeof onEmitChange === 'function') {
                    onEmitChange(value, option, 1);
                }
                return;
            }

            let currTarget = e.target;
            while (currTarget && currTarget != document) {
                let editing = currTarget.getAttribute('data-editing-cell');
                // 当前点击div是正在编辑的cell时，阻止修改回调
                if (editing === '1') {
                    return;
                }
                currTarget = currTarget.parentNode;
            }
            if (typeof onEmitChange === 'function') {
                onEmitChange(value, option);
                // 清除所有dom的编辑状态
                if (doms) {
                    doms.forEach((item) => {
                        item.setAttribute('data-editing-cell', '0');
                    });
                }
            }
        };

        render() {
            const selfProps = antiAssign(this.props, ['onEmitChange', 'onChange', 'value']);
            const { value } = this.state;
            // cellContainer默认将组件中的全局弹框挂载到当前cell上
            return (
                <div className={s.container} ref={this.container}>
                    <Comp
                        {...selfProps}
                        value={value}
                        onChange={this.changeValue}
                        getPopupContainer={() => {
                            return this.container.current;
                        }}
                        getCalendarContainer={() => {
                            return this.container.current;
                        }}
                    />
                </div>
            );
        }
    };
}
