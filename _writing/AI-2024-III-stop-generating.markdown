---
layout: post
title: "AI in 2024: Eat&nbsp;the&nbsp;fruit, leave&nbsp;the&nbsp;rind"
subtitle: How I think about AI in 2024 (Part 3 of 3)
date: 2024-08-31
categories: software
notes:
---

In my opinion, the most exciting uses of LLMs don't involve generating text at all.

As one step of guessing what the next word of a text might be, existing LLMs turn all the previous text into a set of numbers.

There are the same number of numbers, no matter how short or long the text (with a strict upper limit of the context window). If 5 words produce 50 numbers, 500 words also produce 50 numbers -- a different 50, but still 50 of 'em. These numbers are called a 'vector embedding' of that text.

You can measure how similar or how distant those vector embeddings are, and that corresponds well to how similar or different the texts are -- not just in a basic "how many words do they share" kind of way, but in a "do they mean the same thing; are they about the same topic" kind of way.

Multi-modal models can embed text, images, and other kinds of data all in the same space, allowing that measurement between very disparate sources.

That's really cool! That's a big deal! The ability to pick out related documents, to search by meaning instead of by word, to cluster documents in high-dimensional space... that's an incredible, exciting tool, and one that can be used disconnected from generation entirely.

Most tutorials suggest using vector embeddings as a search engine, concealed behind retrieval augmented generation -- but I say, why bother with the generative part? A more effective search is the win; allowing a generative process to rephrase the results is mostly risk with little to no upside.

- Vector embeddings can't produce false text, because they only organize the text you give them.
- Vector embeddings can't secretly produce copyrighted content because they don't produce content.
- Vector embeddings can still help your users find the answers they're looking for, but you have complete control over the wording of the results
- They have much lower energy costs than generation

Every major LLM provider also offers an API for vector embeddings, and they're cheap as dirt because they require far less compute than generation.

And that's it for part III! You've now got a pretty complete picture of my opinions about large-model AI in 2024:

- [only use generation when bullshit is acceptable](/writing/AI-2024-I-bullshit.html)
- [know which arguments against it have weight](/writing/AI-2024-II-arguments.html), and
- vector embedding is cheap, low-risk, and underutilized

If you'd like to discuss how any of these thoughts relate to your team, product, and business, reach out!
