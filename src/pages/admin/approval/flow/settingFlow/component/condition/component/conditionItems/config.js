export const config = {
    'select': {
        name: '下拉选',
        component: require('@/ant_components/BISelect').default,
        placeholder: '请选择',
        comAttr: {
            labelInValue: true
        }
    },
    'department': {
        name: '组织架构',
        component: require('@/ant_components/BISelect').default,
        placeholder: '请选择',
        comAttr: {
            labelInValue: true
        }
    },
    'radio': {
        name: '单选',
        component: require('@/ant_components/BISelect').default,
        placeholder: '请选择',
        comAttr: {
            labelInValue: true
        }
    },
    'number': {
        name: '文本',
        component: require('@/ant_components/BIInput').default,
        placeholder: '请输入',
    }
}