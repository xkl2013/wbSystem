import defaultSettings from '../../config/defaultSettings';

const updateColorWeak = () => {
    const root = document.getElementById('root');
    if (root) {
        root.className = 'theme-blue';
    }
};
const updateTheme = (newPrimaryColor) => {
    // if (newPrimaryColor) {
    //     const timeOut = 0;
    //     const hideMessage = message.loading('正在切换主题！', timeOut);
    //     // themeColorClient.changeColor(newPrimaryColor).finally(() => hideMessage());
    // }
    updateColorWeak(newPrimaryColor);
};

const SettingModel = {
    namespace: 'settings',
    state: defaultSettings,
    reducers: {
        getSetting(state = defaultSettings) {
            const setting = {};
            // const urlParams = new URL(window.location.href);
            // Object.keys(state).forEach(key => {
            //     if (urlParams.searchParams.has(key)) {
            //         const value = urlParams.searchParams.get(key);
            //         setting[key] = value === '1' ? true : value;
            //     }
            // });
            // const { primaryColor, colorWeak } = setting;

            // // if (primaryColor && state.primaryColor !== primaryColor) {
            updateTheme('red');
            // // }
            // updateColorWeak(!!colorWeak);
            return { ...state, ...setting };
        },
    },
};
export default SettingModel;
