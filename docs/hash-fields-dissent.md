# Hash-fields: A Dissenting Opinion

The free expression of reasoned dissent is critical to the healthy functioning of deliberative bodies. With that in mind, I offer the following dissenting opinion regarding the Stage 3 private fields feature (referred to below as "hash-fields").

## 1. Why hash-fields?

Hash-fields provide users with the ability to store **completely encapsulated** internal state for objects that are created by invoking a constructor defined using class syntax. This capability is beneficial for the following use cases:

- Implementing host-defined abstractions (traditionally written in C++) using JS. These abstractions are frequently associated with detailed specifications determining all aspects of their observable semantics.
- Implementing highly popular libraries in such a way that users cannot depend upon "internal" implementation details.
- Implementing "defensive" classes whose instances are frozen but which also hold mutable state.

When analyzing hash-fields it is crucial to understand that the syntax encourages users to replace existing usage of underscore-prefixed names with hash-fields and hash-methods. As such, the affected audience is a majority of all current and future users of class syntax.

## 2. Existing workarounds and downsides

The following workarounds are currently in widespread use:

- A WeakMap may be used to store "private" state. Unfortunately, WeakMaps are currently much slower than normal property access and the resulting code is not particularly readable.
- Symbols may be used to store "soft private" state. Unfortunately, symbols are observable via reflection and reliance on square brackets creates readability issues.

## 3. Usability issues with hash-fields

### Lack of support for Proxy wrapping

Proxies are frequently used to "wrap" normal objects in order to intercede on object model operations like `get` and `set`. There is a well-known restriction when using this pattern: it does not work with builtin objects and many host-defined objects. Users tend to find this restriction surprising. Since hash-fields are subject to the same restriction, widespread usage of hash-fields will tend to amplify this surprise and place greater dependency on heavy-weight proxy designs such as membranes.

### The "private static footgun"

Hash lookup does not traverse the prototype chain, instead throwing an error if the receiver does not "have" the field or method. For class instances this usually does not create a problem; instances are rarely used as prototypes for other objects. However, class constructors are frequently used as prototypes. A base class which attempts to access a private field through a `this` pointer (itself a common pattern) will fail when applied to a subclass.

```js
class A {
  static #x = 0;
  static increment() { this.#x++ }
}

class B extends A {}

B.increment(); // Throws
```

### Lack of support for destructuring

The current proposals do not provide built-in support for pulling out private state using destructuring syntax. Although this feature could be added in the future, analysis of existing TypeScript codebases suggest that destructuring private members is a common pattern and should be directly supported by the hash-fields proposal.

### Lack of support for novel initialization patterns

An advantage of class syntax is that it supports a wide variety of initialization patterns. For subclasses, users can call `super()` in the normal case, but they can also return other objects from the constructor function. This flexibility has been important for some high-profile use cases, such as HTML custom elements.

The only way to initialize hash-fields on an object is to use the normal object creation semantics. Users cannot return a different object from the constructor. In order to fill this capability gap additional features will be required.

### Reliance on metaprogramming for common patterns

Common patterns should not depend upon metaprogramming. Metaprogramming should be restricted to abstraction over syntax, rather than core capability. "Friendship" is a common pattern when creating encapsulated abstractions in JavaScript, in part because JavaScript lacks the ability to create nested classes. With the current proposal, metaprogramming is required to support friendship use cases.

## 4. Understandability issues with hash-fields

### Prototype or own properties?

With current class syntax it is quite clear *where* methods are located.

- Methods are on the prototype
- Static methods are on the constructor

With hash-methods, the method is placed on the instance, because hash-lookup must not traverse the prototype chain. The syntax, however, does not make this explanation obvious.

### WeakMap or properties?

Hash-fields are explained as sugar over WeakMaps. However, it's not clear how that mental mapping is supposed to translate to hash-methods. A hash-method can be an accessor. How can WeakMaps contain accessors? This blurred distinction between values and properties increases the conceptual complexity for users of the language.

As a concrete example of this conceptual confusion, consider the proposed reification of hash fields by means of decorators. When a decorator is applied to a class element that is keyed with a hash-name, the decorating function receives a `PrivateName` object. This object has "get" and "set" methods that allow access to the underlying data value, but unlike normal properties there is no way to change a private accessor property to a data property after the class definition is evaluated.

