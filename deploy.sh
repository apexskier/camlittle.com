#!/bin/bash

set -e

./build.sh
rsync -avz --checksum --delete ./public/ matheny:/var/www/camlittle.com/
