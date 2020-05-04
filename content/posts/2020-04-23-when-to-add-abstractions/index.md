---
title: "When should you add abstraction?"
slug: "when-to-add-abstractions"
date: 2020-04-23T17:44:00+02:00
tags: ["philosophy", "api-design"]
---

I've made the mistake of adding layers of abstraction too early several times
over my career as a software developer. It starts out like this: I've got a
really smart idea that will save me a bunch of time in the future. I'll be able
to create a generic layer that I can build other features beneath without
needing to change consumer behavior.

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

## Truth is relative

Over time, my understanding of systems will always change, due to the complex
and changing environment I work in. Be it because of the tools we use, the
people we work with, or the size of the organization, decisions are never
binary or always correct. Choosing to use a statically typed language might be
more important if the scale of the project is larger, or if a coworker hasn't
developed the muscles to think dynamically. Building a massively scalable
microservice architecture might mean you can't deliver an MVP in time to get
the funding needed to start growing your start-up. Implementing a policy to 
never force-upgrade an app version doesn't work once Brexit happens.

## Build defensively

What you can do is build defensively. In essence, this means building with the
understanding that it will be wrong in the future. Encapsulation helps a lot with
this, as it enables you to extract or split apart functionality with less pain.
Another simple defensive technique is to write less code and save the up-front
and maintenance cost.

## My rule of thumb

> Unless you have three _real_ use cases to build against, don't spend extra time making the solution generic.

The word "real" is intentional because of my comments on predicting the future.

The words "extra time" are also intentional. Generic abstractions can be useful
on their own, to hide complex logic or simplify a difficult to use API, or to
build a layer of defence; but if the main value in abstraction is for future
elegance _it's not worth it_.

Building an abstraction layer is the most problematic with only a single use
case, primarily because it usually adds more maintenance overhead which slows
iteration and maintenance. The "abstract" interface will often look very similar
to the internal one and refactoring is often not any easier than IDE assisted
renaming.

Building with two use cases is also problematic. It will be very tempting to
add [flag-based logic](https://martinfowler.com/bliki/FlagArgument.html) into the
implementation, or worse, the external interface. When a third use case is
added, the most obvious method is to continue using flag-logic, which ends up
coupling the interface to the implementation. The value of the abstraction is
lower but maintenance cost isn't.

Three use cases, however, covers enough complexity that you're forced to
understand what the real value of the abstraction is and create it in a way that
makes it easier to work with.
