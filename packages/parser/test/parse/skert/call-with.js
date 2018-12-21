({

/** obj->foo(1) **/
'call with':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'CallWithExpression',
          subject: { type: 'Identifier', value: 'obj' },
          callee: { type: 'Identifier', value: 'foo' },
          arguments: [ { type: 'NumberLiteral', value: 1 } ],
          trailingComma: false } } ] },

/** obj->foo.bar(1) **/
'right hand side can include a member expression':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'CallWithExpression',
          subject: { type: 'Identifier', value: 'obj' },
          callee:
           { type: 'MemberExpression',
             object: { type: 'Identifier', value: 'foo' },
             property: { type: 'Identifier', value: 'bar' } },
             arguments: [ { type: 'NumberLiteral', value: 1 } ],
          trailingComma: false } } ] },

});
