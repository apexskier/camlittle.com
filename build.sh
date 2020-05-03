#!/bin/bash

set -e

rm -rf public/
hugo gen chromastyles --style=manni > assets/css/highlight_light.css
hugo gen chromastyles --style=native > assets/css/highlight_dark.css
hugo --minify
