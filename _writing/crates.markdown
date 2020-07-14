---
layout: post
title:  "Not Worrying Much About Crates"
subtitle: A follow-up to "Worrying about the <acronym>NPM</acronym> ecosystem"
date: 2020-07-05
categories: code
notes:
---
This brief post is a follow-up to my [previous writing on <acronym>npm</acronym>](./npm.html). This post assumes you've already read that one.

I mentioned in my NPM post that one way to verify or refute my analysis of NPM would be to do a similar analysis of a different package repository. I suggested Rubygems or PyPI. But my post gathered some attention in the Rust community, and I learned that Crates.io has under 50,000 packages, and you can git-clone the package index in a matter of seconds.

The smaller scale, and the definite cultural differences between the javascript and rust communities nudged me hard enough to run my own re-analysis, and what I learned was interesting enough to share here.

The biggest difference between NPM and Cargo is that Cargo allows packages to define a list of optional features, which can each be turned on and off from your projects dependency list. Packages can also have *optional* dependencies which are only included for certain features.

When I read this, I assumed it would be not be used that often; so my first pass, I calculated my statistics assuming that no dependencies were optional. (I did still exclude dev and build dependencies, as I did in the NPM calculations).

What I saw was... confusing, so I took a closer look, and then recalculated *excluding* all optional dependencies.

In a moment I'll share all the pretty charts and scatterplots, but the following two paragraphs summarize:

When I include all optional feature-dependencies, Crates looks a lot like NPM. Crates contains a very popular *8 package* dependency cycle! Crate's average tree depth is worse (and the graph is shockingly flat; the depth is just as likely to be 20 as 5), but the average number of total (indirect) dependencies is ~4x better. This is due to more popular packages tending to have somewhat lower depths. But on the whole, the optional-dependencies-included picture makes me look like a fool. NPM isn't any more unhealthy, really.

But when I *exclude* all optional feature dependencies, Crates looks an awful lot like the ideal, "healthy" package registry I imagined in my NPM post. Most of the cycles go away, the tree depth settles down, and total dependencies max out around 250 --- almost *exactly* the number I imagined.

Does that mean that optional dependencies are a technical solution to what I claimed was a cultural problem? Maybe. I am tempted to say that the evidence of npm packages failing to use `devDependencies` and `peerDependecies` means that there's still a social aspect to this --- Crates provides the solution, **and** the Rust community chooses to use it --- but I am still absorbing this (to me) totally unexpected result, so I have come to no firm conclusions.

Without a more appropriate bombshell, here are the graphs. I'm not going to include much discussion of how to interpret them --- you can find that in the [<acronym>npm</acronym> post](./npm.html).

## Number of Packages at Each Tree Depth

### Including optional features:
![Package counts per tree depth](/assets/images/crates_packages_per_tree_depth.svg)

I have no explanation for how unstructured this is. Someone with more graph theory might be able to interpret what it means that these counts don't decay slowly, they instead wander up and down aimlessly and then cut off more or less suddenly.

### Excluding optional features:
![Package counts per tree depth](/assets/images/crates_packages_per_tree_depth_no_opt.svg)


Much better. Still higher than I really wanted, but drops off 4-5 steps earlier than NPM, and doesn't have any long tail at all.





## Number of Packages at Each Tree Depth by "Popularity"

### Including optional features:
![Scatterplot of package counts per tree depth](/assets/images/crates_packages_per_tree_depth_and_dependents.svg)


### Excluding optional features:
![Scatterplot of package counts per tree depth](/assets/images/crates_packages_per_tree_depth_and_dependents_no_opt.svg)

This looks remarkably like my "ideal" --- deeper than I imagined, but still lovely, low, and flat.





## Number of direct dependencies

### Including optional features:
![Chart of package counts per direct dependencies](/assets/images/crates_packages_per_direct_dependencies.svg)


### Excluding optional features:
![Chart of package counts per direct dependencies](/assets/images/crates_packages_per_direct_dependencies_no_opt.svg)





## Number of total dependencies

### Including optional features:
![Chart of package counts per total dependencies](/assets/images/crates_packages_per_total_dependencies.svg)

### Excluding optional features:
![Chart of package counts per total dependencies](/assets/images/crates_packages_per_total_dependencies_no_opt.svg)






## Number of total dependencies by package "popularity"

### Including optional features:
![Scatterplot of package counts per total dependencies](/assets/images/crates_packages_per_total_dependencies_and_dependents.svg)


### Excluding optional features:
![Scatterplot of package counts per total dependencies](/assets/images/crates_packages_per_total_dependencies_and_dependents_no_opt.svg)

Cuts off at 250, and more popular packages cluster lower in the total dependency count.
