#!/bin/bash

set -e

pids=()

hugo server -D --minify --disableFastRender $@ &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
