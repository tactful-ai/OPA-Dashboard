<template>
  <div class="wrapper">
    <Sidebar v-if="showSidebar"/>
    <router-view/>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar.vue';
  export default {
    name: 'App',

    components: {
      Sidebar,
    },

    data(){
      return{
        showSidebar: true,
      }
    },

    watch: {
      '$route'(to, from) {
        this.showSidebar = to.name !== 'editor';
      }
    }
  };
</script>

<style>
*{
  margin: 0;
  padding: 0;
  /* font-size: 62.5%; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.wrapper {
  display: flex;
  height: 100vh;
}
</style>
