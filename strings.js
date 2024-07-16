function str_repr(node) {
  return toString(node, 'identifier');
}

function str_unicode(node) {
  return toString(node, 'unicode');
}

function str_polish(node) {
  return toPolish(node, 'unicode');
}

function toString(node, field) {
  switch (node.type) {
    case "Variable":
      return node.name;
    case "Predicate":
      return `${node[field]}(${node.arguments.map(arg => toString(arg, field)).join(", ")})`;
    case "Function":
      return `${node.functionName}(${node.arguments.map(arg => toString(arg, field)).join(", ")})`;
    case "Set":
      return `{${node.elements.map(element => toString(element, field)).join(", ")}}`;
    case "Tuple":
      return `(${node.elements.map(element => toString(element, field)).join(", ")})`;
    case "Negation":
      return `${node[field]}${parenthesize(node.formula, node.precedence, toString, field)}`;
    case "Quantifier":
      return `${node[field]} ${toString(node.variable, field)} ${toString(node.formula, field)}`;
    case "BinaryConnective":
      return `${parenthesize(node.left, node.precedence, toString, field)} ${node[field]} ${parenthesize(node.right, node.precedence, toString, field)}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function toPolish(node, field) {
  switch (node.type) {
    case "Variable":
      return node.name;
    case "Predicate":
      return `${node[field]} ${node.arguments.map(arg => toPolish(arg, field)).join(" ")}`;
    case "Function":
      return `${node.functionName} ${node.arguments.map(arg => toPolish(arg, field)).join(" ")}`;
    case "Set":
      return `{${node.elements.map(element => toPolish(element, field)).join(", ")}}`;
    case "Tuple":
      return `(${node.elements.map(element => toPolish(element, field)).join(", ")})`;
    case "Negation":
      return `${node[field]} ${toPolish(node.formula, field)}`;
    case "Quantifier":
      return `${node[field]} ${toPolish(node.variable, field)} ${toPolish(node.formula, field)}`;
    case "BinaryConnective":
      return `${node[field]} ${toPolish(node.left, field)} ${toPolish(node.right, field)}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function parenthesize(child, parentPrecedence, stringFunc, field) {
  if (child.type === "Variable" || child.type === "Predicate" || child.type === "Function" || child.type === "Set" || child.type === "Tuple") {
    return stringFunc(child, field);
  }
  if (child.precedence > parentPrecedence) {
    return stringFunc(child, field);
  }
  if (child.precedence === parentPrecedence && (child.associativity === "right" || child.type !== "BinaryConnective")) {
    return `(${stringFunc(child, field)})`;
  }
  if (child.precedence === parentPrecedence && (child.associativity === "left" || child.type !== "BinaryConnective")) {
    return `(${stringFunc(child, field)})`;
  }
  return `(${stringFunc(child, field)})`;
}

export {
  str_repr,
  str_unicode,
  str_polish
};
