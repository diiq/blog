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


@ContentChild shared interface


Heterogenous @ContentChildren
"
---

If you just want to know how to force `@ContentChild` to return mixed component types, skip down to "Part III." If you're interested in *why* I would want such a thing, start here.

## Part I: What I Want

Every form element needs a label.

Every form element needs visually indicate if it's required.

It needs to report any errors related to what the user has entered.

Because these things have to be done *for every form element*, when there are many kinds of form elements (including custom, as-yet-unimagined ones), it makes sense to abstract these needs into some kind of higher-order component. That phrasing (and to some extent this brand of thinking) is borrowed from React, but the idea is just as useful in Angular.

Doing this both correctly and elegantly is much harder than it seems, though.

I would like to say something like this:

```html
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
```

That way, the input component can worry about being a good monetary input (which is tricky enough on its own) and the label can concern itself with all the textual business around the periphery.

## Part II: You can't always get what you want

However, that's easier said than done, because to make this all accessible, I need to properly hook up the aria attributes: `aria-labelled-by` for the label itself; `aria-described-by` for longer descriptions and error messages; plus `for`, an attribute which is on the `label` element but its value should match the id of the input...

And really, I don't *want* to have to say `required="true"` twice, but both the label and the input need to know that information. Ditto the valid/invalid state, any loading animations, etc, etc.

There's a lot of *shared state* between these two components. Having to construct that shared state in the parent component and then pass it into both the label and the input, for every single input in a form... it's not my cup of tea.

I could, potentially, write some kind of decorator that takes an input component and constructs a labeled version of that component --- but it'd have to be relatively clever, I think, to transparently pass though any and all qualities of the input inside.

Here's what I'd *like* to do; first, I want to define an interface that declares all the stuff an input needs to implement in order to be wrapped by a label:

```typescript
export interface Labelable {
  invalid: boolean;
  id: string;
  required: boolean;
  describedBy: string;
  labelledBy: string;
  loading: boolean;
  // ...etc
}
```

Then, somewhere inside my LabelComponent, I'd like to assign those values:

```typescript
  @ContentChild( ??????? ) input: Labelable;

  ngOnChanges() {
    this.updateInput();
  }

  updateInputs() {
    if (!this.input) { return; }
    Object.assign(this.input, {
      invalid: !!this.errors,
      id: this.inputId,
      required: this.required,
      loading: this.loading,
      describedBy: this.describedByIds(),
      labelledBy: this.labeledByIds()
    });
  }
```

That is, I'd like my `LabelComponent` to reach inside its projected content, and pass the necessary values into the `Labelable` input component as necessary.

This is, if not a good plan, an acceptable one! Angular is happy to fetch components by Class from projected content and let my manipulate them.

The question is simply what do I put in `@ContentChild`, where I currently have `??????`?

[Angular documentation](https://angular.io/api/core/ContentChild) suggests a component class. But I want this to work for *any* component that implements `Labelable`. I can't put `Labelable` there --- angular is looking for these components at runtime; only Typescript knows about interfaces. Not only does it not work; it doesn't compile. Passing an interface by value is nonsense.

Nor would it work if I made `Labelable` a class, and let each input `extend` it. Angular is not looking *at* the class of each component; it's looking *for* the class. Inheritance means nothing.

What about a `TemplateRef`? Unfortunately, `TemplateRef` contentchildren are wrappers around <acronym>DOM</acronym> elements --- they don't return the component instance, which is what I need.

## Part III: You know my name (look up the number)

`@ContentChild` simply cannot look for "one of a group of things with different names," no matter how similar they are.

What Angular *will* let us do is *lie about the names of things*.

First, we create an empty injectable class:

```typescript
@Injectable() export class LabelableComponent {}
```

This is the fake passport we're going to give to each of our input components.

Then, in each input component, we add a provider:

```typescript
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
```

This says, "hey, if anyone comes looking for somebody named `LabelableComponent`, in this neighborhood that means `MyCoolInputComponent`."

It only makes that reassignment inside the context of `MyCoolInputComponent`; which leaves us free to use the same alias for different components in different contexts.

Now, we replace our `?????` with this new alias:

```typescript
@ContentChild(LabelableComponent) input: Labelable;
```

And `this.inputs` can now contain any component which offers that provider.

Note that this approach also works perfectly well with `@ContentChildren`:

```typescript
@ContentChildren(LabelableComponent) inputs: QueryList<Labelable>;
```

Finally, optionally, I tuck that provider line into a function. This way it's easier to remember, cleaner to write, and I can typecheck that anything adopting the `LabelableComponent` alias implements the `Labelable` interface:

```typescript
export const LabelableProvider = <T extends Labelable>(component: new () => T) => {
  return {provide: LabelableComponent, useExisting: forwardRef(() => component)};
};
```

with that defined, then in my input component I can write:

```typescript
@Component({
	// ...
	providers: [LabelableProvider(MyCoolInputComponent)]
})
export class MyCoolInputComponent implements Labelable {
  // ...
}
```

If all this feels surprizing and undocumented, and you're feeling a bit sorry for yourself, check out [this github issue](https://github.com/angular/angular/issues/8580
), where *Miško Hevery himself* had to consult *with two other people* to come up with this technique.

If, on the other hand, you think I've done something overly complicated, and there's a much simpler solution, let me know! I'd love to make this more obvious.
