// interface_helper.js

export function getCaretPosition(ctrl) {
    var caretPos = 0;
    if (document.selection) {
        ctrl.focus();
        var sel = document.selection.createRange();
        sel.moveStart('character', -ctrl.value.length);
        caretPos = sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
        caretPos = ctrl.selectionStart;
    }
    return caretPos;
}

export function getCurrentLine(textarea) {
    const caretPosition = getCaretPosition(textarea);
    const text = textarea.value;
    const lines = text.split('\n');
    let currentLine = 0;
    let charCount = 0;

    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 for the newline character
        if (charCount > caretPosition) {
            currentLine = i;
            break;
        }
    }
    return lines[currentLine];
}

