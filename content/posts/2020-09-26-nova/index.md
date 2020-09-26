---
title: "Nova.app"
date: 2020-09-26T12:42:55+02:00
tags: [tech, typescript, project]
---

Over the last couple months, I've been playing around with the new text editor [Nova](http://nova.app) by [Panic](http://panic.com) and writing extensions for it.

Panic is an independent software development company based in Portland, OR that I've been a fan of for a long time. Back when I first started programming I used their previous web-development focused editor [Coda](https://panic.com/coda/), and I still use many of their products today. The big reason I'm a fan of Panic is that they [do](https://sign.panic.com) [interesting](https://play.date) [things](https://panic.com/blog/firewatch-one-month-later/) with amazingly high quality. I see this as a major difference between much of the industry's focus on growth and speed over quality.

Nova is their new code editor. It's been in beta for a while now and the first version was released a couple weeks ago.

## What I'm excited about

I'm excited about Nova's potential for a few reasons:

It's a native app, which has potential for better stability and performance than editors like Atom and VS Code (my primary GUI editor). Although most of my career has been focused on the web, I still prefer native apps over web technology based ones (one of the reasons I use Apple Photos over Google Photos).

It's a for-profit product with a single owner. Although Microsoft's been doing a pretty great job with VS Code, it's hard to get around the fact that open source and free products have a higher chance of atrophying over time. This can be due to bloat (like I experienced with Atom), contributors switching focus, or just random chance.

It's got some valuable features. [Tasks](https://library.panic.com/nova/run-tasks/) aren't exactly novel, but are well implemented and have good potential to grow. Savable Search Scopes are really powerful and new to me. I'm impressed that remote files, projects, and editing is so stable in a first release.

Finally, Panic's focus on quality and close affinity with the Apple community could align really well with a high-quality, curated Extension Library.

## What I'm worried about

But, there are a few things that worry me:

There's no debugger support, yet. It sounds like this is on the roadmap, but I can't ignore that it's critical for many of my workflows. In the JavaScript landscape I can use Chrome's debugging GUI, but many other languages don't have great options outside of an IDE. Being able to work on the code I'm stepping through directly is immensely valuable.

Nova doesn't support Vim keybindings and the extension API doesn't different editing modes. I don't see myself fully committing to a code editor without Vim emulation---the ubiquity of them while programming makes them second nature to me at this point.

I'm worried about the feasibility of an extension community for a paid product. Most extensions are open-source but the product isn't, so some of what draws me to open-source development is missing. I'm hoping these fears end up unfounded---there's definitely precedent for good extension support with other paid products.

Finally, I'm unsure of the target industry and how well a single product will keep up. Most of what I've seen around Nova revolves around the JavaScript ecosystem, but I think the overall vision is to be general purpose. Panic needs deep understanding of various software development communities and the compatibilities between different communities workflows.

One counter-example to many of my worries is [JetBrains' IDEs](https://www.jetbrains.com/products.html#type=ide). In many ways IntelliJ and friends are similar to Nova: paid product, solid extension library, power-user focused code editor; but there are some significant differences: JetBrains is a much larger company and has broken their products into niche IDEs for specific types of programming (JVM, Golang, Python, etc). They also offer a fully free version.

Most of the people I've talked to have agreed that the ultimate success of Nova will depend on it's extension ecosystem. That's what I've been mostly playing with, so let's jump in.

## Extension development

I'm not going to cover extension development in detail. For that, [read the docs](https://docs.nova.app). I'm also not going to cover differences between extension development for Nova and other editors, since this is my first experience with extension development.

Extensions can provide functionality through two mechanisms: static files and a [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) based runtime. Certain features are available through both mechanisms, certain features are only available through one. For example, language syntax highlighting is defined only through static XML files, but auto-completions can be provided through XML files or through a synchronous JavaScript API.

There are definitely some annoying limitations and missing features of the JavaScript API, but overall it's very nice for a V1 release. Because the runtime is JavaScriptCore, extensions are isolated and have a hard time interfering with each other or the editor's core functionality (_theoretically_, there are still [some major extension-triggered crashes](https://github.com/apexskier/nova-typescript/issues/74)). Having a single runtime is very refreshing---no browser incompatibilities or cross-platform differences to work around.

The static file interface for extensions makes sense---it provides a low barrier to entry to get basic extension functionality working---but is painful for more advanced extensions. One example is [conditionally enabling and disabling commands](https://docs.nova.app/extensions/commands/#when-clauses). For my ESLint extension, I can prevent "Suggest a Fix" commands from applying when the editor isn't in focus, but I can't prevent it when no suggestions are available.

My favorite part of Nova's approach to extensions is support for Language Server Protocol servers. The [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) is a Microsoft-backed open standard for editor/language features like code navigation, refactoring, and auto-completion. It's a really smart way to avoid custom implementations of common code functionality in Nova, while potentially supporting a wide variety of languages. My TypeScript extension runs an LSP for most of its functionality, and the protocol has been great to work with. Nova's support for LSP features is not great (the Go to Definition command doesn't even use the active LSP client) but there's a lot of potential.

## Community

Extensions aside, one of the biggest reasons Nova could succeed is a passionate community. People love Panic---they're the dream example of a software company for many, including myself---and want to see this type of product succeed.

Reach out to me to join the Nova community Discord where we're talking about extension development, bugs, and the future of the product.
