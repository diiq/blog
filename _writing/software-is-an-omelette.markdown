---
layout: post
title:  "Software is an Omelette"
subtitle: Mise en place as an approach to software
date: 2018-08-20
categories: software
notes: 
---

I've been thinking a lot about how the software industry can become more
professional. One way to explore that is by comparing software practices to some
other industry.

The obvious choices for comparison are other technical fields: branches of
engineering, architecture, etc. 

But there's another industry where high-strung workers are expected to apply
technical expertise as part of a team. Where the whole team is often forced to
work in one loud, confusing, shared space. Where the team scrambles to complete
rushed projects that can easily be sent back for unexpected alterations. 

I'm talking, of course, about restaurants.

A line cook has a lot in common with a developer; and a chef de cuisine and sous
chef share many of the same priorities and goals as a product owner and project
manager.

What do they know about getting things done quickly that we don't?

## What makes a good chef

Jacques Pépin has said that, if he wanted to judge a chef's technical skill, he'd
probably have them make a French omelette.

Why an omelette? Eggs are unforgiving in this sense: they do not wait, they
cannot uncook, and the window when they are tender is narrow. No single step in
making a classic omelette is particularly hard, but they *must* happen without
hesitation, repetition or deviation. To get them all right means being prepared.
Being prepared means making the omelette backwards first -- starting, mentally,
at the finished dish, and step by step seeing what tools and ingredients you'll
need, when, and where, so that when you arrive back at the start, you can set up
you workspace to be ready for the sprint.

It's not that hard to set up your workspace for an omelette. There are only a
few ingredients and tools necessary. But having a place for ingredients and
tools for that recipe *as well as every other recipe on a large menu* -- that's
a task that calls for fancy French verbiage.

## Mise en place

*Mise en place* is the phrase for all the setup, all the preparation of
ingredients, tools, and emotional poise necessary for work as a professional
chef. It means "everything in its place". It's more satisfying and pretentious
to leave it in French, so I shall.

Mise en place is invisible because it's already been done. When you walk into a
kitchen, or see one in a video, everything has already been set up. The spices
are ready, the vegetables may already be chopped, the right saucepan is just
within reach. The actual cooking seems rapid effortless -- but in fact, the effort was
merely expended much earlier. 

> Mise en place is the religion of all good line cooks.
>
> -- Anthony Bourdain

(He also said "Do not fuck with a line cook's 'meez," which is both more emphatic
and more in character.)

## The Design Interview

So, software. Remember software? (This is an essay about software.)

Years ago, a company I worked for had a long-form interview question that was
meant to examine a developer-y version of design thinking. (They no longer use
this question.) The question was about a physical device, a programmable
controller for watering crops. The device needed to display what the current
watering schedule was, allow changes to the schedule, and alert the user to any
broken pumps, etc. But for cost reasons (the question claimed) the only input and
output were 8 waterproof LED buttons and six small, one-line text displays. 

Candidates usually found their way to a workable solution in 30 or 45 minutes,
and it was more to see how they asked questions and took a problem apart than to
get a great answer.

After sitting through half a dozen of these sessions, one of my respected
colleagues said to me: "One day, I'd love to see someone solve this backwards."

I wasn't sure what they meant, so I pushed them to elaborate.

"You know, everyone starts with one or another of the needs -- display a daily
schedule, display a broken pump -- and slowly, as they add more needs, they
develop a design vocabulary. 

"Just once, I wanna see someone understand and then set aside the needed
features, invent a generic way to display *any* information and get *any* input,
then re-frame the features with those tools."

I bet him a whole dollar that that would never, ever happen; but the idea of it
stuck with me as a very lisp-y, bottom-up approach that appealed to me.


## Mise en codegen

What does mise en place mean in the software world?

We already do it to some extent, of course: version control, automated testing
frameworks, iterative development processes -- they're like salt and pepper. We
keep those tools close at hand because we will use them in almost *any* project;
we integrate them intimately into our workspaces.

But what would we do if we were consciously trying to apply the idea?

First, understand the problem space, not just the list of features.
Then build tools for exploring that space -- don't start on the feature list, yet.
The business risk will grow as you produce no deployable work for a while; the then
build the features incredibly rapidly and gracefully because your mise is
settled. 

"No deployable work?" you say. "That goes against everything we know!". You're
right; mise is not right for every recipe, and this workflow might not be
not suitable for startups that might pivot to an entirely different industry and
concept. If, however, the industry is right and it's the product space needs
exploring, then building some generic tools could speed you along. When you
learn something important, and need a complete rewrite or major change, that's
OK; no one's fucked with your mise, they're just requesting a different dish.
Pivoting, rewriting, and making parallel product lines -- these are all low-cost
with good mise.

It's not waterfall; you're not preparing to build one rigid thing, untested
until complete. But it's not myopic agile, working only within the mental
confines of a single sprint. Build legos, and then build *with* the legos.

Beware, though! Good mise only comes from a practiced technician. The grunt-work
of chopping celery may go to a less experienced cook, but establishing what goes
where and what's necessary -- making the omelette in reverse -- requires
experience. It's easy enough to waste time preparing the wrong tools.


## What are you actually suggesting I do, Sam?

I'm not actually suggesting any new processes; just a new vocabulary to use when you
think about then. A good design system, that lets you make buttons or forms or
modals (or whatever UI it is you make lots of) quickly and without thinking is
not a luxury; it's mise. A library of templates for making new components,
classes, or models: mise. Building libraries and factoring them out of your code
isn't an 'on-the-side' way to support open source -- it might be primary prep-work.

Don't just think 'I must write the requested code', think 'I must continue
writing requested code, at pace, indefinitely' -- and prepare yourself, and your
team, accordingly. 
