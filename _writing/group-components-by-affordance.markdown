---
layout: post
title:  "Group components by affordance"
subtitle: A small tip for improving your componentized design system
date: 2020-05-19
categories: software
notes:
---
A componentized design system is a great way to make sure multiple products are 'on brand', but I don't think that's the most important reason to use one. What's more powerful, to me, is the ability to let designers and developers think about UX problems at a higher level. By providing larger legos from which to assemble interfaces, a design system focuses attention on what the user actually needs to do, because the difficult details of low-level interactions have already been taken care of.

Here's a tip for increasing that particular kind of leverage:

A design system will often have many components that offer the same affordance. A great example is "selecting one item out of a list of possibilities".

That same action might be afforded by a radio group, a select dropdown, a listbox, a group of toggle buttons, etc.

We tend to think of these components as totally separate entities. That makes intuitive sense: they present themselves very differently, the implementations are very different, the accessibility implications are very different.

But really, they are asking the user to make the same *kind* of decision; and the reasons for using one over another are pretty fluid.

Take a moment to checkout the big, complicated decision matrix at the bottom of this [Nielson Norman Group post](https://www.nngroup.com/articles/listbox-dropdown/). That's *just* for deciding between a dropdown and a listbox! And many of the criteria might change over time --- you have 5 or fewer options now, but in a year you might have 12.

I want to make the case that, rather than organizing your design system by appearance, you should organize it by affordance.

For each affordance, make a parent component that delegates to the various guises that affordance can take, and name it after the user action, rather than some detail of the implementation:

```html
<pick-one
  [options]="options"
  appearance="native-dropdown"
  (change)="setOption($event)">
</pick-one>

// instead of

<dropdown
  [options]="options"
  (change)="setOption($event)">
</dropdown>
```

This not only makes it easy to change your mind about how to present that affordance as your needs change, it also makes it easy to be more creatively responsive. A custom dropdown might look much nicer on desktop, but be harder to use than the native option on mobile; a set of toggles that fit nicely on a large screen might need to collapse to a listbox on a small screen. When you're just asking "what's the best way to a user to pick among options", you can make better choices than if you're asking "how can I make this dropdown work on mobile?"

But most important of all, this lets your code describe what it does for the user --- which is a huge conceptual win. When you sketch a box into your wireframe, you can label it 'pick one' and worry about the most appropriate presentation later. That lets you ocus more on the UX of your UX, and leave the UI details to be determined in the prototype.

You could even let the component enforce your chosen best practices. That Nielson Norman post suggests 5 items or fewer should all be simultaneously visible, while more than that might be better tucked away into some kind of disclosure. If you really want your design system to free you from low-level UI decisions, make that happen automatically! Any decisions based on quantity, length, and other measurable properties could be automated entirely, handle dynamic data gracefully, and free designers and developers to think about user needs at a higher, more abstract level --- which is what I think a component system is meant to do.
