---
layout: post
title:  "Content children by interface, not class"
subtitle: Also, how I handle form labels in componentized frontends
date: 2020-05-16
categories: software
notes: "In the margin I'm going to list phrases I searched for in vain while researching this, in the hope that this post will help others:


@ContentChildren of Superclass


@ContentChild parent class


@ContentChildren extends component


@ContentChildren shared interface


Hererogenous @ContentChildren
"
---

If you're interested in how I make building accessible forms easier to manage in componentized frontends, start here. If you want to know how to force `@ContentChildren` to return a list of mixed component types, skip down to "Part III."

### Part I: What I Want

Every form element needs a label.

Every form element needs visually indicate if it's required.

It needs to report any errors related to what the user has entered.

Because these things have to be done *for every form element*, when there are many kinds of form elements (including custom, as-yet-unimagined ones), it makes sense to abstract these needs into some kind of higher-order component. That phrasing (and to some extent this brand of thinking) is borrowed from React, but the idea is just as useful in Angular.

Doing this both correctly and elegantly is much harder than it seems, though.

I would like to say something like this:

{% highlight html %}
<mylib-labeled
  label="Cool Money"
  note="How much money does it take to be cool?"
  [required]="true"
  [errors]="['You must enter a dollar amount']">

  <mylib-input
    units="$"
    unitsPrefixed="true"
    (change)="setDollars($event)">
  </mylib-input>

</mylib-labeled>
{% endhighlight %}

That way, the input component can worry about being a good monetary input (which is tricky enough on its own) and the label can concern itself with all the textual business around the periphery.

### Part II: You can't always get what you want

However, that's easier said than done, because to make this all accessible, I need to hook properly hook up the aria attributes: `aria-labelled-by` for the label itself; `aria-described-by` for longer labels and error messages; plus `for`, which is on the `label` element but its value id of the input...

And really, I don't *want* to have to say `required="true"` twice, but both the label and the input need to know that information. Ditto the valid/invalid state, any loading animations, etc, etc.

There's a lot of *shared state* between these two components, and having to construct that shared state in the form component, and pass it into both the label and the input, for every single input in a form... it's not my cup of tea.

I could, potentially, write some kind of decorator that takes an input component and constructs a labeled version of that component -- but it'd have to be relatively clever, I think, to transparently pass though any and all qualities of the input inside.

Here's what I'd *like* to do; first, I want to define an interface that declares all the stuff an input needs to implement in order to be wrapped by a label:

{% highlight typescript %}
export interface Labelable {
  invalid: boolean;
  id: string;
  required: boolean;
  describedBy: string;
  labelledBy: string;
  loading: boolean;
  // ...etc
}
{% endhighlight %}

Then, somewhere inside my LabelComponent:

{% highlight typescript %}
  @ContentChildren( ??????? ) inputs: QueryList<Labelable>;

  ngOnChanges() {
    this.updateInputs();
  }

  updateInputs() {
    if (!this.inputs) { return; }
    this.inputs.forEach((i) => {
      Object.assign(i, {
        invalid: !!this.errors,
        id: this.id,
        required: this.required,
        loading: this.loading,
        describedBy: this.describedByIds(),
        labelledBy: this.labeledByIds()
      });
    });
  }
{% endhighlight %}

That is, I'd like my `LabelComponent` to reach inside its projected content, and pass the necessary values into the `Labelable` input component as necessary.

This is, if not a good plan, an acceptable one! Angular is happy to fetch components by Class from projected content and let my manipulate them.

The question is simply what do I put in ContentChildren, where I currently have `??????`.

Angular expects a component class. But I want this to work for *any* component that implements `Labelable`. I can't put `Labelable` there -- angular is looking for these components at runtime; only Typescript knows about interfaces. Not only does it not work; it doesn't compile. Passing an interface by value is nonsense.

Nor would it work if I made `Labelable` a class, and let each input `extend` it. Angular is not looking *at* the class of each component; it's looking *for* the class. Inheritance means nothing.

### Part III: You know my name (look up the number)

ContentChildren simply cannot look for "a group of things with various names," no matter how similar they are.

What Angular *will* let us do is lie about the names of things.

First, we create an empty injectable class:

{% highlight typescript %}
@Injectable() export class LabelableComponent {}
{% endhighlight %}

This is the fake passport we're going to give to each of our input components.

Then, in each input component, we add a provider:

{% highlight typescript %}
@Component({
	// ...
	providers: [{
    provide: LabelableComponent,
    useExisting: forwardRef(() => MyCoolInputComponent)
  }]
})
export class MyCoolInputComponent implements Labelable {
  // ...
}
{% endhighlight %}

This says, "hey, if anyone comes looking for somebody named `LabelableComponent`, in this neighborhood that means `MyCoolInputComponent`."

It only makes that reassignment inside the context of `MyCoolInputComponent`; which leaves us free to use the same alias for different components in different contexts.

Now, we replace our `?????` with this new alias:

{% highlight typescript %}
@ContentChildren(LabelableComponent) inputs: QueryList<Labelable>;
{% endhighlight %}

And `this.inputs` can now contain any component which offers that provider.

Optionally, as a bit of cleanup, I tuck that provider line into a function, so it's cleaner to write, and so I can typecheck that anything using the LabelableComponent alias implements Labelable:

{% highlight typescript %}
export const LabelableProvider = <T extends Labelable>(component: new () => T) => {
  return {provide: LabelableComponent, useExisting: forwardRef(() => component)};
};
{% endhighlight %}

and so

{% highlight typescript %}
@Component({
	// ...
	providers: [LabelableProvider(MyCoolInputComponent)]
})
export class MyCoolInputComponent implements Labelable {
  // ...
}
{% endhighlight %}

If all this feels surprizing and undocumented, and you're feeling a bit sorry for yourself, check out [this github issue](https://github.com/angular/angular/issues/8580
), where *Miško Hevery himself* had to consult *with two other people* to come up with this technique.

Modern Angular is... a lot, and we will all be forgiven.
