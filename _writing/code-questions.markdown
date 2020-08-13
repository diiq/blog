---
layout: post
title:  "Code Questions"
subtitle: a rambling explanation of how I critique my own code
date: 2014-04-15
categories: code
notes:
---

I want to talk about 5 questions I ask myself, almost unconsciously, while writing code. I think they’re very important, but it’s going to take me a little while to build up the conceptual vocabulary to explain ‘em. Be patient with me!

## I. Intention, Action, and Magnification

A foundational metaphor: looking at software at different levels of magnification. Zoom way in, and see individual morphemes of code. Back off a little, and see variable names, fragments of lines. Zoom out, and see full lines, then methods and functions, then classes, libraries, programs, suites of interacting programs...

Nevertheless, just like a painter who is responsible both for every brushstroke and also the composition of the whole painting, or a municipal engineer who must attend to the movements of individual pedestrians and also the flow of thousand-car traffic jams, a programmer must smoothly administrate their software at every level of magnification.

One of the primary reasons students straight out of school are terrible programmers is that they’ve never been faced with a project so large they couldn’t hold it inside their head. In fact, most course schedules stretch students slowly, allowing them time to learn how to mentally juggle programs of gradually-increasing complexity. Such small programs can be written terribly, without the additional mental load exceeding the programmer’s capacity. As the capacity of the programmer increases, their capacity to write big, bad programs increases, too.

The beginning of enlightenment for me didn’t come until I encountered a real, overgrown, hideous codebase. It wouldn’t fit. It wouldn’t fly. It sat on the ground and steadfastly refused to be juggled.

Staggering under this load, we seek tools that let us treat large programs like small ones. Object orientation, languages, macros, templates, factories, libraries — almost any tool or practice we’ve ever come up with are intended for to diminish the mental weight of our programs.

Most of them apply at a specific degree of magnification.

But while specific technical practices are limited to one level of zoom, the same _mental_ practices that make good software architecture at a monumental scale work also at the smallest scale. Symmetries along the zooming axis delight me; so I ask myself the same questions when I’m architecting a new project, creating a new class, authoring a new method, or altering a single line.

I want to write about how that works — so please allow me new definitions for some old words (at least temporarily).

When I write software, the act of describing my intent is what _I_ call **design**. The design is “what it should do.”

The implementation of that intent is **code**. For the sake of this article, code is _often_ verbal, but is not limited to files filled with text. If it’s in your repository, I’d probably call it code.

The separation of design and code occurs at all levels of granularity, from the coarsest to the finest. Even in a single line, there is a narrow-but-present cleft between my intention (increase value of the variable i by one), and my verbal action (<tt>i++;</tt>).

Viewed from afar, design dictates what the program should do “let the user see cat pictures” — and decisions about things like program architecture clearly fall under implementation: code. When looking closer-in, at a single function, that function must meet its particular, predefined role in the overall architecture: the architecture defines the function’s “what it should do”, and so the architecture acts as design.

See the line that divides design and code shift forward and back depending on the degree of magnification. To bridge the gap between design and code, simply choose a different level of granularity.

When I read, review, or revise software, if I want to critique design and implementation separately, I must first pick the scale at which I am passing critique.

## II. Inquisitive Practices

When I was in high school, I learned to play Go (you can probably learn too much about me based on the fact that I managed to make myself an outsider even from e chess club). After a few months of practice, I was given a list of questions. I was told that if I asked and answered these questions before every move, I would nstantly gain 5 stones on my handicap. None of the questions contained any new information I didn’t already know. “Defend weak groups.” “Attack the opponent’s territory.” Baby stuff.

But as sure as the sudden arrival of spring, I played almost exactly 5 stones better. Why? How?

Because the advice was phrased in the form of questions, like, “Do you have a weak group?”

Because they applied equally to the beginning, the middle, and the end of the game.

Because they became a habit.

