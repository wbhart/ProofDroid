import { precedenceTable } from './precedence.js';

function getPrecedenceInfo(name) {
  return precedenceTable[name] || {};
}

function str_repr(node) {
  const { repr = node.name } = getPrecedenceInfo(node.name);
  switch (node.type) {
    case "Const":
      return repr;
    case "UnaryOp":
      return repr;
    case "BinaryOp":
      return repr;
    case "Variable":
      return repr;
    case "Application":
      const { fixity = 'functional' } = getPrecedenceInfo(node.symbol.name);
      if (fixity === "functional") {
        return `${str_repr(node.symbol)}(${node.arguments.map(arg => str_repr(arg)).join(", ")})`;
      } else if (fixity === 'infix') {
        const binaryInfo = getPrecedenceInfo(node.symbol.name);
        return `${parenthesize(node, node.arguments[0], str_repr, false, 'left')} ${binaryInfo.repr} ${parenthesize(node, node.arguments[1], str_repr, false, 'right')}`;
      }  else {
        return `${node.arguments.map(arg => str_repr(arg)).join(` ${str_repr(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_repr(element)).join(", ")})`;
    case "Set":
      if (node.elements.length === 0) {
         const setInfo = getPrecedenceInfo('emptyset');
         return `${setInfo.repr}`;
      } else {
         return `{${node.elements.map(element => str_repr(element)).join(", ")}}`;
      }
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
  const { unicode = node.name } = getPrecedenceInfo(node.name);
  switch (node.type) {
    case "Const":
      return unicode;
    case "UnaryOp":
      return unicode;
    case "BinaryOp":
      return unicode;
    case "Variable":
      return unicode;
    case "Application":
      const { fixity = 'functional' } = getPrecedenceInfo(node.symbol.name);
      if (fixity === "functional") {
        return `${str_unicode(node.symbol)}(${node.arguments.map(arg => str_unicode(arg)).join(", ")})`;
      } else if (fixity === 'infix') {
        const binaryInfo = getPrecedenceInfo(node.symbol.name);
        return `${parenthesize(node, node.arguments[0], str_unicode, false, 'left')} ${binaryInfo.unicode} ${parenthesize(node, node.arguments[1], str_unicode, false, 'right')}`;
      }  else {
        return `${node.arguments.map(arg => str_unicode(arg)).join(` ${str_unicode(node.symbol)} `)}`;
      }
    case "Tuple":
      return `(${node.elements.map(element => str_unicode(element)).join(", ")})`;
    case "Set":
      if (node.elements.length === 0) {
         const setInfo = getPrecedenceInfo('emptyset');
         return `${setInfo.unicode}`;
      } else {
         return `{${node.elements.map(element => str_unicode(element)).join(", ")}}`;
      }
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
  const { unicode = node.name } = getPrecedenceInfo(node.name);
  switch (node.type) {
    case "Const":
      return unicode;
    case "UnaryOp":
      return uniocode;
    case "BinaryOp":
      return unicode;
    case "Variable":
      return unicode;
    case "Application":
      return `${str_polish(node.symbol)} ${node.arguments.map(arg => str_polish(arg)).join(" ")}`;
    case "Tuple":
      if (node.elements.length === 0) {
         return `()`;
      } else {
         return `${', '.repeat(node.elements.length - 1)}${node.elements.map(element => str_polish(element)).join(" ")}`;
      }
    case "Set":
      if (node.elements.length === 0) {
         const setInfo = getPrecedenceInfo('emptyset');
         return `${setInfo.unicode}`;
      } else {
         return `Set ${', '.repeat(node.elements.length - 1)}${node.elements.map(element => str_polish(element)).join(" ")}`;
      }
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

function str_mathjax(node) {
  const { mathjax = node.name } = getPrecedenceInfo(node.name);
  switch (node.type) {
    case "Const":
      return mathjax;
    case "UnaryOp":
      return mathjax;
    case "BinaryOp":
      return mathjax;
    case "Variable":
      return mathjax;
    case "Application":
      const { fixity = 'functional' } = getPrecedenceInfo(node.symbol.name);
      if (fixity === "functional") {
        return `${str_mathjax(node.symbol)}\\left(${node.arguments.map(arg => str_mathjax(arg)).join(", ")}\\right)`;
      } else if (fixity === 'infix') {
        const binaryInfo = getPrecedenceInfo(node.symbol.name);
        return `${parenthesize(node, node.arguments[0], str_mathjax, false, 'left')} ${binaryInfo.mathjax} ${parenthesize(node, node.arguments[1], str_mathjax, false, 'right')}`;
      } else {
        return `${node.arguments.map(arg => str_mathjax(arg)).join(` ${str_mathjax(node.symbol)} `)}`;
      }
    case "Tuple":
      return `\\left(${node.elements.map(element => str_mathjax(element)).join(", ")}\\right)`;
    case "Set":
      if (node.elements.length === 0) {
         const setInfo = getPrecedenceInfo('emptyset');
         return `${setInfo.mathjax}`;
      } else {
         return `\\left\\{${node.elements.map(element => str_mathjax(element)).join(", ")}\\right\\}`;
      }
    case "LogicalUnary":
      const unaryInfo = getPrecedenceInfo(node.name);
      return `${unaryInfo.mathjax} ${parenthesize(node, node.formula, str_mathjax, true)}`;
    case "Quantifier":
      const quantifierInfo = getPrecedenceInfo(node.name);
      return `${quantifierInfo.mathjax} ${str_mathjax(node.variable)} \\left(${str_mathjax(node.formula)}\\right)`;
    case "LogicalBinary":
      const binaryInfo = getPrecedenceInfo(node.name);
      return `${parenthesize(node, node.left, str_mathjax, false, 'left')} ${binaryInfo.mathjax} ${parenthesize(node, node.right, str_mathjax, false, 'right')}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function parenthesize(parent, child, stringFunc, childPosition) {
  if (child.type === 'Variable' || child.type === 'Const' || child.type === 'Tuple' || child.type === 'Set') {
    return stringFunc(child);
  }
  
  const parentInfo = getPrecedenceInfo(parent.type === 'Application' ? parent.symbol.name : parent.name);
  const childInfo = getPrecedenceInfo(child.type === 'Application' ? child.symbol.name : child.name);

  if (child.type === 'Application' && childInfo.fixity === 'functional') {
    return stringFunc(child);
  }

  if (childInfo.precedence < parentInfo.precedence) {
    return stringFunc(child);
  }

  if (childInfo.precedence === parentInfo.precedence) {
    if (child.type !== 'LogicalBinary' && child.type !== 'BinaryOp') {
      return `(${stringFunc(child)})`;
    }

    if (childInfo.associativity !== parentInfo.associativity || childInfo.associativity === 'none') {
      return `(${stringFunc(child)})`;
    }

    if ((parentInfo.associativity === "left" && childPosition === 'right') || (parentInfo.associativity === 'right' && childPosition === 'left')) {
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
  str_polish,
  str_mathjax
};
