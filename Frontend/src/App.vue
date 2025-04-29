<template>
  <div class="app">
      <Navbar v-if="!$route.meta.hideNavbar" />
      <router-view />
      <Footer v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
    name: 'App',
    components: {
        Navbar,
        Footer
    },
    computed: {
        hideNavbar() {
            return this.$route.meta.hideNavbar || false;
        },
        hideFooter() {
            return this.$route.meta.hideFooter || false;
        }
    }
}
</script>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

router-view {
    flex: 1;
}
</style>