---
layout: post
title: "AI in 2024: What Good is Bullshit?"
subtitle: How I think about AI in 2024 (Part 1 of 3)
date: 2024-08-16
categories: software
notes:
---

It's been a year since I last wrote about generative AI and its practical application, and some of my thoughts have solidified in that time, so I thought I might be due to revisit the topic. I expect this to come in three relatively short parts, of which this is part one.

## Generative AI is Bullshit

One of my favorite papers this year so far has been [Generative AI is Bullshit](https://link.springer.com/article/10.1007/s10676-024-09775-5), in Ethics and Information Technology by Hicks, Humphries, and Slater. Despite its inflammatory title, it presents a straightforward and largely semantic argument that I think is very useful when thinking about potential uses of generative AI.

I find myself making reference to it over and over again, and I don't want to force people to read a lengthy academic paper, so here's a 3-point summary (the paper itself is very readable, though, and if that sort of thing is your idea of fun, click through and read it instead. If you've done that, or are already familiar with the paper, feel free to skip ahead to "What is bullshit good for?")

1. "Bullshit" as a technical term
   For the sake of this argument, "bullshit" means anything that is intended to be _plausible_ but is unconcerned with _truth_. Something purely and purposefully false is a lie; but when it _doesn't matter_ whether it's true or false as long as it is believable, that's bullshit.

2. LLMs are explicitly trained to bullshit
   An LLM is given _all the text its trainers can get their hands on_, true, false, fiction, non-fiction, opinion, fantasy, shitpost, diatribe, peer-reviewed academic study...

   Training optimizes the LLM's ability to predict the next word* of that text, given some chunk of it. If the text is a complete fabrication written by a crackpot, it still predicts the next word. If the text is truth handed down by a god, it predicts the next word. If the text is a dadaist poem, it predicts the next word. It does not have the ability to say "hold on, that's nonsense!" it can only say "it is unlikely *anyone\* would ever say that".

3. 'Hallucinations' and correct answers are the same side of the same coin

   It's so tempting to think about the times an LLM generates blatantly untrue text as somehow _different_ from when it generates true text; that we can work to fix the former and keep the latter.

   But the same process generates both, and that process is inherently indifferent to truth. Both are bullshit!

## What is bullshit good for?

Just because generative LLMs produce bullshit doesn't mean they're useless. You just need to carefully pick tasks where good, high-quality bullshit is all you need.

That sounds very limiting, but one key quality of bullshit is that it's internally consistent; as soon as it contradicts itself, it loses plausibility. LLMs are not perfect bullshit generators, but a lot of their odd behavior can be understood in terms of this pressure towards consistency; very little training text, even crackpot text, outright changes its tune mid-thought.

Tasks that require agreement with the real world will sometimes fail catastrophically. Tasks that only require plausible consistency with the prompt are safer bets. Some examples:

- Walking someone through handling a medical crisis? Hell no!
- Explaining scientific concepts to students? No, probably dangerous.
- Summarizing a correct but lengthy description of a scientific topic down to a couple sentences? This is on the edge of its ability; it's much harder to make a summary that's plausible but incorrect when the document is right there.
- Rephrasing a correct short summary in different words, or according to some constraint? Now we're talking!

This is one reason why retrieval-augmented generation makes for more effective chatbots than training-based specialization: retrieving existing (and truthful) documents is a search task, and then rephrasing their contents to fit the conversation merely requires consistency, and so plausibility is often enough of a constraint to maintain that truth.

Is a generative LLM a good choice for my task? Questions to ask yourself:

- Am I OK with producing falsehoods with some frequency?
  _or_
- Can I provide enough context that even limited internal consistency of the response with the prompt will incidentally ensure correctness?
  _and_
- Am I in total control of the prompt, or will users or other parties be able to make the prompt inconsistent, leading to poor results?

This is considerably simpler than most of my question-based discernment tools! I suspect you can guess from the last of these questions that I'm [still bearish on AI-powered chatbots](/writing/build-a-product-not-a-chatbot.html). I don't think exposing a raw LLM to users is a sensible approach for reliability, security, expense, or user experience -- even with RAG involved.

That's not to say I am against the vector database portion of RAG. These questions apply only to generative uses of LLMs. It is the non-generative uses which I think are far more exciting in terms of application, and I intend to return to that subject in part III of this series.

The conclusion of this part, however, is that I still believe, like I did a year ago, that too many companies and individuals are relying on LLMs to produce concise, human-readable truth, when what they're good at is producing plausible filler. LLMs don't have to be a flash-in-the-pan fad forced into your product and then abandoned; play to their strengths, and you'll see longer-lasting success.
