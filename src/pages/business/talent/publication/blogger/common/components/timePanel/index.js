import React from 'react';
import moment from 'moment';
import { TimePicker, message } from 'antd';
import classnames from 'classnames';
import styles from './styles.less';

class TimePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
            dates: [],
            startTime: null,
            endTime: null,
        };
        this.dateNodes = null;
    }

    componentDidMount() {
        this.initValue();
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(JSON.stringify(nextProps.value), JSON.stringify(this.props.value))
    //     if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
    //         this.initValue(nextProps.value);
    //     }
    // }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.value)) {
            return {
                value: Array.isArray(nextProps.value) ? nextProps.value : [],
            };
        }
        return null;
    }

    initValue = (val = this.state.value) => {
        const newValue = Array.isArray(val) ? val : [];
        const dates = [];
        let startTime = null;
        let endTime = null;
        newValue.forEach((ls, index) => {
            const date = ls ? moment(ls).date() : null;
            startTime = index === 0 && ls ? moment(ls) : startTime;
            endTime = index === 1 && ls ? moment(ls) : endTime;
            dates.push(date);
        });
        this.setState({ dates, startTime, endTime });
    };

    chooseDate = (num) => {
        let { dates, startTime, endTime } = this.state;
        if (this.state.dates.length >= 2) {
            dates = [];
            startTime = null;
            endTime = null;
        }
        if (dates[0] && dates[0] > num) {
            dates.unshift(num);
        } else {
            dates.push(num);
        }

        this.setState({ dates, startTime, endTime }, this.onChange);
    };

    renderCell = () => {
        const { dates } = this.state;
        const tds = [];
        for (let i = 0; i < 31; i += 1) {
            const td = (
                <td className={styles.td} key={i}>
                    <div
                        className={classnames(styles.cell, dates.includes(i + 1) ? styles.selectedCell : '')}
                        onClick={this.chooseDate.bind(this, i + 1)}
                    >
                        {i + 1}
                    </div>
                </td>
            );
            tds.push(td);
        }
        return [0, 1, 2, 3, 4].map((ls) => {
            return (
                <tr className={styles.tr} key={ls}>
                    {tds.slice(ls * 7, (ls + 1) * 7).map((item) => {
                        return item;
                    })}
                </tr>
            );
        });
    };

    onStartChange = (startTime) => {
        const { dates } = this.state;
        if (dates.length < 1) {
            message.warn('请选择解锁日期');
            return;
        }
        this.setState({ startTime }, this.onChange);
    };

    onEndChange = (endTime) => {
        const { dates } = this.state;
        if (dates.length !== 2) {
            message.warn('请选择解锁日期');
            return;
        }
        this.setState({ endTime }, this.onChange);
    };

    formatValue = ({ startTime, endTime, dates }) => {
        const startTimeStr = startTime ? startTime.format('HH:mm:00') : '00:00:00';
        const endTimeStr = endTime ? endTime.format('HH:mm:00') : '23:59:59';
        const value = dates.map((ls, index) => {
            if (ls) {
                let formateStr = `YYYY-MM-${ls >= 10 ? ls : `0${ls}`}`;
                formateStr = index === 0 && startTime ? `${formateStr} ${startTimeStr}` : formateStr;
                formateStr = index === 1 && endTimeStr ? `${formateStr} ${endTimeStr}` : formateStr;
                return moment().format(formateStr);
            }
        });
        return value;
    };

    onChange = () => {
        const { startTime, endTime, dates } = this.state;
        let value = this.formatValue({ startTime, endTime, dates });
        value = value.sort((a, b) => {
            return moment(a).valueOf() - moment(b).valueOf();
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({ value });
    };

    render() {
        const { value, dates } = this.state;
        this.dateNodes = this.renderCell();
        return (
            <div className={styles.wrp}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <tbody className={styles.tbody}>{this.dateNodes}</tbody>
                    </table>
                </div>

                {dates[0] ? (
                    <span className={styles.dateNum}>
                        {dates[0] >= 10 ? dates[0] : `0${dates[0]}`}
日
                    </span>
                ) : null}
                <TimePicker
                    className={styles.timePicker}
                    value={value[0] ? moment(value[0]) : null}
                    format="HH:mm"
                    placeholder="Start"
                    allowClear={false}
                    onChange={this.onStartChange}
                />
                <span className={styles.split}>~</span>
                {dates[1] ? (
                    <span className={styles.dateNum}>
                        {dates[1] >= 10 ? dates[1] : `0${dates[1]}`}
日
                    </span>
                ) : null}
                <TimePicker
                    className={styles.timePicker}
                    value={value[1] ? moment(value[1]) : null}
                    format="HH:mm"
                    placeholder="End"
                    allowClear={false}
                    onChange={this.onEndChange}
                />
            </div>
        );
    }
}
export default TimePanel;
