---
layout: post
title:  "Worrying about the <acronym>npm</acronym> ecosystem"
subtitle: There are too many packages and too many dependencies, too deeply nested. Can we measure the problem? And what do we do about it?
date: 2020-06-29
categories: code
notes:
---
### TL;DR
The <acronym>npm</acronym> ecosystem seems unwell. If you are concerned with security, reliability, or long-term maintainence, it is almost impossible to pick a suitable package to use --- both because there are 1.3 million packages available, and even if you find one that is well documented and maintained, it might depend on hundreds of other packages, with dependency trees stretching ten or more levels deep --- as one developer, it's impossible to validate them all.

I spend some time measuring the extent of the problem.

I suggest that this is a social problem, more than a technical one, and propose a semi-social solution: a human-maintained subset of the total registry, based on shared criteria by which a "healthy" package can receive a seal of approval. One criterion would be to only depend on other approved packages.

### The premise

I don't like the way I feel when I'm installing packages with npm. Selecting a package, installing it, discovering the 93 additional packages that were installed along with it, and hoping all of *them* are also suitable for my project... it feels out of control.

I feel unhappy because picking dependencies is hard, so I blame npm, and that way my problems are not my fault.

Is there some way for me to measure this badness, and thus more thoroughly escape the blame?

### Thinking a bit like a scientist, but not too much

Can we make meaningful empirical measurements of the health of the <acronym>npm</acronym> registry? I think so; but before I do, in order to maintain the slightest semblance of impartiality, I want to lay out what I *expect* a healthy package registry to look like. If it turns out that npm, taken as a whole, mostly looks the way I expect a healthy registry to look, I'll have to put my tail between my legs and take ownership of my struggles. If it looks wildly different, I'll still have hope for blaming the system.

### Imagining a healthy repository

In my ideal world there are, mostly, 4 types of packages:

- **Utilities:**

  A utility is a simple package, with no dependencies, that accomplishes a single small but onerous task. For example: lodash is a collection of utilities (and you can install each one separately). Controversially, left-pad.

- **Libraries:**

  A library is one step up in abstraction. It may depend on a handful of utilities, and it accomplishes a whole set of related tasks. For example: urlib has just a few simple dependencies, and while it does many things, it respects a clear unifying principle.

- **Frameworks:**

  A framework provides scaffolding for an entire project, and may depend on multiple libraries and utilities. You should only ever need zero or one of these in your project. Examples: React, angular, express.

- **Plugins:**

  A plugin enhances a framework with additional, special-use functionality. For a plugin, the framework should be a peer dependency, not a true dependency. It might also depend directly on a library, or a handful of utilities. Examples: an angular component or a jquery plugin.

Obviously, the world is messy! I don't expect 100% of packages to fit into such simple categories, nor are any of these definitions strict and unyielding. But overall, I'd hope *many* or even *most* packages to *mostly* conform to a categorization *something* like that, with most packages being utilities and libraries, and the fewest packages being frameworks.

### What would that mean statistically?

In a world where packages fit mostly into that hierarchy, a registry of many packages would have these qualities:

- No dependency cycles
- Most packages would have dependency trees 0-4 levels deep, leaning towards lower numbers
- Even the deepest and broadest frameworks would depend on fewer than 250 packages, including dependencies of dependencies (3-4 steps deep, with 3-4 dependencies per package, <= 4<sup>4</sup> max). Most packages would install well under 30 other packages. These numbers are extremely generous; smaller numbers would make me even happier.

### What do we actually see?

I downloaded the metadata for all 1.3 million packages in the npmjs.org repository and attempted to crunch some numbers. (For more technical details on how I did this, see the final section, titled "Appendix: Methods")

I'm going to use "the number of other packages that depend on this one" as a poor-man's proxy for how popular a package is. It's not a *good* proxy, but neither is the other common choice: the number of downloads (see the section ["Background"](https://packaging.python.org/guides/analyzing-pypi-package-downloads/#background), from PyPI). The number of downloads would have been much more computationally expensive to acquire, so I used dependents.

### Circular dependencies

Of those 1.3 million packages, 1,700 depend directly on themselves, either perfectly circularly, or a different version of the same package. I have no explanation for that.

2500 packages are part of a two-package dependency cycle.

Then ~500, ~125, and ~25 are part of 3-, 4-, and 5-package cycles, respectively. (These are not always simple circles; it may be three codependent packages in any loopy arrangement)

My immediate reaction was that those numbers seemed like good news; out of a million packages, only a tiny percentage of oddball packages have circular dependencies, and the rest are fine. Right?

