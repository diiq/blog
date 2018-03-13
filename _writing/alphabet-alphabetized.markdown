---
layout: post
title:  "The Alphabet Alphabetized"
subtitle: The ABC's should be the ARH's
date: 2013-09-29
categories: code
notes: See Neil deGrasse Tyson's original <a href="https://twitter.com/neiltyson/status/259486092766625793?lang=en">tweet</a>.
---

Today I’m thinking about the alphabet.

Neil deGrasse Tyson pointed out that the alphabet is not actually in alphabetical order: B (“bee”) starts with b, but M (“em”) starts with e! If you write each letter out in the way you pronounce its name, and alphabetize that list, you might get something like the alphabet Mr. Tyson tweeted:

<acronym>A H R B Q D W E F L M N S X G I J K O P C T V Y U Z</acronym>

But this list is only alphabetical according to the everyday <acronym>ABC</acronym> alphabet. It is not alphabetized with respect to itself — that is, the names for the letters are not in the <acronym>AHR</acronym> order proposed by this new alphabet.

Here’s one that is:

<acronym>A R H B D W Y E F L M N S X C Q G I J K O P T U V Z</acronym>

How did I find an ordering for the alphabet that’s alphabetized according to itself?

I’ll define a general procedure <tt>alphabetize</tt> that takes an ordering of letters, and produces a new, re-alphabetized alphabet — an ordering of letters. I want to find an ordering that, when I perform <tt>alphabetize</tt>, gives me that same ordering back.

This is called a **fixed point** of alphabetize. That’s fixed as in _af_fixed: while other orderings change upon application of the procedure, this special ordering doesn’t change — it stays put. Fixed.

The easiest (but ofttimes ineffective) way to find a fixed-point is simply to iterate. Keep applying `alphabetize` to the result of `alphabetize` until the result stops changing.

This will only show you _one_ fixed point — there may be many — and it’s not guaranteed to find one even if one exists. But for my alphabet problem, it has the added bonus of finding the fixed point ordering that’s closest to our usual alphabet (provided that’s what I start with).

```python
alphabet = [("a", "a"), ("bee", "b"), ("see", "c"), ("dee", "d"), 
            ("e", "e"), ("ef", "f"), ("gee", "g"), ("aitch", "h"), 
            ("i", "i"), ("jay", "j"), ("kay", "k"), ("ell", "l"), 
            ("em", "m"), ("en", "n"), ("o", "o"), ("pee", "p"), 
            ("cue", "q"), ("ar", "r"), ("ess", "s"), ("tee", "t"), 
            ("u", "u"), ("vee", "v"), ("double-u", "w"), ("ex", "x"), 
            ("wye", "y"), ("zee", "z")]

def alpha_ind(a):
    for i in range(len(alphabet)):
        if (alphabet[i][1] == a):
            return i

def alpha_cmp(a, b):
    if a == "" and b == "":
        return 0;
    if a == "":
        return -1;
    if b == "":
        return 1;
    if a[0] == b[0]:
        return alpha_cmp(a[1:], b[1:]);
    return cmp(alpha_ind(a[0]), 
               alpha_ind(b[0]));

def new_alphabet():
    global alphabet
    alphabet = sorted(alphabet, 
                      cmp=lambda x, y: alpha_cmp(x[0], y[0]))    
    return alphabet

if __name__ == '__main__':
    while new_alphabet() != new_alphabet(): pass
    print [a[1] for a in alphabet]
```