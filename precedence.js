export const precedenceTable = {
  forall: { precedence: 0, associativity: 'none', fixity: 'none', repr: '\\forall', unicode: '∀', mathjax: '\\forall' },
  exists: { precedence: 0, associativity: 'none', fixity: 'none', repr: '\\exists', unicode: '∃', mathjax: '\\exists' },
  wedge: { precedence: 3, associativity: 'left', fixity: 'infix', repr: '\\wedge', unicode: '∧', mathjax: '\\wedge' },
  vee: { precedence: 3, associativity: 'left', fixity: 'infix', repr: '\\vee', unicode: '∨', mathjax: '\\vee' },
  neg: { precedence: 0, associativity: 'none', fixity: 'prefix', repr: '\\neg', unicode: '¬', mathjax: '\\neg' },
  implies: { precedence: 4, associativity: 'none', fixity: 'infix', repr: '\\implies', unicode: '→', mathjax: '\\to' },
  iff: { precedence: 4, associativity: 'right', fixity: 'infix', repr: '\\iff', unicode: '↔', mathjax: '\\iff' },
  equals: { precedence: 2, associativity: 'none', fixity: 'infix', repr: '=', unicode: '=', mathjax: '=' },
};

