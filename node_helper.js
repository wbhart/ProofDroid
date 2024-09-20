// node_helper.js

function is_term(node) {
  if (node.type === "Variable") {
    return true;
  } else if (node.type === "Application") {
    return true;
  } else if (node.type === "Tuple") {
    return true;
  } else if (node.type === "Set") {
    return true;
  }
  return false;
}

function vars_used(node) {
  const vars = new Set();

  function collect(node) {
    if (node.type === "Variable") {
      vars.add(node.name);
    } else if (node.type === "Application") {
      node.arguments.forEach(collect);
    } else if (node.type === "Tuple") {
      node.elements.forEach(collect);
    } else if (node.type === "Set") {
      node.elements.forEach(collect);
    } else if (node.type === "Quantifier") {
      vars.add(node.variable.name);
      collect(node.formula);
    } else if (node.type === "LogicalUnary") {
      collect(node.formula);
    } else if (node.type === "LogicalBinary") {
      collect(node.left);
      collect(node.right);
    }
  }

  collect(node);
  return Array.from(vars);
}

function vars_rename(needRename, inUse, node) {
  const renameMap = new Map();

  const newName = (name) => {
    if (renameMap.has(name)) {
      return renameMap.get(name);
    }

    let baseName = name;
    let num = 0;

    const match = name.match(/(.*)_(\d+)$/);
    if (match) {
      baseName = match[1];
      num = parseInt(match[2], 10);
    }

    let newName = `${baseName}_${num}`;
    while (inUse.includes(newName) || renameMap.has(newName)) {
      num++;
      newName = `${baseName}_${num}`;
    }

    renameMap.set(name, newName);
    inUse.push(newName);
    return newName;
  };

  function rename(node) {
    if (node.type === "Variable" && needRename.includes(node.name)) {
      node.name = newName(node.name);
    } else if (node.type === "Application") {
      node.arguments.forEach(rename);
    } else if (node.type === "Tuple") {
      node.elements.forEach(rename);
    } else if (node.type === "Set") {
      node.elements.forEach(rename);
    } else if (node.type === "Quantifier") {
      if (needRename.includes(node.variable.name)) {
        node.variable.name = newName(node.variable.name);
      }
      rename(node.formula);
    } else if (node.type === "LogicalUnary") {
      rename(node.formula);
    } else if (node.type === "LogicalBinary") {
      rename(node.left);
      rename(node.right);
    }
  }

  rename(node);
}

function lists_merge(list1, list2) {
  return Array.from(new Set([...list1, ...list2]));
}

function universal_specification(formula) {
  // Step 1: Check if the top-level node is a universal quantifier
  if (formula.type === "Quantifier" && formula.name === "forall") {
    const variable = formula.variable; // The variable being quantified
    const subformula = formula.formula; // The formula under the quantifier

    // Step 2: Traverse the subformula and unbind the variable
    const updatedFormula = unbind_variable(subformula, variable.name);

    // Step 3: Return the formula without the top-level quantifier
    return updatedFormula;
  }

  // If it's not a universal quantifier, return the formula as is
  return formula;
}

// Helper function to traverse the formula and unbind the variable
function unbind_variable(node, varName) {
  // If the node is a variable, check if it matches the quantifier's variable
  if (node.type === "Variable" && node.name === varName) {
    // Unbind the variable by setting bound to false
    return { ...node, bound: false };
  }

  // If the node is a quantifier, logical binary, application, tuple, or set, we need to recurse into its substructures

  // Handle Quantifiers
  if (node.type === "Quantifier") {
    // Recursively unbind the variable in the inner formula
    return { ...node, formula: unbind_variable(node.formula, varName) };
  }

  // Handle Logical Unary Operations
  if (node.type === "LogicalUnary") {
    return { ...node, formula: unbind_variable(node.formula, varName) };
  }

  // Handle Logical Binary Operations
  if (node.type === "LogicalBinary") {
    return {
      ...node,
      left: unbind_variable(node.left, varName),
      right: unbind_variable(node.right, varName)
    };
  }

  // Handle Applications
  if (node.type === "Application") {
    return {
      ...node,
      arguments: node.arguments.map(arg => unbind_variable(arg, varName))
    };
  }

  // Handle Tuples
  if (node.type === "Tuple") {
    return {
      ...node,
      elements: node.elements.map(elem => unbind_variable(elem, varName))
    };
  }

  // Handle Sets
  if (node.type === "Set") {
    return {
      ...node,
      elements: node.elements.map(elem => unbind_variable(elem, varName))
    };
  }

  // For other node types (like constants, binary/unary operators), return the node as is since they don't contain variables
  return node;
}

export { is_term, vars_used, vars_rename, lists_merge, universal_specification };
