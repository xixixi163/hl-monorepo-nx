#!/usr/bin/env sh

# 忽略错误
# set -e

# 构建
pnpm run docs:build

# 进入待发布的目录
cd docs/.vitepress/dist

git remote add lotus-leaf-docs https://github.com/lotusui/lotus-leaf-docs.git
git add -A
# git status
git commit -m 'deploy'

# 如果部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# https://lotusui.github.io/lotus-leaf-docs/
# 如果是部署到 https://<USERNAME>.github.io/<REPO>
git push -f lotus-leaf-docs main

# cd -