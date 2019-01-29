# Some Principles for the Guided Evolution of JavaScript

## Where are we and how did we get here?

It is the middle of 2018. We stand on the brink of a new world and at the edge of the old. In order to succeed in this new world, a new era of computing will be required. A new vista of practical programming challenges extends out before us. How will our programming languages adapt to this new landscape?

JavaScript is the (not-so) little language that programmers love to hate. Although that hate comes in part from JavaScript's dominance, it also expresses the fact that JavaScript is, well, messy. How did a little messy language come to dominate the world? With a bunch of luck, and a bunch of talented people willing to see the good parts and make them better.

Some secrets to JavaScript's success:

- The web (obviously)
- A familiar C-family syntax
- An extremely flexible object model
- Library inventors (thank you jQuery!)
- Transpiler inventors (thank you CoffeeScript!)
- The failure of ES4 (fallow fields make good crop)
- The lack of a type system (thank you TypeScript!)
- Community input (RIP esdiscuss)
- NPM and GitHub (synergy and luck!)

## Where do we go from here?

In technology, as is all else, what cannot adapt is discarded and replaced by what can. In order to preserve JavaScript as a powerful, general purpose programming language for future generations of programmers, I submit the following principles for the guided evolution of JavaScript.

### 1. Leave room for the future

We must resist the temptation to "complete" the language. There is an important distinction between "filling in the gaps" (which is what many post-ES6 features are all about) and "filling in the space". A gap is a small opening in the language surrounded and created by the existence of other, larger features. Some examples:

- Promise.prototype.finally
- Array.prototype.includes
- Object.getOwnPropertyDescriptors
- Object spread

*Filling in the gaps* usually carries little risk and little spillover into other features. They (hopefully) make the language feel more consistent.

*Filling in the space*, on the other hand, implies a tradeoff. If we do this now, then we won't be able to do something else later. Does a proposal use one of the last remaining free ASCII characters? Does it introduce a new operator with new semantics? The empty space we have is a gift, and any empty space we leave is a gift to future generations. Let's treat it like the precious and limited resource that it is.

### 2. Pave the cowpaths

This is an old and subtle concept. All standards development work carries with it the risk that nobody will use it. And when we create features that don't succeed in the marketplace, we waste precious space within the language. Whenever possible, we need to build confidence that a feature will have lasting popularity before we move too far down the standardization road. This can be more tricky than in sounds, because developers can only solve problems within the constraints of the language, and that influences the paths that they create.

Water flows downhill. We don't add features for their own sake, or because we think they are cool. We add features to the language in order to more efficiently carry the water that is already flowing downhill.

### 3. Address the pain points

Prior to ES6, JavaScript was chock-full of pain points. In order to make a class-like abstraction you had to imperatively build a function and prototype pair. It was a lot of "how" for a little bit of "what". Another example: any time you wanted to register a callback within a method, you had to capture a reference to `this` in a local variable. It was painful.

These pain points are a clear signal that the language in its current form is insufficient to express the ideas that developers want to express. There's an obstacle, immovable from within the language, and as language designers we have a unique opportunity (and responsibility) to clear that obstacle.

### 4. Solve the general problem

When a pain point exists in the language, the result is often a collection of awkward workarounds, none of which are particularly satisfactory, and all of which involve uncomfortable tradeoffs. For instance, users frequently want to use an object method as a callback. Since the naive approach doesn't work (simply providing the method property as the callback), we see a multitude of workarounds:

- Autobinding decorators
- Class "field methods"
- Binding methods in the constructor

There have been several ideas for extending the class syntax to provide sugar over those workarounds. In situations like this it is helpful to step back and try to understand what the obstacle really is. In this case, it is the inability to obtain a bound method using normal property access syntax. Fix that, and we eliminate the need for the sugar.

### 5. Solve the problem for the future

