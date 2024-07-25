// node_helper.js

// Helper function to deep copy an object
function deep_copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function is_term(node) {
  if (node.type === "Variable") {
    return true;
  } else if (node.type === "Application") {
    return node.arguments.every(is_term);
  } else if (node.type === "Tuple") {
    return node.elements.every(is_term);
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
  const newName = (name) => {
    let baseName = name;
    let num = 0;

    const match = name.match(/(.*)_(\d+)$/);
    if (match) {
      baseName = match[1];
      num = parseInt(match[2], 10);
    }

    let newName = `${baseName}_${num}`;
    while (inUse.includes(newName)) {
      num++;
      newName = `${baseName}_${num}`;
    }

    return newName;
  };

  function rename(node) {
    if (node.type === "Variable" && needRename.includes(node.name)) {
      const newNameValue = newName(node.name);
      inUse.push(newNameValue);
      node.name = newNameValue;
    } else if (node.type === "Application") {
      node.arguments.forEach(rename);
    } else if (node.type === "Tuple") {
      node.elements.forEach(rename);
    } else if (node.type === "Quantifier") {
      if (needRename.includes(node.variable.name)) {
        const newNameValue = newName(node.variable.name);
        inUse.push(newNameValue);
        node.variable.name = newNameValue;
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

export { is_term, vars_used, vars_rename, lists_merge, deep_copy };

