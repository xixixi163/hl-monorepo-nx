# 安装
```nvm use 16```
```npm i -g pnpm```
```npm i -g lerna```
# 初始化
```lerna init```
- 删除 `npm` 产生的依赖包
- Set "npmClient": "pnpm" in lerna.json
- 手动创建`pnpm-workspace.yaml`,包文件,或者拉去远程 private 仓库
- (optional) Run pnpm import to generate a pnpm-lock.yaml file from an existing lockfile. See https://pnpm.io/cli/import for supported lockfile sources.
- *已废弃*会自动识别工作区:`lerna.json` 更改`useWorkspaces`: enforce useWorkspaces: true in lerna.json (and ignore packages: in package.json)--官网
- `pnpm i`
- block usage of bootstrap, link, and add commands. Instead, you should use pnpm commands directly to manage dependencies (https://pnpm.io/cli/install).
- respect the workspace protocol for package dependencies.
    - During lerna version, dependencies will be updated as normal, but will preserve the workspace: prefix if it exists.
    - If a workspace alias is used, then lerna version will not bump the version of the dependency, since aliases don't specify a version number to bump.


# 为什么使用 pnpm + lerna + nx
链接：https://juejin.cn/post/7199508018374033445

在 monorepo 场景下，npm/yarn 等包管理器等都有自己的 workspace 规范，对于多包的依赖，可以扁平化提升到最外层的 node_modules 目录下，解决了依赖重复安装的问题，但是又带来了其他的问题：
- 幻影依赖：由于依赖扁平化到最外层之后，包 A 可以直接 import 包 B 的依赖。
- 分身依赖：指多包依赖了某个包的多个版本，只有一个版本可以提升到最外层 node_modules 下，其他版本还是会嵌套安装，导致重复安装，如下图中 B 包就被安装了多次。
- 多项目重复安装：比如某个依赖在 10 个项目中使用，就会有 10 份代码被安装到磁盘中。

pnpm解决：
- 多项目重复安装问题：pnpm 会全局缓存已经安装过的包，然后 硬链接 到项目中的 node_modules 目录下，避免了重复安装的问题，且大大提升了安装速度。
- 幻影依赖 和 分身依赖问题：pnpm 安装的依赖并非是扁平化结构，而是通过 软链接 的形式链接到 node_modules 目录下的 .pnpm 中，这样就同时避免了幻影依赖和分身依赖的问题。

# 包管理 lerna + nx
- `npx lerna add-caching`
- 其他用法和往常使用`lerna`一样

# 小记
- 更改了工作区 `workspaces`，需要重新 `pnpm i`；同一个包下面才可以成功使用 `pnpm add [packages-name]`；
但是不同包下直接使用`pnpm add` 会失败,如`componnets`下的组件库安装到`packages`下的项目里,需要使用命令：`pnpm install @lotus-leaf/mini-app -r --filter b`
- 安装workspace的包，直接使用`pnpm add b`，会去远端下载，因为`pnpm add`默认会使用npm注册表的源安装，如果要安装workspace的包，使用`pnpm add b --workspace`或在pacakage.json中指定包为'workspace: ^'。参考链接：https://pnpm.io/zh/cli/add；在文件.npmrc中配置`link-workspace-packages=true`没有用

# 使用说明
`pnpm install`

