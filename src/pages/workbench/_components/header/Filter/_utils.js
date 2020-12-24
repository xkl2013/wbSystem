import React from 'react';
import moment from 'moment';
import { getUserList } from '@/services/globalSearchApi';
import { TASK_STATUS, PRIORITY_TYPE } from '../../../_enum';
// import TagPanel from '@/components/editor/Tag/tagPanel';
import DateRange from './dateRange';
import TagPanel from '../../editModule/_component/tag/select';
import styles from './index.less';

export const checkoutVisible = (ls) => {
    let fieldConstraint = {};
    try {
        fieldConstraint = JSON.parse(ls.fieldConstraint) || {};
    } catch (e) {
        console.warn(e);
    }
    return Number(fieldConstraint.visibleFlag) === 1;
};
export const searchFormMap = (data, { willFetch }) => {
    const conditions = data.map((ls) => {
        let formateObj = {};
        switch (ls.fieldName) {
            case 'BT': // 任务日程标题
                formateObj = {
                    type: 'input',
                    placeholder: ls.fieldDefaultValue || '请输入',
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return (value[0] || {}).value;
                    },
                    getFormat: (value) => {
                        return [{ value, text: value }];
                    },
                };
                break;
            case 'WCBS': // 完成标志
                formateObj = {
                    type: 'checkbox',
                    options: TASK_STATUS,
                    className: styles.checkbox,
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return String(item.value);
                        });
                    },
                    getFormat: (value) => {
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return {
                                    value: item,
                                    text: (
                                        TASK_STATUS.find((i) => {
                                            return String(i.id) === String(item);
                                        }) || {}
                                    ).name,
                                };
                            });
                    },
                };
                break;
            case 'QZSJ': // 起止时间
                formateObj = {
                    type: 'custom',
                    render: () => {
                        const componentAttr = {
                            placeholder: ['开始时间', '结束时间'],
                        };
                        return <DateRange {...componentAttr} />;
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return {
                            start: (value[0] || {}).value ? moment((value[0] || {}).value) : undefined,
                            end: (value[1] || {}).value ? moment((value[1] || {}).value) : undefined,
                        };
                    },
                    getFormat: (value) => {
                        if (!value) return [];
                        return [value.start, value.end].map((item) => {
                            const timeStr = item ? moment(item).format('YYYY-MM-DD HH:mm:00') : '';
                            return { text: timeStr, value: timeStr };
                        });
                    },
                };
                break;
            case 'FZR': // 负责人
                formateObj = {
                    type: 'associationSearch',
                    placeholder: '请输入',
                    componentAttr: {
                        request: (val) => {
                            return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                        },
                        mode: 'multiple',
                        fieldNames: { value: 'userId', label: 'userChsName' },
                        initDataType: 'onfocus',
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return { value: item.value, label: item.text, userIcon: item.userIcon };
                        });
                    },
                    getFormat: (value) => {
                        if (!Array.isArray(value)) return [];
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return { value: item.value, text: item.label, userIcon: item.userIcon };
                            });
                    },
                };
                break;
            case 'CJR': // 创建人
                formateObj = {
                    type: 'associationSearch',
                    placeholder: '请输入',
                    componentAttr: {
                        request: (val) => {
                            return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                        },
                        mode: 'multiple',
                        fieldNames: { value: 'userId', label: 'userChsName' },
                        initDataType: 'onfocus',
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return { value: item.value, label: item.text, userIcon: item.userIcon };
                        });
                    },
                    getFormat: (value) => {
                        if (!Array.isArray(value)) return [];
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return { value: item.value, text: item.label, userIcon: item.userIcon };
                            });
                    },
                };
                break;
            case 'CYR': // 参与人
                formateObj = {
                    type: 'associationSearch',
                    placeholder: '请输入',
                    componentAttr: {
                        request: (val) => {
                            return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                        },
                        mode: 'multiple',
                        fieldNames: { value: 'userId', label: 'userChsName' },
                        initDataType: 'onfocus',
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return { value: item.value, label: item.text, userIcon: item.userIcon };
                        });
                    },
                    getFormat: (value) => {
                        if (!Array.isArray(value)) return [];
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return { value: item.value, text: item.label, userIcon: item.userIcon };
                            });
                    },
                };
                break;
            case 'ZHR': // 知会人
                formateObj = {
                    type: 'associationSearch',
                    placeholder: '请输入',
                    componentAttr: {
                        request: (val) => {
                            return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                        },
                        mode: 'multiple',
                        fieldNames: { value: 'userId', label: 'userChsName' },
                        initDataType: 'onfocus',
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return { value: item.value, label: item.text, userIcon: item.userIcon };
                        });
                    },
                    getFormat: (value) => {
                        if (!Array.isArray(value)) return [];
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return { value: item.value, text: item.label, userIcon: item.userIcon };
                            });
                    },
                };
                break;
            case 'BQ': // 标签
                formateObj = {
                    type: 'custom',
                    placeholder: '请输入',
                    render: () => {
                        const componentAttr = {
                            willFetch,
                            hideAddTag: true,
                            hideEditTag: true,
                        };
                        return <TagPanel {...componentAttr} />;
                    },
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return { tagId: item.value, tagName: item.text, tagColor: item.tagColor };
                        });
                    },
                    getFormat: (value) => {
                        if (!Array.isArray(value)) return [];
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return { value: item.tagId, text: item.tagName, tagColor: item.tagColor };
                            });
                    },
                };
                break;
            case 'YXJ': // 优先级
                formateObj = {
                    type: 'checkbox',
                    options: PRIORITY_TYPE,
                    className: styles.checkbox,
                    setFormat: (value) => {
                        if (!Array.isArray(value)) return undefined;
                        return value.map((item) => {
                            return String(item.value);
                        });
                    },
                    getFormat: (value) => {
                        return value
                            .filter((item) => {
                                return item;
                            })
                            .map((item) => {
                                return {
                                    value: item,
                                    text: (
                                        PRIORITY_TYPE.find((i) => {
                                            return String(i.id) === String(item);
                                        }) || {}
                                    ).name,
                                };
                            });
                    },
                };
                break;
            default:
                break;
        }
        return {
            ...ls,
            ...formateObj,
            label: ls.fieldChsName,
            key: ls.fieldName,
            visible: checkoutVisible(ls),
        };
    });
    return conditions;
};
export default {
    searchFormMap,
};
