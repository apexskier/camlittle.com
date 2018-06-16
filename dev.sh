#!/bin/bash

set -e

pids=()

$(npm bin)/postcss main.css --verbose --watch --output jekyll/assets/css/main.css &
pids+=("$!")
jekyll serve &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
