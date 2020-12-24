// 手机号
export const mobileReg = /^1[3456789]\d{9}$/;
// 邮箱
export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export const filterEmailReg = /^\w+([-+.]\w+)*@(163|126|qq|gmail|sina)\.com$/;
// 零和非零开头的数字
export const pureNumberReg = /^(0|[1-9][0-9]*)$/;
// 身份证号
export const idCardReg = /^\d{15}|\d{18}$/;
// 身份证号
export const pureLetterReg = /^[a-zA-Z]*$/;
// 有两位小数的正实数
export const purePosNumberReg = /^((0|[1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
// 不含特殊符号
export const patrnReg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
// 汉字英文单词统计
export const wordReg = /\b([a-z]+)\b/gi;

export const numReg = /^[0-9]*$/;
// 评论超链接,以空格结尾
export const commentURL = /((https|http)?:\/\/)[^\s|;|《|》|“|”|、|(|)|（|）|。]+/g;
// 整数
export const numberReg = /^[0-9]*$/;
// 普通链接
export const urlReg = /^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
