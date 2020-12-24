import { HandleClass } from './behavior';

class HandleBehavior {
    constructor(props) {
        this.formData = props.formData || null;
        this.changeCallBack = props.changeCallBack || null; // 改变表单回调
        this.changeValue = props.changeValue || null; // 改变值的回调
    }

    initBehavior = (values = []) => {
        if (!this.formData) return;
        this.hiddenFilds();
        this.formData.map((item) => {
            if (!item.behaviors || !Array.isArray(item.behaviors) || item.behaviors.length === 0) return;
            const currentVal = (
                values.find((ls) => {
                    return ls.fieldId === item.id;
                }) || {}
            ).fieldValue;
            const value = this.handleFormaterValue(currentVal || item.value, item);
            this.handleBehavior({ currentValue: value, componentData: item, handleType: 'init' });
        });
        return this;
    };

    getFormData = () => {
        return this.formData;
    };

    handleFormaterValue = (value) => {
        if (!value) return value;
        if (Array.isArray(value) && value.length) {
            return value[0].value;
        }
        if (typeof value === 'object' && value) {
            return value.value;
        }
        return value;
    };

    /*
     * 处理行为方法
     */
    handleBehavior = async ({ currentValue, componentData = {}, eventType, formData, handleType }) => {
        this.formData = formData || this.formData;
        const value = this.handleFormaterValue(currentValue, componentData);
        const events = componentData.events || [];
        const behaviors = componentData.behaviors || [];
        const changeEvents = eventType
            ? events.filter((ls) => {
                return ls.eventValue === 'onChange';
            })
            : events;
        changeEvents.forEach((event) => {
            this.onChangeBehavior({ event, value, componentData, behaviors, handleType });
        });
    };

    onChangeBehavior = ({ event, value, componentData, behaviors, handleType }) => {
        if (!event.behaviors || !Array.isArray(event.behaviors)) return;
        event.behaviors.forEach((item) => {
            this.handleBehaviorType({ value, behavior: item, componentData, behaviors, handleType });
        });
    };

    handleBehaviorType = ({ value, behavior, behaviors, componentData, handleType }) => {
        const behaviorInstance = HandleClass[behavior.behaviorValue];
        if (!behaviorInstance || !behaviorInstance.fun) return;
        const formData = this.formData;
        const newComponentData = formData.find((ls) => {
            return ls.name === componentData.name;
        });
        const result = behaviorInstance.fun(
            {
                value,
                behavior,
                behaviors,
                formData,
                componentData: newComponentData,
                handleType,
                changeValue: this.changeValue,
            },
            this.resertValueCallback,
        );
        if (Array.isArray(result)) {
            this.formData = result;
            return;
        }
        Promise.resolve(result).then((val) => {
            this.formData = val;
            if (this.changeCallBack) this.changeCallBack(val);
        });
    };

    resertValueCallback = ({ key, value, handleType }) => {
        const componentData = this.formData.find((ls) => {
            return ls.name === key;
        }) || {};
        this.handleBehavior({ currentValue: value, componentData, handleType });
    };

    hiddenFilds = () => {
        this.formData = this.formData.filter((item) => {
            return item.type !== 'hidden';
        });
    };
}
export default HandleBehavior;