Unfortunately, what I discovered was that almost 150,000 packages --- more than 1 in 10 --- had at least one of these circular dependencies *somewhere* in their dependency graph. That means at least a few of those "oddballs" are actually major, highly-referenced packages. Some examples:

- `babel-core` depends on `babel-register`, which depends on `babel-core`.
- `yeoman-generator` depends on `yeoman-environment` which depends on `yeoman-generator`.

Those are not isolated instances; I plucked them as the most easily recognizable out of a list of dozens of highly-depended-upon packages with circular dependencies.

I need to be clear, here, that this is not *technically* a problem! <acronym>npm</acronym> can install these packages just fine. They can circularly-depend on one another; there's no technical problem. They work. Obviously. If `babel-core` didn't work, someone would have said something by now.

But I'm not particularly comfortable with it. I'm especially uncomfortable when the cycles involved are longer than two packages, which makes them seem less intentional. Maybe there's a good reason; these folks are smart, and I always try to assume that odd choices were made for important reasons. And yet...

### What about `devDependencies`?

Among the most-depended-upon packages are

- `@types/`[something]
- compilers like `typescript` and `babel`
- build systems like `gulp` and `webpack`.

I'm **not** measuring that using `devDependencies` --- `typescript` appears in over 12,000 "dependency" lists.

So while I am less concerned with packages having large and deep `devDependency` trees (I *am* still concerned, but less so), it seems that a large proportion of packages aren't making use of the distinctions between `dependencies` and `devDependencies` in the first place. That *is* concerning.

### Dependency tree depths

I am defining the depth of a package's dependency tree as the longest dependency-of-a-dependency-of-a-dependency chain I can find. Especially deep dependency trees are a problem because of how difficult they make it to audit all the packages that will get installed when including a single new package.

The *average* dependency tree depth in npmjs.org is just under 4. Which doesn't sound too bad!

As often happens, though, the mean does not tell the whole story. Almost half of all packages have no dependencies at all --- which is a good thing! --- but all those zeros dramatically drop the average of the packages that *do* have dependencies.

If we charted of the number of packages with each dependency tree depth greaterh than zero, then based on the idealized registry I imagined above, here's what I'd hope to see:

**Imagined:**

![Imaginary chart of package counts per tree depth](/assets/images/npm_packages_per_tree_depth_ideal.svg)

And here's what we actually get:

**Reality:**

![Real chart of package counts per tree depth](/assets/images/npm_packages_per_tree_depth.svg)

Remember that we were hoping for mostly 2, 3 and 4. Instead, there are still a long tail of packages with tree depths *above 20*. 20 is... much larger than I was expecting, and I was expecting to be disappointed.

But let's re-use the "oddball" theory: perhaps all those packages with extremely deep dependency trees are rarely used, and not worth worrying about. Let's check.

Here's a scatterplot, where each package is placed based on its tree depth plotted and how many other packages reference it. On the right of the plot are the most-referenced (~popular) packages; on the top are the deepest dependency trees. Again, my hopes first:

**Imagined:**

![Imaginary scatterplot of package counts per tree depth](/assets/images/npm_packages_per_tree_depth_and_dependents_ideal.svg)

Followed by reality:

**Reality:**

![Real scatterplot of package counts per tree depth](/assets/images/npm_packages_per_tree_depth_and_dependents.svg)

There are heaps of 10+ tree-depths up among even the most popular packages, and a few even reach 20+. Extremely deep trees are not just a problem of "oddball" packages.


### Direct dependencies (branching factor)

The average number of direct dependencies (among packages with any dependencies at all) is 5. That, by itself, doesn't seem to bad. It feels a little alarming when combined with high tree depths, though. Does that mean some of these packages have 5<sup>10<sup> total dependencies? (Spoiler: no.)

Here's a graph of how many packages have 1 dependency, 2 dependencies... up to 30 --- a nice, neat exponential decay.

![Chart of package counts per direct dependencies](/assets/images/npm_packages_per_direct_dependencies.svg)

This curve is clean enough that I would not be surprised to see something pretty similar in any package registry --- maybe not the exact same parameters, but a similar shape. Not shown here is an *incredibly* long tail; there are 4 packages tied for the most direct dependencies with exactly 1000, and there are runners-up spread pretty smoothly up to that maximum.

### Indirect dependencies

