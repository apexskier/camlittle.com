#!/bin/bash

set -e

pids=()

hugo server -D --minify $@ &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
