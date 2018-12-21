({

/** x ?? y **/
'null-or operator':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'BinaryExpression',
          left: { type: 'Identifier', value: 'x' },
          operator: '??',
          right: { type: 'Identifier', value: 'y' } } } ] },

/** x ?? y || z **/
'null has lower precedence than logical-or':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'BinaryExpression',
          left: { type: 'Identifier', value: 'x' },
          operator: '??',
          right:
           { type: 'BinaryExpression',
             left: { type: 'Identifier', value: 'y' },
             operator: '||',
             right: { type: 'Identifier', value: 'z' } } } } ] },

});
