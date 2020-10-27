---
title: "Photos"
date: 2020-10-27T20:34:14+01:00
slug: photos
tags: ["projects", "web", "tech"]
chaser: false
---

I'm trying out a new approach to sharing my photos here on my website at [/photos](/photos).

I've been considering divesting from social media for some time, for mental health, ethics, and to own my content. I feel like Instagram reached a tipping point this summer, where it shifted from a positive place to share what my friends are up to, to a platform that amplifies outrages and meme sharing.

My approach is heavily inspired by [Tom MacWright's /photos](https://macwright.com/2019/02/28/photos.html), as are a few other aspects of this site's design. I want it to be fast and simple, with low management overhead.

---

To post a photo, I run it through [a script](https://github.com/apexskier/camlittle.com/blob/b4310c00e55425eadcf6b4bebb983ff28b589902/photo.js) to process, resize, and upload to [DigitalOcean spaces](https://www.digitalocean.com/products/spaces/) for long term storage. The script also creates a new post that I add some details to (location, title, description…), and all that's left is to publish.

I spent quite a bit of time refining the user experience and trying out some fun new web technologies for the first time.

I generate [custom CSS](https://github.com/apexskier/camlittle.com/blob/b4310c00e55425eadcf6b4bebb983ff28b589902/layouts/photos/li.html#L6-L26) to keep the images centered and constrained within the window. I use [CSS scroll snapping](https://css-tricks.com/practical-css-scroll-snapping/) to snap to and center on them as you scroll through. The page uses no JavaScript.

The fanciest feature is a custom placeholder displayed as the images load. My script extracts average colors for the top, left, right, and bottom of the image, then injects them into an inlined SVG background image for the `<picture>` element. The SVG is made of four radial shapes of the extracted average colors, with a blur applied on top of it to form a geometric approximation of a downsampled version of the image.

<p>
	<svg viewBox="0 0 64 64" height="200" width="300" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<filter id="blurMe">
			<feGaussianBlur in="SourceGraphic" stdDeviation="5" />
		</filter>
		<g filter="url(#blurMe)">
			<polygon id="Path" fill="#8987a6" points="0 0 32 32 64 0"></polygon>
			<polygon id="Path" fill="#506c97" points="0 64 32 32 0 0"></polygon>
			<polygon id="Path" fill="#42587f" points="64 0 32 32 64 64"></polygon>
			<polygon id="Path" fill="#647fa2" points="64 64 32 32 0 64"></polygon>
		</g>
	</svg>
</p>

Overall, it was a fun project to show off some of my favorite photos. [I hope you like them too.](/photos)
