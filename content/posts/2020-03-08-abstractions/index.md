---
title: "When is magic useful?"
slug: "abstraction"
date: 2020-03-08 16:30:00 -0100
tags: ["tech", "philosophy"]
draft: true
---

I've made the mistake of adding layers of abstraction early several times over
my career as a software developer. It starts out like this: I've got a really
smart idea that will save me a bunch of time in the future. I'll be able to
create a generic layer that I can build other features beneath without needing
to change consumer behavior.

The issue is that I can't see the future. It's close to impossible to
understand the details of the future use cases I'm building for, and more often
than not I'm going to get it not quite right. Once that happens, the work I put
in building my abstraction layer is far less valuable and it often gets in the
way, making my job harder.

Working in a fast-growing company also means that a lot of the time the future
use case I'm building for just never happens. We decide to go another
direction, or pause on that project, or it just doesn't get prioritized. Two
years later, the system has evolved to the point where what I built just
doesn't make sense.

## Truth is relative / Build defensively

Over time, my understanding of systems will always change, due to the complex
and changing environment I work in. Be it because of the tools we use, the
people we work with, or the size of the organization, decisions are never
binary or always correct. Choosing to use a statically typed language might be
more important if the sale of the project is larger, or if a coworker hasn't
developed the muscles to think dyanmically. Building a massively scalable
microservice archetecture might mean you can't deliver an MVP in time to get
the funding needed to start growing your start-up. Implementing a policy to 
never force-upgrade an app version doesn't work once Brexit happens.

What you can do is build defensively. In essense, this means building with the
understanding that it will be wrong in the future. Encapsulation helps a lot with
this, as it enables you to extract or split apart functionality with less pain.
Another great defensive technique is to write less code. **don't** add that nice
layer of magic if it's not immediately saving you time.


My rule of thumb is now this:

> Unless you have three real use cases to build against, don't spend extra time
> adding abstractions to support those use cases.

The word *real* is intentional. Theoreteical use cases aren't useful, since
understandings can change. 

The words *extra time* is also intentional. Abstractions can be useful on their
own, to hide complex logic or simplify a difficult to use API. But, if the main
reason to build an abstraction is for future elegance, it's not worth it.

Building an abstraction layer is the most problematic with only one use case.
It will add more maintenance overhead which makes change harder. The resulting
external interface will often look very similar to the original one. In this
case, refactoring is often not any easier than IDE assisted renaming.

Building with two use cases is also problematic. It will be very tempting to
add binary logic into the implementation, or worse, the external interface.
When a third use case is added, the most obvious method is to upgrade binary
logic into enumeration logic, which reduces the value of the abstraction with
an increased cost of maintenance.

Three use cases, however, covers enough complexity that you're forced to
understand what the real value of the abstraction is. 
