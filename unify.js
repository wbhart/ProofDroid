// unify.js
import { is_term } from './node_helper.js';

// Unification function
function unify(x, y, subst = {}) {
  if (x.type === "Variable" && x.metavar) {
    return unify_metavar(x, y, subst);
  } else if (y.type === "Variable" && y.metavar) {
    return unify_metavar(y, x, subst);
  } else if (x.type === "Variable" && !x.bound) {
    return is_term(y) ? unify_var(x, y, subst) : null;
  } else if (y.type === "Variable" && !y.bound) {
    return is_term(x) ? unify_var(y, x, subst) : null;
  } else if (x.type === y.type) {
    if (x.type === "Variable" && x.name === y.name) {
      return subst;
    } else if (x.type === "Application" && x.symbol.name === y.symbol.name && x.arguments.length === y.arguments.length) {
      return unify_lists(x.arguments, y.arguments, subst);
    } else if (x.type === "Tuple" && x.elements.length === y.elements.length) {
      return unify_lists(x.elements, y.elements, subst);
    }
  }
  return null;
}

// Unify lists of terms
function unify_lists(xs, ys, subst) {
  if (xs.length === 0 && ys.length === 0) {
    return subst;
  } else {
    const firstUnify = unify(xs[0], ys[0], subst);
    if (firstUnify !== null) {
      return unify_lists(xs.slice(1), ys.slice(1), firstUnify);
    }
  }
  return null;
}

// Unify a variable with a term
function unify_var(v, x, subst) {
  if (v.name in subst) {
    return unify(subst[v.name], x, subst);
  } else if (x.name in subst) {
    return unify(v, subst[x.name], subst);
  } else {
    return extend_subst(v, x, subst);
  }
}

// Unify a metavariable with a formula
function unify_metavar(mv, x, subst) {
  if (mv.name in subst) {
    return unify(subst[mv.name], x, subst);
  } else {
    return extend_subst(mv, x, subst);
  }
}

// Extend the substitution
function extend_subst(v, x, subst) {
  const newSubst = Object.assign({}, subst);
  newSubst[v.name] = x;
  return newSubst;
}

export { unify, is_term };

