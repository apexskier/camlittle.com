---
title: "{{ replace (replaceRE "^\\d{4}-\\d{2}-\\d{2}-(.*)" "$1" .Name) "-" " " | title }}"
date: {{ .Date }}
tags: ["photo"]
draft: true

photo: {{ .Name }}
camera: Sony α6300
location: 
---

