// 此类提供airTable,所有基础组件
import React from 'react';
import { Icon } from 'antd';
import DatePacker from '@/ant_components/BIDatePicker';
import UpLoad from '@/components/upload/airtable_upload';
import Input from './component/input';
import Select from './component/select';
import NumberInput from './component/number';
import AssociationSearch from './component/search';
import Rate from './component/rate';
import TextArea from './component/textArea';
import TextSelect from './component/text_select';
import TaxesRate from './component/taxesRate';
import Cascader from './component/cascader';
import RandePicker from './component/rangePicker';
import { SetFormatter, formatStr } from './_utils/setFormatter';
import { GetFormatter } from './_utils/getFormatter';
/*
 eslint-disable global-require
 */
export const config = {
    1: {
        name: '单行文本',
        component: Input,
        setFormatter: SetFormatter.TEXT,
        getFormatter: GetFormatter.TEXT,
        detail: require('./detail/text').default,
    },
    2: {
        name: '超链接',
        component: TextArea,
        getFormatter: GetFormatter.LINK,
        setFormatter: SetFormatter.LINK,
        detail: require('./detail/link').default,
    },
    3: {
        name: '多行文本',
        component: TextArea,
        setFormatter: SetFormatter.TEXT,
        getFormatter: GetFormatter.TEXT,
        detail: require('./detail/textarea').default,
    },
    4: {
        name: '附件上传',
        component: UpLoad,
        getFormatter: GetFormatter.FILE,
        setFormatter: SetFormatter.FILE,
        detail: require('./detail/upload').default,
    },
    5: {
        name: '复选',
        component: Input, // 暂未添加
        setFormatter: SetFormatter.CHECK_BOX,
        // detail: require('./detail/tag').default,
    },
    6: {
        name: '下拉单选',
        component: Select,
        componentAttr: {
            labelInValue: true,
            allowClear: true,
        },
        getFormatter: GetFormatter.SELECT,
        setFormatter: SetFormatter.SELECT,
        detail: require('./detail/select').default,
    },
    7: {
        name: '下拉多选',
        component: Select,
        componentAttr: {
            multiple: true,
            labelInValue: true,
            mode: 'multiple',
            // maxTagCount: 3,
        },
        getFormatter: GetFormatter.MULTIPLE_SELECT,
        setFormatter: SetFormatter.MULTIPLE_SELECT,
        detail: require('./detail/mutiSelect').default,
    },
    8: {
        name: '评级',
        component: Rate,
        componentAttr: {
            allowClear: true,
            character: <Icon type="like" theme="filled" />,
        },
        getFormatter: GetFormatter.RATE,
        setFormatter: SetFormatter.RATE,
        detail: require('./detail/rate').default,
    },
    9: {
        name: '数字输入',
        component: NumberInput,
        componentAttr: {
            precision: 2,
        },
        setFormatter: SetFormatter.NUMBER,
        getFormatter: GetFormatter.NUMBER,
        detail: require('./detail/number').default,
    },
    10: {
        name: '百分比',
        component: TaxesRate, // 暂未添加
        setFormatter: SetFormatter.TAXES_RATE,
        getFormatter: GetFormatter.TAXES_RATE,
        detail: require('./detail/taxesRate').default,
    },
    11: {
        name: '日期',
        component: DatePacker,
        componentAttr: {
            format: formatStr,
            showTime: true,
        },
        getFormatter: GetFormatter.DATE,
        setFormatter: SetFormatter.DATE,
        detail: require('./detail/date').default,
    },
    12: {
        name: '引用',
        component: Input, // 暂未添加
        setFormatter: SetFormatter.TABLE_QUOTE,
        // detail: require('./detail/text').default,
    },
    13: {
        name: '模糊搜索多选',
        component: AssociationSearch,
        getFormatter: GetFormatter.SEARCH,
        setFormatter: SetFormatter.SEARCH,
        componentAttr: {
            allowClear: true,
        },
        detail: require('./detail/mutiSearch').default,
    },
    14: {
        name: '树组件',
        component: require('./component/treeSelect').default,
        placeholder: '请选择',
        getFormatter: GetFormatter.DEPARTMENT,
        setFormatter: SetFormatter.DEPARTMENT,
        detail: require('./detail/search').default,
    },
    15: {
        name: '文本选择',
        component: TextSelect,
        getFormatter: GetFormatter.TEXT_SEARCH,
        setFormatter: SetFormatter.TEXT_SEARCH,
        componentAttr: {
            allowClear: true,
        },
        detail: require('./detail/textSelect').default,
    },
    17: {
        name: '级联选择',
        component: Cascader,
        getFormatter: GetFormatter.CASCADER,
        setFormatter: SetFormatter.CASCADER,
        detail: require('./detail/cascader').default,
    },
    18: {
        name: '控件在业务进行维护',
    },
    19: {
        name: '控件在业务进行维护',
    },
    20: {
        name: '日期区间',
        component: RandePicker,
        componentAttr: {
            format: formatStr,
        },
        getFormatter: GetFormatter.RANGE_PICKER,
        setFormatter: SetFormatter.RANGE_PICKER,
        detail: require('./detail/dateArea').default,
    },
};
export default {
    config,
};
