---
layout: post
title:  "NASA’s Power of Ten, for javascript"
subtitle: ...and dynamic languages, generally
date: 2018-08-13
categories: software
notes: 
---
The NASA/JPL Laboratory for Reliable Software created a [list of ten rules for writing safety critical code](https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code). They're an interesting mix: some are high-level thoughts, and some are very prozaic pronouncements. They're also deeply connected to NASA's prevalent use of C. I don't think NASA is wrong to use C (I rather like it, though it's not in fashion) but we can't all choose the language we work in, and I want to write reliable code even if I'm using a dynamic language. Javascript is all-devouring at the moment, so I spent a few hours attempting to translate NASA's Power of Ten to suit.

I have, as much as possible, attempted to embody the thinking of the people who wrote the Power of Ten; I'm not certain I buy into all of these rules wholeheartedly; while I already obey perhaps 7 of them, a few would require major changes in my current coding styles. I'm not writing this to argue my own point of view, but in order to see what JPL's viewpoint has to say in my not-quite-equivalent context. (I admit I'm not 100% confident on the part about mutation you'll see below, but this is where I *think* they'd land).

The original Power of Ten is not organized into three categories of rules; but these three overarching themes seem obvious to me:

## Simplify

1. **Make functions short.**

2. **Avoid macro-y magic.**

Preprocessors and compilers like to offer Neat Tricks™ to Increase Productivity®. If they make it hard to understand what the final outcome will look like, don't use 'em. 

{:start="3"}
3. **Avoid deep dereferencing.** 

No `object['foo'][bar].baz.id`. Keep it to one level everywhere possible.

{:start="4"}
4. **Keep your loop terminations easy to prove.**

5. **Avoid recursion, exceptions, and other nonlinear constructs.**

"Wait, really avoid exceptions?" Yes, to the extent it's possible. Certainly don’t use ‘em for flow control. Catch anticipated exceptions immediately around any native/3rd-party call that may throw, so that they don't infect your code. Catch unanticipated exceptions once, at the highest level. 

Don't throw. 

"Aren’t promises nonlinear flow control?" They are. They also swallow exceptions (the ones we're attempting not to use as flow control). `async/await` can conceal some of this, inadequately. Using [bluebird](https://github.com/petkaantonov/bluebird)'s [global rejection events](http://bluebirdjs.com/docs/api/error-management-configuration.html) can mitigate swallowed errors, and allow you to continue to use your one high-level, global catching.

Asynchronous code is, it turns out, hard.

## Memory Control

We don't talk much about memory leaks in garbage-collected languages; but where performance is important, we can and should. Number 6 *probably* wouldn't make it into a top-10 list designed from scratch specifically for JS, but it's not a *bad* rule.

{:start="6"}
6. **To the maximum extent possible, items that will last beyond a single function should be allocated immediately and last forever. The memory tree should have a small number of permanent trunks.**

"Are you arguing *for* mutation?" Yes. Javascript is designed for mutation, and bending over backwards to avoid it adds complexity and GC cycles.

"Couldn't that 'it was designed for it' argument be applied to using exceptions, too?" Yes; not-using a distasteful corner of the language is a long-running JS tradition; but while exceptions only came around JS's 5th year, mutation was there at the birth.

{:start="7"}
7. **To the maximum extent possible, use local variables.**

Keeping it on the stack helps memory usage, and also simplicity, and reduces the impact of mutation.

## Check expectations

{:start="8"}
8. **Use type-checking if possible. Use nominal types if possible.**

Typescript is good. Use it if you can, and if you do, use it to its fullest extent, with all those juicy null and implied-any flags and so on enabled. When it has nominal types it will be even better. Consider using the brand workaround to get pseudo-nominal-typing in the meantime.

{:start="9"}
9. **Assert things that cannot be type-checked.**

This means live runtime assertions, not just automated tests. Web devs are really, really bad at this; Power of Ten recommends an average of 2 assertions per function; as an industry, we average ~0. Log failed assertions in production. Read the logs.

{:start="10"}
10. **Lint.**

Many of these rules can be automated. Don't just trust yourself; get a linter. Also: don't just trust the linter, and check yourself. 
