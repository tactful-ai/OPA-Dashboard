<template>
  <notifications 
  :close-on-click = true
  :pause-on-hover = true />
  <div class="wrapper">
    <SideBar v-if="showSidebar"/>
    <router-view/>
  </div>
</template>

<script>
  import SideBar from './components/SideBar.vue';
  export default {
    name: 'App',

    components: {
      SideBar,
    },

    data(){
      return{
        showSidebar: true,
      }
    },

    watch: {
      '$route'(to) {
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
