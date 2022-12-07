import MyButton from './src/index'
// import '@/assets/iconfont/iconfont.css'

MyButton.install = function(Vue) {
    Vue.component(MyButton.name, MyButton);
}

export default MyButton
