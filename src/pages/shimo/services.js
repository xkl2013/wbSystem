import request from '@/utils/request';

/*
*  
获得石墨登录认证URL
*/
export async function getLoginPath() {
    return request('/shimo/getLoginPath', {
        method: 'get',
        prefix: '/crmApi',
    })
}
