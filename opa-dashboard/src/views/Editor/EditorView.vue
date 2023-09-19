<template>
  <div class="editor-view">
    <tree
    class="directory"
    :nodes="nodes"
    :config="config"
    @nodeFocus="log">
    <template #before-input="props">
      <span class="before"> 
        <!-- <img src="./../../assets/close.svg" alt="">  -->
        <img :src="findIcon(props.node.text)" alt="">
      </span>
    </template>
    </tree>
    <div class="editor-to-be"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import treeview from "vue3-treeview";
// const treeview = require("vue3-treeview");
import "vue3-treeview/dist/style.css";


export default defineComponent({
  name: "EditorView",
  components: {
    tree: treeview,
  },

  data() {
    return {
      config: {
        roots: ["id1", "id2"],
        // editable: true,
        // dragAndDrop: true,
      },
      nodes: {
        id1: {
          text: "text1.jpg",
          children: ["id11", "id12"],
          state:{
            opened: true
          }
        },
        id11: {
          text: "text11",
        },
        id12: {
          text: "text12",
        },
        id2: {
          text: "text2",
        },
      },
    }
  },

  methods: {
    log(node: any){
      console.log(node)
    },

    findIcon(text: string){
      // console.log(text)
      if(text.endsWith(".jpg")){
        return require("./../../assets/close.svg")
      }
    }
  },

  mounted() {
    // this.fetchDirectoryData();
  },

  
});
</script>

<style>
.editor-view {
  display: flex;
  height: 100vh;
}

.directory {
  padding: 1em;
  width: 15vw;
  height: 100vh;
  background: #f7f7f7;
}

.editor-to-be {
  flex: 1;
}


</style>