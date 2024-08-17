// interface_helper.js

export function getCaretPosition(ctrl) {
    let caretPos = 0;
    let currentLineIndex = 0;

    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(ctrl);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretPos = preCaretRange.toString().length;

            // Walk through the nodes up to the caret position and count the lines (based on block-level elements)
            const childNodes = ctrl.childNodes;
            let charsCount = 0;

            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i];
                if (node.nodeType === Node.TEXT_NODE) {
                    const nodeText = node.textContent || '';
                    charsCount += nodeText.length;

                    if (charsCount >= caretPos) {
                        break;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === 'DIV' || node.nodeName === 'P' || node.nodeName === 'BR')) {
                    currentLineIndex++;
                    if (charsCount >= caretPos) {
                        break;
                    }
                }
            }
        }
    }

    return { pos: caretPos, line: currentLineIndex };
}

export function getCurrentLine(editableDiv) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return ''; // Return empty string if no range is selected

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editableDiv);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    const textBeforeCaret = preCaretRange.toString();
    const lines = textBeforeCaret.split('\n');

    // Find the caret's position within the contenteditable div
    let caretPosition = textBeforeCaret.length;

    // Determine the current line based on caret position
    let currentLineIndex = 0;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 for the newline character
        if (charCount > caretPosition) {
            currentLineIndex = i;
            break;
        }
    }
    return lines[currentLineIndex] || ''; // Return the current line or empty string if undefined
}
