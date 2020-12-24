import storage from '@/utils/storage';

export const toShimoDetail = (url) => {
    const rUrl = new URL(url);
    const tokenExg = /(token=)([^&]*)/gi;
    const token = storage.getToken();
    if (rUrl.search.match(tokenExg)) {
        rUrl.search = rUrl.search.replace(tokenExg, `token=${token}`);
    } else {
        rUrl.search += `${rUrl.search.length ? '&' : ''}token=${token}`;
    }
    window.open(rUrl, '_blank');
};
export default {
    toShimoDetail,
};
