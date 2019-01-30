# JavaScript of My Dreams 2019

In January 2011, Brendan Eich published [Harmony of My Dreams](https://brendaneich.com/2011/01/harmony-of-my-dreams/) on his blog. It was a holistic vision for how JavaScript might evolve out of the pre-ES6 and pre-Babel era. Many features from that vision are in widespread use today, albeit dressed up in slightly different clothes (we use arrow functions instead of hash-rockets, thankfully).

I believe that in January 2019 we are long overdue for an updated vision. We seem to be stuck on an evolutionary journey mapped and planned in 2016, and the tower on the horizon recedes further away at every TC39 meeting. Even when we are able to successfully muscle a proposal through, the community backlash has in some cases been overwhelming. It all leads one to ask: where are we going, and why are we going there? And is there a better way forward?

## Goals

Let's start with some goals and design principles.

### Grow to shrink

In his blog post, Brendan Eich argues for the design principle "grow to shrink":

> If we do this right, Harmony’s kernel semantics do not grow inordinately in complexity. Then users merely have to choose to use the simpler new syntax over the old, and for those users (and possibly for everyone, many years hence — sooner, if you use a translator to "lower" Harmony to JS-as-it-is), JS is in fact more usable and smaller in its critical dimensions.

If we are going to evolve JavaScript in a way that makes it more usable instead of less, then we must demand that **every** new feature pay for itself with an overall reduction in the mental burden placed on users and students of the language.

### Be conservative

JavaScript is used by millions of people worldwide for an unbelievable range of tasks, but we must remember that JavaScript is ultimately a language for writing practical software applications. It is not a research language.

### Keep it JS

Because JavaScript is so popular there will always be pressure to evolve the language away from its core strengths: it's a highly malleable dynamically typed language which provides very natural support for object-oriented programming styles and rather good (although not great) support for functional programming. That peculiar mix is essential to the nature and success of JavaScript and we must be cautious with features that tend to shift that balance.

See [Some Principles for the Guided Evolution of JavaScript](./principles.md) for more.

With those high-level goals in mind, what might the future of JS look like? Here are some of my ideas:

## Call-With Operator

When integrating function-oriented code with object-oriented code, we frequently run into the "inside-out-chaining" problem:

```js
import { doA, doB } from 'utils';
doB(doA(someObject.foo()));
```

I want to express the idea that I first call the "foo" method, then call `doA` with the result, and then call `doB` with the result of that operation. But instead I have to write everything "inside-out".

What if I could write this instead?

```js
import { doA, doB } from 'utils';
someObject.foo()->doA()->doB();
```

The thin arrow operator (`->`) simply calls the function on the right, using the value on the left as the first argument.

Why not use piplines (`|>`)? Well, it turns out that pipelines work really well for languages that are designed from the ground up to support functional programming patterns. Those languages tend to have features like auto-currying that make pipelines a breeze to reason about. JavaScript, on the other hand, doesn't have those features. Remember, we want to *keep it JS*.

I think this feature will change the way that you think about JavaScript. As an example, consider how you might use "call-with" to implement non-reflective private state:

```js
import hiddenState from 'hidden-state';

let [getState, initState] = hiddenState();

class C {
  constructor() {
    this->initState({ count: 0 });
  }

  increment() {
    this->getState().count++;
  }
}
```

With this approach, the need for "hash-fields" (a terribly unpopular feature) falls away.

## Symbol Literals

Symbols are a great tool for making object properties less visible than your standard underscore-prefixed names:

```js
let countSymbol = Symbol('countSymbol');

let obj = {
  [countSymbol]: 0,
  increment() { this[countSymbol]++ }
};
```

But that's a whole lot of typing for a simple idea. I think we can do better with "symbol literals":

```js
let obj = {
  @count: 0,
  increment() { this.@count++ }
}
```

The idea here is that property names that start with `@` are symbol literals, scoped to the script or module in which they occur. Within any single script or module, two symbol literals with the same name will refer to the same symbol.

## Macros

The ability of the programmer to *abstract over syntax*, to create programs which create other programs, is as important as it is dangerous. However, I think that we've reached a point where our users need macros.

Instead of something like decorators, which only gets us halfway to syntactic abstraction (and only with classes), let's take inspiration from Rust and define "procedural macros":

```js
import { deprecated } from './macros';

#[deprecated]
export function dontUseThis() {
  // ...
}
```

For now, I propose that we limit macros to build-time tooling. It may be that our build toolchains are the ideal place to perform macro expansion, and if not, we can use that tooling experience when we add macro support directly to the language.

## Null-coalescing

The null coalescing operator `??` is a better way to pull defaults from a variable. The following code is something you might see today:

```js
function f(options = {}) {
  let plugins = options.plugins || [];
}
```

But using the logical-or operator has a downside: falsey values like `0` or `false` will trigger the default. The null coalescing operator does the right thing, only using the default when the value on the left is `null` or `undefined`.

```js
function f(options = {}) {
  let plugins = options.plugins ?? [];
}
```

## Method extraction

In general, JavaScript is a great language for object-oriented programming. There are still a couple of gaps, however.

When I want to provide a method as a callback to some operation, I might make the following mistake:

```js
let obj = {
  greeting: 'Hello world',
  onClick() { console.log(this.greeting) }
};

element.addEventListener('click', obj.onClick); // Oops!
```

When I provide `obj.onClick` to `addEventListener`, it only passes the function. It completely forgets the object that the function is attached to. When `onClick` is called, the `this` value isn't right, and things fall apart. That's not what we want.

Instead, I would like to see a method extraction operator:

```js
element.addEventListener('click', &obj.onClick); // Yay!
```

The method extraction operator is a prefix `&` which pulls out a method and binds it to the object that it came from.

## Mixins

ES6 classes are wonderful and have transformed the way we write JavaScript. But although inheritance works well in many cases, sometimes it makes more sense to reuse code in other ways.

For instance, suppose that I have a rather large class definition that I want to break up by functionality into separate modules, for maintainability reasons. I don't want to *extend* those external definitions. Instead, I want to copy the methods found in those other files into my class definition.

This is where mixins come in handy:

```js
mixin A {
  foo() { return 'a' }
}

mixin B {
  bar() { return 'b' }
}

class C with A, B {}

new C().foo(); // 'a'
new C().bar(); // 'b'
```

## Waking to Reality

In case you missed it, this dream of a JavaScript future doesn't line up very well with the path that we are on. There are no decorators. There are no private fields and no private methods. Perhaps we are too far down the road to change course now. Perhaps too many individuals have put too much work into current proposals to abandon (or modify) that work now. But if we can change course, I think that we should. Our current designs are stuck in a world that we envisioned in 2016. A better future is possible.
