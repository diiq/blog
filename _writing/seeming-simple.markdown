---
layout: post
title:  "On Seeming Simple"
subtitle: How to think about simplicity when designing complex things, and vice-versa
date: 2020-07-06
categories: design
notes:
---

## TL;DR

Nothing is actually simple. But humans mostly prefer learning and using things that *seem* simple. There are different ways of seeming simple. Each approach hides and reveals complexity to different people; we should do so purposefully.

## What's actually simple

Things that are actually simple are boring. They do not do much, and not much can be said of them. Thankfully, nothing is simple in every context. A rock is simple when it appears in a plowed field and needs to be removed; but hand it to a geologist and, even if it is not an especially rare rock, you'll still get an earful if you ask for it. This is true for most undesigned objects --- you can find a context for examination where its complexity will be made visible.

When it comes to *designed* objects, on the other hand, someone has *chosen* the angles and contexts from which they seem simple or complex; and making that choice is, in some ways, at the very heart of what design is.

Something that does not seem simple in *any* way is intimidating. It's exhausting. It's hard to approach, to learn about, and to describe. Finding a way to hide the complexity of a designed object is critical in allowing humans to peacefully interact with it.

So when I hear someone say "we designed it to be simple" --- whether that person is a designer, an engineer, an executive --- it is hard not to roll my eyes. Making something simple cannot be done. Anything interesting enough to spend any time or attention on is not simple; it can only *appear* simple from certain points of view. So I want to hear where you hid the complexity; that's the real problem you solved.

I'm going to describe some classic ways of seeming simple; if your background is purely design or purely engineering, you may feel I am unfairly mixing the fields --- but consider engineers as one more type of person who as to interact with a system. We can design things to seem simple to them, just as we can choose to make something seem simple to a new user, a long-time user, an administrator...

Here are some approaches you might take:

## Make each part simply constructed

This is a classic engineer's version of simple. We broke the problem into tiny parts, each part is built as simply as we could, and now each part is easy to maintain!

Note, however, that a Rube Goldberg machine fits this definition. You've made something that appears simple from close-up, but the complexity is obvious when you step back. This is especially true if each simple part was built by a different person, or using different tools, or according to different principles. See also: microservices.

I don't mean to say this is a bad approach! Often, it is the *only plausible* approach. Just understand that, like some prehistoric geoglyph, the complexity is only visible from 40,000 feet up.

This kind of simplicity is simple for the junior developer and complex for the architect.

## Make every part follow the same few principles

This is how a high-modern architect or graphic designer might approach simplicity.

"The whole space is subdivided based on the proportions of the human figure," Le Corbusier says, and sure enough: he's used his human-based "Modulor" system of measurements to lay out the landscape, the building, the rooms, the doors, the height of the water fountains, the depth of the benches. It all hangs together.

This is an incredibly subtle way to hide complexity; you can only discover it when you say "hey, Charles-Édouard, you've based this sytem of measurements on a six-foot-tall man --- that's taller than the average man, and much taller than the average woman. Can we tweak your Modulor to better reflect the humans that'll occupy the space?"

And suddenly *every measurement in the whole building has to change at once*.

The complexity has been tucked away in between the assumptions that led to those foundational principles in the first place.

Again! This is not a *bad* approach -- it is a very powerful one. Especially in the world of software, a user interface that obeys a few simple principals will be much easier for a user to predict and understand. The original Google Material writeup is an interesting, if maybe limited, example. Just stay aware that, even if you cannot find the complexity in the *implementation* of those principles, it hasn't evaporated.

This kind of simplicity is simple for the user and fiendish for the designer; exponentially more so if it must change over time.

## Make a tree of simple choices

This is the phone-tree version of simplicity. At any given moment, there are only 9 choices, and usually only 2 or 3. How could a user get confused? Don't worry about the past or the future --- think only about this choice right now.

For a slightly less dated example, think of the original iPhone. A user can touch a point on the screen, swipe, pinch, or press the home button. Every outcome a user might want must be accessed via a series of those few actions.

