({

/** ({ @foo: 1 }) **/
'symbol name in object literal':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'ParenExpression',
          expression:
           { type: 'ObjectLiteral',
             properties:
              [ { type: 'PropertyDefinition',
                  name: { type: 'SymbolName', value: '@foo' },
                  expression: { type: 'NumberLiteral', value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ @foo }) **/
'shorthand property syntax not allowed with symbol names': {},

/** @foo = 1 **/
'symbol names not allowed as primary expression': {},

})
