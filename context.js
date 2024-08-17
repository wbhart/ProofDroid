// context.js

let context = {
    lines: []
};

export function initializeContext() {
    context = {
        lines: []
    };
    return context;
}

export function getContext() {
    return context;
}

export function updateContext(newContext) {
    context = newContext;
}

export function addLine(formula, target = false, assumptions = [], proved = true, justification = ['Hyp', []]) {
    const newLine = {
        formula: formula,
        target: target,
        assumptions: assumptions,
        proved: proved,
        justification: justification
    };
    context.lines.push(newLine);
}

export function getLine(index) {
    return context.lines[index];
}

export function updateLine(index, updatedLine) {
    context.lines[index] = updatedLine;
}