As human beings, we are inclined to project the current state of the world out into the foreseeable future. After all, we have to hold some things steady in order to understand and cope with a constantly changing world. The downside is that we have a tendency to always solve yesterday's problems, instead of tomorrow's. The challenges that we apply our engineering genius toward are themselves shifting under our feet.

When designing the language, we need to constantly ask ourselves: what are we assuming about the state of the world five years from now? Are those valid assumptions? As an example, suppose I'm trying to solve the following problem: large JavaScript bundles are taking too long to download and parse. Am I assuming that users will continue to bundle their entire app? Is that a fair assumption? What does the world look like if that assumption is not valid?

### 6. Measure the costs

This is something that I think we can all improve upon. As proposal champions, we are primed and ready to defend our designs in the face of sharp criticism. And we should be. There's no point in championing a proposal that you don't believe in. But every feature has tradeoffs, and I'm not sure that we do a good job of being honest about them. Further complicating matters, it seems to me that we haven't sufficiently developed a way to measure or even compare relative costs versus benefits. Sometimes it seems that the only argument that we acknowledge is the so-called killer argument; the one where I completely sink your battleship.

It is clear that some costs are greater than others, and that some benefits are less than others. We need to develop a means of measuring those costs and we need to provide an honest accounting of them. If the proposal is good enough, then the benefits will justify the costs.

### 7. Be conservative

JavaScript is not a language for experimentation. The features that we bake into the language need to have proven themselves in other settings. We can't afford to make mistakes on novel features. But JavaScript has unique semantics. How do we know that features from other languages will work well in JavaScript?

This is where compile-to-JS languages are critical for gathering feedback on what works and what doesn't work. Remember that Babel is, in fact, a framework for generating lightweight compile-to-JS languages. Babel deserves extra care however: because it is (among other things) a "bleeding edge" JavaScript implementation, we can easily find ourselves constrained by user expectations.

### 8. Be suspicious of cross-cutting features

Whenever we see a proposal that exhibits some the following characteristics:

- It touches on several other features
- It needs other new features to really work well
- Future features will need to think carefully about how they interact with it

Our warning lights should start blinking rapidly. Cross-cutting features indicate irreducible complexity and can be costly along several dimensions, including implementation difficulty, optimizability, and mental taxation. Some highly cross-cutting features might be worth it (Proxies, perhaps) but we should always proceed with caution.

### 9. Listen, respect, and record dissent

Whenever we run into trouble with a feature down the road, you can be sure that trouble was forseen. We tend to get locked into "debate-mode" when developing features; any negative feedback is viewed as a counter-argument which we must then counter with our own, stronger arguments. And the strongest argument must win. When we are focused on "winning the argument", we lose sight of what negative feedback is trying tell us. Generally speaking, it's trying to tell us about the tradeoffs. And in the end, after our work has been passed on to others, there are no "winners". No one will care who won the argument. There are only tradeoffs.

I think we need to do a better job of trying to understand dissent, and I think that we need to systematically record it, so that future designers will have a better understanding of the tradeoffs that we chose to make.

### 10. Leave room for supersets

Being a JS purist, I used to dislike TypeScript. I was wary of the influence that another language was exerting over "mine". But I now believe that TypeScript has been essential to the success of JavaScript, because it removed the need to create a static type system within the language kernel. By opening up and curating the space necessary for a statically-typed superset, we created an environment where innovation was possible. At the same time, we haven't bound ourselves permanently to any particular innovations in static typing. Instead, we've created a *platform* upon which statically typed JavaScript supersets can compete.

We should learn from that success. What other areas of the language can we open up to experimentation? What would be good candidates? How about metaprogramming? How about macros?

By keeping the core language small, we provide fertile soil for innovation while remaining flexible in the face of a constantly changing programming world.

### 11. Don't let process drive risk

