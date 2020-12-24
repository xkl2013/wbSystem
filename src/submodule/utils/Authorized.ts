import RenderAuthorized from '../components/Authorized';
import Storage from './storage';



let Authorized = RenderAuthorized(Storage.getUserInfo); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
    Authorized = RenderAuthorized(Storage.getUserInfo);
};
// 获取token
const checkoutToken = () => {
    return Storage.getToken();
};

export { reloadAuthorized, checkoutToken };
export default Authorized;