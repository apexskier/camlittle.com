---
title: About
url: /about/
menu: main
---

I’m a software engineer at [Remitly](https://grnh.se/3c4028751) where I’m
working on our international product team. I recently moved to
[Kraków, Poland](https://aackleinkrakow.blogspot.com) with
[my wife](https://cameronandaisha.love) to help start our new European
engineering office. I graduated with a degree in Computer Science from Western
Washington University, where I worked for
[ResTek](https://www.restek.wwu.edu/about/jobs/). I like spending time outside
[running long distances](https://www.strava.com/athletes/14856714) and
[wilderness backpacking](https://www.gaiagps.com/profile/13832/Cameron/).

I have lots of projects, ranging from web, iOS, and macOS applications,
Arduino, and 3D printing.

I can be contacted at: <cameron@camlittle.com>.

## This site

This site's tech stack throughout the years.

* Feb 2012[^1]--June 2014

  [Stacey](http://www.staceyapp.com) content management system with a custom
  theme. I chose Stacey because it's very lightweight and PHP was the language I
  was primarily using at the time. Hosted on 
  [Dreamhost](https://www.dreamhost.com) with [Apache](https://httpd.apache.org).

* June 2014--March 2020

  [Jekyll](https://jekyllrb.com) static site with a custom theme. I chose Jekyll
  because it's pretty universal and produces a static site. Around this time I
  also switched to [DigitalOcean](https://www.digitalocean.com) for hosting and
  an [nginx](https://www.nginx.com) web server.

* March 2020--

  [Hugo](https://gohugo.io) static site with a custom theme written from
  scratch. I chose Hugo since it's the top starred static site generator on
  [StaticGen](https://www.staticgen.com) that doesn't use client-side rendering
  at all. It has a good mix of power and simplicity and ships as a standalone
  binary (no ruby installation to deal with). I still use Digital Ocean and
  nginx, but now have several other sites and [tools](/apps) are hosted as well.
  I'm using [docker](https://www.docker.com) and 
  [docker-compose](https://docs.docker.com/compose/) to provision and isolate
  each app.

  For newer apps, I'm generally using docker from the start to deploy. Some have
  images published to [GitHub packages](https://github.com/features/packages),
  some don't. For older projects that I'm really planning to revisit or have
  archived, I reverse-engineered Dockerfiles and stored them in my
  host-configuration repo.

[^1]: I'm not 100% sure this is when I first set up this site, but I think so based on when I registered it with Namecheap.
