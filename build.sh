#!/bin/bash

set -e

hugo gen chromastyles --style=manni > assets/css/highlight_light.css
hugo gen chromastyles --style=native > assets/css/highlight_dark.css
hugo
