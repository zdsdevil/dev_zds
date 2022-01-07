<template>
<div id="app">
    <pageLoadScrollBar />
    <transition class="change" name="fade" mode="out-in">
        <router-view />
    </transition>
</div>
</template>

<script>
import pageLoadScrollBar from "@c/pageLoadScrollBar"
export default {
    components: {
        pageLoadScrollBar
    }

}
</script>

<style lang="less">
.fade-leave-active {
  transition: all .6s ease-out;
  opacity: 0;
  transform: translateX(-20px);
}
.fade-enter-active {
  transition: all .5s ease-out;
}
.fade-enter {
  opacity: 0;
  transform: translateX(20px);
}
</style>
