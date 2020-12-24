import styles from '../index.less';
import { THROW_PLATFORM, THROW_CHANNEL, THROW_TYPE_TOTAL, THROW_STATUS } from '@/utils/enum';

import { getOptionName } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import moment from 'moment';
import AuthButton from "@/components/AuthButton";
import { DATETIME_FORMAT,DATE_FORMAT } from '@/utils/constants';

// 获取table列表头
export function columnsFn(props) {

    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            render: (text, record, index) => index + 1
        },
        {
            title: '推广日期',
            dataIndex: 'popularizeDate',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            }
        },
        {
            title: '推广内容',
            dataIndex: 'popularizeContent',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>
            }
        },
        {
            title: 'Talent账号',
            dataIndex: 'talentAccountName',
            render: (text,record) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(`${text}(${getOptionName(THROW_PLATFORM, record.accountPlatform)})`)}</span>
            }
        },
        {
            title: '投放渠道',
            dataIndex: 'putChannel',
            render: (text) => {
                return getOptionName(THROW_CHANNEL, text);
            }
        },
        {
            title: '投放类型',
            dataIndex: 'putType',
            render: (text) => {
                return getOptionName(THROW_TYPE_TOTAL, text);
            }
        },
        {
            title: '投放金额',
            dataIndex: 'putAmount',
        },
        {
            title: '涨粉量',
            dataIndex: 'autoFansUpCount',
        },
        {
            title: '单位粉丝成本(元)',
            dataIndex: 'autoFansPrice',
            render: t => (t && t >= 0) ? t.toFixed(2) : ''
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/talentManage/throwManage/detail">
                            <span className={styles.btnCls}
                                onClick={() => props.checkData(record.id)}> 查看</span>
                        </AuthButton>
                    </div>
                );
            },
        },

    ];
    return columns || [];
}
