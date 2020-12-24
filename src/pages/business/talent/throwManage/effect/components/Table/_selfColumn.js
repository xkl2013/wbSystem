import { SEX_TYPE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import moment from 'moment';
import { DATETIME_FORMAT } from '@/utils/constants';

// 获取table列表头
export function columnsFn() {

    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: '账号',
            dataIndex: 'talentAccountName',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>
            }
        },
        {
            title: '粉丝数',
            dataIndex: 'currentFansNum',
            align: 'center'
        },
        {
            title: '投入金额(元)',
            dataIndex: 'putAmount',
            align: 'center',
        },
        {
            title: '推广次数',
            align: 'center',
            dataIndex: 'popularizeTimes',
        },
        {
            title: '涨粉量',
            align: 'center',
            dataIndex: 'totalAutoFansUpCount',

        },
        {
            title: '涨幅',
            align: 'center',
            dataIndex: 'totalAutoFansUpRate',
            render: d => d && `${(d*100).toFixed(2)}%`
        },
        {
            title: '单位粉丝成本(元)',
            dataIndex: 'autoFansPrice',
            align: 'center',
            render: t => (t && t >= 0) ? t.toFixed(2) : ''
        },

    ];
    return columns || [];
}
