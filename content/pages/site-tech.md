---
title: Site tech
url: /site-tech/
menu: 
  main:
    parent: about
tags: ["tech"]
---

## Features

Theres are some of the little details I've added to this site that I'm proud of. You can always see how they work in [the source code](https://github.com/apexskier/camlittle.com).

- [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) support
- custom [responsive image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) support
- 100% [Lighthouse](https://developers.google.com/web/tools/lighthouse) score on most pages
- JavaScript is not required <!-- - easter egg -->
- custom [tag cloud](/tags/)
- full text RSS
- zero client-side trackers (I track some stats server-side)

## History

This site's tech stack throughout the years.

* March 2020

  [Hugo](https://gohugo.io) static site with a custom theme. I chose Hugo since
  it's the top starred static site generator on
  [StaticGen](https://www.staticgen.com) that doesn't rely on client-side rendering.
  I'm familiar with Go style templates, which Hugo uses. Since switching, I've
  even [contributed to the project](https://github.com/gohugoio/hugo/commits?author=apexskier).
  It has a good mix of power and simplicity and ships as a standalone
  binary (no ruby installation to deal with). I still use Digital Ocean and
  nginx, but now host several other sites and [tools](/apps).
  I'm using [docker](https://www.docker.com),
  [docker-compose](https://docs.docker.com/compose/), and some custom scripts
  to provision and isolate each app.

  For newer apps, I generally use docker from the start. Some have
  images published to [GitHub packages](https://github.com/features/packages),
  some don't. For older projects I'm not really planning to revisit or have
  archived, I reverse-engineered Dockerfiles and stored them in my
  host-configuration repo.

* October 2016

  Added [https](https://crt.sh/?caid=16418) support through [Let's
  Encrypt](https://letsencrypt.org/).

* June 2014
  
  [Jekyll](https://jekyllrb.com) static site with a custom theme. I chose Jekyll
  because it's pretty universal and produces a static site. Around this time I
  also switched to [DigitalOcean](https://www.digitalocean.com) for hosting and
  an [nginx](https://www.nginx.com) web server.
  
* Feb 2012

  Transferred my domain name to [Namecheap](https://namecheap.com). At some
  point, I switched to the [Stacey](https://github.com/kolber/stacey) CMS with a custom
  theme. I chose Stacey because it's very lightweight and PHP was the language I
  was primarily using at the time. Hosted on 
  [Dreamhost](https://www.dreamhost.com) with [Apache](https://httpd.apache.org).

* Sep 2010

  Registered [camlittle.com](https://camlittle.com) with GoDaddy and set up a
  homemade PHP website.


