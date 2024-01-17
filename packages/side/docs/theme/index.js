import DefaultTheme from "vitepress/theme";
import lotus from '@lotus-leaf/mini-app'
export default {
    ...DefaultTheme,
    // enhanceApp 用于增强 VitePress 应用程序的钩子函数
    enhanceApp: async ({app}) => {
        app.use(lotus)
    }
}