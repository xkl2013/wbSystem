import React, { Component } from 'react';
import { fromJS, List, is } from 'immutable';
import { Popover } from 'antd';
import classnamse from 'classnames';
import Button from '@/ant_components/BIButton';
import SearchView from '@/submodule/components/SearchView';
import filterIcon from '@/assets/airTable/filter.png';
import { checkoutVisible } from '../_utils';
import SettingPanel from './hide';
import styles from './styles.less';

/**
 * 操作栏过滤条件控制
 * 参数
 * @filterValues        已有的过滤条件
 * @filterColumnConfig  可以过滤的配置项
 * @onChange            变化回调
 * @hideSettingPanel    设置过滤条件
 * @conditions          全量条件数据
 * @openSettingPanel     打开设置变量看板
 * @closeSettingPanel    关闭设置变量看板
 * @selectedConditions   已选择条件数据
 *
 */
export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchForm: props.searchForm || {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { searchForm } = this.props;
        const x1 = fromJS(searchForm);
        const x2 = fromJS(nextProps.searchForm);
        if (!is(x1, x2)) {
            this.setState({
                searchForm: nextProps.searchForm,
            });
        }
    }

    toggleOption = (bol) => {
        // 每次打开是更新数据
        if (bol && this.props.getSearchCols) {
            this.props.getSearchCols();
        }
        this.props.toggleOption(bol);
    };

    // 重置
    resetFilterItem = () => {
        this.setState({
            filterConfig: [{}],
        });
        this.onChange([]);
    };

    // 改变筛选条件
    changeFilterKey = (index, value) => {
        const { filterConfig } = this.state;
        const { filterColumnConfig } = this.props;
        const filter = filterColumnConfig.find((item) => {
            return item.key === value;
        });
        const data = {
            colName: value,
            colChsName: filter.title,
            operationCode: filter.operator && filter.operator[0] && filter.operator[0].id,
            colValues: undefined,
        };
        const temp = List(filterConfig)
            .splice(index, 1, data)
            .toJS();
        this.setState({
            filterConfig: temp,
        });
    };

    // 回调表格更改操作栏方法
    onChange = (props, changedValues) => {
        const { searchForm } = this.state;
        this.setState({ searchForm: { ...searchForm, ...changedValues } });
    };

    onOk = () => {
        const { searchForm } = this.state;
        const { conditions = [], originConditions } = this.props;
        const x1 = fromJS(this.state.searchForm);
        const x2 = fromJS(this.props.searchForm);
        if (!is(x1, x2) && this.props.updateParams) {
            const params = originConditions.map((ls) => {
                const obj = conditions.find((item) => {
                    return item.fieldName === ls.fieldName;
                }) || {};
                return {
                    ...ls,
                    fieldValueDto:
                        obj.getFormat && searchForm[ls.fieldName] ? obj.getFormat(searchForm[ls.fieldName]) : [],
                };
            });
            this.props.updateParams(params);
        } else {
            this.toggleOption(false);
        }
    };

    onReset = () => {
        const { searchForm } = this.state;
        const obj = {};
        Object.keys(searchForm).forEach((ls) => {
            obj[ls] = undefined;
        });
        this.setState({ searchForm: obj });
    };

    getConditionsLen = () => {
        const { conditions = [] } = this.props;
        return conditions.filter((ls) => {
            if (ls.fieldName === 'QZSJ') {
                return (
                    checkoutVisible(ls)
                    && ls.fieldValueDto
                    && Array.isArray(ls.fieldValueDto)
                    && (ls.fieldValueDto || []).filter((item) => {
                        return item.value;
                    }).length > 0
                );
            }
            return (
                checkoutVisible(ls)
                && ls.fieldValueDto
                && Array.isArray(ls.fieldValueDto)
                && (ls.fieldValueDto[0] || {}).value
            );
        });
    };

    // 渲染搜索栏
    renderSearchForm = () => {
        const { conditions = [] } = this.props;
        const { searchForm = {} } = this.state;
        const selectedConditions = conditions.filter((ls) => {
            return ls.visible;
        });
        if (selectedConditions === null || selectedConditions.length <= 0) return null;
        return (
            <SearchView
                modal="modal"
                searchForm={searchForm}
                searchCols={selectedConditions}
                search={this.search}
                onChangeParams={this.onChange}
            />
        );
    };

    renderContent = () => {
        const { hideSettingPanel } = this.props;
        return (
            <div className={styles.optionsModal}>
                <div className={styles.content}>{this.renderSearchForm()}</div>
                <div className={styles.btns}>
                    <div role="presentation" className={styles.addFilterBtn}>
                        {hideSettingPanel ? null : <SettingPanel {...this.props} />}
                    </div>
                    <div className={styles.handleBtn}>
                        <Button className={classnamse(styles.btn, styles.resetBtn)} onClick={this.onReset}>
                            重置
                        </Button>
                        <Button className={classnamse(styles.btn, styles.okBtn)} onClick={this.onOk} type="primary">
                            确认
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    renderOpenBtn = () => {
        if (this.props.renderOpenBtn && typeof this.props.renderOpenBtn === 'function') {
            return this.props.renderOpenBtn();
        }
        const length = (this.getConditionsLen() || []).length;
        const background = length > 0 ? 'rgba(247,181,0,0.1)' : '';
        return (
            <div className={styles.operateContainer} style={{ background }}>
                <img alt="" className={styles.operateIcon} src={filterIcon} />
                <span className={styles.operateName}>{length > 0 ? `${length}条筛选` : '筛选'}</span>
            </div>
        );
    };

    render() {
        return (
            <Popover
                overlayClassName={styles.popover}
                placement="bottomLeft"
                title="筛选条件"
                content={this.renderContent()}
                visible={this.props.visible}
                onVisibleChange={this.toggleOption}
                trigger="click"
            >
                {this.renderOpenBtn()}
            </Popover>
        );
    }
}
