#!/bin/bash

set -e

$(npm bin)/postcss main.css --output jekyll/assets/css/main.css
jekyll build
