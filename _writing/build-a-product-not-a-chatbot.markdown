---
layout: post
title: "Build a Product, Not a Chatbot"
subtitle: on the business and design of generative AI
date: 2023-09-04
categories: software, business
---

A bare generative AI model by itself is not a viable product. You should stop rushing to build prompt UIs and chat-bots that serve up raw generative results and _build a real product_.

Let's unpack why.

Generative AI is the hot new thing to include in your product. Before you do so, I would encourage you to self-reflect. Over the past few years have you also attempted to include blockchain? NFTs? Are you including a generative model because it is well-aligned with your business model? Or just because it's cool and you think you should?

If your use case has passed that test; think about quality control. What does it mean if your product is serving up unreviewed content? Are you willing to accept that a voice connected to your brand will confidently say [untrue](https://www.theverge.com/2023/2/8/23590864/google-ai-chatbot-bard-mistake-error-exoplanet-demo) things? Or [frightening things](https://www.nytimes.com/2023/02/16/technology/bing-chatbot-microsoft-chatgpt.html)? These are not solved problems! **The former problem -- making up untrue facts -- _cannot_ be solved by existing LLM technology.**

None of the above is an attempt to say that generative AI is useless, or doesn't belong in your business. Generative AI is shockingly, surprisingly effective, and you should be investigating it -- but you should be thinking:

- in the long-term
- about how to use it _indirectly_
- to deal with actual business problems you have

Adding a chatbot to your web app is not the strongest use of this technology; it's easy, but it's dangerous and expensive, and your customers will not appreciate it.

Finally, think extremely carefully about the business model you're going to use to support your generative features.

For comparison, let's talk about full-internet search engines as a product.

**Customer value for search:**

- The functional value to the user comes from a small number of results; often just one
- The emotional reward to the user comes from seeing a result that seems likely to be useful. It may take a couple of tries to find the right search, but most users will give up after a handful of attempts if the results aren't promising.
- Users will almost always digest the results in some way before using them; search is mostly a tool, rather than a white-labeled service

(I break the customer value into the functional value, which is what the product is providing to them when they are clear-eyed and paying the bill, and the emotional reward, which is what feels good in the heat of the moment while they're _using_ the product. A good product has both: the product needs to feel good to use _and_ be valuable, but even when both parts are present, they aren't always well-aligned.)

**Cost for search:**

- There's a massive setup cost for crawling and indexing
- There's a small but inescapable cost per use
- At scale, some of the per-search cost can be mitigated by caching popular searches; no one minds if everyone gets the same results for the same query (though perhaps you tweak them based on history, location, etc.)

**Business value for search:**

- Google and Bing are ad-based; they earn money per search, regardless of whether that search produces a successful result for the user
- They earn _more_ if the ads they serve are themselves valuable search results.

Search is a viable product because the costs and values align quite well! The user will only do as much searching as they need to; every search costs money but also earns money; and most searches provide value. There are economies to be had when scaling the number of people searching. The math for viability is easy: can the average search earn more than the average search costs?

Now let's talk about a pure, unfiltered Generative AI product in those same terms.

**Customer value for Generative AI:**

- The functional value to the customer comes from the final generation they decide to use (the one that provides an answer, or a useful image, or whatever it is).
- The emotional reward comes _randomly, with many (but not all) generations_; this is especially true of image generation, where lots of results are cool and exciting to look at without successfully meeting the demands of the prompt, but it is also true of a chatbot. Each response is a little jolt of emotion, if not always positive.

**Cost for Generative AI:**

- There's a very large upfront cost to training, which you you may be paying via licensing if you didn't train the model yourself
- There's a large cost per generation.
- Unlike caching popular searches, the cost per generation doesn't decrease at scale, because for most use cases, users expect unique results.

**Business value for Generative AI:**

- There's not an agreed-upon model for charging for generative AI, yet.
- The method best aligned to costs is to charge per generation, but that's not well aligned with the functional value to customers.
- Most AI generation products today charge a monthly fee and limit the number of generations, with a hard cap, a throttle, or a per-use charge above a certain limit.
- Advertising doesn't pay enough to make up for the cost.

There are several financial challenges to viability, here; the first is simply that generative AI is expensive; the per-use compute cost is astronomical compared to most cloud software products.

The second is more insidious: the emotional incentives are almost perfectly Skinnerian. They're like a slot machine. Some percentage of all the generations are in some way exiting. The images are titillating (either sexually or just by being cool and exciting to look at); the messages are unexpected. _They are that way regardless of whether they suit the users' actual needs._ Because of this random-but-common reward, the user is strongly _emotionally_ encouraged to _keep pressing the generate button_. If you've used any of these tools, I'm sure you've experienced this exact urge to see just one more image. Just one more set. Just one more prompt.

Setting the _moral_ implications of that gambling-like feeling aside for a moment, it's also surprisingly bad news financially. An addictive _game_ is financially solid, because additional play is either free for the business (if it's local) or earns more than it costs (if a server is required). But generative AI is expensive, and has no economy of scale! You _want_ your users to get what they need with as few generative steps as possible; but in the heat of the moment, that's not what users are doing.

The solution is to be an ounce more thoughtful! Consider ways the generative AI can power parts of your business without simply exposing it, unalloyed, to your users. In my opinion, the best generative AI products, the ones that will still be going strong in 5 years under their own financial steam, will be ones that users _can't tell are using generative AI at all_. They'll seem like very powerful and clever traditional products -- because while the technology is new, the tenants of business and the tenants of product design are the same as they have always been.
