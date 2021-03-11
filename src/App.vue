<template>
  <div id="app" class="app">
    <transition ref="transition" :name="transitionName">
      <keep-alive :include="taskStack">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script type="ecmascript-6">
import { ref } from '@vue/composition-api'
// import axios from 'axios'
// import { mapGetters } from 'vuex'
export default {
  name: 'app',
  setup () {
    // 移除加载白屏时的占位dom
    const loading = document.getElementById('loading')
    if (loading) {
      document.body.removeChild(loading)
    }

    // 页面路由栈相关
    // const { root } = context
    const transitionName = ref('')
    const taskStack = ref([])

    // watch(
    //   () => root.$route,
    //   (to, from) => {
    //     const { name, params } = to
    //     const routerType = params.routerType

    //     if (routerType === 'push') {
    //       taskStack.value.push(name)
    //       transitionName.value = 'fold-pre'
    //     } else {
    //       if (!from.name) {
    //         taskStack.value.push(name)
    //         return
    //       }

    //       taskStack.value.pop()
    //       transitionName.value = 'fold-next'
    //     }
    //   }
    // )

    return {
      transitionName,
      taskStack
    }
  },
  computed: {

  },
  watch: {
    '$route' (to, from) {
      const { name, params } = to
      const routerType = params.routerType
      console.log(from, to)
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (routerType === 'push') {
        this.taskStack.push(name)
        this.transitionName = 'fold-pre'
      } else {
        if (!from.name) {
          this.taskStack.push(name)
          return
        }
        this.taskStack.pop()
        if (isAndroid) {
          // 这个是安卓操作系统
          this.transitionName = 'fold-next'
        }
        if (isIOS) {
          // 这个是ios操作系统
          this.transitionName = ''
        }
        // this.transitionName = 'fold-next'
      }
      console.log(this.taskStack, 'taskStack')
    }
  }
}
</script>

<style lang="scss">
.app {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #ebebeb;
}

// 入栈页面进入动画，上页面退出动画
.fold-pre-enter-active {
  animation-name: fold-pre-in;
  animation-duration: 0.4s;
}
.fold-pre-leave-active {
  animation-name: fold-pre-out;
  animation-duration: 0.4s;
}
@keyframes fold-pre-in {
  0% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fold-pre-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

// 上页面进入动画，出栈页面退出动画
.fold-next-enter-active {
  animation-name: fold-next-in;
  animation-duration: 0.4s;
}
.fold-next-leave-active {
  animation-name: fold-next-out;
  animation-duration: 0.4s;
}
@keyframes fold-next-in {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fold-next-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
