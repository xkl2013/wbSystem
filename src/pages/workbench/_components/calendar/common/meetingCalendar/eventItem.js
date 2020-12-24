export default function (event) {
    return `
        <div class="fc-content">
            <div class="fc-content-out" style="padding:5px 0 5px 4px;font-size: 12px;font-family: PingFangSC-Regular,PingFangSC;font-weight: 400;color: #273746;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                ${event.title}
            </div>
        </div>
    `;
}
