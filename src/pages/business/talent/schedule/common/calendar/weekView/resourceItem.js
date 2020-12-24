import { checkPathname } from '@/components/AuthButton';


const iconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAADn0lEQVRYR82XS2hUdxTGvzOPGDOGYhznPpKUEgJqNamtIrQikkVSaW1RKRbtopu60IWggl20Cwvtoi50IVioD0SwUARdtFBq2zQg9qmiUEmMDxRq7r0zk0FjzGMe95MbcSaZZGbuvTOUznLmnN/3m3PP/w9X8D/9SK28SIaQTMYQjSZFJF0ttyZitKxuMHcCQCuAFCS4WxTlTDVyVYsxHm+Hnb0OoCEvImIjKN0SVXv9ylUvZg1dANE9S0AwiJjWKSKTfuSqEqNpbgPsb0oGixwQRfvsPxVjKvUCMpMDINUywZMIhFZILHbbq5zvidEyjoLcWTFQ8JMoek/FuqICX2JMGmuQw+8gA+4CAx+IqpZ+5HNAPIuRDCJuXAax0p0UABET4XlLpanpkdse72Lm0B4Ah9wGTLtCvhJF2+W2z5MYh4dbkE33g1xQHDDe14v0rVsI6c2I9LwJhMMzS6buNrwuUe0vN3LexKyhcyA2F4PT/f14fO5s/uuGri7Mf2Pd7HzBNcS01SKSqyTnWowJcyNy9ndzAccvXcRY36/5n+o7OhF5d1Op7L2i6odrIkayAZZ5A+BLbsTmdXRiQSkxkVGE6pbJokX/lpNzNTFaxpcg95cCFU+srJgDEZwXRd9SlRhT5gpkeBVk0TYXsJ7FnNZg4B1ZrH5fSq7sxEgK4sZFEGvL/TtfYpD7UNSXRWRsLnZ5MdP8CLCPVVpUf2JTF+9BUbSPPYlxZCSKsdGbAJoqiU388Rue/PJz4VSufA2RtzdWanPEsgjLq9Kk/lNcXHJitIxTID+sTAdyiQQenTwGZrNwgI3vb0e4vd1Nq3MQLiGmrRMRTm+YU4wJYz1y7HNHflZlDyeRuXcPIU1HUNe9tAII7BBVPV5WjGQdLPMawGUe6dWUpxCRpdKoJZ5DZk2M5tAnAD73muJMLH33DkJ6C0LNzV7bnX07LYqWX50ZYjTNNsC+AaDeC9mRenj868KObduOcJvLHZseFJQuWaxNrdBMMcv4AeQGL1JO7cTff+LJhR8Lp3LVakQ2vOUV49QPQNFecd5L82KMG1th81s/tOyDBxg5dQLPj1Xjps2oW97hB+X0fCqq/kVBzDLugGzzS8vcvY304CDCra3VSDnx45gfaZkSYyKxBLnMgF+pmvcFZOszsVTqRaQn7tc8wC9Qgj3TH+VZkO/5ZdWw7woUbU1BzLlYE9Y+2HRe9xtrGOQWNQpBL+rqj8jChQ+fAnQ7UV1ckCu3AAAAAElFTkSuQmCC'

const starBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACIklEQVRIS6XUu4sTURQG8PNlEoiw2kiQJPcOCuJq5YNtxEdhpzY+wLcIVhb+AYuC4oKitRZWgqLrA3w0amexKla+Ko0IypybpMhWKhhIZj4ZSZZsNpvZ2Z3y3nN+c5j7zYUs4CHpOedexaXGmF0AwqQ2JBXE+0EQHBGR+53ao77vP0jqWxCsqp9IbowxAJ+ttZuWDKvqbpIveiEAe6y1L4fhiRMHQTAlIjv6kNe+7+9cNFytVreFYfhmEOB53vZyufx2PnzgxKpaBjBK8iLJgZMBmAJwiWTFWlvtfwFqtdpYGIZ7RSSGRgGsIzmSdDh93/wPyW8AKiJS8TzvOVR1muTKNFBSLYDpGL5O8mxScZp9ADdAMqOqt0TkVJrmIbW3rbWn/x9ejDvn7pA8vhQcwKQx5iSAaCYV8X2gqpMicmiR+CNr7bHuPTIrbiSzzrmHJA+kwQE8McYcBtDu9s3Jca1WW99ut7+kgbPZ7IZSqfR1VgT7gSAI9onI0zSwiOz3ff/ZUNg5dy6Kostp4Ewmc94Yc2UorKp306YDwD1r7Ykk+APJzQMm/tVZWzHnXgA+Wmu3zAt38hz/98t6iloAbnqeNxGvhWF4geQZEcnNJAD4a4wZifM7MBX1en11q9X60dPwWETGrbXfe6dR1bUicpXkwe56LpdbUywWfw6EG43G8maz+V5E6gDGjTHvhh2ic25rFEXXAKzK5/NjhULhd7f+H40R4syh44UJAAAAAElFTkSuQmCC'

const starSelBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACGUlEQVRIS6WUu2sUURjFz5lZMcGohYWFjUJ0I8ju3GQLQ1TEToXFB74VwcrCPyAoGCIoWmthJSgaX/gEtROJhli4mdlVMKsBbcQmjRpcxd05komb7LqPySRTfvec3xzmO3OJWTzSHhve2PNA6rRvIe+WwmwME0yeK2v2w9fNQGvxAJPurTDf7MCu8QAlp2DM0rjOvMHKma0o6WkVyOY2JtxnzeChieWZQUgbqyDkSzrupjmD5aZ6gOKr+oDYBpo3Q43gdRPL614B/o7DVx+gBsk4CIv90MI8neEv/7+AemtS8LUdPuMg4oDWQGgLW071p8EEwA8Q8rCUh8UnlGvGAS2LBAoVc5zyzEVIJ0K1UQTkJUp9FrzHVwAdjeJtrOVVOOljwfICePbRNQiH5gfnAJz0EbLfn25FcB9kPw5A2DsnOHEHydUHy/dIVd2kzTFkv92GtCsSnLyP5NJ95Iti2VfTY+W6OlAqvY8Etu21TGRGKz21YLdrB1B6EAkMeydN5mFzcNY5CR9nI4EtnGLSO9cc7DnXI7eDuEHHOxwGHoFgahPz+9RMS2rOCJeO19kQ/O9nmQDUOiPiHxCX0WqdCWYF/zSE44AWVGgKcNJtk/2t2wq561cCvz5NG8h7iLGX60bGKtPoXWc7ijoPaffMvGUVzevP9cGjPYtR+JkB8BU2eplwh5stUTnTDR8XAC1Hy6IUO4Z+lPV/AWH9wEquVMIVAAAAAElFTkSuQmCC'
// 会议室 node结构
const renderItem = (info) => {
    let {extendedProps:{id,home, isFreeFlag, name, remark,talentType,isAttention}} = info.resource
    let editBtnIsShow = (talentType == 0 && checkPathname('/foreEnd/business/talentManage/schedule/actor/info')) || (talentType == 1 && checkPathname('/foreEnd/business/talentManage/schedule/blogger/info')) || false
    const html = `
        <div class="meetingItem">
            <div class="name">
                <img src=${isAttention ? starSelBase64 : starBase64} class="star" id=${id} isattention=${isAttention} title=${isAttention ? '取消关注' : '关注'} />
                <div class="nameLeft">
                    <p>${name}</p>
                    ${isFreeFlag ? `<div class="nameIcon">
                        <img src="${iconBase64}" alt="" class="nameIconImg"/>
                    </div>` : ''}
                </div>
                ${editBtnIsShow ? `<div class="nameEdit" id=${id}>编辑</div>` : ''}
            </div>
            <p class="base">常驻地: ${home ? home : '--'}</p>
            <p class="intro">档期说明: ${remark ? remark : '--'}</p>
        </div>
    `

    let childNodes = info.el.childNodes
    let childNodesArr = Array.from(childNodes)
    childNodesArr.map(item => {
        if(item.nodeType == 1) {
            item.innerHTML = html
        }
    })
}



export default function (info) {
    return renderItem(info)
}


