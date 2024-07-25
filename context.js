// context.js

let context = {
    formulas: []
};

export function initializeContext() {
    context = {
        formulas: []
    };
    return context;
}

export function getContext() {
    return context;
}

export function updateContext(newContext) {
    context = newContext;
}

