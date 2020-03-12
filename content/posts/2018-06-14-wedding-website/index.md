---
title: "Wedding Website"
slug: "wedding-website"
date: 2018-06-14 00:00:00 -0700
tags: ["tech", "web"]
---

I'm getting married!

Aside from being excited, I'm taking this as an opportunity to DIY some of the
pieces of weddings that could involve code.

The most obvious part is our wedding website. When I'm building a small-scale
personal site, I usually try to choose technologies that will help me enhance
my existing skill set. Without the constraints of a legacy system, competing
priorities, or legacy browser support, I'm able to stay on the bleeding edge.
I also wanted to keep the site "raw" by writing as much pure html and css by
hand and using minimal javascript. A number of factors contribute to this,
including site performance, setup complexity, and the overload of web
development in 2018, but I also just wanted to do it.

In this case, I set up a minimal build system with [Webpack
4](https://webpack.js.org), [cssnext](http://cssnext.io), and
[babel](https://babeljs.io). I haven't had time to sit down and configure
webpack from scratch for some time, so a couple loaders were new to me. I was
pleasently surprised by
[webpack-merge](https://github.com/survivejs/webpack-merge) for splitting
development and production build configuration. I combined
[extract-loader](https://webpack.js.org/loaders/extract-loader/https://webpack.js.org/loaders/extract-loader/)
and [html-loader](https://github.com/webpack-contrib/html-loader) to manage css
and html, but I'm not completely satisfied with this part of webpack.

I'm continuing to use [nginx](http://nginx.org) to host my websites and
recently upgraded to `https` using [Let's Encrypt](http://letsencrypt.org). I
took an additional step with this site and made the upgrade to `http2`. This
wasn't quite the learning experience I expected...

```patch
-  listen 443 ssl;
+  listen 443 ssl http2;
```

I still managed to have some fun setting up my domain names.

While the primary url is
[https://ourlittlewedding.love](https://ourlittlewedding.love), I also
purchased two additional vanity hostnames:
[aishaandcameron.love](https://aishaandcameron.love) and
[cameronandaisha.love](https://cameronandaisha.love). To do it right, I wanted
each domain to work, across both http and https, with or without `www`, with
minimal redirects. To do this, I created a shared ssl certificate for all six
domains.

```sh
  Certificate Name: aishaandcameron.love
    Domains: aishaandcameron.love cameronandaisha.love ourlittlewedding.love www.aishaandcameron.love www.cameronandaisha.love www.ourlittlewedding.love
```

Then it was a fairly simple matter of redirecting http traffic to the primary
domain to ssl

```nginx
server {
    server_name ourlittlewedding.love;

    listen 80;

    return 301 https://ourlittlewedding.love$request_uri;
}
```

and redirecting any traffic to a non primary domain directly to the primary one

```nginx
server {
    server_name cameronandaisha.love www.cameronandaisha.love aishaandcameron.love www.aishaandcameron.love www.ourlittlewedding.love;

    listen 80;

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/aishaandcameron.love/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/aishaandcameron.love/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    return 301 https://ourlittlewedding.love$request_uri;
}
```

There might be a more efficent way to structure the configuration, but this
works well for me.
