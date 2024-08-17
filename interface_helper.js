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
            caretPos = preCaretRange.toString().length;  // Get caret position by measuring text length before caret

            // Get the text before the caret and split into lines to determine the current line number
            const textBeforeCaret = preCaretRange.toString();
            const linesBeforeCaret = textBeforeCaret.split('\n');
            currentLineIndex = linesBeforeCaret.length - 1;  // The current line index is the last line before caret
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
