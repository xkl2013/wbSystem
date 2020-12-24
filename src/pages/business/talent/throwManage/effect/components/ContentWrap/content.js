import React, { Component } from 'react';
import BISelect from '@/ant_components/BISelect';
import AssociationSearch from '@/components/associationSearch';
import BIDatePicker from '@/ant_components/BIDatePicker';
import { getTalentAccountList } from '@/services/globalSearchApi';
import moment from 'moment';
import { THROW_PLATFORM1 } from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import styles from './index.less';

export default class ContentWrap extends Component {
    constructor(props) {
        super(props);
        const date = new Date();
        const date1 = date.setDate(date.getDate() - 14);
        this.state = {
            accountPlatform: 1, // 账号平台（  1:微博 2:抖音 3:小红书 4:B站 5:快手）
            statisticsTimeFrom: `${moment(date1).format(DATE_FORMAT)} 00:00:00`, // 日期1
            statisticsTimeTo: `${moment(new Date()).format(DATE_FORMAT)} 23:59:59`, // 日期2
            talentAccountNo: '',
            countValue: undefined,
        };
    }

    componentDidMount() {
        this.props.getParam(this.state);
    }

    talentNameChange = (countValue) => {
        // talent 选择
        const talentAccountNo = countValue ? countValue.accountUuid : '';
        this.setState({
            talentAccountNo,
            countValue,
        });
        this.props.getParam({ ...this.state, talentAccountNo });
    };

    dateValueChange = (date) => {
        // 日期选择
        const statisticsTimeFrom = date[0] ? `${moment(date[0]).format(DATE_FORMAT)} 00:00:00` : undefined;
        const statisticsTimeTo = date[1] ? `${moment(date[1]).format(DATE_FORMAT)} 23:59:59` : undefined;
        this.setState({
            statisticsTimeFrom,
            statisticsTimeTo,
        });
        const { talentAccountNo, accountPlatform } = this.state;
        this.props.getParam({
            talentAccountNo,
            accountPlatform,
            statisticsTimeFrom,
            statisticsTimeTo,
        });
    };

    plantChange = (val) => {
        // 平台选择
        const { countValue, ...others } = this.state;
        this.setState({
            accountName: undefined,
            accountPlatform: Number(val),
        });
        this.props.getParam({ ...others, accountPlatform: Number(val) });
    };

    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    render() {
        const { title = '' } = this.props;
        const { countValue, accountPlatform, statisticsTimeFrom, statisticsTimeTo } = this.state;

        return (
            <div className={styles.wrap}>
                <div className={styles.titleWrap}>
                    <span className={styles.titleCls}>{title}</span>
                    <div className={styles.selectCls}>
                        <BISelect
                            placeholder="请选择账号平台"
                            onChange={this.plantChange}
                            value={String(accountPlatform)}
                            className={styles.associationSearch}
                        >
                            {THROW_PLATFORM1.map((option) => {
                                return (
                                    <BISelect.Option value={option.id} key={option.id}>
                                        {option.name}
                                    </BISelect.Option>
                                );
                            })}
                        </BISelect>
                        <AssociationSearch
                            className={styles.associationSearch}
                            allowClear={true}
                            request={(val) => {
                                return getTalentAccountList({
                                    pageNum: 1,
                                    pageSize: 100,
                                    accountName: val,
                                    platform: accountPlatform,
                                });
                            }}
                            initDataType="onfocus"
                            fieldNames={{
                                value: (val) => {
                                    return `${val.accountId}_${val.accountId}`;
                                },
                                label: 'accountName',
                            }}
                            value={countValue}
                            placeholder="请输入talent账号"
                            onChange={this.talentNameChange}
                        />
                        <BIDatePicker.BIRangePicker
                            className={styles.dateCls}
                            value={[statisticsTimeFrom, statisticsTimeTo].map((item) => {
                                return item ? moment(item) : undefined;
                            })}
                            disabledDate={this.disabledDate}
                            placeholder={['起始时间', '截止时间']}
                            onChange={this.dateValueChange}
                        />
                    </div>
                </div>
                <div className={styles.contentWrap}>{this.props.children}</div>
            </div>
        );
    }
}
