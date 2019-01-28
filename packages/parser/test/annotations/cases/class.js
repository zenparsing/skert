({

/** #[a, b] #[c] class C {} **/
'class declaration':
[ { nodeType: 'ClassDeclaration',
    list:
     [ { type: 'Annotation',
         expressions:
          [ { type: 'Identifier', value: 'a', context: 'variable' },
            { type: 'Identifier', value: 'b', context: 'variable' } ] },
       { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'c', context: 'variable' } ] } ] } ],

/** class C { #[a] m() {} } **/
'class methods':
[ { nodeType: 'MethodDefinition',
    list:
     [ { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'a', context: 'variable' } ] } ] } ],

/*** #[a] class C {} ***/
'class in module':
[ { nodeType: 'ClassDeclaration',
    list:
     [ { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'a', context: 'variable' } ] } ] } ],

/*** #[a] export class C {} ***/
'exported class':
[ { nodeType: 'ClassDeclaration',
    list:
     [ { type: 'Annotation',
         expressions: [ { type: 'Identifier', value: 'a', context: 'variable' } ] } ] } ],

});
