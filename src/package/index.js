// 引入封装好的组件
import MyButton from "./my-button";
import MyClock from "./my-clock";
import MyCustomchart from "./my-customchart";

// 将引入的组件模块存储，方便循环注册所有组件
const components = [
    MyButton, MyClock, MyCustomchart
];

const install = (Vue, options) => {
    if (install.installed) return;
    install.installed = true
    console.log(options)
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

// 如果是直接引入的
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    // 使用Vue.use必须具有install方法
    // https://cn.vuejs.org/v2/api/#Vue-use
    install,
    // 同时导出组件列表
    ...components
}
