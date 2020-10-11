---
title: "Style Test"
date: 2020-10-10T19:38:55+01:00
toc: true
draft: true
---

This has a footnote[^1]

This has a **big** footnote[^2]

## This is an &lt;h2&gt; tag
### This is an &lt;h3&gt; tag
#### This is an &lt;h4&gt; tag
##### This is an &lt;h5&gt; tag
###### This is an &lt;h6&gt; tag

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

---

_You **can** combine them_

* Item 1
* Item 2
  * Item 2a
  * Item 2b
    * Item 2bi
    * Item 2bii

1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b
      1. Item 3bi
      1. Item 3bii

Item 1
: description of item 1

Item 2a
Item 2b
: description of item 2

Item 3
: description of item 3
: description of item 3
: description of item 3

![GitHub Logo](http://placekitten.com/200/300)  
Format: ![Alt Text](https://placekitten.com/g/200/300)

http://github.com - automatic!  
[GitHub](http://github.com)

As Kanye West said:

> We're living the future so
> the present is our past.

I think you should use an
`<addr>` element here instead.

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

- [x] **formatting** and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

## Code fence

```tsx
import * as m from "module";

console.log(m);
```

```
hello world
```

## Details

<details>

<summary>Details block</summary>

Detailed content goes here.

</details>

<details>

<summary>

Details block with _formatting_.

</summary>

Detailed content goes here.

> More complexity

```
Code fence
```

</details>

[^1]: This is a footnote

[^2]: This is a *big* footnote

    With more content
    
    Avoid these, they're not very well styled.
