({

/** async { await 1 } **/
'':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'AsyncExpression',
          body:
           { type: 'FunctionBody',
             statements:
              [ { type: 'ExpressionStatement',
                  expression:
                   { type: 'UnaryExpression',
                     operator: 'await',
                     expression: { type: 'NumberLiteral', value: 1 } } } ] } } } ] },

})
