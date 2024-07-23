import { precedenceTable } from './precedence.js';

function getPrecedenceInfo(name) {
  return precedenceTable[name] || {};
}

function str_repr(node) {
  switch (node.type) {
    case "Variable":
      const { repr = node.name } = getPrecedenceInfo(node.name);
      return repr;
    case "Application":
      const { fixity = 'functional' } = getPrecedenceInfo(node.symbol.name);
      if (fixity === "functional") {
        return `${str_repr(node.symbol)}(${node.arguments.map(arg => str_repr(arg)).join(", ")})`;
      } else {
        return `${node.arguments.map(arg => str_repr(arg)).join(` ${str_repr(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_repr(element)).join(", ")})`;
    case "LogicalUnary":
      const unaryInfo = getPrecedenceInfo(node.name);
      return `${unaryInfo.repr} ${parenthesize(node, node.formula, str_repr, true)}`;
    case "Quantifier":
      const quantifierInfo = getPrecedenceInfo(node.name);
      return `${quantifierInfo.repr} ${str_repr(node.variable)} (${str_repr(node.formula)})`;
    case "LogicalBinary":
      const binaryInfo = getPrecedenceInfo(node.name);
      return `${parenthesize(node, node.left, str_repr, false, 'left')} ${binaryInfo.repr} ${parenthesize(node, node.right, str_repr, false, 'right')}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function str_unicode(node) {
  switch (node.type) {
    case "Variable":
      const { unicode = node.name } = getPrecedenceInfo(node.name);
      return unicode;
    case "Application":
      const { fixity = 'functional' } = getPrecedenceInfo(node.symbol.name);
      if (fixity === "functional") {
        return `${str_unicode(node.symbol)}(${node.arguments.map(arg => str_unicode(arg)).join(", ")})`;
      } else {
        return `${node.arguments.map(arg => str_unicode(arg)).join(` ${str_unicode(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_unicode(element)).join(", ")})`;
    case "LogicalUnary":
      const unaryInfo = getPrecedenceInfo(node.name);
      return `${unaryInfo.unicode}${parenthesize(node, node.formula, str_unicode, true)}`;
    case "Quantifier":
      const quantifierInfo = getPrecedenceInfo(node.name);
      return `${quantifierInfo.unicode}${str_unicode(node.variable)} (${str_unicode(node.formula)})`;
    case "LogicalBinary":
      const binaryInfo = getPrecedenceInfo(node.name);
      return `${parenthesize(node, node.left, str_unicode, false, 'left')} ${binaryInfo.unicode} ${parenthesize(node, node.right, str_unicode, false, 'right')}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function str_polish(node) {
  const { unicode } = getPrecedenceInfo(node.name);
  switch (node.type) {
    case "Variable":
      const { unicode = node.name } = getPrecedenceInfo(node.name);
      return unicode;
    case "Application":
      return `${str_polish(node.symbol)} ${node.arguments.map(arg => str_polish(arg)).join(" ")}`;
    case "Tuple":
      return `${', '.repeat(node.elements.length - 1)}${node.elements.map(element => str_polish(element)).join(" ")}`;
    case "LogicalUnary":
      const unaryInfo = getPrecedenceInfo(node.name);
      return `${unaryInfo.unicode} ${str_polish(node.formula)}`;
    case "Quantifier":
      const quantifierInfo = getPrecedenceInfo(node.name);
      return `${quantifierInfo.unicode} ${str_polish(node.variable)} ${str_polish(node.formula)}`;
    case "LogicalBinary":
      const binaryInfo = getPrecedenceInfo(node.name);
      return `${binaryInfo.unicode} ${str_polish(node.left)} ${str_polish(node.right)}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function parenthesize(parent, child, stringFunc, childPosition) {
  const parentInfo = getPrecedenceInfo(parent.name);
  const childInfo = getPrecedenceInfo(child.name);
  
  if (child.type === "Variable" || child.type === "Application" || child.type === "Tuple") {
    return stringFunc(child);
  }

  if (childInfo.precedence < parentInfo.precedence) {
    return stringFunc(child);
  }

  if (childInfo.precedence === parentInfo.precedence) {
    if (child.type !== "LogicalBinary") {
      return `(${stringFunc(child)})`;
    }

    if (childInfo.associativity !== parentInfo.associativity || childInfo.associativity === "none") {
      return `(${stringFunc(child)})`;
    }

    if ((parentInfo.associativity === "left" && childPosition === 'right') || (parentInfo.associativity === "right" && childPosition === 'left')) {
      return `(${stringFunc(child)})`;
    }

    if (child.name !== parent.name) {
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
