/*
 * @Author: your name
 * @Date: 2019-12-27 15:40:13
 * @LastEditTime : 2020-01-06 11:39:03
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/feeManage/apply/detail/ModalComponent.js
 */
import React, { Component } from 'react';
import BIInputNumber from '@/ant_components/BIInputNumber';

import modalfy from '@/components/modalfy';
import { thousandSeparatorFixed } from '@/utils/utils';

@modalfy
class CreateOrg extends Component {
    render() {
        const { inputChange, inputValue, pushDownNum } = this.props;
        const styles = {
            overall: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
            overallLine: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
            },
            pushDownLine: {
                display: 'block',
            },
            pushDownNum: {
                color: '#F7B500',
                fontSize: '16px',
                marginLeft: '5px',
                fontStyle: 'normal',
            },
        };
        return (
            <div style={styles.overall}>
                <p style={styles.overallLine}>
                    <span>
                        剩余下推额度为：
                        <i style={styles.pushDownNum}>
                            {thousandSeparatorFixed(pushDownNum)}
元
                        </i>
                    </span>
                </p>
                <p style={styles.overallLine}>
                    <span>请输入下推金额：</span>
                    <BIInputNumber
                        placeholder="请输入"
                        value={inputValue}
                        style={{ width: '100%' }}
                        min={0}
                        max={9999999999.99}
                        precision={2}
                        onChange={inputChange}
                    />
                </p>
                <p style={styles.overallLine}>
                    <span>下推后会生成对应的报销单，此操作不可逆，是否确认下推？</span>
                </p>
            </div>
        );
    }
}

export default CreateOrg;
