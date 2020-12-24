import React from 'react';
import moment from 'moment';
import { Tree, message, Tooltip, Popover } from 'antd';
// import BIModal from '@/ant_components/BIModal';
import { renderTxt } from '@/utils/hoverPopover';
import IconFont from '@/components/CustomIcon/IconFont';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import AddSubTask from './addSubTask';
import { addSchedule } from '../../../services';
import { fetchCardFinishflagStatus } from './_utils';
import styles from './index.less';

const { TreeNode } = Tree;
/*
 *  @props(modeType)  组件内建属性,用于判断组件被使用的场景(add,edit,detail)
 *
 */

class SubTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: [],
            checkedChildKeys: [],
            loading: false,
            treeData: props.treeData || [],
            popoverVisible: false, // 新增子模块弹框显隐
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.treeData) !== JSON.stringify(this.props.treeData)) {
            const newData = nextProps.treeData;
            const checkedKeys = [];
            newData.forEach((item) => {
                if (item.finishFlag) checkedKeys.push(item.id);
            });
            this.setState({ treeData: nextProps.treeData, checkedKeys });
        }
    }

    // 默认选中项
    getInitChildKeys = (arr) => {
        if (Array.isArray(arr)) {
            arr.forEach((item) => {
                if (item.finishFlag) this.state.checkedKeys.push(item.id);
                this.getInitChildKeys(item.scheduleWriteVoList);
            });
        }
        return Array.from(new Set(this.state.checkedKeys));
    };

    getChildKeys = (arr) => {
        if (Array.isArray(arr)) {
            arr.forEach((item) => {
                this.state.checkedChildKeys.push(item.id);
                this.getChildKeys(item.scheduleWriteVoList);
            });
        }
        return Array.from(new Set(this.state.checkedChildKeys));
    };

    /*
     * 此方法用于编辑模式下判断是否可点击完成,
     */
    onCheck = async (checkedKeys, data) => {
        // 选中状态：把当前以及子级都选中,且调用接口，直接修改完成状态，取消选中：仅取消本级选中，并改成未完成状态
        // const { modeType } = this.props;
        // let childKeys = [];
        // if (data.checked) {
        //     data.checkedNodes.forEach((list) => {
        //         if (list.key === data.node.props.eventKey) {
        //             this.state.checkedChildKeys = [];
        //             childKeys = this.getChildKeys(list.props.scheduleWriteVoList);
        //         }
        //     });
        // }
        const { getData, getDetailData, paramsObj = {} } = this.props;
        const { id } = paramsObj;
        const params = {
            currentId: Number(data.node.props.eventKey),
            status: data.checked ? 1 : 0,
            callBack: () => {},
        };
        // if (modeType === 'detail') {
        params.callBack = () => {
            getData();
            getDetailData({ id });
        };
        await fetchCardFinishflagStatus(params);
        // return;
        // }
        // const isCheck = await fetchFinishflagStatus(params);
        // childKeys = Array.from(new Set(childKeys.concat(checkedKeys.checked)));
        // if (isCheck) this.setState({ checkedKeys: childKeys });
    };

    // 点击进入子任务详情
    onSelect = (item) => {
        const { goChildModal } = this.props;
        // if (goChildModal) {
        //     if (paramsObj.detailType === 'editPage') {
        //         BIModal.confirm({
        //             title: '是否放弃当前任务编辑信息？',
        //             autoFocusButton: null,
        //             onOk: () => {
        //                 goChildModal(Number(item.id));
        //             },
        //         });
        //     } else {
        goChildModal(Number(item.id));
        // }
        // }
    };

    // 数组对象增加字段
    addWords2Arr = (arr = []) => {
        const newArr = arr;
        newArr.forEach((item, i) => {
            const newItem = { ...item };
            newItem.avatar = item.memberAvatar;
            newItem.userId = item.memberId;
            newItem.userName = item.memberName;
            newArr[i] = newItem;
        });
        return newArr;
    };

    // 负责人
    showPeoArr = (data) => {
        const memberType1 = data.scheduleMemberList.filter((ls) => {
            return ls.memberType === 1;
        });
        const memberType0 = data.scheduleMemberList.filter((ls) => {
            return ls.memberType === 0;
        });
        return memberType1 && memberType1.length ? this.addWords2Arr(memberType1) : this.addWords2Arr(memberType0);
    };

    renderTip = () => {
        return <p>截止日期</p>;
    };

    renderTitle = (item) => {
        const { paramsObj = {} } = this.props;
        const width = paramsObj.detailType === 'editPage' ? '230px' : '80px';
        const txtLeng = paramsObj.detailType === 'editPage' ? 20 : 4;
        const peoArr = this.showPeoArr(item);
        return (
            <div
                className={styles.titleWrap}
                onClick={() => {
                    this.onSelect(item);
                }}
            >
                <span style={{ width }} className={`${styles.nameCls} ${item.finishFlag ? styles.finishCls : ''}`}>
                    {renderTxt(item.scheduleName, txtLeng)}
                </span>
                <div className={styles.infoWrap}>
                    <div className={styles.iconWrap}>
                        <IconFont className={styles.iconCls} type="iconziduan-riqi" onClick={this.showDatePicker} />
                        {item.endTime ? (
                            <Tooltip placement="bottom" title={this.renderTip()}>
                                <span>{moment(item.endTime).format('MM月DD日')}</span>
                            </Tooltip>
                        ) : (
                            <span>无排期</span>
                        )}
                    </div>
                    <div className={styles.iconWrap}>
                        <NotifyNode hideBtn={true} reWriteCls data={this.props.renderNoticers(peoArr)} />
                    </div>
                </div>
            </div>
        );
    };

    renderTreeNodes = (data, editType) => {
        // const bol = editType !== 'editPage';
        return data.map((item) => {
            const bol2 = item.parentScheduleFinishFlag === 1;
            if (item.scheduleWriteVoList) {
                return (
                    <TreeNode
                        disabled={item.id === -1}
                        disableCheckbox={bol2}
                        {...item}
                        title={this.renderTitle(item)}
                        key={item.id}
                        dataRef={item}
                    >
                        {this.renderTreeNodes(item.scheduleWriteVoList, editType)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    disabled={item.id === -1}
                    disableCheckbox={bol2}
                    key={item.id}
                    {...item}
                    title={this.renderTitle(item)}
                />
            );
        });
    };

    addTask = (value = {}) => {
        const daterange = value.daterange || [];
        const { leadingCadre = [], participant = [], scheduleName, description, wholeDayFlag } = value;
        const [beginTime, endTime] = daterange
            .filter((ls) => {
                return ls;
            })
            .map((ls) => {
                return moment(ls).format('YYYY-MM-DD HH:mm:00');
            });
        const scheduleMemberList = [].concat(leadingCadre, participant);
        this.fetchData({
            beginTime,
            endTime,
            scheduleMemberList,
            scheduleName,
            description,
            wholeDayFlag,
        });
    };

    fetchData = async (obj = {}) => {
        const { getData, getDetailData, paramsObj = {} } = this.props;
        const { formData = {}, projectId, panelId, type, id } = paramsObj;
        // const { beginTime, endTime, dateRange, scheduleName, scheduleMemberList } = obj;

        // if (!scheduleName) {
        //     message.error('请输入子任务名称');
        //     return;
        // }
        // if (!dateRange) {
        //     message.error('请选择子任务起始时间');
        //     return;
        // }
        // const beginTime = moment(dateRange[0]).format('YYYY-MM-DD HH:mm:00');
        // const endTime = moment(dateRange[1]).format('YYYY-MM-DD HH:mm:00');
        const fetchParams = {
            type,
            ...obj,
            // beginTime,
            // endTime,
            // scheduleMemberList,
            // scheduleName,
            rootScheduleId: formData.rootScheduleId,
            parentScheduleId: id,
            scheduleType: '0',
            scheduleNoticeList: [
                {
                    timeIntervalFlag: 1,
                    noticeName: '不提醒',
                    noticeType: 0,
                },
            ],
            privateFlag: 1,
            finishFlag: 0,
            // schedulePriority: 1,
        };
        await this.setState({ loading: true });
        const response = await addSchedule(fetchParams, { panelId, projectId });
        if (response && response.success) {
            message.success('新增成功');
            this.setState({ popoverVisible: false });
            if (getData) getData();
            if (getDetailData) getDetailData({ id });
        }
        await this.setState({ loading: false });
    };

    render() {
        const { loading, treeData, checkedKeys, popoverVisible } = this.state;
        this.getInitChildKeys(treeData);
        const { paramsObj = {} } = this.props;
        return (
            <div className={styles.treeWrap}>
                <Popover
                    trigger={['click']}
                    placement="topRight"
                    visible={this.state.popoverVisible}
                    content={
                        !popoverVisible ? null : (
                            <AddSubTask
                                loading={loading}
                                fetchData={this.fetchData}
                                handleCancel={() => {
                                    this.setState({ popoverVisible: false });
                                }}
                                addTask={this.addTask}
                            />
                        )
                    }
                >
                    <IconFont
                        className={styles.addnewTask}
                        type="icontianjiabiaoqian"
                        onClick={() => {
                            this.setState({ popoverVisible: true });
                        }}
                    />
                </Popover>
                <Tree
                    checkable
                    checkStrictly={true}
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                >
                    {this.renderTreeNodes(treeData, paramsObj.detailType)}
                </Tree>
            </div>
        );
    }
}
export default SubTask;
