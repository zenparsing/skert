({

/** #[a, b] function f() {} **/
'function declaration':
{ type: 'Script',
  statements:
   [ { type: 'FunctionDeclaration',
       kind: '',
       identifier: { type: 'Identifier', value: 'f' },
       params: [],
       body: { type: 'FunctionBody', statements: [] } } ] },

/*** #[a] function f() {} ***/
'function declaration in module':
{ type: 'Module',
  statements:
   [ { type: 'FunctionDeclaration',
       kind: '',
       identifier: { type: 'Identifier', value: 'f' },
       params: [],
       body: { type: 'FunctionBody', statements: [] } } ] },

/*** #[a] export function f() {} ***/
'exported function declaration':
{ type: 'Module',
  statements:
   [ { type: 'ExportDeclaration',
       declaration:
        { type: 'FunctionDeclaration',
          kind: '',
          identifier: { type: 'Identifier', value: 'f' },
          params: [],
          body: { type: 'FunctionBody', statements: [] } } } ] },

/** #[a, b] class C {} **/
'class declaration':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body: { type: 'ClassBody', elements: [] } } ] },

/*** #[a] class C {} ***/
'class declaration in module':
{ type: 'Module',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body: { type: 'ClassBody', elements: [] } } ] },

/*** #[a] export class C {} ***/
'exported class declaration':
{ type: 'Module',
  statements:
   [ { type: 'ExportDeclaration',
       declaration:
        { type: 'ClassDeclaration',
          identifier: { type: 'Identifier', value: 'C' },
          base: null,
          mixins: [],
          body: { type: 'ClassBody', elements: [] } } } ] },

/** #[a] x; **/
'cannot annotate expression statement': {},

/** ({ #[a] x: 1 }) **/
'property definition':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'ParenExpression',
          expression:
           { type: 'ObjectLiteral',
             properties:
              [ { type: 'PropertyDefinition',
                  name: { type: 'Identifier', value: 'x' },
                  expression: { type: 'NumberLiteral', value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ #[a] x() {} }) **/
'method definition':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'ParenExpression',
          expression:
           { type: 'ObjectLiteral',
             properties:
              [ { type: 'MethodDefinition',
                  static: false,
                  kind: '',
                  name: { type: 'Identifier', value: 'x' },
                  params: [],
                  body: { type: 'FunctionBody', statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ #[a] get x() {} }) **/
'getter definition':
{ type: 'Script',
  statements:
   [ { type: 'ExpressionStatement',
       expression:
        { type: 'ParenExpression',
          expression:
           { type: 'ObjectLiteral',
             properties:
              [ { type: 'MethodDefinition',
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', value: 'x' },
                  params: [],
                  body: { type: 'FunctionBody', statements: [] } } ],
             trailingComma: false } } } ] },

/** class C { #[a] x = 1 } **/
'class field':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'ClassField',
               static: false,
               name: { type: 'Identifier', value: 'x' },
               initializer: { type: 'NumberLiteral', value: 1 } } ] } } ] },

/** class C { #[a] static x = 1 } **/
'class static field':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'ClassField',
               static: true,
               name: { type: 'Identifier', value: 'x' },
               initializer: { type: 'NumberLiteral', value: 1 } } ] } } ] },

/** class C { #[a] x() {} } **/
'class method':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'MethodDefinition',
               static: false,
               kind: '',
               name: { type: 'Identifier', value: 'x' },
               params: [],
               body: { type: 'FunctionBody', statements: [] } } ] } } ] },

/** class C { #[a] static x() {} } **/
'class static method':
{ type: 'Script',
  statements:
   [ { type: 'ClassDeclaration',
       identifier: { type: 'Identifier', value: 'C' },
       base: null,
       mixins: [],
       body:
        { type: 'ClassBody',
          elements:
           [ { type: 'MethodDefinition',
               static: true,
               kind: '',
               name: { type: 'Identifier', value: 'x' },
               params: [],
               body: { type: 'FunctionBody', statements: [] } } ] } } ] },

})