I knew that I _should_ defend weak groups, but asking this question as a habit forced me to _find_ weak groups, to _recognize_ them, and to do so _mentally prepared to consider defending them_.

Lists of questions are better than lists of ideals.

We all hold similar ideals for our software. Software should be modular, flexible, robust, readable, well-documented, self-documented, well-rounded, well-fed, happy, bouncy, and have a well-groomed and glossy coat.

It’s all too easy to nod vigorously, say, “Yes! Code should be just like that!” and remain blind to the places where my software fails to be that way.

Questions are mean. They bully you to look directly into those areas of blindness. They rub your face in your failures.

It’s easy to list out useful questions. But somewhere between question number 15 and question number 500, you’ll realize that a lengthy list of excellent, razor-focused questions is totally useless because you’ll never take the time to ask them.

Your list needs to be short — I like 5 questions. To keep the list so short, every question needs to apply equally well whether you’re examining a single line or a whole program. Each question should be concise and easy to remember. You’re going to be asking them a lot.

## III. Questions for Design

My first two questions regard design. Remember, I’ve temporarily redefined design to mean “the act of describing my intention.”

*   What action should it take?
*   What question should it answer?

Remember, these questions apply at every level of magnification. You should have a single answer for each of these questions.

Here’s a function, `dingsave`, from a terrible game I wrote years ago. I’m confident it can use some improvement:

```javascript
var save_squares = {};
var dingsave = function (actor) {
    // A checkpoint; saves your game and goes 'ding'
    if (actor.type === "player") {
        grid.tiles[actor.x][actor.y].hash = "_";
        if (!save_squares["" + actor.x + actor.y]){
            save_squares["" + actor.x + actor.y] =
                {color:actor.color, tilemap:brief_tilemap(grid.tilemap)};
        }
        transitions.push(function(){
                             if (callbacks.ding)
                                 callbacks.ding(count);
                             count = 0;
                             grid.tiles[actor.x][actor.y].hash = "_";
                             actor.color = save_squares["" + actor.x + actor.y].color;
                             grid.tilemap = unbrief_tilemap(save_squares["" + actor.x + actor.y].tilemap);
                             actor.save(grid);
                         });
    }
    return true;
};
```

_cough_ Oh dear. Let’s try and discern past-me’s answer to the first question: What action should it take?

First, note the comment: this function “saves your game and goes ding.”

This function, as best as I can tell, was called when a player stepped on a ‘save game’ square. It does this by setting a grid tile to a new value, and pushing a value into a hash of saved states, and registering a callback that calls another callback (the ding) and _also_ sets a grid tile and then restores everything from the save we just made.

Then it returns true.

That’s a _terrifying_ answer to the question “What action should it take?”

I had some design problems.

The sorts of answer you’re looking for:

*   the function `save_game` saves the game.
*   the function `ding` queues a bell to ding at the end of the turn
*   the function `change_tile` queues a tile to transition into a different tile at the end of the turn.

One, single, simple answer.

Let’s look at a single line:

```javascript
grid.tilemap = unbrief_tilemap(save_squares["" + actor.x + actor.y].tilemap);
```

This line, the ghost of past-me explains, calculates a hash of the current grid-cell, finds the compressed game-state that was saved in that square, decompressed the game state, and sets the current game grid to that value.

Past-me, have you no decency? No sense of pace or decorum?

Just as a function should take a single, concise action, a line of code should take a single, concise action.

What if we zoom out? Let’s look at what might (very loosely) be termed a ‘class’:

```javascript
var new_grid = function (url, callbacks) {
      console.log(url);
      var grid = {}, width, height;
```

[there follows _500 lines_ of embarrassment, ending with:]

```javascript
      /** Load 'er up! **/

      $.ajax({url:url, dataType:"json", async:false, success:grid.mport});

      grid.specials = {
          //3:[{src:"baobad.png", x:66, y:2, offset:[-95, -287]}],
          //3:[{src:"baobab.png", x:66, y:2, offset:[-110, -370]}]
          //3:[{src:"clockwork.png", x:66, y:2, offset:[-50, -235]}]
      };

      return grid;
};
```

