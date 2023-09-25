<template>

  <div class="spinner-container" v-if='isLoading'>
        <looping-rhombuses-spinner
        :animation-duration="2000"
        :size="60"
        color="#0B3954"
        />
  </div>

  <div class="editor-view">
    <tree
    v-if="Object.keys(nodes).length > 0"
    class="directory"
    :nodes="nodes"
    :config="config"
    @nodeFocus="openCode"
    style="display: flex; flex-direction: column; align-items: flex-start; text-align: left;"
    >
    <template #before-input="props">
      <span class="before"> 
        <img :src="findIcon(props.node)" alt="">
      </span>
    </template>
    </tree>
    <div class="editor-wrapper">
      <div class="tabs">
        <div
          class="tab" 
          v-for="tab in openTabs"
          :key="tab"
          :class="{ active: tab === activeFileId }"
          @click.exact="activeFileId = tab"
        >
          <span>{{ nodes[tab].text }}</span>
          <img src="./../../assets/close.svg" alt="" @click.exact="closeTab(tab)">
        </div>
      </div>
      <!-- <button @click="log(nodes)">Log Nodes</button>
      <button @click="log(config.roots)">Log Roots</button> -->
      <codemirror
      v-if="openTabs.length > 0"
      class="editor-to-be"
      v-model="nodes[String(activeFileId)].code"
      placeholder="Code goes here..."
      :style="{ height: '90%', minWidth: 'fit-content', maxWidth: '100%', textAlign: 'left', fontSize: '1.2rem', padding: '0.75em',  }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @update:modelValue="pushToEditedFiles"
      />
      <div v-else class="editor-to-be">
        <h1 style="text-align: center;">Select a file to edit</h1>
      </div>

      <div class="bottom-btns">
        <button class="bottom-btn" @click="saveFiles">Save Files</button>
        <router-link class="bottom-btn" to="/roles">Back to Dashboard</router-link>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import treeview from "vue3-treeview";
// const treeview = require("vue3-treeview");
import "vue3-treeview/dist/style.css";
import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";

import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import { LoopingRhombusesSpinner } from 'epic-spinners'

const get_directory_url = process.env.VUE_APP_BASE_URL + 'readdir'
const save_files_url = process.env.VUE_APP_BASE_URL + 'file'
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

interface DirectoryItem {
  file: boolean;
  path: string;
  text: string;
  ID: string;
  code: string | null;
  children: string[];
  root: boolean;
}

type DirectoryStructure = DirectoryItem[];

interface EditedFile {
  ID: string;
  code: string;
}

/**
 * A component that allows the user to edit the files in the project repository through a code editor and
 * lists the files in the project repository.
 * @displayName Editor View
 */
