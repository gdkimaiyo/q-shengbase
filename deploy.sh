#!/usr/bin/env sh

# abort on errors
set -e

# build
quasar build

# navigate into the build output directory
cd dist/spa

cp index.html 404.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'initiate deployment'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:gdkimaiyo/q-shengbase.git master:gh-pages

cd -
