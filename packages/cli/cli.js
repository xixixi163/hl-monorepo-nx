import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { readFile } from "fs/promises";

/**
 * -v 处理版本命令
 * commandLineArgs 识别命令 --- 找到package.json的路径 --- 读取version
 * 执行 node cli.js -v，会得到版本
 */
const pkg = JSON.parse(
    await readFile(new URL('./package.json', import.meta.url))
);

// 配置命令参数
const optionDefinitions = [
    {name: 'version', alias: 'v', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean}
];
const options = commandLineArgs(optionDefinitions);
if (options.version) {
    console.log(`v${pkg.version}`)
}

// 帮助命令
const helpSections = [
    {
        header: 'create-lotus',
        content: '一个快速生成组件库搭建环境的脚手架',
    },
    {
        header: 'Options',
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
                typeLabel: '{underline boolean}',
                description: '帮助',
            }
        ]
    }
]

if (options.help) {
    console.log(commandLineUsage(helpSections));
}

// 交互ui
import prompts from 'prompts'
const promptsOptions = [
    {
        type: 'text',
        name: 'user',
        message: '用户'
    },
    {
        type: 'password',
        name: 'password',
        message: '密码'
    },
    {
        type: 'select', // 单选
        name: 'gender',
        message: '性别',
        choices: [
            {title: '男', value: 0},
            {title: '女', value: 1},
        ]
    },
    {
        type: "multiselect", // 多选
        name: 'study',
        message: '选择学习框架',
        choices: [
            {title: 'Vue', value: 0},
            {title: 'React', value: 1}
        ]
    }
]

const getUserInfo = async () => {
    const res = await prompts(promptsOptions);
    console.log(res)
}

getUserInfo()