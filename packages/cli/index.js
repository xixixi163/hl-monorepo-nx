#! /usr/bin/env node

import commandLineArgs from "command-line-args";
import commandLineUsage from 'command-line-usage';
import prompts from "prompts";
import { readFile } from 'fs/promises';
import gitClone from "./gitclone.js";

/**
 * 如上，指定 Node.js 程序的脚本头部（shebang）；告诉操作系统在运行这个脚本时使用 node 解释器
 * 
 * 这种指定解释器的方式允许你在不直接调用解释器的情况下执行脚本。
 * 这在编写可移植性更强的脚本时很有用，因为不同的系统可能将解释器安装在不同的路径上。
 * /usr/bin/env 是一个通用的方式，它会在系统的 PATH 中查找指定的程序，这里是 node。
 */

const optionDefinitions = [
    {name: 'version', alias: 'v', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean}
]

const options = commandLineArgs(optionDefinitions);

// 获取版本
const pkg = JSON.parse(
    await readFile(new URL('./package.json', import.meta.url))
)

// 帮助命令
const helpSelections = [
    {
        header: 'create-lotus',
        content: '一个快速生成组件库搭建环境的脚手架'
    },
    {
        header: 'Optoins',
        optionList: [
            {
                name: 'version',
                alias: 'v',
                typeLabel: '{underline boolean}',
                description: '版本号'
            },
            {
                name: 'help',
                alias: 'h',
                typeLabel: '{underline string}',
                description: '帮助'
            }
        ]
    }
]

const promptsOptions = [
    {
        type: 'text',
        name: 'project-name',
        message: '请输入项目名称'
    },
    {
        type: 'select',
        name: 'template',
        message: '请选择一个模版',
        choices: [
            {title: 'lotus-ui', value: 1},
            {title: 'easyest', value: 2}
        ]
    }
]

if (options.version) {
    console.log(`v${pkg.version}`)
}

if (options.help) {
    console.log(commandLineUsage(helpSelections));
}

// 模版 git
const remoteList = {
    1: 'https://github.com/xixixi163/hl-monorepo-nx.git#main',
    2: 'https://github.com/qddidi/easyest.git'
}

const getUserInfo = async () => {
    const res = await prompts(promptsOptions);
    console.log(res['project-name'], res.template)
    if (!res['project-name'] || !res.template) return;
    
    gitClone(`direct:${remoteList[res.template]}`, res['project-name'], {
        clone: true,
    })
}

getUserInfo()
