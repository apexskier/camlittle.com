#!/bin/bash

set -e

rsync -avzhC ./out/ /var/www/camlittle.com/
