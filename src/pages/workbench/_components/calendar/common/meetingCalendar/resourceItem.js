// 会议室 node结构
const renderItem = (info) => {
    const {
        title,
        extendedProps: { seatCapacity, devices, icon },
    } = info.resource;
    const devicesArr = (devices && devices.split(',')) || [];
    let devicesNode = '';
    if (devicesArr && devicesArr.length > 0) {
        devicesArr.map((item) => {
            devicesNode += `<span>${item}</span>`;
        });
    }
    const titleStr = seatCapacity && seatCapacity > 0 ? `${title}(${seatCapacity}人)` : title;
    const html = `
        <div class="meetingItem">
            <div class="meetingItemTit" title="${titleStr}">
                <img src="${icon}"/>
                <span>${titleStr}</span>
            </div>
            <div class="meetingItemCon">
                ${devicesNode}
            </div>
        </div>
    `;
    const { childNodes } = info.el;
    const childNodesArr = Array.from(childNodes);
    childNodesArr.map((item) => {
        if (item.nodeType == 1) {
            item.innerHTML = html;
        }
    });
};

export default function (info) {
    const {
        extendedProps: { level },
    } = info.resource;
    if (level == 3) {
        return renderItem(info);
    }
}
