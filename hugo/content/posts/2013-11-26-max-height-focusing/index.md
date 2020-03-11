---
title:  "Max-height and focusing"
date:   2013-11-26 00:00:00 -0700
---

Click on the box below, and tab through the subsequent links in Chrome (or
Safari) and Firefox (or Opera).

<div class="set-focus" tabindex="0">Set Focus</div>

<style>
    .set-focus {
        background: #ccc;
        display: inline-block;
        padding: 5px 10px;
    }
    .sr-only {
        position: absolute;
        border: 0;
    }
    .skip {
        margin: 0 auto;
        background: #000;
        color: red;
        height: auto;
        width: 100px;
        padding: 0px;
        -webkit-transition: max-height 200ms, padding 200ms;
           -moz-transition: max-height 200ms, padding 200ms;
                transition: max-height 200ms, padding 200ms;
    }
    .skip:focus,
    .skip:active {
        padding: 0.5em 1.3em;
        max-height: 40px;
        z-index: 1000;
    }
    .skip1 {
        right: 20px;
        max-height: 1px;
    }
    .skip2 {
        right: 130px;
        overflow: visible;
        max-height: 0px;
    }
    .skip3 {
        right: 240px;
        clip: rect(0 0 0 0);
        max-height: 0px;
    }
    .skip4 {
        right: 350px;
        display: block;
        max-height: 0px;
    }
    .skip5 {
        right: 460px;
        clip: rect(0 0 0 0);
        max-height: 1px;
    }
    .skip3:focus,
    .skip5:focus {
        clip: auto;
    }
    .focus-max-height-demo {
        height: 60px;
        position: relative;
        overflow-x: scroll;
    }
</style>

<div class="focus-max-height-demo">
    <a href="#" class="skip1 skip sr-only">skip1</a>
    <a href="#" class="skip2 skip sr-only">skip2</a>
    <a href="#" class="skip3 skip sr-only">skip3</a>
    <a href="#" class="skip4 skip sr-only">skip4</a>
    <a href="#" class="skip5 skip sr-only">skip5</a>
</div>

In webkit browsers, you're able to focus links unless they have the css `max-height: 0`. In
Firefox and Opera you can access all links.

I stumbled across this quirk when animating a [skip to content
link](http://webaim.org/techniques/skipnav/) on the new WWU Housing site. It
seems that webkit browsers disable keyboard focus to elements that have a max-height of
0.

This could have significant implications for accessibility if a visually
impaired user was using a site not tested in Webkit.

I tested a bunch of variations of styles, but nothing overrides the max-height.
skip1 is pretty basic, skip2 changes overflow, skip3 messes with cilp,
and skip4 messes with display.

I'd advise using the styles set for skip5 if you need to accomplish something
similar.

The relevant style and html is below.

```html
<style>
    .sr-only {
        position: absolute;
        border: 0;
    }
    .skip {
        margin: 0 auto;
        background: #000;
        color: red;
        height: auto;
        width: 100px;
        padding: 0px;
        -webkit-transition: max-height 200ms, padding 200ms;
            -moz-transition: max-height 200ms, padding 200ms;
                transition: max-height 200ms, padding 200ms;
    }
    .skip:focus,
    .skip:active {
        padding: 0.5em 1.3em;
        max-height: 40px;
        z-index: 1000;
    }
    .skip1 {
        right: 20px;
        max-height: 1px;
    }
    .skip2 {
        right: 130px;
        overflow: visible;
        max-height: 0px;
    }
    .skip3 {
        right: 240px;
        clip: rect(0 0 0 0);
        max-height: 0px;
    }
    .skip4 {
        right: 350px;
        display: block;
        max-height: 0px;
    }
    .skip5 {
        right: 460px;
        clip: rect(0 0 0 0);
        max-height: 1px;
    }
    .skip3:focus,
    .skip5:focus {
        clip: auto;
    }
</style>

<a href="#" class="skip1 skip sr-only">skip1</a>
<a href="#" class="skip2 skip sr-only">skip2</a>
<a href="#" class="skip3 skip sr-only">skip3</a>
<a href="#" class="skip4 skip sr-only">skip4</a>
<a href="#" class="skip5 skip sr-only">skip5</a>
```
