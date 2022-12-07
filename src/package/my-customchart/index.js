import MyCustomchart from './src/index'

MyCustomchart.install = function(Vue) {
    Vue.component(MyCustomchart.name, MyCustomchart);
}

export default MyCustomchart
