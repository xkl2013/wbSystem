import React from 'react';
import { Divider, message } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import Modal from '../_component/modal';
import styles from './styles.less';
import Header from './components/header';
import ScheduName from '../_component/scheduName';
import Member from '../_component/member';
import DatePacker from '../_component/dateRange';
import NoticeSetting from '../_component/scheduleNotice';
import TagList from '../_component/tag';
import Description from '../_component/description';
import Upload from '../_component/upload';
import Meeting from './components/meeting';
import { getOccupationMeeting } from '../services';
import { occupationStatus } from '../../../_enum';
/*
 * @props onRefresh   刷新数据
 * isEdit 用于判断是否是编辑页面
 *
 */
const changeEffect = (params = {}) => {
    let newParams = { ...params };
    // 当时间改变时清除会议室
    if ('beginTime' in params || 'endTime' in params || 'wholeDayFlag' in params) {
        newParams = { ...newParams, scheduleResource: null };
    }
    return newParams;
};
export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.dataSource || {},
            submitParams: props.dataSource || {},
            meetingList: [],
            // editType: 1, // 1只读,2禁用,3读写
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(prevState.dataSource)) {
            return {
                dataSource: nextProps.dataSource || {},
                submitParams: nextProps.dataSource || {},
            };
        }
        return null;
    }

    getMeetingList = async () => {
        const { endTime, beginTime, wholeDayFlag } = this.state.submitParams;
        if (!endTime) {
            message.warn('请选择时间');
            return;
        }
        let meetingList = [];
        const res = await getOccupationMeeting({ endTime, startTime: beginTime, wholeDayFlag });
        if (res && res.success) {
            const data = Array.isArray(res.data) ? res.data : [];
            meetingList = data.map((item) => {
                return {
                    ...item,
                    name: `${item.companyAddress}-${item.buildingLayer}-${item.name}`,
                    disabled: item.occupationStatus === occupationStatus.occupy.type,
                };
            });
        }
        this.setState({ meetingList });
    };

    onRefresh = (id) => {
        if (this.props.onRefresh) {
            this.props.onRefresh(id);
        }
    };

    onChange = (val = {}) => {
        let { submitParams } = this.state;
        submitParams = { ...submitParams, ...changeEffect(val) };
        this.setState({ submitParams }, this.updateDate);
    };

    addSchedule = () => {
        const { submitParams } = this.state;
        if (this.props.addSchedule) {
            this.props.addSchedule(submitParams);
        }
    };

    updateDate = () => {
        // 编辑页面进行实时保存
        if (this.props.isEdit && this.props.updateSchedule) {
            const { submitParams } = this.state;
            this.props.updateSchedule(submitParams);
        }
    };

    render() {
        const { dataSource, submitParams = {} } = this.state;
        const { isEdit, scheduleId } = this.props;
        return (
            <Modal
                ref={(dom) => {
                    this.comment = dom;
                }}
                scheduleId={scheduleId} // 使用原始scheduleId,减少评论组件渲染
                onCancel={this.props.onCancel}
                isEdit={isEdit}
                onOk={this.addSchedule}
                visible={true}
            >
                <div className={styles.wrap}>
                    <Header
                        isEdit={isEdit}
                        dataSource={dataSource}
                        onRefresh={this.onRefresh}
                        submitParams={submitParams}
                        onChange={this.onChange}
                        settingCallback={this.props.settingCallback}
                    />
                    <Divider style={{ margin: 0 }} />
                    <div className={styles.body}>
                        <div className={styles.item}>
                            <span className={styles.itemWrap}>
                                {/* 设置任务名称,任务状态 */}
                                <ScheduName submitParams={submitParams} onChange={this.onChange} isEdit={isEdit} />
                            </span>
                        </div>
                        {/* 设置负责人,参与人,只会人 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-ren" />
                            </span>
                            <span className={styles.itemWrap}>
                                <Member submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                        {/* 设置时间,全天,闹铃提示 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-riqi" />
                            </span>
                            <span className={styles.itemWrap}>
                                <DatePacker submitParams={submitParams} onChange={this.onChange} />
                                <NoticeSetting
                                    submitParams={submitParams}
                                    onChange={this.onChange}
                                    style={{ marginLeft: '20px' }}
                                />
                            </span>
                        </div>
                        {/* 设置会议室 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconhuiyishi" />
                            </span>
                            <span className={styles.itemWrap}>
                                <Meeting
                                    getMeetingList={this.getMeetingList}
                                    submitParams={submitParams}
                                    onChange={this.onChange}
                                    meetingList={this.state.meetingList}
                                />
                            </span>
                        </div>
                        {/* 设置tag */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconbiaoqian" />
                            </span>
                            <span className={styles.itemWrap}>
                                <TagList submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                        {/* 设置描述 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-duohangwenben" />
                            </span>
                            <span className={styles.itemWrap}>
                                <Description submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>

                        {/* 设置附件 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-fujian" />
                            </span>
                            <span className={styles.itemWrap}>
                                {/* 设置任务名称,任务状态 */}
                                <Upload submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
