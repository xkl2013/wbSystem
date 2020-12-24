
import { getOptionName } from '@/utils/utils';

//state: 1-已完成  2-新建  3-已存在

const renderItem = (event,projectType) => {
    return {
        1: event => (`
            <div class="fc-content">
                <div class="fc-content-out fc-content-out1">
                    <span class="fc-content-out-text">【${getOptionName(projectType,event.extendedProps.projectType)}】${event.title}</span>
                    <p class="fc-content-out-address">${event.extendedProps.currentAddress}</p>
                </div>
            </div>
        `),
        2: event => (`
            <div class="fc-content">
                <div class="fc-content-out fc-content-out2">
                    <span class="fc-content-out-text">【${getOptionName(projectType,event.extendedProps.projectType)}】${event.title}</span>
                    <p class="fc-content-out-address">${event.extendedProps.currentAddress}</p>
                </div>
            </div>
        `),
        3: event => (`
            <div class="fc-content">
                <div class="fc-content-out fc-content-out3">
                    <span class="fc-content-out-text">【${getOptionName(projectType,event.extendedProps.projectType)}】${event.title}</span>
                    <p class="fc-content-out-address">${event.extendedProps.currentAddress}</p>
                </div>
            </div>
        `),

    }
}



export default function (info,projectType) {
    let {event} = info
    let {extendedProps:{state}} = event
    if(state){
        return renderItem(event,projectType)[state](event)
    } else {
        return ''
    }
}
