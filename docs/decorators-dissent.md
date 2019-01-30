# Decorators: A Dissenting Opinion

The free expression of reasoned dissent is critical to the healthy functioning of deliberative bodies. With that in mind, I offer the following dissenting opinion regarding decorators feature.

## 1. Current problems

### The inner class binding problem

It's not clear that we can resolve the inner-class binding problem in a satisfactory way.

```js
@replacer
class C {
  static x = 1;
  static get y() { return 1 }
  static instance = new C();
}
```

Does `instance` create an instance of the replaced class or the replacing class? Does the replacer "see" the value of the `x` static field? Does changing `y` from a static getter into a static field change what the replacer can see?

Consider the following: Imagine reading a choose-your-own-adventure book. We've followed a certain path through the book and we now must choose among two options. The claim is that one of these options will lead to a happy ending. What if they both lead to us to a dead end? What if we're killed by ninjas either way?

### The complexity problem

Over time, the complexity of this proposal has continued to grow. Stage 1 decorators were *Python-esque*: each decorator took the result of evaluating a program element and returned a value to be used in its place. Stage 2 decorators introduced the concept of element descriptors which can be added or removed to modify the input to class evaluation. Now we have the concept of "hooks", which can be used to associate arbitrary code with certain phases of class and instance creation.

Complexity in itself is not a problem, but in this case it indicates a gradually increasing scope. The current decorators proposal is attempting to be a syntactic transformation feature. It is chasing macros.

If decorators are filling the role of macros for JavaScript, we must then ask whether the can scope out to other language features. Can we abstract over functions? Can we abstract over statements? It is not clear from the current analysis that this generalization is achievable.

### The syntax problem

The developer experience for export-before is questionable. The Angular website homepage, in its first code sample, shows a decorator above an exported class declaration.


### The private name problem

The private name API is a mess and it's not clear how any of that can be resolved in an elegant manner. By binding these proposals so tightly together, we've multiplied our risk.