Knowing the average depth and branching factor, you have to imagine that counting the total dependencies of each package, including dependencies-of-dependencies, is not going to yield good news. But many of the branches of a large dependency tree are shared --- multiple packages in the tree all depend on the same library. And the tree depth I have measured is the *maximum* depth for each package --- not the average. So the picture is not necessarily as dire as an initial back-of-the-envelope calculation might make it seem.

So, now that we're convinced that we won't be seeing packages with 9 million total dependencies, let's see what the actual numbers are.

![Chart of package counts per total dependencies](/assets/images/npm_packages_per_total_dependencies.svg)

This doesn't look too bad! Mostly under 200, which fits my imagined limits. It's a little fatter in the 50-100 range than I'd like, and this chart doesn't show the looooong tail leading out to the ultimate winners with over 2500 total dependencies, but this chart doesn't make things look as bad as they feel.

For verification, let's split things out by frequency of use, again; in this chart, packages that are more often depended upon (more popular) are toward the right, and packages that will install more total dependencies are toward the top.

![Scatterplot of package counts per total dependencies](/assets/images/npm_packages_per_total_dependencies_and_dependents.svg)

The bad news here is the same as it has been. Many packages in that long tail are, in fact, reasonably frequently used. Even among the most-used packages are a few spots representing packages with over 1000 total dependencies.

### Experiment conclusions

Certainly, <acronym>npm</acronym> doesn't match my hoped-for "healthy" qualities. You can take that to mean my desires are unrealistic, or that something is genuinely wrong.

As homework for the reader: an easy way to disprove my analysis would be to show that other package repositories have the same issues: cycles, high depth, high indirect dependencies, a large proportion of unmaintained packages, packages from the statistical tails among the most-used, etc.

Do what I've done for <acronym>npm</acronym> to PyPI.org, or rubygems.org, and see if the outcome is similar, or very different.

### Why are things this way?

Some observations:

- Javascript is popular. It's the most popular language on github, and has been for over 5 years.
- <acronym>npm</acronym> uses the same file to define a project as it does to define a package. If you've added a few dependencies to your side project, publishing it as a package is essentially free. Contrast this with ruby bundler's `gemfile` vs. `gemspec` and PyPI's `requirements.txt` vs `setup.py`.
- <acronym>npm</acronym> packages are permanent; you can yank a version, or deprecate the package, but you cannot disown or delete the project. (`request` has been officially deprecated for months --- but almost 50,000 packages still depend on it.)
- There's no standard library. Everything you might want to do with javascript, you'll need to write yourself, or use a third-party package.

None of these things are bad! I am glad javascript is popular; I am glad <acronym>npm</acronym> made a thoughtful and easy way to publish packages; I am glad we fixed the impermanent-package dangers that `left-pad` so dramatically exposed.

But the collection of these observations, combined with human nature, results in npmjs.org having 5 times more packages than PyPI, a huge number of which are undocumented, maintained, unused, or nonsensical. Even among the popular and frequently maintained packages, you'll find packages with vast numbers of dependencies, including dependencies with security issues, deprecations, circular dependencies, and so on.

And because that is considered normal, it will continue to happen; and as it continues to happen more libraries will be based on those that already exist, increasing the bloat even further.

If you are an engineer tasked with selecting safe, useful, and long-lasting dependencies

### So what do we do about it?

This is the part of the essay where ideally I'd introduce my new automated package-repository-better-maker, that will solve all our problems. Instead, I can only offer some interesting things for you to imagine.

Imagine a set of rules that define a "healthy" package. They might look something like

- A healthy package is actively maintained --- either with recent commits, or with an annual "this package is still performing as intended" message.
- A healthy package has a documented backup-maintainer; someone who will take over if the maintainer wins the lotto.
- A healthy package has a way to report bugs, and those bugs are, at least, regularly triaged.
- A healthy package resolves security issues rapidly.
- A healthy package is not deprecated
- etc

But most of all, imagine this recursive rule:

- A healthy package can only depend on other healthy packages.

Now, starting with the most popular packages with zero dependencies, start collecting a list of healthy packages. Then you can start looking at the packages that depend upon those, walking teh dependency graph backwards and flagging what is not only safe, but recursively so. Eventually, (with time, and enough social pressure to be "healthy"), you could build something akin to a standard library. When a package like `request` decides to deprecate, that will mean *something* to any approved packages that depend on it --- they must find a replacement, or lose approved status themselves.

There's no need to change <acronym>npm</acronym> for any of this to work! People can still publish silly packages and personal packages and packages they have no intention of maintaining --- but it will be easy for developers in professional contexts to recognize the difference.

