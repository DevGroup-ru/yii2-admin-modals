#!/bin/bash
filewatcher -s -i 1 "app/**/*" "npm run build-dev; npm run build"
