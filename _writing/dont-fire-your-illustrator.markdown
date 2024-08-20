---
layout: post
title: "Don't Fire Your Illustrator"
subtitle: Understanding (and Art Directing) AI image generators
date: 2023-08-20
categories: software, art
notes: "Oh no, the robots are doing the fun human work instead of the degrading mechanical work"
image: "/assets/images/rgb_space.png"
---

My academic training is in Fine Art, painting, and printmaking. My professional career for the past 20 years has been in software engineering, including machine learning. This makes me uniquely situated to <strike>panic about</strike> discuss image-generative AI systems like Midjourney, DALL-E, etc.

This essay comes to you in two parts (both of which are right here on this page).

[Part I](#part1) is a mostly-un-opinionated technical description of how one popular branch of AI image generation currently works. If you're already familiar enough with stable diffusion to understand the terms "latent space" and "text transformer," you can skip ahead.

[Part II](#part2) is a very opinionated prediction of how this technology will be successfully used and by whom.

## <a name="part1"></a> PART I: Stable diffusion

### I a) The Latent Space

If you want to talk about colors, there are more and less useful ways to name them for different tasks. Take the color "pinkish purplish autumn mist" and make it a little warmer; what color is that?
Mix a little ultramarine, a little alizarin crimson, a tiny dot of cadmium yellow, and a good blob of titanium white. Make _that_ a little warmer; what color is that?
Take the RGB color `234, 182, 227`, and make it a little warmer; what color is that?
Or the HSV color `308° 22° 92°`. Or the Lch color `80/30/330`.

When we use lists of numbers to name points in a physical space, we don't do so randomly.

![Several points plotted on an x and y axis, labeled with the numbers (5, 4), (6, 5) and (-5, -10)](/assets/images/vector_space.png)

We pick a numbering to ensure that when the numbers are close, the locations they name are close, and when the numbers are very different, the locations they name are far apart.

We can also use a list of numbers to describe a non-physical space, like the space of colors:

![A cube of colors representing all of RGB space, with red increasing to the left, green to the top, and blue into the picture plane](/assets/images/rgb_space.png)

And we want the same rules to apply: similar colors should have similar numbers, and similar numbers represent similar colors. There are many ways to give colors numbers --- RGB, Lch, CMYK --- and each numbering results in slightly different relationships between those colors. The goal is always "put similar things near to one another," but we might define "similar things" in a variety of subtly different ways.

The numbers don't contain the appearance of colors nor the literal pigments they're made from --- it's a labeling system, not a filing system. The numbers for a color are both a label and a set of instructions: mix this much red light, this much green light, and this much blue light, and you'll get the color that these numbers label.

Words are more complicated than colors. Still, one could imagine assigning every word a bunch of numbers --- perhaps hundreds, instead of just three --- in such a way that "mom" and "dad" have similar numbers, and "mom" and "prestidigitation" are further apart.

Researchers have used AI to take lots and lots of text and (by assuming that words that appear near each other in text are related in some way) build a space of words that's like that.

Whole images are even more complicated than single words or colors, but (by using thousands of numbers) we can imagine "spaces" where similar images are represented by similar lists of numbers.

We _could_ do that by listing every RGB color of every pixel in an image --- that will make some similar images close to each other! There are downsides, though. That method takes _millions_ of numbers. Worse, some similar pictures won't be near to one another at all: for instance, the RGB pixels in a picture of a black cat and the RGB pixels in a picture of a white cat will be very, very different, even if they're otherwise very similar pictures of cats.

So how do we build a useful space for images? It's one thing to assume words that appear near one another are similar because the same word gets used in millions of different situations, with _heaps_ of nearby words. Most images only get used once, and maybe not near any other images at all!

We can _borrow_ our latent space of words, though: Lots of pictures have captions, labels, or words nearby. Researchers have used AI to build image spaces where pictures with similar _captions_ are near one another. Pictures labeled "cat" are near to each other and pictures labeled "car" are near to each other, and pictures labeled "Miyizaki cat-bus" are somewhere between.

In generative AI research, these spaces of images are called "image latent spaces."

A latent space can give you a list of numbers that approximates any image you might ever want to see, and every random uninterpretable image, too. It's Borges' [Library of Babel](https://en.wikipedia.org/wiki/The_Library_of_Babel) but for pictures.

How do we navigate that space full of sense and nonsense to find the numbers for images we want to see?

### I b) Stable diffusion

(Understand that what I'm about to describe, called stable diffusion, isn't the only way to accomplish this, but it's a popular one)

Imagine seeing a picture of a cat on a staticky television:
If you squint, you can make out the cat. If you wanted to, you could paint out the static and reveal the cat more clearly.

Imagine seeing a cat behind a _lot_ of static. You could squint, sketch in some lines, squint at those lines, and probably get a picture of a cat, though not exactly the same picture of a cat.

And maybe you can imagine seeing pure static and convincing yourself there's a cat in there somewhere, and with a lot of squinting, slowly teasing out a staticky picture of a cat, then a less staticky one, and then a clear picture of a cat.

This is stable diffusion: We took millions of images, made them a little noisy, put them in latent space, and trained the computer to clean them up. And then, we took the noisy images, made them noisier, and trained the computer to make them less noisy. And we made those noisier, and then even noisier, until the images were obliterated, and the computer could, step by step, hallucinate its way back to _some_ image. Not necessarily a good one, or a useful one, but a non-noisy image.

We can also take our word space and train the computer to try and associate an image in image-latent-space to some words in word-latent-space and say how likely an image is to have a particular caption. A picture of a cat is likely to have the caption "my cute kitty mister french fry" and unlikely to have the caption "the engine from a 1959 Austin Healey."

The last piece of the puzzle is called "cross attention," which is a fancy way of saying, "glue several AI systems together, so they can do two things at once." In particular, we can ask the computer to remove some static from an image AND nudge that image to be more likely to be captioned with some specific text.

And that's it --- that's generative AI.

Note some important things:

- while every image in the training set is representable by some numbers in latent space, the images themselves are not there in any specific way.
- To steer the process, the words you type get turned into points in a word latent space, which then gets retranslated into a movement in _image_ latent space. That's hard! And making small adjustments to the result using just words can be _very_ hard!
- The kinds of images that are very common --- statistically likely --- get organized in bigger and more well-organized parts of latent space.
- There are other systems for steering the denoising process --- using text labels is just one of them --- but all of them involve cross-attention between the denoising and some other goal.

A test of understanding: why does this produce extra fingers and deformed hands?
The wrong way of thinking: every input image the model has trained on has correct hands, so it should learn to draw correct hands!
The latent space describes _every possible image_. The nudge away from noise prioritizes clarity. The nudge towards a text label is satisfied by any image that would best be labeled by that text. Image captions rarely mention people's hands, especially not with correct and incorrect numbers of fingers. There's not much pressure toward perfect hands, and adding negative labels like "no deformed hands" relies on a very small number of images out there labeled "deformed hands." (You might have better luck with a negative label for "polydactyly" since that label correlates very strongly to extra fingers)
Most generative systems have separate components specifically to correct faces because the same issue applies; the core system is content if there's something face-like, while our eyes are very picky about faces being correct, with the eyes pointed in the same direction most of the time.

A test of understanding: why does adding an artist's name, like James Gurney, produce better images overall?
Most image captions are nouns: a person, an object --- the picture's focal point. The background can be nonsense; if the foreground is a teapot, it's fair to caption it as "a teapot." Non-teapot parts of the image aren't under much pressure. An artist's style is a gestalt; it doesn't exist in just one part of the image, but the whole thing; every pixel is under correlated pressure, so a coherent outcome is a little more likely.

## <a name="part2"></a> PART II: Who should use AI image generation, and how

There are some opinions here that will be unpopular with my artist friends. Some will be unpopular with technologists or neophilic managers. I certainly don't want you to think I am _pleased_ about any of these opinions, or that I _want_ them to come to pass; these are simply my predictions based on a goodish understanding of both generative AI and traditional image-making.

**An opinion popular with creatives: Physical media artists will keep their jobs.**

The human desire for real paintings, sculptures, woodcuts, embroideries, and so on isn't going to vanish.

I don't have much to say about that; I mostly mention it so we can set that segment of artists aside and concentrate on the larger swath of commercial image-makers.

**An opinion popular with tech and unpopular with creatives: The output of physical media will continue to be used in training generative AIs.**

I absolutely understand the desire to prevent this. Knowing your work has been used without permission to train a computer to replace people's livelihoods is extremely violating. But understanding the technical basis, I don't see any plausible way to outlaw it while still allowing fair use in all the ways human artists have been for thousands of years. Images similar to those used to build the latent space may be _recoverable_ with the right prompt and some luck, but they're not inherently there, any more than my memory of an Andy Warhol is inherently a copyright violation. I can sell Andy Warhol pastiches I make based on that memory. I can augment my memory by having a morgue file of images to train my memory on.

If you have a vision for how this can be structured legally, restricting ML uses of imagery without restricting human uses, I'd love to hear about it!

**An opinion popular with tech-loving managers and unpopular with creatives: Generative AI will replace a slice of illustration and writing: in particular, the kind where the content doesn't actually matter:**

> This blog post needs a header image that's vaguely related, not because it needs illustration but to fit the page layout.

Or

> This spammy site needs a new blog post once a week for SEO reasons.

No one from one end of the process to the final consumer particularly cares about the image or the text as long as it doesn't stand out; it is furniture.

This kind of work never paid particularly well and is now rapidly vanishing. My heart goes out to the people suffering because this work is vanishing, but I also can't see any way out, even with much stronger legal regulation of generative AI than I expect we'll ever see.

Why only that slice?

If you've ever used a generative system, I can pretty much guarantee that you spent an embarrassing amount of time making tiny adjustments to your prompt and retrying. Producing a compelling image with generative AI is pretty easy; maybe one in ten images it generates will make you say, "Wow, cool!" But producing a specific image with generative AI is sometimes almost impossible.

If you visit (often NSFW, beware!) showcases of generated images like [civitai](https://civitai.com/images), where you can see and compare them to the text prompts used in their creation, you'll find they're often using massive prompts, many parts of which don't appear anywhere in the image. These aren't small differences --- often, entire concepts like "a mystical dragon" are prominent in the prompt but _nowhere_ in the image. These users are playing a gacha game, a picture-making slot machine. They're writing a prompt with lots of interesting ideas and then pulling the arm of the slot machine until they win... something. A compelling image, but not really the image they were asking for.

Why is it so hard to get what you want?

Let's return to the technical discussion for a second.

Text is a difficult way to steer an image because while the text latent space is related to the image latent space, there are still multiple translation steps: from the actual prompt to the text latent space to a function in the image latent space. The process can only accommodate so much text at a time (usually ~75 words; if there are more than that, you must break the prompt into separate guiding systems in cross-attention).
OK. Are there better ways to direct image generation to have specific results?

Yes! It's much easier to translate an image into a latent space constraint. Images translate very well into image latent space; that's what image latent space is for. Here are some ways folks have invented to prompt image generation using images rather than words

- Create an image that would reduce to the same line art as another image
- Create an image that would reduce to the same depth map as was pulled from another image
- Create an image with matching poses pulled for another image
- Create an image whose style matches another image even though the content differs
- match perspective lines of another image
- match the colors palette of another image

These are all very powerful constraints that can exert precise control over the content and composition of a generated image.

The only challenge in using them is: where do all these guiding images come from? Who can take the time to understand the concepts we want illustrations of and turn them into a line drawing, a sketch of poses, or a style? Is there some existing job title for that?

**An opinion popular with creatives and unpopular with techy managers: Generative AI isn't much use for sophisticated needs if there isn't an illustrator involved.**

I believe that will continue to hold true even for future versions of Midjourney, DALL-E, and so on; I think the amount of text they can handle will increase, and the quality and resolution of images they produce will increase, but the fundamental challenge of getting specific imagery is not going to vanish without more fundamental changes in the approach.

**Finally, an opinion popular with no one: Commercial illustrators will keep their jobs, but will mostly need to learn to use AI as a part of their workflow to maintain a higher pace of work.**

This _doesn't_ mean illustrators will stop drawing and become prompt engineers. That will waste an immense amount of training and gain very little. Instead, I foresee illustrators concentrating even more on capturing the core features of an image, letting generative AI fill in details, and then correcting those details as necessary.

Here's a process for digital painting that I've tested and found... plausible:

- Produce a line drawing traditionally, focusing on the composition and key ideas
- Have the generative AI suggest a dozen potential approaches to color and lighting; pick one or two
- Paint almost entirely over those AI generated pixels, adjusting and correcting the color to suit my vision

Obviously, this is not a workable approach for artists that put great care and emotion into their color choices. I don't think there _will_ be any one approach that works for all artists. But for artists working on deadlines, I foresee them using AI to fill in whatever step is the least important and most tedious: crowd scenes, cityscapes, vegetation. Just like a blog post header image is furniture for the page, there is furniture for many images --- not important, but still necessary. For better or worse, that furniture is becoming the territory of generative AI.

The more concerning problem is that while generative AI _research_ is heading in this direction, offering more and more ways to direct image generation using image inputs, the products that are entering the market are not easy to slot into an illustrator's workflow at all. All my experiments have been done running open-data models on my own computer in order to have useful levels of control.

I have more to say on the subject of machine creativity and also the gacha-like nature of generative AI, but I think it best to leave this post here, with that vision of commercial illustration yet to come, and the hope that generative AI products will start catering to it.