export default defineComponent({
  name: "EditorView",
  components: {
    tree: treeview,
    CodeEditor,
    Codemirror,
    LoopingRhombusesSpinner
  },

  data() {
    return {
      /**
       * A boolean that indicates whether the component is loading data.
       * @model
       */
      isLoading: true,
      /**
       * The directory structure of the project repository.
       * @model
       */
      directoryStructure: [] as DirectoryStructure,
      /**
       * The files that have been edited by the user. Saved for when the request is sent to the backend.
       * Files are added to the array based on the @update event of the codemirror component.
       * @model
       */
      editedFiles: [] as EditedFile[],
      /**
       * A configuration object used by treeview component.
       * @model
       */
      config: {
        roots: [] as string[],
      },
      /**
       * The extensions used by the codemirror component. Includes the theme and language.
       * @model
       */
      extensions: [oneDark, javascript()],
      /**
       * The id of the active file. Used to determine which file to display in the codemirror component.
       * @model
       */
      activeFileId: null as string | null,
      /**
       * The ids of the files that are open in the codemirror component. Used to display the tabs.
       * @model
       */
      openTabs: [] as string[],
      /**
       * An object used by treeview component to display and tree-like structure.
       * @model
       */
      nodes : {} as any
    }
  },

  methods: {
    /**
     * logs a component's props/events. Used for debugging imported components.
     * @param node 
     */
    log(node: any){
      console.log(node)
    },
    /**
     * Displays the appropriate icon for the node object based on its properties.
     * @param node the node object the tree component
     * @public
     */
    findIcon(node: any){
      if (node.file){
        return require("./../../assets/code.svg")
      }
       else if (node.state.opened){
        return require("./../../assets/folder_open.svg")
      } else {
        return require("./../../assets/folder_closed.svg")
      }
    },
    /**
     * Checks if the node object clicked on by the user is a file or a folder.
     * If it is a file, it first checks if the file already axists as an open tab.
     * If the node is a folder, it toggles the open state of the folder to display its contents.
     * @param node the node object the tree component
     * @public
     */
    openCode(node: any){
      if (node.code){
        let openFileId = this.openTabs.find(id => id === node.id);
        if (openFileId) {
          // If the file is already open, just set it as the active file
          this.activeFileId = openFileId;
        } else {
          // If the file is not open, add it to the open files and set it as the active file
          let newTab = node.id;
          this.openTabs.push(newTab);
          this.activeFileId = newTab;
        }
      } 
      else {
        // If the node is a folder, toggle the open state
        this.nodes[node.id].state.opened = !this.nodes[node.id].state.opened;     
       }
    },
    /**
     * Closes the tab of the file with the given id.
     * Has a problem of not setting another tab to be the active tab.
     * @param tab the id of the tab to be closed
     * @public
     */
    closeTab(tab: string) {
      this.openTabs = this.openTabs.filter(id => id !== tab);
      if (this.openTabs.length > 0){
        this.activeFileId = this.openTabs[0];
      } else {
        this.activeFileId = null;
      }
    },
    /**
     * Fetches the directory structure of the project repository from the backend.
     * Uses transformDirectoryStructure to transform the directory structure retrieved from the backend
     * into a format that can be used by the treeview component.
     * @public
     */
    async fetchDirectoryData() {
      this.isLoading = true;
      try {
        const response = await axios.get(get_directory_url, config);
        this.directoryStructure = response.data;
        this.transformDirectoryStructure();
        console.log(response.data)
        this.$notify({
          title: 'Success',
          text: 'Directory structure retrieved successfully',
          type: 'success'
        })
      } catch (error: any) {
        console.error(error);
        let message = ''
        if (error.response){
          message = error.response.data.message
        } else {
          message = error.message
        }
        this.$notify({
          title: 'Error',
          text: message,
          type: 'error'
        })
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Transforms the directory structure retrieved from the backend into a format that can be used by the treeview component.
     * Would have been more efficient to use a computed property to transform the directory structure, 
     * but the treeview component does not seem to work with computed properties.
     * @public
     */
    transformDirectoryStructure(){
      const map: any = {};
      // Convert array to map for easy lookup
      this.directoryStructure.forEach(item => {
        // map[item.ID] = { ...item, state:{opened: true} };
        map[item.ID] = { 
          text: item.text,
          code: item.code,
          children: item.children,
          file: item.file,
         };
      });
      this.config.roots = this.directoryStructure
        .filter(item => item.root)
        .map(item => item.ID);
      this.nodes = map;
    },
    /**
     * Pushes the id and code of the active file to the editedFiles array.
     * If the file is already in the array, it replaces the code, since the codeminor component emits the @update event
     * whenever the code is changed.
     * @public
     */
    pushToEditedFiles(){
      const index = this.editedFiles.findIndex(file => file.ID === this.activeFileId);
      // if the index is not -1, replace the code
      if (index !== -1){
        this.editedFiles[index].code = this.nodes[String(this.activeFileId)].code;
      } else {
        this.editedFiles.push({
          ID: this.activeFileId as string,
          code: this.nodes[String(this.activeFileId)].code
        })
      }
      console.log(this.editedFiles)
    },
    /**
     * Saves the files that have been edited by the user to the backend. Triggered by the save button.
     * @public
     */
    async saveFiles(){
      this.isLoading = true;
      try {
        const data = {
          updatedFiles: this.editedFiles
        }
        const response = await axios.put(save_files_url, data, config);
        console.log(response.data)
        this.$notify({
          title: 'Success',
          text: 'Files saved successfully',
          type: 'success'
        })
      } catch (error: any) {
        console.error(error);
        let message = ''
        if (error.response){
          message = error.response.data.message
        } else {
          message = error.message
        }
        this.$notify({
          title: 'Error',
          text: message,
          type: 'error'
        })
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchDirectoryData();
  },  
});
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.editor-view {
  display: flex;
  height: 100vh;
  width: 100%; 
  overflow: auto;
}

.directory {
  padding: 1em;
  width: 15%;
  height: 100%;
  background: #f7f7f7;
  overflow: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.directory::-webkit-scrollbar {
    display: none;
}

.editor-wrapper{
  width: 90%;
  height: 100%;
}

.editor-to-be {
  height: 90%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs {
  display: flex;
  height: 2em;
  width: 100%;
  background: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  height: 100%;
  padding: 0 0.5em;
  border: 1px solid black;
  cursor: pointer;
}

.tab img {
  border : 1px solid transparent;
  height: 1em;
}

.tab img:hover{
  border: 1px solid #e0e0e0;
  border-radius: 0.2em;
  filter: invert(0.25);
}

.tab.active {
  background: #e0e0e0;
  border-top: 3px solid lightseagreen;
}

.bottom-btns {
  display: flex;
  justify-content: space-between;
  padding: 0.5em 1em;
}

.bottom-btn {
  padding: 0.5em 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.2em;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: lightseagreen;
}

.bottom-btn:hover {
  border: 1px solid lightseagreen;
  background: #e0e0e0;
}

.bottom-btn:first-child:hover {
  background: #0B3954;
}

.bottom-btn:nth-child(2):hover {
  background: white;
  color: lightseagreen;
}

</style>