The WeakMap model of private state does not integrate well with JavaScript's property-based syntactic features.

### Forced syntax

By experience with visually-related object oriented languages with static type systems, users expect this feature to be provided with the following syntax:

```js
class C {
  private x;
}
```

The hash-fields syntax is well-motivated and that motivation is well-documented. However, explanations are not helping with user acceptance in the community at large.

To take a user experience metaphor, suppose we have a button that is located on the left side of the screen, and for whatever reason, users expect it on the right side of the screen. Even though we can explain the location in a convincing manner to the user, that explanation may not help the user overcome their sense of cognitive dissonance. And because existing user experiences (in Java, C#, TypeScript, and others) will not change, this cognitive dissonance may be a lasting feature of hash-fields.

## 5. Alternative solutions

The following alternative solutions have been presented:

### Classes 1.1

The "classes 1.1" alternative eliminated the concept of "fields" and replaced it with "instance variables" and "hidden methods", where both of these members are accessed using the `->` operator.

Unfortunately this solution demands that the user type `->` instead of `.`, without an easy explanation of *why*.

### Private symbols

Private symbols are functionality identical to normal symbols, with the exception of reflective capability: they are not exposed by any reflective operations.

Private symbols exhibit the following downsides:

- They reduce the potential transparency of certain reflection-oriented abstractions such as membranes.
- They result in more complex understandings of concepts like "frozen".
- They make prototype traversals observable.

## 6. Fundamental design problems

### Misidentification of scope

Community feedback has made it clear that the lack of language support for "hard private" state is not perceived as a problem by a large segment of JavaScript users. The `private` visibility modifier has existed in TypeScript for several years. Although there have been several issues created on TypeScript's GitHub repository pointing out the lack of "hard privacy", those issue threads do not appear to gain much traction with other TypeScript users. Furthermore, some TypeScript users rely on the fact that `private` members can be accessed outside of the class in which they are defined.

This evidence suggests that most TypeScript users simply do not need perfect encapsulation. The evidence also suggests that lexical scoping of private access is too restrictive for the needs of JavaScript programmers.

### Overloading property access

The hash-fields feature overloads familiar syntactic elements like fields, methods, and property lookup to mean entirely new things. This design decision makes sense only if the user does not need to understand the difference in normal usage. On the contrary, the usability issues described above show that the user needs to be keenly aware of the special semantics ascribed to hash-fields and hash-methods in many typical JavaScript idioms.

## 7. A new alternative

In our opinion, a solution to the "encapsulated instance state" problem that improves upon hash-fields is achievable. Such a solution would have the following characteristics:

- Since it is an advanced feature, it should not place supporting syntax at the center of the language.
- Since it is fundamentally different from property access in ways that cannot be ignored, it should not overload property syntax.

We propose the following solution:

- A standard library module that allows the user to generate state initialization and access functions. See [hidden-state](https://github.com/zenparsing/hidden-state) for an informative implementation.
- A "call-with" operator (`->`) that allows the users to call a function, passing the operand on the left-hand side as the first argument.

```js
import privateState from 'std:private-state';

const [initState, getState] = privateState();

class Point {
  constructor(x, y) {
    this->initState({ x, y });
  }

  toString() {
    let { x, y } = this->getState();
    return `[${x}:${y}]`;
  }

  add(other) {
    let { x, y } = this->getState();
    let { x: xOther, y: yOther } = other->getState();
    return new Point(x + xOther, y + yOther);
  }
}
```

This solution is both ergonomic and readable. It is immediately clear what parts of the class are "public" and what parts are "private".

In order to address use cases that do not require perfect encapsulation we propose a more ergonomic syntax for using symbols:

- A symbol literal (`@name`) can be used as a property name.
- Any two syntactically identical symbol literals within a given module or script evaluate to the same symbol.

```js
class Node {
  constructor(parent) {
    this.@parent = parent;
    this.@left = left;
    this.@right = right;
  }
}
```

Properties defined using symbol literals can be accessed only by reflection. We claim that symbols are the appropriate encapsulation solution for the majority of use cases in idiomatic JavaScript.
