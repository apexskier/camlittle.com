#!/bin/bash

set -e

./build.sh
rsync -avzC --delete ./public/ matheny:/var/www/camlittle.com/
