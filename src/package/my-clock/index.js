import MyClock from './src/index'

MyClock.install = function(Vue) {
    Vue.component(MyClock.name, MyClock);
}

export default MyClock
