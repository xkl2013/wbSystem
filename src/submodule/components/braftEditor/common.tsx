import request from '@/utils/request';


// 文件上传获取token
export function getToken() {
    return request('/qiniu/token', { method: 'get', prefix: '/adminApi', params: { bucket: 'apollo-influencer' } });
}


/**
 *
 * @param len           随机树位数  默认6位
 * @param type          随机数集类型：n纯数字 l纯小写字母 u纯大写字母 lu大小写字母 默认数字字母
 * @param extra         随机数集扩展  可加其他字符
 * @returns {string}    返回随机字符串
 */

export function getRandom(len = 6, type?: string, extra?: string): string {
    const num = '0123456789';
    const letter = 'abcdefghigklmnopqrstuvwxyz';
    const upLetter = letter.toUpperCase();
    let str = num;
    let result = '';
    switch (type) {
        case 'n':
            str = num;
            break;
        case 'l':
            str = letter;
            break;
        case 'u':
            str = upLetter;
            break;
        case 'lu':
            str = letter + upLetter;
            break;
        default:
            str = num + letter + upLetter;
            break;
    }
    if (extra && typeof extra === 'string') {
        str += extra;
    }
    for (let i = 0; i < len; i += 1) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}
