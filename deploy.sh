#!/bin/bash

jekyll build
rsync -avzhC ./_site/ /var/www/camlittle.com/