AJAX! A dead asset list! And in the 500 line interim, while I do add some methods to `grid`, I also set configuration data, define some UI, link to static assets... and so on. You get the idea: even a class should do one and only one thing: “The class grid should store and report the state of the game grid.”

“What about changing the colors of tiles?”, young-me asks.

Perhaps a tile class?

"What about the default settings of the game grid?"

Perhaps a defaults structure?

Do you see how a strict separation of concerns emerges from redesigning until “What action should it take?” has a single, simple answer? And how that is true whether you ask at a high level (where it can help you trim features out of your program altogether) or at the lowest level, where it ensures that each line of code is clear and adaptable?

Now, what about the second question: “What question should it answer?” Sometimes, this is easy: you’re need a method to look up a value in a database, or calculate some statistical summary of a collection of data. These methods take no actions — they just answer a single question.

And sometimes a method doesn’t need to answer a question at all — sometimes it _only_ takes an action.

But what about `dingsave`? Or, rather, what about `save` (assuming I redesigned based on my horrific answer to the action-question)? Should it answer “Did it save successfully?” Or should it answer “Where is it saved?” Or even "What information got saved?" There is no "right" answer — but trying to do _all_ of these things will muddy the design. It is fair to have lines, methods, classes, programs that have one answer to each of these design questions.

## IV. Questions for Code

*   “What part has the worst fit?”
*   “What part will be hardest for a new team member to understand?”
*   “What part will be hardest to modify, later?”

These are negative assessment questions. Imagine a structural engineer assessing points of failure — it makes sense to pick them out, even when they will tolerate far more than any expected stress. By identifying the weakest points, and deciding that they are strong _enough_, they can be confident the whole structure is strong enough.

Fit (allow me just one more definition) is how closely the code matches the design. If the code does exactly what it is intended to do, and nothing else, in all circumstances, then the fit is perfect.

This is almost never the case.

It is useful to assess fit, so that you’re aware of edge cases and failure modes; asking “What part has the worst fit?” forces you to explicitly visualize the difference between your design and your code.

I love this question: “What part will be hardest for a new team member to understand?”

I love the struggle of forcing myself into someone else’s shoes. Trying specifically to imagine a new team member encountering your code, and the struggles they will have, is an incredibly clarifying exercise. I find it helpful to pick a specific developers I’ve known, and imagine their reactions to my code.

As always, this question applies at all scales of implementation; just always have another imaginary and uninformed developer standing over your shoulder, trying to understand.

This final question, on the other hand, is evil: “What part will be hardest to modify, later?” This is the riskiest question to act upon. For that reason, I’ve saved it for last. Ask all the other questions _first_. Take care of any answers that leave you discontent. Then, and only then, pick up this question — carefully! Like it were a glass spider. It, and its answers, are both delicate and dangerous. Predicting the future is a rum game; but so is paying no attention to flexibility. The key, I think, is to make no changes that decrease your satisfaction answering with the other questions.

*   “What action should it take?”
*   “What question should it answer?”
*   “What part has the worst fit?”
*   “What part will be hardest for a new team member to understand?”
*   “What part will be hardest to modify, later?”

Writing code is revising code. It is a constant verbal performance; as you add new features, tension will grow in old code, until finally the answer to one of these questions is too dissatisfying, and you’ll make a change.

That’s <acronym>OK</acronym>! It’s <acronym>OK</acronym> that old code is dissatisfying. It’s <acronym>OK</acronym> that new code makes it worse. These questions protect you from making your new features bad from the start, and they also keep your eye steadily on those parts of your software that are rotting the fastest. They are indicators, the test-strips of my programming world.

Ask yourself questions.

Make them suit any level of magnification.

Make them short.

Don’t make too many.

Make them a habit.
