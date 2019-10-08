#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

yarn docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f git@gitee.com:THRAEX/gradle-docs-cn.git master:gh-pages
git push -f git@git.dev.tencent.com:THRAEX/gradle-docs-cn.git master:coding-pages

cd -
