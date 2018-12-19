({
/** class C { static { return this; } } **/
'class static block':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'ClassInitializer',
               body:
                { type: 'FunctionBody',
                  statements:
                   [ { type: 'ReturnStatement',
                       argument: { type: 'ThisExpression' } } ] } } ] } } ] },

/** class C { static {} static {} } **/
'duplicate static blocks are not allowed': {},

})
