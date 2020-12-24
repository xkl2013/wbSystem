import React from 'react';
import { Collapse } from 'antd';
import styles from './index.less';
import IconFont from '@/components/CustomIcon/IconFont';
import BISelect from '@/ant_components/BISelect';
import BIInput from '@/ant_components/BIInput';

export default class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseStatus: false,
            advacedTerm: [
                {
                    key: null,
                    value: null,
                },
            ],
        };
    }

    // TODO: 切换筛选类型
    onChangeType = () => {
        // TODO: 清空筛选条件
    };

    // TODO: 切换筛选条件
    onChangeTerm = () => {
        // TODO: 抛出结果
    };

    // TODO: 删除筛选条件
    removeTerm = () => {};

    // TODO: 添加筛选条件
    addTerm() {
        const addItem = {
            key: null,
            value: null,
        };
        const { advacedTerm } = this.state;
        const result = [...advacedTerm, ...[addItem]];
        this.setState({
            advacedTerm: result,
        });
    }

    // 搜索字段render
    renderSearch = () => {
        const { advacedTerm } = this.state;
        const result = advacedTerm.map(() => {
            return (
                <div className={styles.termContext}>
                    <BISelect
                        showSearch
                        className={styles.termHead}
                        placeholder="请选择"
                        onChange={this.onChange}
                        onSearch={this.onSearch}
                    >
                        <BISelect.Option value="jack">Jack</BISelect.Option>
                        <BISelect.Option value="lucy">Lucy</BISelect.Option>
                        <BISelect.Option value="tom">Tom</BISelect.Option>
                    </BISelect>
                    <BIInput className={styles.termBody} placeholder="请填写搜索条件" />
                </div>
            );
        });
        return result;
    };

    // 隐藏区显隐
    changeCollapse() {
        const { collapseStatus } = this.state;
        this.setState({
            collapseStatus: !collapseStatus,
        });
    }

    render() {
        const { collapseStatus } = this.state;
        return (
            <Collapse bordered={false}>
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
                        <div>
                            <div className={styles.termLine}>
                                <div className={styles.termLabel}>审批事项:</div>
                                <div className={styles.termCont}>
                                    <BISelect
                                        showSearch
                                        className={styles.termHead}
                                        placeholder="请选择"
                                        onChange={this.onChange}
                                        onSearch={this.onSearch}
                                    >
                                        <BISelect.Option value="jack">Jack</BISelect.Option>
                                        <BISelect.Option value="lucy">Lucy</BISelect.Option>
                                        <BISelect.Option value="tom">Tom</BISelect.Option>
                                    </BISelect>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={styles.termLine}>
                                <div className={styles.termLabel}>搜索字段:</div>
                                <div className={styles.termCont}>{this.renderSearch()}</div>
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
