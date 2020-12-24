/* eslint-disable */

import React from 'react';
import { Collapse } from 'antd';
import styles from './index.less';
import IconFont from '@/components/CustomIcon/IconFont';
import AssociationSearch from '@/components/associationSearch';
import AdvancedSearchItem from '@/components/AdvancedSearchItem';

class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.advancedItem = React.createRef();
        this.state = {
            collapseStatus: false,
            advancedTerm: [
                {
                    label: null,
                    value: null,
                },
            ],
            advancedForm: [
                {
                    type: [],
                    field: [],
                    advancedType: '',
                },
            ],
        };
    }

    // TODO: 切换筛选类型
    onChangeType = () => {
        // TODO: 清空筛选条件
    };

    // 切换筛选条件
    onChangeTerm = (data) => {
        this.setState({
            advancedForm: data,
        });
    };

    // 添加筛选条件
    addTerm() {
        const { advancedForm } = this.state;
        const result = advancedForm;
        result.push({
            type: [],
            field: [],
            advancedType: '',
        });
        this.setState({
            advancedForm: result,
        });
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
            <Collapse bordered={false} defaultActiveKey={['1']}>
                <Collapse.Panel
                    key="1"
                    style={{ border: 'none', paddingBottom: '20px' }}
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
                    <div>
                        {/* 审批事项 */}
                        {approval && (
                            <div>
                                <div className={styles.termLine}>
                                    <div className={styles.termLabel}>审批事项:</div>
                                    <div className={styles.termCont}>
                                        <AssociationSearch placeholder="请选择审批事项" className={styles.termHead} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* 搜索字段 */}
                        <div>
                            <div className={styles.termLine}>
                                <div className={styles.termLabel}>搜索字段:</div>
                                <div className={styles.termCont}>
                                    <AdvancedSearchItem
                                        ref={this.advancedItem}
                                        advancedForm={advancedForm}
                                        onChangeTermFn={this.onChangeTerm}
                                    />
                                </div>
                            </div>
                            <span
                                className={styles.btnAddTerm}
                                onClick={() => {
                                    return this.addTerm();
                                }}
                            >
                                <IconFont type="iconxinzeng" className={styles.btnAddTermIcon} />
                                添加
                            </span>
                        </div>
                    </div>
                </Collapse.Panel>
            </Collapse>
        );
    }
}
export default AdvancedSearch;
