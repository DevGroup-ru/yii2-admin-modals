#!/bin/bash
filewatcher -s -i 1 "AdminModals.js" "echo Building started ⚠️; npm run build-dev && npm run build && echo Built ✅ || echo Error 🔴"