The complexity here is obviously moved from the breadth of each decision into the depth of the tree of decisions. A user doesn't actually care about the single choice they're making now. They have a specific *outcome* in mind. The more steps it takes to achieve that outcome --- even if each step is "simple" --- the easier it is to get lost along the way.

As always, I am not saying this is a *bad approach*. I am saying that with hindsight and this mental model, you can easily predict what Apple had to do as they added more capabilities to the iPhone. More possible outcomes given the same 4 inputs meant a longer series of taps and swipes to get to any given outcome. To make everything still feel available "right at your fingertips", the depth of the decision tree had to be reduced by adding new possible actions: long press, 3d touch, swipe-from-top, swipe-from-bottom, swipe *halfway* from the bottom, swipe-from-bottom-halfway-then-left...

Reducing the number of buttons on the phone to 1 and replacing them all with a touchscreen was a masterpiece of *seeming* simple. All the complexity is still right there under the glass! But taking the first step was easy: touch the only button there is. That's a very seductive seeming-simplicity.

This kind of complexity is simple for the new user, but can be tiringly complex for the power-user.

## Journeyman Simplicity

There are some systems which take years to learn how to use effectively --- both because of the memorized knowledge needed, and because of the muscle memory required.

Think of Emacs, vim, or the ancient internal tools used in large bureaucracies.

Here, the complexity isn't hidden from lay folk, or even from apprentices. From their point of vew, all the complexity is laid intimidatingly bare.

But to someone who has been using one of these tools for years, everything is *so much faster and easier* than it would be in any other tool. It is, in some ways, the opposite solution compared to a phone tree. The set of possible actions is immense, but for a practiced user, the distance between thought and outcome is very small.

One symptom of a system like this is how hard it is for an expert to teach. I can remember, when I was a daily Emacs user, trying to tell someone a hotkey combination and realizing I didn't know what it actually was --- it had become merely a shape my hand made in direct response to my intention. The keyboard and its labels had been abstracted away.

## Use repeated building blocks

Complexity from repeated, simple building blocks? Yes, we could talk about cellular (please-sit-back-down-Mr-Wolfram) automata. But I'd rather talk about Lego.

A Lego is a rectangular brick with studs on one side and voids on the other that the studs click tightly into. You can build anything you want with just these bricks.

Where's the complexity in that?

As with the iPhone, the easiest way to find it is to watch the product progress over time. Because unless you are happy with a fairly crude surface finish --- or using tens of thousands of Lego --- building with *only* rectangular prisms is a bit restrictive. Thankfully, Lego also provided a small selection of smooth-topped ramps, spires, people, and so on.

And as time went on, Lego produced a wider and wider variety of un-brick-like objects, with fewer studs, stranger voids, additional capabilities. Gears and shafts and wheels and glass domes and pod-bay-doors and...

Where did my lovely modular simplicity go?

This, too, is not a bad approach; there is a simple base which is easy to understand --- rectangle, studs, voids --- and then there are exceptions and extensions to that base which, critically, a brand-new Lego-er doesn't need to know about or understand *until they want them*. Lego's history is also its onboarding path.

This simplicity is simple for the manufacturer, and potentially for the new user. It is complex for *everyone* when the demands become more specific and refined.

## Is that all of them?

Any list of human categories that pretends to be a complete taxonomy is a lie, I will not pretend. I'm sure, with this mental framework in place, you can come up with some other ways in which to seem simple, and other ways the complexity leaks out from behind the seeming. Assume that creating an exhaustive list is left as an exercise for the reader.

## So what?

You can begin to see, at least, that there are ways to make complex systems feel simple to their creators, or their maintainers, or to their consumers; to first-time users or to long-time users.

When we are approaching the design of something large and inevitably complex, we must think of it like a sculptor might, considering it from every angle. Yes, we must consider those angles and contexts from which it should seem simple -- that is fun and makes us feel like excellent, powerful designers. But we cannot neglect the others, from which it looks complex. For all that those views of complexity are *inconvenient*, they are inevitable, and they are true.
