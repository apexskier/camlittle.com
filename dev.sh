#!/bin/bash

set -e

pids=()

hugo server -D --disableFastRender $@ &
pids+=("$!")

for pid in $pids
do
    wait $pid
done
