---
title: "{{ replace (replaceRE "^\\d{4}-\\d{2}-\\d{2}-(.*)" "$1" .Name) "-" " " | title }}"
date: {{ replaceRE "(^\\d{4}-\\d{2}-\\d{2})-.*" "$1" .Name }}
tags: []
images:
  - https://content.camlittle.com/photos/{{ .Name }}_1280.jpg

photo: {{ .Name }}
camera: Sony α6300
location: 

COLOR_INFO:
---
