import { createRunner } from '../runner.js';

const test = createRunner();

test('class declaration initializer', `
  class A {
    static {
      register(this);
    }
  }
`, `
  class A {}

  (function() {
    register(this);
  }).call(A);
`);

test(`multiple class initializers`, `
  class A {
    static {
      register(this);
    }
    static {
      register(this);
    }
  }
`, `
  class A {}

  (function() {
    register(this);
    register(this);
  }).call(A);
`);

test('class expression initializer', `
  (class A {
    static {
      register(this);
    }
  })
`, `
  ((function() {
    register(this);
  }).call(class A {}));
`);

test('class expression with new', `
  new class A {
    static {
      register(this);
    }
  }
`, `
  new ((function() {
    register(this);
  }).call(class A {}));
`);
