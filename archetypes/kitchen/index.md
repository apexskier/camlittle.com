---
title: "{{ replace (replaceRE "^\\d{4}-\\d{2}-\\d{2}-(.*)" "$1" .Name) "-" " " | humanize }}"
date: {{ .Date }}
tags: ["kitchen"]
recipe_link: 
recipe_source: 

resources:
- src: ""
  title: ""
---
