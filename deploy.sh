#!/usr/bin/env sh

set -e

yarn docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@gitee.com:THRAEX/gradle-docs-cn.git master:gh-pages
git push -f git@github.com:THRAEX-70/gradle-docs-cn.git master:gh-pages
git push -f git@git.dev.tencent.com:THRAEX/gradle-docs-cn.git master:coding-pages

cd -
