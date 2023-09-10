<template>
    <transition name="fade">
        <!-- exit animation works, enter animation does not -->
        <!-- send selected role name and permission as empty -->
        <ResourceModal 
        v-if="showModal" 
        @close="toggleModal" 
        @update="fetchResources" 
        @loadingOn="isLoading = true"
        @loadingOff="isLoading = false"
        mode="add"/>
    </transition>
    <div class="resources">
        <div class="page-heading">
            <img src="./../../assets/resources.svg" alt="">
            <span> Resources </span>
        </div>
        <div class="top-container">
            <input type="text" placeholder="Search for a Resource" v-model="searchTerm">
            <button @click.exact="toggleModal" class='add-resource'>Add +</button>
        </div>
        <div class="table-container" v-if="Object.keys(resources).length">
            <table>
                <thead>
                    <tr>
                        <th>Resource</th>
                        <th>Scopes</th>
                    </tr>
                </thead>
                <tbody v-for="(values, key) in filteredResources" :key="key">
                    <ResourceModal 
                    v-if="selectedResource === key" 
                    @close="selectedResource = null" 
                    @update="fetchResources" 
                    :selected_resource_name="key"
                    :selected_resource_scopes="values"
                    mode="edit"/>
                    <tr @click= "selectedResource = key">
                        <td>{{ key }}</td>
                        <td>
                            <span class="pill" v-for="scope in values" :key='scope'>
                                <!-- <span class='pill'>  -->
                                    {{scope}} 
                                    <!-- </span> -->
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>Loading resources...</div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue"
import axios from 'axios'
import ResourceModal from './ResourceModal.vue'

interface ResourceResponse {
  resources: {
    [key: string]: string[];
  };
}

interface Resource {
  [key: string]: string[];
}

const url: string = process.env.VUE_APP_BASE_URL + 'resources'
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

export default defineComponent({
    name: 'ResourcesView',

    components:{
        ResourceModal
    },

    data(){
        return{
            resources: {} as Resource,
            showModal: false,
            selectedResource: null,
            searchTerm: ''
        }
    },

    computed: {
        filteredResources(): Resource {
            if (this.searchTerm === '') {
                return this.resources;
            } else {
                let filtered = {} as Resource;
                for (let key in this.resources) {
                    if (key.toLowerCase().includes(this.searchTerm.toLowerCase())) {
                        filtered[key] = this.resources[key];
                    }
                }
                return filtered;
            }
        }
    },


    methods:{
        toggleModal(){
            this.showModal = !this.showModal
        },

        async fetchResources(){
            console.log('displaying resources...')
            try{
                const response = await axios.get(url, config)
                this.resources = response.data.resources
                console.log(response.data.resources)
                console.log(Object.keys(this.resources).length)
            } catch (error){
                console.log(error)
                this.resources = {
                    "book": ["read","order","review"],
                    "document": ["read","order","review"],
                    "email": ["read","send"]
                }
            }
        }
    },

    mounted(){
        this.fetchResources()
    }
})
</script>

<style scoped>
*{
    box-sizing: border-box;
}

.resources{
    top: 0;
    padding: 3em;
    width: 100vw;
    height: 100vh;
    font-size: 62.5% 
}

.page-heading{
    display: flex;
    align-items: center;
    padding: .4em 0;
    justify-content: flex-start;
    align-content: center;
    margin-bottom: 1em;
}

.page-heading span{
    font-size: 2rem;
}

.page-heading img{
        width: 6em;
        height: 6em;
        margin: 0 3em;
}

.top-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
}

input{
    padding: 1em;
    border-radius: 0.5em;
    border: 1px solid #f2f2f2;
    width: 30%;
}

.add-resource{
    padding: 1em 2em;
    border-radius: 0.5em;
    border: 1px solid #f2f2f2;
    background-color: black;
    color: white;
    font-weight: bold;
    cursor: pointer;
    /*  add a transition to make the border black */
    transition: background-color 0.2s;
}

.add-resource:hover{
    background-color: #CDE77F;
    color: black
}

.table-container{
    overflow-y: scroll;
    height: 75%;
}

table{
    text-align: left;
    overflow: hidden;
    box-shadow: 0 5px 10px #e1e5ee;
    border-radius: 3px;
    border: 1px solid #f2f2f2;
    overflow-y: scroll;
}

thead {
    box-shadow: 0 5px 10px #e1e5ee;
    position: sticky;
    top: 0;
    background: #F2F8FF;
    z-index: 1;
}

th {
    padding: 1rem 2rem;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    font-size: 1rem;
}

td {
    padding: 1rem 2rem;
    font-size: 1rem;
}

tbody tr {
    transition: transform 0.2s;
}

tbody tr:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
    cursor: pointer;
}

tr td:nth-child(2) {
  width: 100%;
}

.pill {
    display: inline-block;
    margin: 0 0.5em;
    padding: 1em 2em;
    /* background: #ff9a56; */
    background: #aaaaaa;
    border-radius: 20px;
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-weight: bold;
    color: black;
    cursor: pointer;
    transition: filter 0.1s linear;
  }

.pill:hover{
    filter: brightness(120%);
    cursor: default;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>