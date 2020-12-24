import React from 'react';
import { Radio } from 'antd';
import moment from 'moment';
// import closeIcon from '@/assets/airTable/close.png';
// import { mergeFilter } from '@/utils/utils';
// import s from '@/pages/business/live/session/index.less';

const options = [
    { label: '今日新增', value: '1' },
    { label: '三日新增', value: '3' },
    { label: '一周新增', value: '7' },
];
export const getTimeOption = (type) => {
    let time = 0;
    const format = 'YYYY-MM-DD 00:00:00';
    const curTime = moment().format('YYYY-MM-DD HH:mm:ss');
    switch (Number(type)) {
        case 1:
            // 今日凌晨到当前时间
            time = moment().format(format);
            break;
        case 2:
            // 两天前凌晨到当前时间，作为三天
            time = moment()
                .subtract(2, 'days')
                .format(format);
            break;
        case 3:
            // 六天前凌晨到当前时间，作为一周
            time = moment()
                .subtract(6, 'days')
                .format(format);
            break;
        default:
            break;
    }
    if (time <= 0) {
        return;
    }
    return [
        {
            colChsName: '报名时间',
            colName: 'createTime',
            colValues: [{ text: time, value: time }],
            operationCode: 'GREATER_THAN_OR_EQUAL',
        },
        {
            colChsName: '报名时间',
            colName: 'createTime',
            colValues: [{ text: curTime, value: curTime }],
            operationCode: 'LESS_THAN',
        },
    ];
};
const FilterCreateTime = (props) => {
    const { onSearch, value, className } = props;

    // const [value, setValue] = useState('');
    // useEffect(() => {
    //     const minValue =
    //         filters &&
    //         filters.find((item) => {
    //             return item.colName === 'createTime' && item.operationCode === 'GREATER_THAN_OR_EQUAL';
    //         });
    //     const maxValue =
    //         filters &&
    //         filters.find((item) => {
    //             return item.colName === 'createTime' && item.operationCode === 'LESS_THAN';
    //         });
    //     if (minValue && maxValue) {
    //         const x = moment(maxValue.colValues[0].value).diff(moment(minValue.colValues[0].value), 'days', true);
    //         if (x >= 0 && x < 1) {
    //             setValue('1');
    //         } else if (x >= 1 && x < 3) {
    //             setValue('2');
    //         } else if (x >= 3 && x < 7) {
    //             setValue('3');
    //         }
    //     } else {
    //         setValue('');
    //     }
    // }, [filters]);
    // const onChangeFilter = (filterOps) => {
    //     if (typeof onSearch === 'function') {
    //         const newFilters = mergeFilter(filters, { createTime: filterOps });
    //         const payload = [{ type: 'filterConfig', config: newFilters }];
    //         onSearch(payload);
    //     }
    // };
    // const onChange = (e) => {
    //     const filterOps = getTimeOption(e.target.value);
    //     onChangeFilter(filterOps);
    // };
    // const onClick = () => {
    //     onChangeFilter([]);
    // };
    const onChange = (e) => {
        onSearch(e.target.value);
    };
    const onClear = (e) => {
        if (e.target.value === value) {
            onSearch('');
        }
    };

    // return (
    //     <div className={className}>
    //         <Radio.Group options={options} onChange={onChange} value={value} />
    //         <img className={s.closeIcon} alt="" src={closeIcon} onClick={onClick} />
    //     </div>
    // );
    return (
        <div className={className}>
            <Radio.Group onChange={onChange} value={value}>
                {options.map((item) => {
                    return (
                        <Radio key={item.value} value={item.value} onClick={onClear}>
                            {item.label}
                        </Radio>
                    );
                })}
            </Radio.Group>
        </div>
    );
};
export default FilterCreateTime;
