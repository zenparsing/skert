({

/** #[a, b] #[c] function f() {} **/
'function declaration':
[ { nodeType: 'FunctionDeclaration',
    list:
     [ { type: 'Annotation',
         expressions:
          [ { type: 'SequenceExpression',
              expressions:
               [ { type: 'Identifier', value: 'a', context: 'variable' },
                 { type: 'Identifier', value: 'b', context: 'variable' } ] } ] },
       { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'c', context: 'variable' } ] } ] } ],

});
