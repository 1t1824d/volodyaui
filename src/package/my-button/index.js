import MyButton from './src/index'

MyButton.install = function(Vue) {
    Vue.component(MyButton.name, MyButton);
}

export default MyButton
