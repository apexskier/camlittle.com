#!/bin/bash

set -e

pids=()

hugo server -D --bind 0.0.0.0 --minify --disableFastRender $@ &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
