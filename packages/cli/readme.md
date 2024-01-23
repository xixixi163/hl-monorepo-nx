# 使用说明
# 介绍
`pnpm init create-lotus-ui` 实际是 `npx create-lotus-ui`, npx 直接安装并运行

1、当执行`create-lotus-ui`时，会执行`package.json`下的bin 对应的路径，因此把main 改成bin

2、处理用户输入参数的插件有很多,比如 CAC,Yargs,Commander.js,command-line-args 等,
command-line-args 使用起来是最简单的,所以这里使用 command-line-args 进行用户参数解析，也就是识别命令。

`pnpm add command-line-args`

3、`command-line-usage` 插件让它为我们提供帮助命令

`pnpm add command-line-usage`

4、交互式命令
比如让用户做选项
`pnpm add prompts`

5、拉取远程仓库模版
download-git-repo 工具拉去远程仓库；loading插件-ora；log 颜色插件-chalk
`pnpm add download-git-repo ora chalk`

问题：使用`download-git-repo`拉去远程代码，报错：`Error: 'git checkout' failed with status 1`
- 原因：没有找到master分支，使用的是main
- 解决：地址上加`#main`

6、发布脚手架
使用 release-it 自动发布工具
- 配置
本目录下配置参考：https://github.com/release-it/release-it/blob/main/docs/recipes/monorepo.md

monorepo根目录配置参考：https://github.com/release-it/release-it/blob/main/docs/recipes/monorepo.md

- 问题：改了版本号，但是报错了如下
```
ERROR npm ERR! code EUNSUPPORTEDPROTOCOL
npm ERR! Unsupported URL Type "workspace:": workspace:^

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/yiqian/.npm/_logs/2024-01-23T08_23_26_944Z-debug-0.log

 ELIFECYCLE  Command failed with exit code 1.
```

解决：因为使用了pnpm，workspace配置文件在`pnpm-workspace.yaml`,`package.json`中的workspace冲突了，删掉即可

7、使用发布后的脚手架
`pnpm create lotus-ui` 或 `npx create-lotus-ui` 或 `npm init lotus-ui`