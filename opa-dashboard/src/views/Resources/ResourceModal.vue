<template>
  <div class="backdrop" @click.self="closeModal">

    <div class="spinner-container" v-if='isLoading'>
        <fulfilling-bouncing-circle-spinner
        :animation-duration="2000"
        :size="60"
        color="#0B3954"
        />
    </div>

        <div class="modal">
            <h1 v-if="mode === 'add'" class="modal-header">Add a New Resource</h1>
            <h1 v-else-if="mode === 'edit'" class="modal-header">Edit Resource</h1>

            <form @submit.prevent="submitResource">
                <label for="">Resource Name:</label>
                <input type="text" v-model="resource_name" required>

                <label for="">Scopes:</label>
                <input 
                type="text"
                v-model="tempScope"
                @keyup="addScope"
                @keypress.enter.prevent
                placeholder="Enter a scope followed by an Enter"
                > 

                <div class="scopes-container">
                    <span 
                    class="pill" 
                    v-for="scope in scopes" 
                    :key='scope' 
                    @click="removeScope(scope)">
                        {{scope}}
                        <!-- <img src="./../../assets/close.svg" alt="Delete" class="delete-scope"> -->
                    </span>
                </div>

                <div class="btns-container">
                    <button class="close" @click.prevent="closeModal">Cancel</button>
                    <button v-if="mode === 'add'">Add Resource</button>

                    <div class="actions" v-else-if="mode === 'edit'">
                        <button @click.prevent="deleteResource">Delete Resource</button>
                        <button @click.prevent="editResourceAndScopes">Save Changes</button>
                    </div>

                </div>
            </form>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

const resources_url = process.env.VUE_APP_BASE_URL + 'resources'
const scopes_url = process.env.VUE_APP_BASE_URL + 'scopes'
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

export default {
    name: 'ResourceModal',

    props: ['selected_resource_name', 'selected_resource_scopes', 'mode'],

    components: {
        FulfillingBouncingCircleSpinner
    },

    data(){
        return{
            resource_name: '',
            scopes: [],
            tempScope: '',
            originalResourceName: '',
            scopesChanged: false,
            isLoading: false,
        }
    },

    methods:{
        closeModal(){
            this.$emit('close')
        },
        addScope(e){
            // check if this.scopes is null
            if(!this.scopes){
                this.scopes = []
            }
            if(this.tempScope && e.key == 'Enter'){
                if(!this.scopes.includes(this.tempScope)){
                    this.scopes.push(this.tempScope.trim())
                    // this.scopesToAdd.push(this.tempScope.trim())
                    this.scopesChanged = true
                }
                this.tempScope = ''
            }
        },
        removeScope(scope){
            this.scopes = this.scopes.filter(s => s !== scope)
            // this.scopesToAdd = this.scopesToAdd.filter(s => s !== scope)
            // this.scopesToDelete.push(scope)
            this.scopeToDelete = scope
            this.scopesChanged = true
        },
        async submitResource(){
            this.isLoading = true
            try{
                console.log('adding resource...')
                const data = {
                    resource: this.resource_name,
                    scopes: this.scopes
                }
                console.log(data)
                const res = await axios.post(resources_url, data, config)
                this.$emit('update')
                this.closeModal()
            } catch(err){
                console.log(err)
            } finally{
                this.isLoading = false
            }
        },
        async deleteResource(){
            // this.$emit('loadingOn')
            this.isLoading = true
            try{
                console.log('deleting resource...')
                const data = {
                    resource: this.resource_name,
                }
                console.log(data)
                const res = await axios.delete(resources_url, {data: data, headers: config.headers})
                console.log(res)
                this.$emit('update')
                this.closeModal()
                // this.$emit('update')
                // this.closeModal()
            } catch(err){
                console.log(err)
            } finally{
                this.isLoading = false
            }
        },

        async submitScope(){
            this.isLoading = true
            try{
                console.log('adding scope...')
                const data = {
                    resource: this.resource_name,
                    // scopes: this.scopesToAdd
                    scopes: this.scopes
                }
                console.log(data)
                const res = await axios.post(scopes_url, data, config)
                console.log(res)
                this.$emit('update')
                this.closeModal()
            } catch(err){
                console.log(err)
            } finally{
                this.isLoading = false
            }
        },
        async deleteScope(){
            this.isLoading = true
            try{
                console.log('deleting scope...')
                const data = {
                    resource: this.resource_name,
                    scope: this.scopesToDelete
                }
                console.log(data)
                const res = await axios.delete(scopes_url, {data: data, headers: config.headers})
                console.log(res)
                this.$emit('update')
                this.closeModal()
            } catch(err){
                console.log(err)
            } finally{
                this.isLoading = false
            }
        },
        async editResourceAndScopes(){
            this.isLoading = true
            try{
                console.log('editing scope...')
                let data = null
                if(this.resource_name !== this.originalResourceName){
                    console.log('resource name changed')
                    data = {
                        resource: this.originalResourceName,
                        newResource: this.resource_name,
                        scopes: this.scopes
                    }
                } else {
                    console.log('resource name did not change')
                    data = {
                        resource: this.resource_name,
                        scopes: this.scopes
                    }
                }
                console.log(data)
                const res = await axios.post(resources_url, data, config)
                console.log(res)
                this.$emit('update')
                this.closeModal()
            } catch(err){
                console.log(err)
            } finally{
                this.isLoading = false
            }
        },
    },

    mounted(){
        if(this.mode === 'edit'){
            this.resource_name = this.selected_resource_name
            // deep copy selected_resource_scopes into scopes
            this.scopes = JSON.parse(JSON.stringify(this.selected_resource_scopes))
            if (this.scopes === null){
                this.scopes = []
            }
            this.originalResourceName = this.selected_resource_name
        }
        console.log(this.scopes.length)
    }
}
</script>

<style scoped>
.backdrop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2;
}
.modal{
    width: 50%;
    margin: 100px auto;
    padding: 1em;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
}
.modal-header{
    color: black;
    border: none;
    padding: 0;
    margin: 0.5em;
}

 form {
    /* max-width: 90%; */
    margin: 0 auto;
    background: white;
    text-align: left;
    padding: 2em;
    border-radius: 10px;
}

label {
    /* color: #aaa; */
    display: inline-block;
    margin: 1em 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

form input {
    display: block;
    padding: 1em 0.6em;
    width: 100%;
    box-sizing: border-box;
    margin: 0.5em 0;
    padding: 1em;
    border: 1px solid #5a5a5a;
    border-radius: 5px;
}

form button{
    padding: 1em;
    border-radius: 5px;
    border: none;
    background-color: #CAE2BC;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;
}

form button:hover{
    background-color: #DBF9B8;
}

.scopes-container .pill{
    display: inline-block;
    /* background: #ff9a56; */
    background: #aaaaaa;
    border-radius: 20px;
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-weight: bold;
    color: black;

    margin: 0.5em;
    padding: 1em;
    cursor: pointer;
    text-decoration: none;
    transition: text-decoration 0.2s ease-in-out, background-color 0.1s ease-in-out;
}

.scopes-container .pill:hover{
    background-color: rgb(255, 67, 25);
    text-decoration: line-through;
    cursor: pointer
}


.btns-container{
    display: flex;
    justify-content: space-between;
    margin-top: 2em;   
}

.actions{
    display: flex;
    justify-content: space-between;
}

.actions button{
    margin: 0 0.5em;
}

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
</style>