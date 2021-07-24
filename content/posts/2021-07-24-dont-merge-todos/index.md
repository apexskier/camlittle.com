---
title: Don't merge that TODO
date: 2021-07-24
tags: [tech, philosophy]
---

One of my standard code review comments is, "Why is this a TODO"? I believe you should always avoid TODO comments in your code. They're a familiar pattern, but they defer responsibility and make problems harder to solve.

In most cases, the TODO should be filed in your team's issue tracker immediately and cross-linked with the pull request. Some people have processes that track issues using TODOs, but I don't believe source code works well for issue tracking. Source code represents the current state of your product. Reviewing historical context, though possible with version control, is not the primary interface. Issue tracking systems are built for prioritization, tracking context, linking related issues, and assigning responsibility.

TODOs are usually used to defer technical debt. Moving them to your issue tracker's backlog allows prioritization against feature work by putting them in the same playing field and can be used as a metric to understand the depth of technical debt.

TODOs often describe an expected future change. It's tough to predict the future, so the TODO might not make sense when the next person reads them. I still encourage using comments to describe the problem and the reasons for not addressing it, but not to prescribe action. In the future, you'll have much better context when deciding how to fix the issue, or you might be able to just delete it.

Even though I don't like seeing TODOs in a codebase, I often use them in my feature branches and scan through the diff once I've opened my draft PR to decide if it's ready for review. They're lighter weight than an issue tracker and can act as a checklist for a single task. Generally, though, they're an indicator of poor quality and have more responsible alternatives.
