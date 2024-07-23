export const precedenceTable = {
  forall: { precedence: 0, associativity: 'none', fixity: 'none', repr: '\\forall', unicode: '∀' },
  exists: { precedence: 0, associativity: 'none', fixity: 'none', repr: '\\exists', unicode: '∃' },
  wedge: { precedence: 3, associativity: 'left', fixity: 'infix', repr: '\\wedge', unicode: '∧' },
  vee: { precedence: 3, associativity: 'left', fixity: 'infix', repr: '\\vee', unicode: '∨' },
  neg: { precedence: 0, associativity: 'none', fixity: 'prefix', repr: '\\neg', unicode: '¬' },
  implies: { precedence: 4, associativity: 'none', fixity: 'infix', repr: '\\implies', unicode: '→' },
  iff: { precedence: 4, associativity: 'right', fixity: 'infix', repr: '\\iff', unicode: '↔' },
  equals: { precedence: 2, associativity: 'none', fixity: 'infix', repr: '=', unicode: '=' },
};

