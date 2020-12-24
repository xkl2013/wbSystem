/*
 * @Author: CaiChuanming
 * @Date: 2020-02-09 21:38:05
 * @LastEditTime : 2020-02-09 23:00:29
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/submodule/components/SearchViewAdvanced/index.js
 */
/* eslint-disable */

import React from 'react';
import { Collapse } from 'antd';
import styles from './index.less';
import IconFont from '@/components/CustomIcon/IconFont';

class SearchViewAdvanced extends React.Component {
    constructor(props) {
        super(props);
        this.advancedItem = React.createRef();
        this.state = {
            collapseStatus: false,
        };
    }

    // 隐藏区显隐
    changeCollapse() {
        const { collapseStatus } = this.state;
        this.setState({
            collapseStatus: !collapseStatus,
        });
    }

    render() {
        const { approval } = this.props;
        const { collapseStatus, advancedForm } = this.state;
        return (
            <Collapse bordered={false}>
                <Collapse.Panel
                    key="1"
                    style={{ border: 'none' }}
                    showArrow={false}
                    header={
                        <div
                            className={styles.collapseTitle}
                            onClick={() => {
                                return this.changeCollapse();
                            }}
                        >
                            高级搜索
                            <IconFont
                                type="iconzhankaiicon"
                                className={`${styles.collapseIcon} ${collapseStatus ? styles.show : null}`}
                            />
                        </div>
                    }
                >
                    {this.props.children}
                </Collapse.Panel>
            </Collapse>
        );
    }
}
export default SearchViewAdvanced;
