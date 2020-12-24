/* eslint-disable no-case-declarations */
// 判断是Android 或 iOS
const platform = (function checkPlatForm() {
    // const u = window.navigator.userAgent;
    // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    // const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    // if (isAndroid) {
    //     return 'android';
    // }
    // if (isiOS) {
    //     return 'ios';
    // }
    return 'PC';
}());
const presetValueMap: any = {
    userId: 'userId',
    userName: 'userName',
    departmentId: 'departmentId',
    departmentName: 'departmentName',
};
const getLocalData = ({ getLocalDataMethod }: any) => {
    const localData = {};
    // if (platform === 'PC') {
    //     if (typeof getLocalDataMethod === 'function') {
    //         localData = getLocalDataMethod();
    //     } else {
    //         // console.log('没有找到获取本地数据的方法getLocalDataMethod');
    //     }
    //     //@ts-ignore
    // } else if (window.mtBridge) {
    //     //@ts-ignore
    //     localData = window.mtBridge.data.localData || {};
    // } else {
    //     // console.log('没有找到native交互桥mtBridge');
    // }
    return localData;
};
/**
 * 受控子组件更新
 * @param item          子组件数据
 * @param list          全部数据
 * @param behavior      子组件行为
 * @returns {*}         添加附加属性后返回子组件
 */
const changDynamicParams = ({ item, list, behavior }: any) => {
    const { paramsJsonCols, paramsJsonColsLogic = 'and', paramsJsonRequired, fieldValueName } = behavior;
    const itemData = item;
    itemData.columnAttrObj.type = fieldValueName || item.columnAttrObj.type;
    if (paramsJsonRequired) {
        const sources = paramsJsonCols.split(',');
        let len = 0;
        sources.map((s: any) => {
            const sourceArr = list.filter((temp: any) => {
                return temp.columnName === s;
            });
            const source = sourceArr[0];
            if (source && source.value && source.value[0] && source.value[0].value) {
                itemData.columnAttrObj.paramsJson = itemData.columnAttrObj.paramsJson || {};
                itemData.columnAttrObj.paramsJson[s] = source.value[0].value;
                len += 1;
            }
        });
        // 根据条件判断子组件是否可编辑
        switch (paramsJsonColsLogic) {
            case 'and':
                itemData.columnAttrObj.disabled = sources.length !== len;
                break;
            case 'or':
                itemData.columnAttrObj.disabled = len === 0;
                break;
            default:
                break;
        }
    }
    return itemData;
};
/**
 * 控制组件赋值（父组件调接口）更新
 * @param item          父组件数据
 * @param list          全部数据
 * @param behavior      父组件行为
 * @param originValue   修改的原始值
 * @returns {*}         添加附加属性后返回父组件
 */
const changDynamicValue = ({ item, list, behavior, originValue }: any) => {
    const { targets, specialTargets } = behavior;
    if (targets) {
        const targetsArr = targets.split(',');
        if (targetsArr) {
            targetsArr.map((t: any) => {
                const targetArr = list.filter((temp: any) => {
                    return temp.columnName === t;
                });
                const target = targetArr[0];
                if (target) {
                    const { extraData } = Array.isArray(originValue) ? originValue[0] || {} : originValue || {};
                    if (!extraData) {
                        target.value = [];
                    } else {
                        target.value = Array.isArray(extraData[t]) ? extraData[t] : [extraData[t]];
                    }
                }
            });
        }
    }
    if (specialTargets) {
        const targetsArr = specialTargets.split(',');
        if (targetsArr) {
            targetsArr.map((t: any) => {
                const targetArr = list.filter((temp: any) => {
                    return temp.columnName === t;
                });
                const target = targetArr[0];
                if (target) {
                    const { extraData } = Array.isArray(originValue) ? originValue[0] || {} : originValue || {};
                    if (extraData) {
                        const targetValue = Array.isArray(extraData[t]) ? extraData[t] : [extraData[t]];
                        if (targetValue.length === 1) {
                            target.value = targetValue;
                        } else {
                            target.value = [];
                        }
                        // else {
                        //     const options = [];
                        //     targetValue.map((option) => {
                        //         options.push({
                        //             name: option.text,
                        //             id: option.value,
                        //         });
                        //     });
                        //     target.columnAttrObj.options = options;
                        // }
                    }
                }
            });
        }
    }
    return item;
};
/**
 * 控制组件赋值（直接值）更新
 * @param item          父组件数据
 * @param list          全部数据
 * @param behavior      父组件行为
 * @returns {*}         添加附加属性后返回父组件
 */
