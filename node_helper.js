// node_helper.js

  // Helper functions for creating AST nodes
  function createQuantifier(variable, formula, name) {
    return { type: "Quantifier", variable: variable, formula: formula, name: name };
  }

  function createLogicalUnary(formula, name) {
    return { type: "LogicalUnary", formula: formula, name: name };
  }

  function createLogicalBinary(left, right, name) {
    return { type: "LogicalBinary", left: left, right: right, name: name };
  }

  function createApplication(symbol, count, args) {
    return { type: "Application", symbol: symbol, arguments: args.slice(0, count) };
  }

  function createConst(name) {
    return { type: "Const", name: name };
  }

  function createVariable(name) {
    return { type: "Variable", name: name, metavar: false, bound: false };
  }

  function createBinaryOp(name) {
    return { type: "BinaryOp", name: name };
  }

  function createUnaryOp(name) {
    return { type: "UnaryOp", name: name };
  }

  function createTuple(count, terms) {
    return { type: "Tuple", elements: terms.slice(0, count) };
  }

  function createSet(count, terms) {
    return { type: "Set", elements: terms.slice(0, count) };
  }

  // Binds a variable in a formula
  function bind_var(variable, formula) {
    function bind(node) {
      if (node.type === "Variable" && node.name === variable.name) {
        node.bound = true;
      } else if (node.type === "Application") {
        node.arguments.forEach(bind);
      } else if (node.type === "Tuple") {
        node.elements.forEach(bind);
      } else if (node.type === "Quantifier") {
        bind(node.formula);
      } else if (node.type === "LogicalUnary") {
        bind(node.formula);
      } else if (node.type === "LogicalBinary") {
        bind(node.left);
        bind(node.right);
      }
    }
    bind(formula);
  }

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

function negate_formula(formula) {
    // If the formula is a quantifier, apply De Morgan's laws to negate
    if (formula.type === "Quantifier") {
        if (formula.name === "forall") {
            // Negate ∀x φ -> ∃x ¬φ
            return createQuantifier(formula.variable, negate_formula(formula.formula), "exists");
        } else if (formula.name === "exists") {
            // Negate ∃x φ -> ∀x ¬φ
            return createQuantifier(formula.variable, negate_formula(formula.formula), "forall");
        }
    }

    // If the formula is already a negation, remove the negation
    if (formula.type === "LogicalUnary" && formula.name === "neg") {
        return formula.formula;
    }

    // Apply De Morgan's laws for conjunction (A ∧ B) -> (¬A ∨ ¬B)
    if (formula.type === "LogicalBinary" && formula.name === "wedge") {
        return createLogicalBinary(
            negate_formula(formula.left),
            negate_formula(formula.right),
            "vee" // Use disjunction (∨)
        );
    }

    // Apply De Morgan's laws for disjunction (A ∨ B) -> (¬A ∧ ¬B)
    if (formula.type === "LogicalBinary" && formula.name === "vee") {
        return createLogicalBinary(
            negate_formula(formula.left),
            negate_formula(formula.right),
            "wedge" // Use conjunction (∧)
        );
    }

    // For any other formula, apply negation
    return createLogicalUnary(formula, "neg");
}

export { is_term, vars_used, vars_rename, lists_merge, universal_specification, negate_formula };
