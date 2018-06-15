#!/bin/bash

set -e

jekyll build
rsync -avzhC ./_site/ /var/www/camlittle.com/
