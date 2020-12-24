export const getPosition = function (element) {
    let cursorPos = 0;
    if (document.selection) {//IE
        var selectRange = document.selection.createRange();
        selectRange.moveStart('character', -element.value.length);
        cursorPos = selectRange.text.length;
    } else if (element.selectionEnd || element.selectionEnd == '0') {
        cursorPos = element.selectionEnd;
        // console.log('selectionStart',element.selectionStart)
        // console.log('selectionEnd',element.selectionEnd)
    }
    return cursorPos;
}





