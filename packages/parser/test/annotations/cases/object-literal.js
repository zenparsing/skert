({

/** ({ #[a, b] #[c] m() {} }) **/
'object literal methods':
[ { nodeType: 'MethodDefinition',
    list:
     [ { type: 'Annotation',
         expressions:
          [ { type: 'Identifier', value: 'a', context: 'variable' },
            { type: 'Identifier', value: 'b', context: 'variable' } ] },
       { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'c', context: 'variable' } ] } ] } ],

  /** ({ #[a] x: 1 }) **/
'object literal properties':
[ { nodeType: 'PropertyDefinition',
    list:
     [ { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'a', context: 'variable' } ] } ] } ],

});