One of the tradeoffs inherent in the "train" model of language development is the possibility of runaway risk. As a proposal moves through the stages it gains momentum, such that core changes to the feature become more and more difficult to make. On one hand, this is a good thing, because it discourages churn (which did happen during ES6 development). On the other hand, by the time a proposal reaches stage 3 it seems like we are pushed toward a binary option: either abandon the work or push it through as-is. Asking a champion to abandon their work (which has probably gone on for years at this point) is going to be very unpopular.

We need an escape hatch. We need a socially acceptable way to say, "I'm really uncomfortable with this proposal in its current form, and I'm not sure what it would take to change my mind, or whether that's even possible." I don't know how to create that space, but I think it starts by simply not allowing ourselves to begin justifying proposals based upon what stage they are at or which engines have experimentally implemented them.

### 12. Think in the large

Sometimes it feels like we're rushing headlong to implement new features without having a clear understanding of what we are trying to accomplish. Sure, each proposal comes pre-loaded with a set of motivating examples. But those examples aren't very good at conveying the big picture. We should always ask, at the very beginning of feature work: how does this fit into the large-scale evolution of the language? Is it simply providing much-needed relief for a common pain point? Is it making the language a better platform for functional programming styles? Is it making the language more self describing? Is that what we want?

Ultimately, it's these "big picture" questions that really need consensus. If we have consensus on those, then feature work becomes more technical and straightforward. And if we don't create the space to discuss the big picture, then those concerns will almost always lose in the technical context of feature work.

## Annex A: The Tragedy of the Common Lisp, or, Why Large Languages Explode

In 2015 Mark Miller posted the following message to esdiscuss:

> The Algol, Smalltalk, Pascal, and early Scheme languages were prized for being small and beautiful. The early C and JavaScript languages were justifiably criticized for many things, and rarely mistaken for a language that was generally beautiful. But they were small, and this aspect was properly and widely appreciated. When a language is small, our appreciation of it is often driven by the sense "I can learn the whole thing, and then I will have a mastery of it", and later "I know the whole thing. I love the fact that there are no corners I don't know." For C and JavaScript, few who thought they knew the whole thing actually did -- the details were actually fiendishly complex. Nevertheless, this sense drove much of the satisfaction with everyday usage.
>
> The esthetic of smallness of JS lasted through ES5. I participated heavily in both ES5 and ES6 and in both cases I am proud of my contributions. ES6 is much larger, but nevertheless it is a much better language. Given where we started, we could not have achieved these gains in the utility of JS without such an increase in size. I do not regret most of the additions that grew ES5 to ES6. For many of these, had we the ES6 standards process to do over again, I would likely make similar additions.
>
> But each of the additions that grew ES5 into ES6 had to pass a very high bar. Psychologically, this made sense to all of us because we were starting from a language, ES5, whose smallness we could still appreciate. When a language is small, every additional feature is viscerally felt as a significant percentage increase in the size of the language. The specific benefits of a feature are always visible to its advocates. But for a small language, a new feature's general costs in added complexity are also still visible to everyone.
>
> Once a language gets beyond a certain complexity --- say LaTeX, Common Lisp, C++, PL/1, modern Java --- the experience of programming in it is more like carving out a subset of features for one's personal use out of what seems like an infinite sea of features, most of which we become resigned to never learning. Once a language feels infinite, the specific benefits of a new feature are still apparent. But the general costs in added complexity are no longer apparent. They are no longer felt by those discussing the new feature. Infinity + 1 === Infinity. Even aLargeNumber + 1 === approximatelyAsLargeANumber. This is the death of a thousand cuts that causes these monstrosities to grow without bound.
>
> So please, I beg all of you, when considering a new feature, please apply a higher bar than "Wouldn't it be nice if we could also write it this way?". I believe that ES6 is in that middle territory where unrestrained growth is not yet inevitable, but only if we all restrain each other with high standards for any proposed new feature. As a community, we need more of a shared sense of panic about the size that ES6 has already grown to. Ideally, that panic should increase, not decrease, with further growth from here as our size approaches the point of no return.

I can't think of a better way to conclude, and that healthy sense of panic has not left me since I read it.
