<template>
  <div>
    <div @click="go('dev_zds')">dev_zds</div>
  </div>
</template>

<script>
export default {
  mounted() {

  },
  methods: {
    go(url) {
      this.$router.push('/blogger/' + url)
    }
  }
}
</script>

<style>

</style>