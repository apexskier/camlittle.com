---
title: "TeaHarmony"
slug: "teaharmony"
date: 2013-10-28 00:00:00 -0700
tags: ["tech", "web"]
---

I'm part of the Brewing Club here at WWU, which is funny, because I pretty much
only drink water. My roommate started it the spring before last, though, and
since then it's become quite popular.

One of the things people ask us most is where they can find a
[scoby](http://en.wikipedia.org/wiki/SCOBY) to brew
[kombucha](http://en.wikipedia.org/wiki/Kombucha). During each fermentation a
baby which be given to someone else forms. The original mother is usually
reused. Unfortunately, finding someone with a baby can be difficult, as they
are usually tossed if not given away, and purchasing online is expensive and
not guaranteed to work.

We've talked about setting up a website to exchange SCOBY's and
other brewing cultures for a while, and it's finally ready to launch.

I decided to try out [Node.js](http://nodejs.org) for this site, as I've seen
it used in number of tutorials and projects I've stumbled upon and I'm very
comfortable with javascript. After researching alternative databases to MySQL
(why not try something new?), I decided to go javascript all the way and use
[CouchDB](http://couchdb.apache.org). One language makes a lot of sense for a
quick, single developer project. Not having to switch my brain from one to
another makes development faster and keeps code design consistant.

CouchDB is very interesting for someone who's familiar with the relational
database model. Here what I'm noticing.

- Keys and values are much different. A key corresponds to value, but both can
  be a full objects. This allows matching entities with objects, arrays, or
  standard values.
- You don't write queries like you do in SQL. You explicitly tell the database
  how to return your data. If you're setting up the view at the same time as
  your app, neither restricts what you do; you just have to make sure they're
  on the same page.

Node is great to work with. It's much simpler than something like apache, and
is well documented. NPM is probably the best part, primarily because it
installs locally to the project. If I've messed something up, I can just ``rm
-r node_modules && npm install``.

For TeaHarmony, I'm using the following modules.

- [express](http://expressjs.com/) - Web app framework<br>
  Express makes mapping post and get requests to specific urls super easy. It
  also let me do some nifty things to redirect to and from the login page.
- [Passport](http://passportjs.org/) - Authentication<br>
  Passport has a bunch of built in hooks for authentication through websites
  like Google, Twitter, and Facebook, but I'm just using username/password
  authentication. I wrote [some
  code](https://github.com/apexskier/teaharmony/blob/master/app.js#L124) to
  talk to CouchDB's _user table through nano. It essentially pretends to be a
  form post to get a cookie.
- [Jade](http://jade-lang.com/) - Templating<br>
  Jade was the default when I used express(1) to generate a skeleton app. So
  far I like it, as it's basically minimal html with some programming fun
  thrown in.
- [nano](https://github.com/dscape/nano) - CouchDB ⇄ Node.js<br>
  Nano lets my app talk to CouchDB. This is the glue holding the site together.
  The one thing I found confusing at first, was the concept of using
  ['bulk'](https://github.com/dscape/nano#dbbulkdocs-params-callback) to update
  and delete information.
- [nodemailer](https://github.com/andris9/Nodemailer) - Emails<br>
  Nodemailer lets me send emails through node. Simple enough, but I'd like to
  be able to send from arbitrary email addresses.
- [Underscore](http://underscorejs.org/) - JS Utilities<br>
  Underscore.js is becoming a default for any project I start using javascript.
  When doing any sort of complex data manipulation, the utilities it provides
  are a lifesaver.

To make my life easier, I went with [Bootstrap](http://getbootstrap.com/) for
the frontend.

If you want to check the project out (or checkout the project <small>(git
joke)</small>) ~~visit [http://wwubrew.com/](http://wwubrew.com/)~~. The code's all
on [github](https://github.com/apexskier/teaharmony).
