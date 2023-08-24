<template>
  <div class="wrapper">
    <Sidebar/>
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
