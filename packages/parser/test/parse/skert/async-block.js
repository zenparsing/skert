({

/** async { await 1 } **/
'async block':
{ type: 'Script',
  statements:
   [ { type: 'AsyncBlock',
       statements:
        [ { type: 'ExpressionStatement',
            expression:
             { type: 'UnaryExpression',
               operator: 'await',
               expression: { type: 'NumberLiteral', value: 1 } } } ] } ] },

/** (async {}) **/
'async block not allowed in statement position': {},

/** async { return 1; } **/
'return not allowed in async block': {},

})
