/* eslint-disable max-len */
import moment from 'moment';

// 默认头像
const defaultHead = 'data:image/png;base64,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';

// 头像展示
const imgIcon = (event) => {
    const { imgList = [] } = event.extendedProps;
    if (imgList.length === 0) {
        return '';
    }
    const item = imgList[0];
    const imgNode = `<img src="${
        item.memberAvatar ? item.memberAvatar : defaultHead
    }" style="width:20px;height:20px;display:block;border-radius:50%;"/>`;
    return `
        <div style="display:flex;align-items:center;margin:0 5px;flex-shrink:0;">
            <div style="display:flex;align-items:center;flex-direction:row-reverse;">
                ${imgNode}
            </div>
        </div>
    `;
};

// state: 1-日程  2-已完成、未逾期  3-已认领、未逾期  4-已认领、已逾期  5-未认领、未逾期 6-未认领、已逾期 7-已完成、已逾期

const renderItem = () => {
    return {
        1: (event) => {
            return `
            <div class="fc-content">
                <div style="padding: 4px 0;display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                        <span style="display:block;width:8px;height:8px;background:rgba(66,202,196,1);border-radius:50%;position:relative;top:-1px;margin:0 6px;flex-shrink:0;"></span>
                        <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:#2C3F53;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${
    event.title
}</span>
                    </div>
                    ${imgIcon(event)}
                </div>
            </div>
        `;
        },
        2: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(140,151,163,1);padding: 4px 0;display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:rgba(163,169,183,1);padding-left:10px;text-decoration:line-through;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${
    event.title
}</span>
                    ${imgIcon(event)}
                </div>
            </div>
        `;
        },
        3: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(92,153,255,1);padding: 4px 0;display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:#2C3F53;padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${
    event.title
}</span>
                    ${imgIcon(event)}
                </div>
            </div>
        `;
        },
        4: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(255,93,93,0.8);padding: 4px 0;display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:rgba(255,93,93,1);padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${
    event.title
}</span>
                    ${imgIcon(event)}
                </div>
            </div>
        `;
        },
        5: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(92,153,255,1);padding: 4px 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:#2C3F53;padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${event.title}</span>
                </div>
            </div>
        `;
        },
        6: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(255,93,93,0.8);padding: 4px 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:rgba(255,93,93,1);padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${event.title}</span>
                </div>
            </div>
        `;
        },
        7: (event) => {
            return `
            <div class="fc-content">
                <div style="border-left:3px solid rgba(255,93,93,0.8);padding: 4px 0;display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:12px;font-family:PingFangSC-Regular,PingFangSC;font-weight:400;color:rgba(255,93,93,1);padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-decoration:line-through;">${
    event.title
}</span>
                    ${imgIcon(event)}
                </div>
            </div>
        `;
        },
    };
};

// 列表视图item
const renderItem2 = (event) => {
    const {
        allDay,
        title,
        extendedProps: { beginTime },
    } = event;
    const time = allDay ? '全天' : moment(beginTime).format('HH:mm');
    return `
        <td colspan="3">
            <div class="listDayItem">
                <span class="time">${time}</span>
                <span class="title">${title}</span>
            </div>
        </td>
    `;
};

export default function (info, tab) {
    const { event } = info;
    const {
        extendedProps: { state },
    } = event;
    if (state && tab === 1) {
        return renderItem(event)[state](event);
    }
    if (tab === 2) {
        return renderItem2(event);
    }
    return '';
}
