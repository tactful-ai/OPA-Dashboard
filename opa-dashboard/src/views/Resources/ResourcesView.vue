<template>
    <transition name="fade">
        <!-- exit animation works, enter animation does not -->
        <!-- send selected role name and permission as empty -->
        <ResourceModal 
        v-if="showModal" 
        @close="toggleModal" 
        @update="fetchResources" 
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
                    <tr @click= "selectedResource = String(key)">
                        <td>{{ key }}</td>
                        <td>
                            <span class="pill" v-for="scope in values" :key='scope'>
                                {{scope}} 
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


interface Resource {
  [key: string]: string[];
}

const url: string = process.env.VUE_APP_BASE_URL + 'resources'
// need to include this header to work properly with ngrok
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

/**
 * A component to display all the resources and the accompanying scopes in the system
 * @displayName Resources View
 */
export default defineComponent({
    name: 'ResourcesView',

    components:{
        ResourceModal
    },

    data(){
        return{
            /**
             * The resources to be displayed.
             * A resource object consists of key value pairs where the key is the resource name and the value is an array of scopes
             * @model
             */
            resources: {} as Resource,
            /**
             * A boolean to toggle the modal
             * @default false
             * @model
             */
            showModal: false,
            /**
             * The resource that is selected to be edited when a table row is clicked.
             * @default null
             * @model
             */
            selectedResource: null as string | null,
            /**
             * The search term entered by the user to filter the resources based on the resource name
             * @default ''
             * @model
             */
            searchTerm: ''
        }
    },

    computed: {
        /**
         * A computed property to filter the resources based on the search term entered by the user
         */
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
        /**
         * Toggles the showModal property to display the modal, triggered when the add button is clicked,
         * when the user clicks on a table row to edit or delete a role, 
         * or when the user clicks on the close button in the modal
         * @public
         */
        toggleModal(){
            this.showModal = !this.showModal
        },

        /**
         * Fetches the resources from the backend and stores them in the resources property.
         * Triggered when the component is mounted, or when a resource is added or edited
         * @public
         */
        async fetchResources(){
            console.log('displaying resources...')
            try{
                const response = await axios.get(url, config)
                this.resources = response.data.resources
                console.log(response.data.resources)
                this.$notify({
                    title: 'Success',
                    text: 'Resources fetched successfully',
                    type: 'success'
                })
            } catch (error: any){
                console.log(error)
                this.$notify({
                    title: 'Error',
                    text: 'Could not fetch resources',
                    type: 'error'
                })
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
    border: 1px solid #4361EE;
    background-color: white;
    color: #4361EE;
    font-weight: bold;
    cursor: pointer;
    /*  add a transition to make the border black */
    transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
}

.add-resource:hover{
    background-color: #4361EE;
    color: white;
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