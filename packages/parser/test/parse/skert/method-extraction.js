({

/** &obj.fn **/
'method extraction':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'UnaryExpression',
          operator: '&',
          expression:
           { type: 'MemberExpression',
             object: { type: 'Identifier', value: 'obj' },
             property: { type: 'Identifier', value: 'fn' } } } } ] },

/** &obj **/
'method extraction must be applied to member expressions': {},

});
