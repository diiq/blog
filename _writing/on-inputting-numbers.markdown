---
layout: post
title: "On Inputting Numbers"
subtitle: A short note about the details of a common bit of UI
date: 2022-10-29
categories: code
notes:
---

It's easy to ignore little things that _ought_ to be easy. Today's case-in-point: numeric inputs on the web. Frustrating numeric inputs is something I run into again and again, and I _do_ find it hard to remember all the variables involved myself. Here are some reasons you might want users to type in some numbers:

- a price
- a weight loss goal
- a zip code
- a scale factor
- a phone number
- a PIN code
- a house number
- a volume amount

And here are some ways to write HTML inputs that accept numbers:

```html
<input />
<input type="tel" />
<input type="number" />
<input type="text" pattern="\d*" />
<input type="text" pattern="[0-9]" />
<input type="number" pattern="[0-9]" />
<input type="text" inputmode="numeric" />
```

You can also consider a slider if precision doesn't matter, or a `select` if there are actually only a few options.

Some key things to think about when making a numeric input:

- Natural numbers only? The options using `pattern` usually preclude decimals, negative numbers, and scientific notation
- Is the user interested adjusting "one more" or "one less"? `type="number"` allows the user to use the mouse scroll wheel or the arrow keys to adjust the value of the input. In the case of zip codes, this can cause dangerous typos.
- Do you need a numeric `value`, or are you willing to parse the value before use? `number` type inputs have values which are numbers or null; all the others have string values.
- Do you want to validate the input to provide a meaningful error message, or simply prevent users from typing invalid characters in the first place?
- How do you want the input to behave on mobile? `type` and `inputmode` are the only ways to guarantee users get a numeric keyboard on mobile devices.
- Does the user care about leading zeros?

**My recommendation:** if you're building a design system, I think the most universal input for numbers is

```html
<input type="text" inputmode="numeric" />
```

Write your component such that it parses the number from a string before passing it up to its parent.
