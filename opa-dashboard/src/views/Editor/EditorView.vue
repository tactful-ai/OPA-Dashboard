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
      v-model="nodes[activeFileId].code"
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
      isLoading: true,
      directoryStructure: [] as DirectoryStructure,
      editedFiles: [] as EditedFile[],
      // directoryStructure: [
      // {
      //     "file": true,
      //     "path": "D:\\web\\backend\\OPA\\server\\build\\app.js",
      //     "text": "app.js",
      //     "ID": "\\app.js",
      //     "code": "\"use strict\";\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// Import required modules\r\nconst body_parser_1 = __importDefault(require(\"body-parser\"));\r\nconst express_1 = __importDefault(require(\"express\"));\r\nconst retrieve_1 = __importDefault(require(\"./routes/retrieve\"));\r\nconst edit_1 = __importDefault(require(\"./routes/edit\"));\r\nconst gitManger_1 = __importDefault(require(\"./services/gitManger\"));\r\nconst swagger_1 = require(\"./services/swagger\");\r\nrequire(\"dotenv\").config();\r\n// Create an Express app\r\nconst app = (0, express_1.default)();\r\nconst port = process.env.PORT || 3000;\r\n// Middleware\r\napp.use(body_parser_1.default.json());\r\nconst cors_1 = __importDefault(require(\"cors\"));\r\napp.use((0, cors_1.default)({ origin: \"*\" }));\r\napp.use(retrieve_1.default);\r\napp.use(edit_1.default);\r\n// Error handling middleware\r\napp.use((err, req, res, next) => {\r\n    console.error(err.stack);\r\n    res.status(500).json({ error: \"Internal server error\" });\r\n});\r\n// Setup swagger\r\n(0, swagger_1.setupSwagger)(app);\r\n// Start the server\r\napp.listen(port, () => {\r\n    console.log(`Server is running on port ${port}`);\r\n    gitManger_1.default.init();\r\n});\r\n",
      //     "child": [],
      //     "root": true
      // },
      // {
      //     "file": false,
      //     "path": "D:\\web\\backend\\OPA\\server\\build\\controllers",
      //     "text": "controllers",
      //     "ID": "\\controllers",
      //     "code": null,
      //     "child": [],
      //     "root": true
      // }],
      config: {
        roots: [] as string[],
        // openedIcon: {
        //   type: "img",
        //   height: 16,
        //   width: 16,
        //   src: require("./../../assets/folder_open.svg"),
        // },
        // closedIcon: {
        //   type: "img",
        //   height: 16,
        //   width: 16,
        //   src: require("./../../assets/folder_closed.svg"),
        // },
        // roots: ["id1", "id2"],
        // editable: true,
        // dragAndDrop: true,
      },
      // nodes: {
      //   id1: {
      //     text: "text1.jpg",
      //     children: ["id11", "id12"],
      //     state:{
      //       opened: false
      //     }
      //   },
      //   id11: {
      //     text: "text11",
      //     code: `const a = 1`
      //   },
      //   id12: {
      //     text: "text12",
      //     children: ["id121", "id122"],
      //   },
      //   id2: {
      //     text: "text2",
      //     code: `console.log('Hello world')`
      //   },
      //   id121: {
      //     text: "text121",
      //     code: `console.log('Hello again')`
      //   },
      //   id122: {
      //     text: "text122",
      //     code: `console.log('Hello kak')`
      //   },
      // },
      extensions: [oneDark, javascript()],
      activeFileId: null as string | null,
      openTabs: [] as string[],
      nodes : {} as any
    }
  },

  methods: {
    log(node: any){
      // console.log(node)
      // console.log(node.modelValue)
      console.log(node)
    },

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

    logID(id: any){
      console.log(id.id)
    },

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

    closeTab(tab: string) {
      // Remove the tab from the open tabs
      this.openTabs = this.openTabs.filter(id => id !== tab);
      if (this.openTabs.length > 0){
        this.activeFileId = this.openTabs[0];
      } else {
        this.activeFileId = null;
      }
    },

    async fetchDirectoryData() {
      this.isLoading = true;
      try {
        const response = await axios.get(get_directory_url, config);
        this.directoryStructure = response.data;
        // console.log(this.directoryStructure)
        this.transformDirectoryStructure();
        console.log(response.data)
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },


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

      // rename the child key to children
      // this.directoryStructure.forEach(item => {
      //   if (item.child.length > 0) {
      //     map[item.ID].children = item.child;
      //   }
      // });

      // add the rood nodes ids to config.roots
      this.config.roots = this.directoryStructure
        .filter(item => item.root)
        .map(item => item.ID);

      this.nodes = map;
    },

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

    async saveFiles(){
      this.isLoading = true;
      try {
        const data = {
          updatedFiles: this.editedFiles
        }
        const response = await axios.put(save_files_url, data, config);
        console.log(response.data)
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  },

  mounted() {
    this.fetchDirectoryData();
  },

  // computed: {
  //   nodes(): any {
  //     const map: any = {};

  //     // Convert array to map for easy lookup
  //     this.directoryStructure.forEach(item => {
  //       // map[item.ID] = { ...item, state:{opened: true} };
  //       map[item.ID] = { 
  //         text: item.text,
  //         code: item.code,
  //         children: item.children,
  //         file: item.file,
  //         state: {
  //           opened: true
  //         }
  //        };
  //     });

  //     // rename the child key to children
  //     // this.directoryStructure.forEach(item => {
  //     //   if (item.child.length > 0) {
  //     //     map[item.ID].children = item.child;
  //     //   }
  //     // });

  //     // add the rood nodes ids to config.roots
  //     this.config.roots = this.directoryStructure
  //       .filter(item => item.root)
  //       .map(item => item.ID);
  //     return map;
  //   },
  // },

  
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

/* .bottom-btn:first-child {
  background: lightseagreen;
  color: white;
} */
/* .bottom-btn:nth-child(2) {
  background: lightseagreen;
  color: black;
} */

.bottom-btn:first-child:hover {
  background: #0B3954;
}

.bottom-btn:nth-child(2):hover {
  background: white;
  color: lightseagreen;
}

</style>