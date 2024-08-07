// unify.js
import { is_term } from './node_helper.js';

// Clone a substitution list (mgu)
function clone_subst(subst) {
  return { ...subst };
}

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
    } else if (x.type === "Const" && x.name === y.name) {
      return subst;
    } else if (x.type === "Application" && x.symbol.name === y.symbol.name && x.arguments.length === y.arguments.length) {
      return unify_lists(x.arguments, y.arguments, subst);
    } else if (x.type === "Tuple" && x.elements.length === y.elements.length) {
      return unify_lists(x.elements, y.elements, subst);
    } else if (x.type === "Set") {
      return unify_sets(x.elements, y.elements, subst);
    } else if (x.type === "LogicalBinary" && x.name === y.name) {
      const leftUnify = unify(x.left, y.left, subst);
      return leftUnify !== null ? unify(x.right, y.right, leftUnify) : null;
    } else if (x.type === "LogicalUnary" && x.name === y.name) {
      return unify(x.formula, y.formula, subst);
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

// Unify sets of terms
function unify_sets(xs, ys, subst) {
  const dealtWithXs = new Set();
  const dealtWithYs = new Set();
  let newSubst = subst;

  // First pass: Find all elements in xs that unify with precisely one element in ys
  for (let i = 0; i < xs.length; i++) {
    let match = null;
    for (let j = 0; j < ys.length; j++) {
      const substCopy = clone_subst(newSubst);
      const unifiedSubst = unify(xs[i], ys[j], substCopy);
      if (unifiedSubst !== null) {
        if (match !== null) {
          match = null; // More than one match found, ignore this element
          break;
        }
        match = [unifiedSubst, j];
      }
    }
    if (match !== null) {
      newSubst = match[0];
      dealtWithXs.add(i);
      dealtWithYs.add(match[1]);
    }
  }

  // Second pass: Find all elements in ys that haven't had at least one thing unified with them
  for (let j = 0; j < ys.length; j++) {
    if (!dealtWithYs.has(j)) {
      let match = null;
      for (let i = 0; i < xs.length; i++) {
        const substCopy = clone_subst(newSubst);
        const unifiedSubst = unify(ys[j], xs[i], substCopy);
        if (unifiedSubst !== null) {
          if (match !== null) {
            return null; // More than one match found, fail immediately
          }
          match = [unifiedSubst, i];
        }
      }
      if (match !== null) {
        newSubst = match[0];
        dealtWithYs.add(j);
        dealtWithXs.add(match[1]);
      } else {
        return null; // Failed to unify an element in ys with precisely one element in xs
      }
    }
  }

  // Check if all elements have been dealt with
  if (dealtWithXs.size === xs.length && dealtWithYs.size === ys.length) {
    return newSubst;
  } else {
    return null;
  }
}

// Extend the substitution
function extend_subst(v, x, subst) {
  const newSubst = { ...subst };
  newSubst[v.name] = x;
  return newSubst;
}

export { unify, is_term };
