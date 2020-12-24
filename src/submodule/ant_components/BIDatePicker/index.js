import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import s from './style.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
moment.locale('zh-cn');
/*
 * DatePicker 组件
 *
 * 基于原 ant DatePicker
 * 只扩展自定义样式
 * */

class BIDatePicker extends React.PureComponent {
    render() {
        return (
            <span className="BIDatePicker">
                <DatePicker
                    {...this.props}
                    locale={zhCN}
                    suffixIcon={
                        <img className={s.suffixIconSingle} alt="" src="https://static.mttop.cn/admin/calendar.png" />
                    }
                />
            </span>
        );
    }
}

class BIRangePicker extends React.PureComponent {
    render() {
        return (
            <span className="BIDatePicker">
                <RangePicker
                    {...this.props}
                    locale={zhCN}
                    suffixIcon={
                        <img className={s.suffixIcon} alt="" src="https://static.mttop.cn/admin/calendar.png" />
                    }
                />
            </span>
        );
    }
}

class BIMonthPicker extends React.PureComponent {
    render() {
        return (
            <span className="BIDatePicker">
                <MonthPicker {...this.props} locale={zhCN} />
            </span>
        );
    }
}

class BIWeekPicker extends React.PureComponent {
    render() {
        return (
            <span className="BIDatePicker">
                <WeekPicker {...this.props} locale={zhCN} />
            </span>
        );
    }
}

BIDatePicker.BIMonthPicker = BIMonthPicker;
BIDatePicker.BIRangePicker = BIRangePicker;
BIDatePicker.BIWeekPicker = BIWeekPicker;
export { BIDatePicker as default };
