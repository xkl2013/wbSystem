import { getUserList } from '@/services/globalSearchApi';
import { VIEW_TYPE, TASK_STATUS, PRIORITY_TYPE } from '../../../_enum';
import styles from './index.less';

// const constance = [
//     {
//         fieldChsName: '标题',
//         fieldConstraint: { visibleFlag: '1' },
//         fieldDefaultValue: '请输入名称',
//         fieldModule: '1',
//         fieldName: 'BT',
//         fieldType: 'input',
//         fieldValueDto: [
//             {
//                 text: '剧本组',
//                 value: '剧本组',
//             },
//         ],
//     },
//     {
//         fieldChsName: '完成标示',
//         fieldConstraint: { visibleFlag: '1' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'WCBS',
//         fieldType: 'radio',
//         fieldValueDto: [
//             {
//                 text: '未完成',
//                 value: '0',
//             },
//             {
//                 text: '已完成',
//                 value: '1',
//             },
//         ],
//     },
//     {
//         fieldChsName: '起止时间',
//         fieldConstraint: { visibleFlag: '1' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'QZSJ',
//         fieldType: 'timecomponent',
//     },
//     {
//         fieldChsName: '负责人',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'FZR',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '档期一',
//                 value: '1113',
//             },
//             {
//                 text: 'lgc111',
//                 value: '1015',
//             },
//         ],
//     },
//     {
//         fieldChsName: '创建人',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'CJR',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '档期一',
//                 value: '1113',
//             },
//             {
//                 text: 'lgc111',
//                 value: '1015',
//             },
//         ],
//     },
//     {
//         fieldChsName: '参与人',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'CYR',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '档期一',
//                 value: '1113',
//             },
//             {
//                 text: 'lgc111',
//                 value: '1015',
//             },
//         ],
//     },
//     {
//         fieldChsName: '知会人',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'ZHR',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '档期一',
//                 value: '1113',
//             },
//             {
//                 text: 'lgc111',
//                 value: '1015',
//             },
//         ],
//     },
//     {
//         fieldChsName: '标签',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'BQ',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '试试',
//                 value: '7',
//             },
//             {
//                 text: '0998开始',
//                 value: '8',
//             },
//         ],
//     },
//     {
//         fieldChsName: '优先级',
//         fieldConstraint: { visibleFlag: '2' },
//         fieldDefaultValue: '-1',
//         fieldModule: '1',
//         fieldName: 'YXJ',
//         fieldType: 'combox',
//         fieldValueDto: [
//             {
//                 text: '普通',
//                 value: '1',
//             },
//             {
//                 text: '紧急',
//                 value: '2',
//             },
//             {
//                 text: '非常紧急',
//                 value: '3',
//             },
//         ],
//     },
// ];

const searchCols = [
    { type: 'checkbox', key: '1', label: '类型', options: VIEW_TYPE, className: styles.checkbox },
    { type: 'input', key: '2', label: '标题', placeholder: '请输入' },
    { type: 'radio', key: '3', label: '是否完成', options: TASK_STATUS },
    { type: 'daterange', key: '4', label: '起止日期', placeholder: ['开始时间', '结束时间'] },
    {
        type: 'associationSearch',
        key: '5',
        label: '负责人',
        placeholder: '请输入',
        componentAttr: {
            request: (val) => {
                return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
            },
            mode: 'multiple',
            fieldNames: { value: 'userId', label: 'userChsName' },
            initDataType: 'onfocus',
        },
    },
    {
        type: 'associationSearch',
        key: '6',
        label: '参与人',
        placeholder: '请输入',
        componentAttr: {
            request: (val) => {
                return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
            },
            mode: 'multiple',
            fieldNames: { value: 'userId', label: 'userChsName' },
            initDataType: 'onfocus',
        },
    },
    {
        type: 'associationSearch',
        key: '7',
        label: '只会人',
        placeholder: '请输入',
        componentAttr: {
            request: (val) => {
                return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
            },
            mode: 'multiple',
            fieldNames: { value: 'userId', label: 'userChsName' },
            initDataType: 'onfocus',
        },
    },
    { type: 'input', key: '8', label: '标签' },
    { type: 'checkbox', key: '9', label: '优先级', options: PRIORITY_TYPE, className: styles.checkbox },
];
export default searchCols;
