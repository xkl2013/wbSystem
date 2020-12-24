import React from 'react';
import { config } from '../config';
import styles from './styles.less';
import { transferAttr } from '@/components/airTable/component/baseComponent/_utils/transferAttr';
import Text from './text';

// 此方法为高阶组件,不应再render里面频繁调用,防止频繁实例化,带来性能上的浪费
/*
 *@params(type)  string    组件type
 *@return component
 */

export const getDetail = (type) => {
    const NodeObj = config[type] || {};
    const Detail = NodeObj.detail || Text; //  默认文本类型
    if (!NodeObj.detail) {
        console.warn(`${NodeObj.name}---详情组件暂未定义,默认使用文本类型`);
    }
    return class extends React.PureComponent {
        render() {
            const {
                columnConfig: { columnAttrObj, columnType },
                value,
            } = this.props;
            const newProps = {
                ...(NodeObj.componentAttr || {}),
                ...(columnAttrObj || {}),
            };
            const transferColumn = transferAttr(columnType, newProps);

            return (
                <div className={styles.container}>
                    <Detail
                        {...this.props}
                        componentAttr={transferColumn}
                        formatter={NodeObj.getFormatter}
                        value={value}
                        onChange={this.onChange}
                    />
                </div>
            );
        }
    };
};
export default getDetail;
