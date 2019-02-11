({

/** class C { static { x; } } **/
'class initializer':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'ClassInitializer',
               statements:
                [ { type: 'ExpressionStatement',
                    expression: { type: 'Identifier', value: 'x' } } ] } ] } } ] },

/** class C { static { return 1 } } **/
'return not allowed': {},

})
