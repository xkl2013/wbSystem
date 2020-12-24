import React from 'react';
// import moment from 'moment';
import { Form, Checkbox } from 'antd';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import SubmitButton from '@/components/SubmitButton';
import NotifyNode from '../../../../notifyNode';
// import BIButton from '@/ant_components/BIButton';
import storage from '@/utils/storage';
import avatar1 from '@/assets/avatar.png';
import { SPECIAL_DATETIME_FORMAT, DATE_FORMAT } from '@/utils/constants';
import { formItemLayout } from './_utils';
import { leadingCadreType, participantType } from '../../../../../_enum';
import styles from './index.less';

class AddTask extends React.Component {
    constructor(props) {
        super(props);
        const { userId, userName, avatar } = storage.getUserInfo();
        this.state = {
            peopleArr: [
                {
                    avatar: avatar || avatar1,
                    userId,
                    userName,
                    memberId: userId,
                    memberName: userName,
                    memberType: leadingCadreType,
                },
            ],
            wholeDayFlag: 0,
        };
    }

    changeWholeDayFlag = (val) => {
        // 修改全天需清除
        this.setState({ wholeDayFlag: Number(val.target.checked) });
    };

    fetchData = () => {
        const { dateRange, peopleArr, taskName } = this.state;
        this.props.fetchData({ dateRange, scheduleMemberList: peopleArr, scheduleName: taskName });
    };

    handleSubmit = (e) => {
        const { wholeDayFlag } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            if (this.props.addTask) this.props.addTask({ ...fieldsValue, wholeDayFlag });
        });
    };

    render() {
        const { peopleArr, wholeDayFlag } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.addTaskWrap}>
                <Form {...formItemLayout}>
                    <Form.Item label="任务名称:" className={styles.formItem}>
                        {getFieldDecorator('scheduleName', {
                            rules: [{ required: true, message: '请输入子任务名称' }],
                        })(<BIInput placeholder="请输入子任务名称" maxLength={300} />)}
                    </Form.Item>
                    <Form.Item label="起止日期:" className={styles.formItem}>
                        {getFieldDecorator('daterange')(
                            <BIDatePicker.BIRangePicker
                                style={{ width: '100%' }}
                                showTime={{ format: 'HH:mm', minuteStep: 15 }}
                                format={wholeDayFlag ? DATE_FORMAT : SPECIAL_DATETIME_FORMAT}
                                renderExtraFooter={() => {
                                    return (
                                        <Checkbox checked={Number(wholeDayFlag)} onChange={this.changeWholeDayFlag}>
                                            全天
                                        </Checkbox>
                                    );
                                }}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="任务详情:" className={styles.formItem}>
                        {getFieldDecorator('description')(<BIInput.TextArea maxLength={1000} />)}
                    </Form.Item>
                    <Form.Item label="负责人:" className={styles.formItem}>
                        {getFieldDecorator('leadingCadre', {
                            initialValue: peopleArr,
                        })(<NotifyNode renderItem={null} length={1} isShowClear memberType={leadingCadreType} />)}
                    </Form.Item>
                    <Form.Item label="参与人:" className={styles.formItem}>
                        {getFieldDecorator('participant')(<NotifyNode memberType={participantType} />)}
                    </Form.Item>
                    <div className={styles.buttonWrap}>
                        <BIButton onClick={this.props.handleCancel} className={styles.btnCls}>
                            取消
                        </BIButton>
                        <SubmitButton
                            onClick={this.handleSubmit}
                            type="primary"
                            className={styles.btnCls}
                            // loading={loading}
                        >
                            确认
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }
}

const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(AddTask);

export default WrappedTimeRelatedForm;
