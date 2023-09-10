<template>
  <v-app>
    <v-main>
      <div class="wrapper">
          <Sidebar/>
          <router-view/>
      </div>  
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar.vue'

export default defineComponent({
  name: 'App',

  components: {
    Sidebar,
  },

  data () {
    return {
      //
    }
  },
})
</script>

<style>
.wrapper{
  display: flex;
  height: 100vh;
}
</style>