It's a lovely picture to imagine. Obviously, it won't work. The most popular javascript packages, especially large frameworks, have no impetus to dramatically change their practices just because some person in West Michigan made some graphs and said it would be nice.

Any set of rules will risk gaming; for instance, if you say a healthy package responds to bug reports in a timely manner, you're giving permission to furstrated mis-users to yell and scream and threaten to report a project when they're ignored.

How do we solve *those* problems?

I can imagine a committee of respected voices in javascript --- well-known developers, maintainers of popular projects, project leads from angular and react --- fighting over and finally agreeing on the set of rules, and endorsing the process with their names.

I can imagine the partial (but never complete!) automation of grading project health.

I can imagine a halfway-compromise, where rather than a binary good-package/not-good-package, packages get a pagerank-like score that depends both on their own qualities, and the scores of all their dependencies. Then a team could say "we only use packages with a health-score above 65" and still feel like they've taken some responsibility. Perhaps a score would even encourage more participation --- people do like to make numbers go up.

All of which should come as a stunning disappointment to you, reader. Thousands of words and charts and figures, and I don't even have a complete solution! What gives?

I cannot offer a batteries-included answer, but I want you to walk away with these conclusions:

- Something is wrong with the javascript ecosystem.
- It's not just a feeling; it's measurable.
- It's not really a technical problem, but mostly a social one.
- A functional solution will not be to change how packages are published, but how packages are selected for use.
- That solution will need to take into account not just a package, but all its direct and indirect dependencies, too.
- And, for approval and adoption, it will need the social clout of major names in the field.

If you're interested in discussing the problem, potential solutions, or berating me for getting it all wrong, feel free to reach out: [sam@sambleckely.com](mailto:sam@sambleckley.com).

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Appendix: Methods

There is not a *documented* endpoint on [replicate.npmjs.org](https://replicate.npmjs.org) for downloading the entire registry in bulk; for some time I assumed I would need to make 1.3 million separate requests to get the data I needed. However, the replicate api is actually a raw couchdb instance. So (don't follow this link!) https://replicate.npmjs.com/registry/_all_docs?include_docs=true is an incantation for a 50GB json file that contains more than enough information for this task.

You'll need to be able to parse that 50GB file, and if you are not among the 1% of RAM-wealthy, that means using a streaming parser. I was not expecting to do this task in javascript, but [Oboe.js](http://www.oboejs.com/) does exactly the job we need --- it allows you to parse a json file as a stream, and discard parsed nodes once they've been used.

I pushed the relevant data from that json file into a postgres database. Note that if you attempt to use [node-postrges](https://node-postgres.com/), or any other asynchronous interface, all the work of using oboe will be for naught --- you'll create tens of thousands of pending asynchronous calls, and still run out of memory. I used [pg-native](https://www.npmjs.com/package/pg-native)'s synchronous API.

My data schema was simple: a table for packages, and a join table (from packages to packages) for dependencies (I also created and filled tables for `devDependencies`, `peerDependencies`, etc, but didn't end up using them for this analysis).

Inserting 1.3 million packages and 4.1 million dependencies will take several hours. Make sure you handle errors gracefully, so you're not forced to restart the process. A few uniqueness-guaranteeing indices will help if you *are* forced to.

Most of the calculations were iterative, built like inductive proofs, and pretty gnarly.

To find circular dependencies, first find and mark all packages that depend on themselves. Then, excluding those, find 2-step cycles. Then, excluding those, find 3 step cycles. Etc.

Similarly, to calculate the depth of dependency trees, find all packages with no dependencies, and mark them as depth 0. Then find all packages that depend on packages marked 0, and mark them 1. Then find all the packages that depend on those marked 1, and mark them 2. Continue until no new packages are marked. (Make sure you're not getting caught by the cycles you detected earlier!)

The biggest challenge was counting total indirect dependencies. A single package may depend on another single package in many ways --- as a direct dependency, and as an indirect dependency multiple places elsewhere in its dependency tree. If you ignore that fact, especially for packages with deep trees, you can end up with results like "this package has 900,000 indirect dependencies".

So there is no inductive-proof-style all-SQL solution to be had, here. You must add another join table from packages onto packages, this time tracking indirect dependencies. It needs a compound uniqueness key. And you'll need to iterate through every package, starting with depth = 1 and working up, filling out the indirect dependencies from both the direct dependencies table, and all the indirect dependencies from the previous depth.

inserting 40 million entries into that join table will, as before, take many hours of computation, so try to get it right the first time.

The final graphs were made with D3.
