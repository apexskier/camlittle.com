#!/bin/bash

set -e

rm -rf public/
hugo gen chromastyles --style=manni > assets/css/highlight_light.css
hugo gen chromastyles --style=native > assets/css/highlight_dark.css

pids=()

hugo server -D --bind 0.0.0.0 --minify --disableFastRender $@ &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
