#!/usr/bin/env bash

echo Building started ⚠️
npm run build-dev
npm run build && echo Built ✅ || echo Error 🔴

