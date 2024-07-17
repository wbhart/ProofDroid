function str_repr(node) {
  switch (node.type) {
    case "Variable":
      return node.name;
    case "Application":
      if (node.fixity === "functional") {
        return `${str_repr(node.symbol)}(${node.arguments.map(arg => str_repr(arg)).join(", ")})`;
      } else {
        return `${node.arguments.map(arg => str_repr(arg)).join(` ${str_repr(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_repr(element)).join(", ")})`;
    case "LogicalUnary":
      return `${node.identifier} ${parenthesize(node, node.formula, str_repr, true)}`;
    case "Quantifier":
      return `${node.identifier} ${str_repr(node.variable)} (${str_repr(node.formula)})`;
    case "LogicalBinary":
      return `${parenthesize(node, node.left, str_repr, false, 'left')} ${node.identifier} ${parenthesize(node, node.right, str_repr, false, 'right')}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function str_unicode(node) {
  switch (node.type) {
    case "Variable":
      return node.name;
    case "Application":
      if (node.fixity === "functional") {
        return `${str_unicode(node.symbol)}(${node.arguments.map(arg => str_unicode(arg)).join(", ")})`;
      } else {
        return `${node.arguments.map(arg => str_unicode(arg)).join(` ${str_unicode(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_unicode(element)).join(", ")})`;
    case "LogicalUnary":
      return `${node.unicode}${parenthesize(node, node.formula, str_unicode, true)}`;
    case "Quantifier":
      return `${node.unicode}${str_unicode(node.variable)} (${str_unicode(node.formula)})`;
    case "LogicalBinary":
      return `${parenthesize(node, node.left, str_unicode, false, 'left')} ${node.unicode} ${parenthesize(node, node.right, str_unicode, false, 'right')}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function str_polish(node) {
  switch (node.type) {
    case "Variable":
      return node.name;
    case "Application":
      return `${str_polish(node.symbol)} ${node.arguments.map(arg => str_polish(arg)).join(" ")}`;
    case "Tuple":
      return `(${node.elements.map(element => str_polish(element)).join(" ")})`;
    case "LogicalUnary":
      return `${node.unicode} ${str_polish(node.formula)}`;
    case "Quantifier":
      return `${node.unicode} ${str_polish(node.variable)} ${str_polish(node.formula)}`;
    case "LogicalBinary":
      return `${node.unicode} ${str_polish(node.left)} ${str_polish(node.right)}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function parenthesize(parent, child, stringFunc, childPosition) {
  if (child.type === "Variable" || child.type === "Application" || child.type === "Tuple") {
    return stringFunc(child);
  }

  if (child.precedence < parent.precedence) {
    return stringFunc(child);
  }

  if (child.precedence === parent.precedence) {
    if (child.type !== "LogicalBinary") {
      return `(${stringFunc(child)})`;
    }

    if (child.associativity !== parent.associativity || child.associativity === "none") {
      return `(${stringFunc(child)})`;
    }

    if ((parent.associativity === "left" && childPosition === 'right') || (parent.associativity === "right" && childPosition === 'left')) {
      return `(${stringFunc(child)})`;
    }

    if (child.identifier !== parent.identifier) {
      return `(${stringFunc(child)})`;
    }

    return stringFunc(child);
  }

  return `(${stringFunc(child)})`;
}

export {
  str_repr,
  str_unicode,
  str_polish
};
