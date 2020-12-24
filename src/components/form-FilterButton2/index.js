import React, { Component } from 'react';
import { message } from 'antd';
import Button from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import ChooseItem from '@/components/choose-Item2';
import styles from './styles.less';
import BIInput from '@/ant_components/BIInput';
import { setSift } from '@/services/comment';
import { getOptionName } from '@/utils/utils';
import { SIFT_TYPE } from '@/utils/enum';
/* eslint-disable react/sort-comp */
const searchIcon = 'https://static.mttop.cn/admin/sousuo.png';
class FormFilterButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creatSfitStatus: false,
            newSiftName: '',
            currentSiftNum: null,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentSiftNum: props.currentSiftNum,
        });
    }

    // 新建快捷筛选
    creatSiftTag() {
        const { chooseItems = [], siftDataArr = [] } = this.props;
        if (
            !chooseItems
            || !Array.isArray(chooseItems)
            || chooseItems.length === 0
            || chooseItems.filter((item) => {
                return item.value;
            }).length === 0
            || (chooseItems.filter((item) => {
                return item.value;
            }).length > 0
                && chooseItems.every((item) => {
                    return (
                        (Array.isArray(item.value) && item.value.length === 0) || Object.keys(item.value).length === 0
                    );
                }))
        ) {
            message.warn('已选条件为空！');
            return;
        }
        if (siftDataArr && Array.isArray(siftDataArr) && siftDataArr.length >= 6) {
            message.warn('最多可设置6个快捷筛选标签！');
            return;
        }

        this.setState({
            creatSfitStatus: true,
        });
    }

    // 关闭新建弹窗
    handleCancel = () => {
        this.setState({
            creatSfitStatus: false,
            newSiftName: '',
        });
    };

    // 新增标签
    addSiftTag(data) {
        let { newSiftName } = this.state;
        const { siftDataArr } = this.props;
        const siftData = this.formSiftTagData(siftDataArr);
        let siftNameSame = false;
        newSiftName = String(newSiftName).replace(/\s+/g, '');
        if (newSiftName === '') {
            message.warning('请填写快捷筛选名称！');
            return false;
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const iterator of siftData) {
            if (iterator.queryLabelName === newSiftName) {
                message.warning('该筛选名称已存在！');
                siftNameSame = true;
                return false;
            }
        }
        if (!siftNameSame) {
            const result = {
                queryLabelName: newSiftName,
                queryLabelStatus: 1,
                queryLabelValue: data,
            };
            siftData.push(result);
            this.updateTags(siftData);
        }
    }

    updateTags = async (siftData = []) => {
        const { siftCallBack } = this.props;
        const { creatSfitStatus } = this.state;
        const res = await setSift({
            businessType: getOptionName(SIFT_TYPE, window.location.pathname),
            queryLabelList: siftData,
        });
        if (res && res.success) {
            message.success('操作成功');
            if (siftCallBack) {
                siftCallBack();
            }
            if (creatSfitStatus) {
                this.handleCancel();
            }
        }
    };

    // 删除快捷筛选
    async removeSiftTag(index) {
        // 当前选中状态不允许删除,不需要考虑条件的重置
        const siftDataArr = this.props.siftDataArr || [];
        const data = siftDataArr.filter((item) => {
            return item.queryLabelId !== index;
        }) || [];
        this.updateTags(data);
    }

    // 格式化自定义标签
    formSiftTagData = (data) => {
        return data.map((item) => {
            return {
                queryLabelName: item.queryLabelName,
                queryLabelStatus: 0,
                queryLabelValue: item.queryLabelValue,
            };
        });
    };

    formChooseItem = (data) => {
        const DomArr = [];
        data.map((item) => {
            if (Array.isArray(item.value)) {
                item.value.map((cItem) => {
                    DomArr.push(
                        <span key={`${item.key}-${cItem.id}`} className={styles.chooseItems}>
                            {cItem.name}
                        </span>,
                    );
                });
            } else if (Object.prototype.toString.call(item.value) === '[object Object]') {
                DomArr.push(
                    <span key={`${item.key}-${item.value.id}`} className={styles.chooseItems}>
                        {item.value.name}
                    </span>,
                );
            } else {
                DomArr.push(
                    <span key={`${item.key}-${item.value.id}`} className={styles.chooseItems}>
                        {item.value}
                    </span>,
                );
            }
        });
        return DomArr;
    };

    onClickTag = (item) => {
        if (this.state.currentSiftNum === item.queryLabelId) {
            // 取消选中
            this.setState({ currentSiftNum: 0 });
            if (this.props.changeSearchForm) {
                this.props.changeSearchForm(0);
            }
        } else {
            // 选中
            this.setState({ currentSiftNum: item.queryLabelId });
            if (this.props.changeSearchForm) {
                this.props.changeSearchForm(item.queryLabelId);
            }
        }
    };

    // 格式化快捷筛选标签
    templateSift = (data) => {
        return data.map((item, index) => {
            return (
                <span
                    key={index}
                    className={this.state.currentSiftNum === item.queryLabelId ? styles.active : ''}
                    onClick={this.onClickTag.bind(this, item)}
                >
                    {item.queryLabelName}
                    {this.state.currentSiftNum === item.queryLabelId ? null : (
                        <i
                            className={styles.clear}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.removeSiftTag(item.queryLabelId);
                            }}
                        />
                    )}
                </span>
            );
        });
    };

    render() {
        const {
            chooseItems, onSubmit, onRemoveItem, onResert, searchForm, siftDataArr,
        } = this.props;
        const { creatSfitStatus } = this.state;
        return (
            <>
                {!creatSfitStatus ? null : (
                    <BIModal
                        visible={creatSfitStatus}
                        title="新建快捷筛选"
                        onOk={() => {
                            return this.addSiftTag(searchForm);
                        }}
                        onCancel={this.handleCancel}
                        width={500}
                    >
                        <dl className={styles.newSiftInfo} key={1}>
                            <dt>已选条件:</dt>
                            <dd>{this.formChooseItem(chooseItems)}</dd>
                        </dl>
                        <dl className={styles.newSiftInfo} key={2}>
                            <dt>筛选名称:</dt>
                            <dd>
                                <BIInput
                                    value={this.state.newSiftName}
                                    className={styles.searchCol}
                                    placeholder="请输入快捷筛选名称"
                                    maxLength={10}
                                    onChange={(event) => {
                                        this.setState({
                                            newSiftName: event.target.value,
                                        });
                                    }}
                                />
                            </dd>
                        </dl>
                    </BIModal>
                )}
                <dl className={`${styles.quickSift} ${siftDataArr.length > 0 ? styles.show : styles.hide}`}>
                    <dt>快捷筛选:</dt>
                    <dd>{this.templateSift(siftDataArr)}</dd>
                </dl>
                <div className={styles.formFooter}>
                    <div className={styles.chooseItem}>
                        <ChooseItem
                            params={chooseItems}
                            onChange={onRemoveItem.bind(this)}
                            creatSiftTag={this.creatSiftTag.bind(this)}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <Button type="primary" onClick={onSubmit.bind(this)} className={styles.btnCls}>
                            <img className={styles.searchIconCls} src={searchIcon} alt="查询" />
                            查询
                        </Button>
                        <span className={styles.resertButton}>
                            <Button onClick={onResert.bind(this)} className={styles.btnCls}>
                                重置
                            </Button>
                        </span>
                    </div>
                </div>
            </>
        );
    }
}

export default FormFilterButton;
