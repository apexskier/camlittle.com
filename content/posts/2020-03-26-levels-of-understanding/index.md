---
title: "Levels of understanding"
slug: "levels-of-understanding"
date: 2020-03-26T20:56:07+01:00
tags: ["philosophy"]
---

Over my time working in the real world I've learned a lot about what it means to actually understand something. Naturally, this includes realizing that I don't understand everything as well as I'd like to. I've also learned a lot about the process of learning, which has given me insights that have helped me grow faster along the way.

To start, what does understanding actually mean?
To [paraphrase](https://www.goodreads.com/quotes/243913-in-general-i-feel-if-you-can-t-say-it-clearly) [others](https://www.goodreads.com/quotes/19421-if-you-can-t-explain-it-to-a-six-year-old):

> To fully understand something you should be able to explain it to someone else.

Getting there takes time. In my experience there are a number of stages along the way, and I've found that recognizing where I'm at helps me avoid mistakes and accelerates the learning process understanding faster.

In this post, I'm going to describe these stages as I understand them and how I use them.

<div class="levels">

1. I don't understand
1. I can copy and extend
1. I know enough to be dangerous
1. I've got a bad feeling about this
1. I can explain what I know

</div>

### I don't understand

At this point I'm aware that I don't understand. I've moved past the Peak of "Mount Stupid" and I'm in the "Valley of Despair" in the [Dunning–Kruger](https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect) curve. This is a safe place to be, since the though that I might be doing things wrong is top of mind. When I'm writing code, I pay much more attention to what I'm doing and try to communicate my questions to other reviewers, so they also take a closer look. I also take more time to build safeguards into my code during this phase because the likelyhood of future change is higher.

### I can copy and extend

At this stage, I can build upon existing patterns, and I'm starting to see the shape of those patterns. This is where I generally learn the fastest, but only if I'm paying attention. It's key here to avoid [cargo culting](https://en.wikipedia.org/wiki/Cargo_cult_programming) while recognizing the cost---it takes time and mental energy.

When I'm working with someone else who's at this level I trust them to work independently, given they have patterns to copy and their code is well-reviewed.

### I know enough to be dangerous

This is the riskiest level, and the best way to get through it quickly is to take personal responsibility. At this stage I know a few patterns, but not how to apply them. A specific example is when I first learned about [go modules](https://blog.golang.org/using-go-modules) and [packages](https://golang.org/ref/spec#Packages). I knew how to set up my project to use packages from external dependencies, but not how to apply the package organization structure to my own project. In order to get stuff done my project grew to have have excessively long files and code duplication. Since I knew I wasn't following the right pattern, I was able to separate responsibility within my code to allow it to be extracted in the future.

A specific technique I use here is to read each line in my change and spot check if I have a basic understanding of why I had to change it. If I don't, I revert it and see what happens.

Double check all your assumptions and pay attention. Automated tooling and testing (e.g. automated tests and linting, good gitignore files) will help a lot here and reduce the need for hand-holding.

### I've got a bad feeling about this

At this point I'm able to, both with my own work and when reviewing others', instinctively recognize bad patterns and can sometimes suggestion better replacements. However, I struggle to adequately explain _why_, or to fully internalize my logic.

With a healthy team, this is a good place to be in. If your team has trust issues, this is a bad place to be. Without being able to explain change requests, the original author won't see the value. You'll either need to accept what you feel isn't quality code or risk breeding resentment.

I often feel stuck in this stage for a long time---sometimes years. I think this is normal. Systems are complex, but recognizing I'm starting to see patterns allows me to be more intentional and introspective, which lets me grow faster.

### I can explain what I know

Finally, I'm able to explain clearly. I should be able to simplify the concepts in a way that reduces complexity---such as drawing a systems diagram, creating an analogy, or writing a blog post.

In order to communicate concepts, especially to someone who's still learning, some nuance will be lost. At any given point I'm missing some depth of detail simply because there are limits to the amount of complexity I can hold in my head at a single point in time.

It's also important to recognize that complete understanding is unobtainable. There are always differences in opinion and changes over time, and it's worth reconsidering your assumptions if something doesn't feel right.
