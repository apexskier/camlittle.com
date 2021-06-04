---
title: Site tech
url: /site-tech/
menu: 
  main:
    parent: about
tags: ["tech"]
---

## Features

These are some of the little details in the site that I'm proud of. You can always see how they work in [the source code](https://github.com/apexskier/camlittle.com).

- [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) support
- custom [responsive image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) support
- JavaScript is not required <!-- - easter egg -->
- custom [tag cloud](/tags/)
- full-text RSS
- zero client-side trackers (I track some stats server-side)
- high [Lighthouse](https://developers.google.com/web/tools/lighthouse) and [WebPagetest](https://www.webpagetest.org) scores

## History

This site's tech stack throughout the years.

* June 2021

  The site now auto deploys through GitHub actions.

  I've built my own image processing pipeline using some hacky node scripts that
  uploads to a DigitalOcean Spaces CDN. I was running into issues where without
  caches the site would take 10+ minutes to build, primarily due to the number
  of image variations I support in my responsive image templates, which
  prevented automating deployments. It's not perfect---there's a fair amount of
  duplication of knowledge between the hugo and npm sides of things and file
  fingerprinting could be a lot better, but it's a fairly simple, as it should
  be for a personal website.

* March 2020

  [Hugo](https://gohugo.io) static site with a custom theme. I chose Hugo since
  it's the top starred static site generator on
  [StaticGen](https://www.staticgen.com) that doesn't rely on client-side rendering.
  I'm familiar with Go-style templates, which Hugo uses. Since switching, I've
  even [contributed to the project](https://github.com/gohugoio/hugo/commits?author=apexskier).
  It has a good mix of power and simplicity and ships as a standalone
  binary (no ruby installation to deal with). I still use Digital Ocean and
  nginx but now host several other sites and [tools](/apps).
  I'm using [docker](https://www.docker.com),
  [docker-compose](https://docs.docker.com/compose/), and some custom scripts
  to provision and isolate each app.

  For newer apps, I generally use docker from the start. Some have
  images published to [GitHub packages](https://github.com/features/packages);
  some don't. For projects I'm not planning to revisit or have
  archived, I reverse-engineered Dockerfiles and stored them in my
  host-configuration repo.

* October 2016

  Added [https](https://crt.sh/?caid=16418) support through [Let's
  Encrypt](https://letsencrypt.org/).

* June 2014
  
  [Jekyll](https://jekyllrb.com) static site with a custom theme. I chose Jekyll
  because it's pretty universal and produces a static site. Around this time, I
  also switched to [DigitalOcean](https://www.digitalocean.com) for hosting and
  an [nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) web server.
  
* Feb 2012

  I transferred my domain name to [Namecheap](https://namecheap.com). At some
  point, I switched to the [Stacey](https://github.com/kolber/stacey) CMS with a custom
  theme. I chose Stacey because it's very lightweight and PHP was my primary language
  at the time. Hosted on 
  [Dreamhost](https://www.dreamhost.com) with [Apache](https://httpd.apache.org).

* Sep 2010

  Registered [camlittle.com](https://camlittle.com) with GoDaddy and set up a
  homemade PHP website.


