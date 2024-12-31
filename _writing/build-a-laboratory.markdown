---
layout: post
title: "Build a Laboratory"
subtitle: A different lens for understanding the MVP
date: 2024-10-07
categories: software
notes:
---

- A product is something someone will pay for.
- A viable product is one you can sell for more than it costs to produce.
- A minimum viable product is the easiest thing you can make with those properties, where "ease" depends on your specific circumstances: the time, money, resources, and skills you have available to you

In those terms, it's inescapable that an MVP is the best thing for your business to build. It's nearly tautological; a business can't exist without a viable product, and the least risky way to get there would be the one with the least cost and complexity.

Nevertheless, in the past year, in meetups, conferences talks, conversations with clients, and online, I've heard a fair amount of pushback against the MVP concept, with folks often trying to replace just one letter --- recommending a "minimum viable test", or a "minimum useful product". And there _are_ problems: before you build it, you don't know what people will pay! You don't know how much it will cost! You don't know what features it needs and which can be eschewed! Building an entire business is an expensive way to learn that your idea isn't viable.

But when addressed on its own terms, the idea of an MVP feels unassailable --- because it's tautological, it's hard to argue against.

In order to address that tension and frustration, I think it might be easier to approach the idea side-on, by translating the concept of the MVP into a slightly different language, where there's more room to examine it. I have found a lot of value in an experimental mindset: make a hypothesis, find a way to test it, adjust, repeat --- so I instinctively turn to that framework when I need a way to think about actions and motivations.

Let me invent some vocabulary to fit that perspective:

A **market hypothesis** is a guess that a sufficiency of customers will pay some amount for some good or service. (This should not be confused with the broader "efficient market hypothesis").

An **operations hypothesis** is a guess that you can produce a product at a given cost (in money, in labor, in time, etc).

A **complete business hypothesis** is a matching pair of a market hypothesis and an operations hypothesis.

In this language, an MVP is just the simplest experiment that demonstrates the validity of a complete business hypothesis.

Importantly, that experiment may still be too complex, too expensive, or too risky to design or implement straight away. And that's OK --- by framing it this way, we already know that our big guess is made up of smaller guesses; every complex hypothesis is made up of lesser assumptions.

In the original language of the MVP, an MVP is atomic --- it cannot be broken into smaller bits without losing its fundamental properties, because it's already, by name and definition, "minimal".

But in the experimental mindset, we can envision sub-hypotheses --- the assumptions from which our larger guesses are built --- and we can design and run experiments to test those sub-hypotheses. A proof of your complete business hypothesis is not the least thing you can do; it's simply the least you can do _to be home free_. Those smaller experiments along the way aren't viable products, or even necessarily products at all --- if what you're testing is an underlying assumption in your operations hypothesis, you may not even need to put it in front of users.

The _end goal_ is still always to develop and prove a complete business hypothesis; it's still just as tautologically true that you're not a successful business until you have a viable product. Because we're testing a hypothesis, a disproof is as genuine an outcome as a proof.

User interviews, user tests, market tests, prototypes --- all the tools we're already familiar with can be cast in this experimental light, as ways of testing sub-hypotheses. If an interview or a mockup can cheaply disprove one small assumption on which you based your larger business hypotheses, then you've cheaply disproved the whole thing; you know you need to make adjustments without having spent the cost of an entire MVP. (This isn't a new conclusion, only a new lens: translated back into startup-speak, small, low-risk disproofs are covered by the mantra "fail fast").

And that is part of the value of this way of thinking: it's clear that our hypothesis, like most guesses, is _probably_ wrong; rather than trying to build the easiest thing that is a successful business --- rather than "build an MVP" --- we want to discover a successful business in the easiest way --- we want to _develop a correct business hypothesis_ as simply as possible.

Once we acknowledge that our first experiment won't be the last, the sensible thing to do is to plan for many experiments. A smart inventor doesn't build a new workshop for every prototype; a smart scientist doesn't buy all new equipment for every experiment.

So don't build an MVP; build a laboratory.

Don't build a product; build yourself tools that will allow you to keep testing and improving hypotheses until you find ones that work.

A lot of my clients balk at the idea of building a componentized design system; but if a slick brand or elegant UI are part of your market hypothesis, then a design system is a UI laboratory. Custom-built one-off UIs are useful only for a single experiment; a design system turns your product into an optical table, where you can stage a thousand experiments using the same building blocks.

A lot of my clients, especially those with small teams don't want to spend time and energy on robust feature flagging; it doesn't feel like progress the same way that actually building features does. But being able to add, remove, and recombine entire features turns the product into an inventor's workbench. It seems too expensive for an MVP, but it's an obvious step for cheaply running a series of experiments.

(Note that I'm explicitly _not_ talking about A/B testing when I am talking about "experiments" --- that is a kind of experiment, but it is more useful for refining and improving an already successful business hypothesis. A/B testing can extract a weak signal from a noisy channel, which is great when you've got a real business already, but tight margins and high volume. The gap between a disproven complete business hypothesis and a proven one, on the other hand, is usually visible to the naked eye. So when I say "build a laboratory" I don't mean "construct a set of rigorous statistical tools like giant enterprises use"; I mean "provide yourself with building blocks that are easy to assemble in lots of ways, and a platform for exposing the results to users where you can watch what happens". This is part of the difference between a "scientific" mindset and an "experimental" one --- I am advocating for the latter.)

If this way of thinking seems appealing, here are some questions to ask yourself:

- What are some ways in which your current project is like a laboratory? What experiments have you anticipated and left room for?
- What are some ways in which your current project is a one-off? If it turns out to be unsuccessful, what will you have to throw away?
- Reframe your business as a complete business hypothesis; how would you say it? What are the most vulnerable assumptions underlying that hypothesis? Are you testing those assumptions in the easiest way? Or are you building the machinery of a business while leaving the assumptions untested?
