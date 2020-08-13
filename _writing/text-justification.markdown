---
layout: post
title:  "Unjustifiable"
subtitle: Beautiful text-justification for the web.
date: 2018-03-22
categories: code
notes: Why no examples of the results? Because this post has been laid out using unjustifiable.
---

This post details the motivation and function of my in-browser
text-justification library, [unjustifiable](https://github.com/diiq/unjustifiable).

## The History of Justification

The desirability of justified text goes back to the beginning of movable type;
Gutenberg's 42-line Bible dates to the 1450s. It was the first mass-produced
movable-type book in Europe and is still, almost 600 years later, considered
the pinnacle of typographic beauty. Let's take a look at it:

![A page from Gutenberg's 42-line bible](/assets/images/b42.jpg)

In particular, note how even and regular the text blocks look; they're
rectangular, there are no odd gaps, and they convey what typographer's call an
"even gray" &mdash; there are no concentrations of ink that stand out from any
others. The text blocks make a clear designed shape on the page. Gutenberg's
<acronym>B42</acronym> accomplishes this by justifying the text both left and
right. It ensures that no spaces between words grow so wide or so narrow as to
catch the eye. It dangles any punctuation over the edge of the text block,
because a period in line with the rest of the text block is too small a bit of
ink, and will appear like a gap in the neat edge.

Gutenberg's bible uses different widths of letters, joined letters,
abbreviations, and all kinds of other tricks to accomplish this miracle &mdash; and
many of them (especially the abbreviations) make the text _harder to read_ &mdash;
which is not our goal at all. So for both technical and readability reasons,
almost no one since has gone to such lengths to preserve perfect text
justification.

Still, almost all printed text blocks in English ARE justified &mdash; every novel,
newspaper, and academic journal article is justified. It is easy to read and
good-looking. Why, then isn't the web?

## The Anti-Justification Dictum

It turns out that web browsers are spectacularly bad at justifying text. They do
it by cramming words on to a line until no more words will fit, and then
increasing the word-spacing to make up whatever space is left. This works
acceptably for one line, but for a block of text is woefully suboptimal. It
results in large gaps in the text; in one line having
<acronym>**HUGE**</acronym> gaps and the next having _teeny-tiny_ gaps; and in
large gaps staking up between lines, creating vertical 'rivers' that catch the
eye and prevent smooth reading.

For that reason, designers for the web put forth a dictum:

> Do not justify text on the web. It is ugly.
>
> &mdash; Web Designers

## How Computers Justify Text

However, bad justification is not computers' fault. Computers are, in fact,
really very good at text justification; they just need a little more strategy
than "cram words on a line until it's full". No less luminary than Donald Knuth,
with Micheal Plass, wrote a paper on the subject of choosing optimal line breaks
for a block of text.

The basic approach uses dynamic programming for constraint-optimization; seeking
a set of line-breaks that minimizes:

* the amount of change in word-spacing from the ideal
* the difference in word-spacing between adjacent lines
* the number of words that must be hyphenated

Knuth and Plass has been widely described elsewhere; the <acronym>DOI</acronym> of the original
paper is 10.1002/spe.4380111102; I'll leave it to you to obtain it if you'd like
to give it a read.

## How I justify text on the web

The problem of making a javascript text-justification engine breaks into 4 parts:

* Determine the space available for each line in the text-block
* Determine the size of each word (or hyphenatable word-part) in the text block
* Choose the ideal line breaks for the text
* Render those line breaks with appropriate word-spacing, dangling punctuation, etc.

Pretty much every one of these steps requires an uncomfortable hack to make
possible; so strap in for some nastiness.

### Measuring Text

Unjustifiable measures text by wrapping each word (or hyphenatable word-part &mdash;
which I will refer to hereon as a **wordlet**) in a span. Each span can them be
measured in-place using basic methods of HTMLElement objects.

It's important to measure in-place because text styles (font-size, weight,
decoration, etc) all effect size, and CSS ensures that only in the exact
rendering context can we be sure we're capturing the actual styling of each
wordlet.

In particular, we need to wrap each wordlet in a span while respecting and
maintaining any elements that already exist in the text. Along the way, we want
to mark spaces (which can stretch), punctuation (which should dangle) and
hyphenatable points between wordlets (where we _can_ break the text, but it's
less ideal than on a word-boundary).

Here's some code that does that:

```javascript
const spanMaker = function(klass) {
  return content => {
    const elt = document.createElement("span");
    elt.className = klass;
    if (content) elt.innerHTML = content;
    return elt;
  };
};

const glueSpan = spanMaker("glue");
const boxSpan = spanMaker("box");
const punctuationSpan = spanMaker("punctuation");
const penaltySpan = spanMaker("penalty");

const spanifyWord = function(word) {
  const syllables = options.hyphenator(word);
  const spanifiedWord = boxSpan(syllables[0]);
  const parts = [];
  syllables.forEach((s, i) => {
    if (i > 0) parts.push(penaltySpan());
    parts.push(boxSpan(s));
  });
  return parts;
};

const glueRegex = /(&nbsp;|(?:&mdash;|&rdquo;|[-,;:"”=\.\/\)\]\}\?])+(?:&nbsp;)*)/;

const spanifyText = function(text) {
  text = text.replace(/\n ?/g, " ").replace(/ +/g, "&nbsp;");
  const words = text.split(glueRegex);
  const spannedWords = words.map(function(word, i) {
    if (word.match(glueRegex)) {
      return [glueSpan(word), " "];
    } else if (word) {
      return spanifyWord(word);
    } else {
      return "";
    }
  });
  return [].concat.apply([], spannedWords);
};

const spanifyElement = function(elt) {
  const parts = elt.childNodes;
  var contents = [];
  parts.forEach(function(part) {
    if (part.nodeType === 3) {
      contents = contents.concat(spanifyText(part.textContent));
    } else {
      contents.push(spanifyElement(part));
    }
  });

  var clonedElt = elt.cloneNode(false);
  clonedElt.innerHTML = "";
  clonedElt.append.apply(clonedElt, contents);
  elt.parentNode.replaceChild(clonedElt, elt);
  return clonedElt;
};
```

Next we walk that newly rendered tree of `span`s and measure both the size of
each wordlet, and also the existing ends of each line (the text having been
justified sloppily by the browser already, we'd like to know where to put each
line's end, especially if there are any floats or other interruptions in the
text.)

```javascript
/*
Walking the DOM in this particular way happens several times,
so I've pulled it out into a utility function. If a node has children
(not a text node, or an image, or anything),
  */
const hasClass = function(elt, cls) {
  if (elt.hasAttribute("class")) {
    return elt.getAttribute("class").indexOf(cls) > -1;
  }
};

const walkElt = function(elt, action) {
  return Array.from(elt.children).forEach(function(bit) {
    if (hasClass(bit, "unjustifiable-ignore")) {
      // Do nothing
    } else if (bit.children.length) {
      walkElt(bit, action);
    } else {
      action(bit);
    }
  });
};

/*
listWordlets takes a DOM element that has already been spanified,
and makes an array of dictionaries that summarizes the important
data about the word-fragments therein. It's recursive to cope with
nested elements (<strong>, <em>, etc.)
*/
const listWordlets = function(elt) {
  const list = [];
  walkElt(elt, function(bit) {
    const wordlet = {
      type: bit.getAttribute("class"),
      span: bit,
      width: bit.getClientRects()[0].width
    };
    if (wordlet.type === "glue" && bit.innerHTML.match("&nbsp;")) {
      wordlet.stretch = options.stretch;
      wordlet.shrink = options.shrink;
    } else if (wordlet.type === "penalty") {
      wordlet.cost = options.hyphenPenalty;
      wordlet.width = 0;
    }
    return list.push(wordlet);
  });
  return list;
};

/*
lineLengths takes an element that has been spanified and produces
a list of line-lengths. Expects the text-block to be
css-justified.
  */
const lineLengths = function(elt) {
  const list = [];
  var prevHeight = 0;
  var lineStart = 0;
  var prevOffset = null;
  walkElt(elt, bit => {
    const offset = bit.getClientRects()[0];
    if (prevOffset && offset.top - prevOffset.top > 2) {
      list.push(prevOffset.right - lineStart - options.overhang);
      lineStart = offset.left;
    }
    if (!prevOffset) {
      lineStart = offset.left;
    }
    return (prevOffset = offset);
  });
  return list;
};
```

## Finding line breaks

Now it's time to perform a bastardized version of Knuth and Plass. The proper
algorithm looks both forward AND back to minimize the difference in
word-spacings. My version looks only backward, sacrificing some beauty for an
increase in efficiency (this whole process being rather expensive).

```javascript
const sumPluck = function(list, name) {
  return list.map(e => e[name] || 0).reduce((a, b) => a + b, 0);
};

/*
A possible line break is scored in part based on the width of the
line it makes. We can measure that width (and the amount of
stretching and shrinking we can do to the line) by summing the
respective parts of all the wordlets that make up the line.
  */
const measureWordlets = function(wordlets, start, end) {
  var slice = wordlets.slice(start, end);
  while (slice.length && slice[0].type === "glue") {
    slice = slice.slice(1);
  }
  var width = sumPluck(slice, "width");
  while (slice.length && slice[slice.length - 1].type === "glue") {
    slice.pop();
  }
  return {
    width: width,
    stretch: sumPluck(slice, "stretch"),
    shrink: sumPluck(slice, "shrink"),
    glues: slice.filter(w => w.type === "glue").length
  };
};

/*
Given an index of a wordlet, and a set of possible line breaks
made previous to that wordlet, findBreaksI determines all the
ways we might make a line break at the specified wordlet. It also
determines which of the line breaks in the list of possible line
breaks are still relevant to choosing future breaks.
  */
const findBreaksI = function(wordlets, index, breaks, lineLengths) {
  var oldBreaks = [];
  var newBreak = null;
  breaks.forEach(previousBreak => {
    const lineLength = lineLengths[previousBreak.lineNumber];
    const measure = measureWordlets(wordlets, previousBreak.index, index);
    var compression = lineLength - measure.width;
    if (index === wordlets.length - 1) {
      compression = Math.min(compression, 0);
    }
    if (compression >= measure.shrink && compression <= measure.stretch) {
      let cost = previousBreak.cost;
      cost += Math.pow(compression, 2);
      if (wordlets[index].type === "penalty") {
        cost += wordlets[index].cost;
      }
      cost += Math.pow(previousBreak.compression - compression, 2);
      if (!newBreak || cost <= newBreak.cost) {
        newBreak = {
          wordlet: wordlets[index],
          cost: cost,
          compression: compression,
          width: measure.width,
          glues: measure.glues,
          index: index,
          previous: previousBreak,
          lineNumber: previousBreak.lineNumber + 1
        };
      }
    }
    if (
      measure.width + measure.shrink < lineLength &&
      index < wordlets.length - 1
    ) {
      oldBreaks.push(previousBreak);
    }
  });
  if (newBreak) {
    oldBreaks.push(newBreak);
  }
  return oldBreaks;
};

const getMin = function(list, iteratee) {
  var result = null,
    lastComputed = Infinity,
    value,
    computed;
  list.forEach(function(value) {
    computed = iteratee(value);
    if (computed < lastComputed) {
      result = value;
      lastComputed = computed;
    }
  });
  return result;
};

/*
Loops through each wordlet in a paragraph, and uses findBreaksI to
discover any possible line breaks at that point; once it reaches the
end, it chooses the lowest-cost set of breaks, which it returns.
  */
const findBreaks = function(wordlets, lineLengths) {
  var breaks = [
    {
      wordlet: {},
      cost: 0,
      compression: 0,
      index: 0,
      previous: null,
      lineNumber: 0
    }
  ];
  wordlets.push({
    type: "glue",
    width: 0
  });
  wordlets.forEach(function(wordlet, index) {
    if (wordlet.type === "penalty" || wordlet.type === "glue") {
      breaks = findBreaksI(wordlets, index, breaks, lineLengths);
    }
  });
  var ret = getMin(breaks.reverse(), function(breakChain) {
    return breakChain.cost;
  });
  if (!ret) return;
  return reifyBreakChain(ret);
};

/*
The linked list that findBreaks produces is kinda difficult to work
with; this function munges it into a cleaner array, with useful
information about spacing.

Each element in the resulting list has the following info:

- breakElement: the wordlet on which to break the line.
- firstSpacing: the word-spacing for the first n words
- restSpacing: the wordSpacing for the remaining words
- firstCount: the number n
- gluesSoFar: 0. Used by despanify.
- currentSpacing: Used by despanify.
  */
const reifyBreakChain = function(chain) {
  const rets = [
    {
      gluesSoFar: 0,
      spacing: 0,
      firstCount: 100
    }
  ];
  while (chain.previous) {
    const compression = chain.compression;
    const spacing = compression / chain.glues;
    rets.push({
      breakElement: chain.wordlet.span,
      spacing: spacing
    });
    chain = chain.previous;
  }
  return rets;
};
```

## Rendering line-breaks

This final step is messy, but it's the only method I've found that preserves all
the qualities of web text &mdash; it can be selected, copied, pasted, read by a
screen-reader, etc.

We're going to turn each line into a `span` (or several, if the line is broken
by an existing <acronym>DOM</acronym> element); then follow that span with a
non-selectable, non-screen-readable hard line-break. The span will get an
in-line style setting its word-spacing to some wild fractional number of pixels.
(When I first wrote unjustifiable, word-spacings could only be whole-number
pixels, and each line had to be broken into several `span`s whose word-spacings
averaged to the correct value. Thankfully that's no longer necessary.)

We'll also remove the spans from any text that the algorithm failed to find a
solution for.

```javascript
const despanifyElement = function(elt, linebreaks) {
  if (!linebreaks) return despanifyNoJustify(elt);

  var curElt = null;
  const openSpan = cbreak => {
    const elt = document.createElement("span");
    elt.style.wordSpacing = cbreak.spacing + "px";
    curElt = elt;
  };
  const closeSpan = elts => elts.push(curElt);
  const pushContent = content => (curElt.innerHTML += content);

  const newLine = elts => {
    const elt = document.createElement("br");
    elt.setAttribute("aria-hidden", "true");
    elt.style.userSelect = "none";
    elts.push(elt);
  };
  const hyphen = elts => {
    const elt = document.createElement("span");
    elt.innerText = "-";
    elt.style.userSelect = "none";
    elts.push(elt);
  };

  var cbreak = linebreaks[linebreaks.length - 1];

  const recur = function(elt) {
    var elts = [];
    openSpan(cbreak);
    Array.from(elt.children).forEach(function(bit) {
      if (bit.children.length) {
        closeSpan(elts);
        elts.push(recur(bit));
        openSpan(cbreak);
      } else {
        let bittext = bit.innerHTML;
        if (cbreak && bit === cbreak.breakElement) {
          if (bit.getAttribute("class") === "penalty") {
            closeSpan(elts);
            hyphen(elts);
          } else {
            pushContent(bittext);
            closeSpan(elts);
          }
          newLine(elts);
          linebreaks.pop();
          cbreak = linebreaks[linebreaks.length - 1];
          openSpan(cbreak);
        } else if (bit.getAttribute("class") === "box") {
          pushContent(bittext);
        } else if (bit.getAttribute("class") === "glue") {
          pushContent(bittext.replace("&nbsp;", " "));
        } else {
          elts.push(bit);
        }
      }
    });
    closeSpan(elts);

    // Now return a new elt with the new contents:
    var clonedElt = elt.cloneNode(false);
    clonedElt.innerHTML = "";
    clonedElt.append.apply(clonedElt, elts);
    return clonedElt;
  };

  elt.parentNode.replaceChild(recur(elt), elt);
};

const despanifyNoJustify = function(elt) {
  const recur = function(elt) {
    var elts = [];
    Array.from(elt.children).forEach(function(bit) {
      var bittext;
      if (bit.children.length) {
        elts.push(recur(bit));
      } else {
        if (
          ["penalty", "box", "glue"].indexOf(bit.getAttribute("class")) >= 0
        ) {
          bittext = bit.innerHTML.replace("&nbsp;", " ");
          elts.push(bittext);
        } else {
          elts.push(bit);
        }
      }
    });
    var clonedElt = elt.cloneNode(false);
    clonedElt.innerHTML = "";
    clonedElt.append.apply(clonedElt, elts);
    return clonedElt;
  };

  elt.parentNode.replaceChild(recur(elt), elt);
};
```

## Putting it all together

```javascript
function(elt) {
  var bestBreaks, lineLength, wordlets;

  // Wrap each syllable in a span so we can measure it
  elt = spanifyElement(elt);

  // Temporarily justify so we can measure line lengths (esp. around floats)
  elt.style.textAlign = "justify";
  lineLength = lineLengths(elt);
  // Assume last line (which won't have justified) matches the next-to-last-line
  lineLength.push(lineLength[lineLength.length - 1]);
  elt.style.textAlign = "left";

  // Find the proper places to break each line
  wordlets = listWordlets(elt);
  bestBreaks = findBreaks(wordlets, lineLength);

  // Render the new line breaks
  despanifyElement(elt, bestBreaks);
};
```

And there you have it. Proper text justification bolted on to the browser using
javascript.
