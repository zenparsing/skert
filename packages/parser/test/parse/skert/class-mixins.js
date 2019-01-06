({

/** class A with B, C {} **/
'class declaration mixins':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'A' },
       base: null,
       mixins:
        [ { type: 'Identifier', value: 'B' },
          { type: 'Identifier', value: 'C' } ],
       body: { type: 'ClassBody', elements: [] } } ] },

/** (class with A, B {}); **/
'class expression mixins':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'ParenExpression',
          expression:
           { type: 'ClassExpression',
             identifier: null,
             base: null,
             mixins:
              [ { type: 'Identifier', value: 'A' },
                { type: 'Identifier', value: 'B' } ],
             body: { type: 'ClassBody', elements: [] } } } } ] },

})
