// moves.js
import { unify } from './unify.js';
import { is_term, vars_used, vars_rename, lists_merge, deep_copy } from './node_helper.js';
import { str_unicode } from './strings.js';

// Helper function to get the intersection of two arrays
function intersect(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

// Function to apply substitutions to a formula
function substitution(formula, subst) {
  function applySubst(node) {
    if (node.type === 'Variable' && subst[node.name]) {
      return applySubst(subst[node.name]);
    } else if (node.type === 'Application') {
      return {
        ...node,
        arguments: node.arguments.map(arg => applySubst(arg))
      };
    } else if (node.type === 'Tuple') {
      return {
        ...node,
        elements: node.elements.map(element => applySubst(element))
      };
    } else if (node.type === 'Quantifier') {
      return {
        ...node,
        variable: applySubst(node.variable),
        formula: applySubst(node.formula)
      };
    } else if (node.type === 'LogicalUnary') {
      return {
        ...node,
        formula: applySubst(node.formula)
      };
    } else if (node.type === 'LogicalBinary') {
      return {
        ...node,
        left: applySubst(node.left),
        right: applySubst(node.right)
      };
    }
    return node;
  }

  return applySubst(deep_copy(formula));
}

// Function to perform modus ponens
function modus_ponens(implication, formula) {
  // Check if the first argument is an implication
  if (!(implication.type === 'LogicalBinary' && implication.name === 'implies')) {
    return null; // Return null to indicate failure
  }

  // Deep copy the implication to avoid modifying the original
  const implicationCopy = deep_copy(implication);

  // Extract the antecedent and consequent from the implication
  const antecedent = implicationCopy.left;
  const consequent = implicationCopy.right;

  // Find all variables used in both formulas
  const varsInImplication = vars_used(implicationCopy);
  const varsInFormula = vars_used(formula);
  const inUseList = lists_merge(varsInImplication, varsInFormula);

  // Find variables that need renaming
  const needsRenamingList = intersect(varsInImplication, varsInFormula);

  // Rename conflicting variables in the implication
  vars_rename(needsRenamingList, inUseList, implicationCopy);

  // Unify the antecedent of the implication with the provided formula
  const subst = unify(implicationCopy.left, formula);

  // If unification fails, return null
  if (!subst) {
    return null;
  }

  // Apply substitutions to the consequent
  const result = substitution(consequent, subst);

  // Return the resulting formula
  return result;
}

export { modus_ponens, substitution };