const changParams = ({ item, list, behavior }: any) => {
    const { targetText, targetValue, targets } = behavior;
    if (targets) {
        const targetsArr = targets.split(',');
        if (targetsArr) {
            targetsArr.map((t: any) => {
                const targetArr = list.filter((temp: any) => {
                    return temp.columnName === t;
                });
                const target = targetArr[0];
                if (target) {
                    target.value = [{ text: targetText, value: targetValue }];
                }
            });
        }
    }
    return item;
};
/**
 * 获取附加属性得到最终值状态
 * @param list              全部数据
 * @param changedKey        修改的键
 * @param changedValue      修改的值
 * @param originValue       修改的原始值
 * @returns {*}             根据组件行为，添加附加属性后返回
 */
const changeData = ({ list, changedKey, changedValue, originValue }: any) => {
    let changedItem = list.find((item: any) => {
        return item.columnName === changedKey;
    });
    if (changedItem) {
        changedItem.value = changedValue;
        if (changedItem.columnAttrObj) {
            const { events } = changedItem.columnAttrObj;
            if (events) {
                events.map((e: any) => {
                    const { behaviors } = e;
                    if (behaviors) {
                        behaviors.map((behavior: any) => {
                            const { behaviorValue } = behavior;
                            switch (behaviorValue) {
                                case 'changDynamicValue':
                                    changedItem = changDynamicValue({
                                        item: changedItem,
                                        list,
                                        behavior,
                                        changedKey,
                                        originValue,
                                    });
                                    break;
                                case 'changParams':
                                    changedItem = changParams({ item: changedItem, list, behavior });
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                });
            }
        }
    }
    return list.map((item: any) => {
        let itemData = item;
        if (item.columnName !== changedKey) {
            if (item.columnAttrObj) {
                const { events } = item.columnAttrObj;
                if (events) {
                    events.map((e: any) => {
                        const { behaviors } = e;
                        if (behaviors) {
                            behaviors.map((behavior: any) => {
                                const { behaviorValue } = behavior;
                                if (behaviorValue === 'changDynamicParams') {
                                    itemData = changDynamicParams({ item: itemData, list, behavior });
                                }
                            });
                        }
                    });
                }
            }
        }
        return itemData;
    });
};
/**
 * 根据默认值处理数据属性
 * @param item                      原始数据
 * @param initType                  原始数据
 * @param getLocalDataMethod        获取本地数据的方法名
 * @returns {*}                     添加附加属性后返回
 */
const initPresetValue = ({ item, initType, getLocalDataMethod }: any) => {
    const { presetValue } = item.columnAttrObj || {};
    const itemData = item;
    if (presetValue) {
        const { type, value } = presetValue;
        if (initType === 'add') {
            switch (type) {
                case '1':
                    itemData.value = value;
                    break;
                case '2':
                    const localData: any = getLocalData({ getLocalDataMethod });
                    const textKey = presetValueMap[value[0].text];
                    const valueKey = presetValueMap[value[0].value];
                    itemData.value = [{ text: localData[textKey], value: localData[valueKey] }];
                    break;
                default:
                    break;
            }
        }
    }
    return itemData;
};
/**
 * 根据events处理数据属性
 * @param item                      原始数据
 * @param list                      原始数据
 * @returns {*}                     添加附加属性后返回
 */
const initEvents = ({ item, list }: any) => {
    const { events } = item.columnAttrObj || {};
    let itemData = item;
    if (events) {
        events.map((e: any) => {
            const { behaviors } = e;
            if (behaviors) {
                behaviors.map((behavior: any) => {
                    const { behaviorValue } = behavior;
                    switch (behaviorValue) {
                        case 'changDynamicParams':
                            itemData = changDynamicParams({ item, list, behavior });
                            break;
                        default:
                            break;
                    }
                });
            }
        });
    }

    return itemData;
};
/**
 * 根据flag处理数据属性
 * @param item          原始数据
 * @param rowLocked     行锁定状态
 * @returns {*}         添加附加属性后返回
 */
const initFlag = ({ item, rowLocked }: any) => {
    const itemData = item;
    itemData.columnAttrObj = item.columnAttrObj || {};
    // 锁定状态
    if (rowLocked) {
        itemData.columnAttrObj.disabled = true;
    }
    // 只读属性
    if (item.readOnlyFlag) {
        itemData.columnAttrObj.disabled = true;
    }
    return itemData;
};
/**
 * 初始化
 * @param list                  原始数据
 * @param initType              初始化类型：'add'|'edit'
 * @param getLocalDataMethod    获取本地数据的方法名
 * @param rowLocked             行锁定状态
 * @returns {*}                 根据子组件行为，添加附加属性后返回
 */
const initData = ({ list, initType, getLocalDataMethod, rowLocked }: any) => {
    return list.map((item: any) => {
        let itemData = item;
        itemData = initPresetValue({ item: itemData, initType, getLocalDataMethod });
        itemData = initEvents({ item: itemData, list });
        itemData = initFlag({ item: itemData, rowLocked });
        return itemData;
    });
};
/**
 * 获取附加属性得到最终值状态
 * @param list                  全部数据
 * @param changedKey            修改的键
 * @param changedValue          修改的值
 * @param originValue           修改的原始值
 * @param initType              初始化类型：'add'|'edit'
 * @param getLocalDataMethod    获取本地数据的方法名
 * @param rowLocked             该行是否锁定
 * @returns {*}                 根据组件行为，添加附加属性后返回
 */
const getFormData = ({
    list,
    changedKey,
    changedValue,
    originValue,
    initType,
    getLocalDataMethod = 'getClientUserInfo',
    rowLocked,
}: any) => {
    // 没有修改键时默认走初始化
    if (!changedKey) {
        return initData({ list, initType, getLocalDataMethod, rowLocked });
    }
    return changeData({ list, changedKey, changedValue, originValue });
};
// -------------------------------------table----------------------------------------
/**
 * 控制组件赋值（父组件调接口）更新
 * @param behavior          父组件行为
 * @param key               修改的键
 * @param originValue       修改的原始值
 * @returns {[]}            返回改变的数据列表
 */
const changTableDynamicValue = ({ behavior, originValue }: any) => {
    const { targets, specialTargets } = behavior;
    const result: any[] = [];
    if (targets) {
        const targetsArr = targets.split(',');
        if (targetsArr) {
            targetsArr.map((t) => {
                const { extraData } = Array.isArray(originValue) ? originValue[0] || {} : originValue || {};
                if (!extraData) {
                    result.push({
                        columnCode: t,
                        cellValueList: [],
                    });
                } else {
                    result.push({
                        columnCode: t,
                        cellValueList: Array.isArray(extraData[t]) ? extraData[t] : [extraData[t]],
                    });
                }
            });
        }
    }
    if (specialTargets) {
        const targetsArr = specialTargets.split(',');
        if (targetsArr) {
            targetsArr.map((t) => {
                const { extraData } = Array.isArray(originValue) ? originValue[0] || {} : originValue || {};
                if (extraData) {
                    const targetValue = Array.isArray(extraData[t]) ? extraData[t] : [extraData[t]];
                    if (targetValue.length === 1) {
                        const [firstData] = targetValue;
                        result.push({
                            columnCode: t,
                            cellValueList: firstData,
                        });
                    }
                }
            });
        }
    }
    return result;
};
/**
 * 控制组件赋值（直接值）更新
 * @param behavior      父组件行为
 * @returns {[]}        返回改变的数据列表
 */
const changTableParams = ({ behavior }: any) => {
    const { targetText, targetValue, targets } = behavior;
    const result: any[] = [];
    if (targets) {
        const targetsArr = targets.split(',');
        if (targetsArr) {
            targetsArr.map((t: any) => {
                result.push({
                    columnCode: t,
                    cellValueList: [{ text: targetText, value: targetValue }],
                });
            });
        }
    }
    return result;
};
/**
 * 获取附加属性得到最终值状态
 * @param item              修改的数据属性
 * @param changedKey        修改的键
 * @param changedValue      修改的值
 * @param originValue       修改的原始值
 * @returns {[]}            返回改变的数据列表
 */
const changeTableData = ({ item, changedKey, originValue }: any) => {
    let result: any[] = [];
    if (item.columnAttrObj) {
        const { events } = item.columnAttrObj;
        if (events) {
            events.map((e: any) => {
                const { behaviors } = e;
                if (behaviors) {
                    behaviors.map((behavior: any) => {
                        const { behaviorValue } = behavior;
                        switch (behaviorValue) {
                            case 'changDynamicValue':
                                result = result.concat(changTableDynamicValue({ behavior, changedKey, originValue }));
                                break;
                            case 'changParams':
                                result = result.concat(changTableParams({ behavior }));
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        }
    }
    return result;
};
export default {
    getFormData,
    changeTableData,
};
