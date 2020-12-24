import { approvalValue } from '@/services/globalSearchApi';

export const HandleClass = {
    getBehaviors: (behaviorValue, componentData) => {
        // 获取全量behaviors的taggets
        const behaviors = componentData.behaviors || [];
        const behavior = behaviors.find((ls) => {
            return ls.behaviorValue === behaviorValue;
        }) || {};
        return (behavior.targets || '').split(',');
    },
    showComponent: {
        // 控制组件显,需要处理其他组件的隐
        name: '控制组件显隐',
        fun: ({ behavior = {}, formData, value, changeValue }) => {
            let newFormData = formData.slice();
            const targets = (behavior.targets || '').split(',');
            newFormData = newFormData.map((ls) => {
                if (targets.includes(ls.name)) {
                    const display = String(behavior.params) === String(value) ? 1 : 0;
                    const behaviorResult = { ...ls.behaviorResult, display };
                    const targetObj = {
                        ...ls,
                        behaviorResult,
                    };
                    if (display === 0) {
                        if (changeValue) changeValue({}, { fieldValue: undefined, fieldId: targetObj.id });
                    }
                    return targetObj;
                }
                return ls;
            });
            return newFormData;
        },
    },
    changeParams: {
        name: '修改business,请求参数',
        fun: ({
            behavior = {}, formData, componentData, value, handleType, changeValue,
        }, resertValue) => {
            // handleType 为init时不处理值的问题
            const newFormData = formData.slice();
            const targets = (behavior.targets || '').split(',');
            targets.forEach((ls) => {
                const index = newFormData.findIndex((item) => {
                    return item.name === ls;
                });
                const obj = newFormData[index] || {};
                const paramsJson = {};
                if ((componentData.behaviorResult || {}).display !== 0) {
                    // 当前控件处于隐藏状态下时,不做串联处理
                    paramsJson[componentData.name] = value;
                    paramsJson.fieldMessage = `请输入${componentData.title}`;
                }

                obj.behaviorResult = {
                    ...obj.behaviorResult,
                    paramsJson,
                };
                if (resertValue) resertValue({ key: ls, handleType });
                if (handleType !== 'init') {
                    obj.value = undefined; // 将目标组件清空
                    const currentObj = { fieldId: componentData.id, componentData, value };
                    const targetObj = { fieldId: obj.id, undefined, componentData: obj };
                    if (changeValue) changeValue(currentObj, targetObj);
                }
            });
            return newFormData;
        },
    },
    changeValue: {
        name: '值的变化修改相应组件的值',
        fun: async ({ behavior = {}, formData, value, handleType }) => {
            let newFormData = formData.slice();
            const targets = (behavior.targets || '').split(',');
            // 初始化不执行
            if (handleType === 'init' || targets.length === 0) {
                return newFormData;
            }
            const params = {
                fieldValueName: targets[0],
                name: value,
                paramsJson: JSON.stringify({
                    value,
                    params: behavior.params,
                }),
            };
            const result = await approvalValue(params);
            if (result && result.success) {
                const data = result.data || {};
                let resultValue = data.value ? data.value : '';
                newFormData = newFormData.map((ls) => {
                    if (targets.includes(ls.name)) {
                        if (ls.type === 'upload') {
                            try {
                                resultValue = JSON.parse(resultValue);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        return {
                            ...ls,
                            value: resultValue,
                        };
                    }
                    return ls;
                });
                return newFormData;
            }
            return newFormData;
        },
    },
};
export default HandleClass;
