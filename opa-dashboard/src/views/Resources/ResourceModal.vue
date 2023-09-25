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

<script lang='ts'>
import { defineComponent } from 'vue'
import axios from 'axios'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

const resources_url = process.env.VUE_APP_BASE_URL + 'resources'
const scopes_url = process.env.VUE_APP_BASE_URL + 'scopes'
// need to add this header to work properly with ngrok
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

/**
 * A modal that allows the user to add a new resource or edit an existing resource's name and scopes.
 * @displayName Resource Modal
 */
export default defineComponent({
    name: 'ResourceModal',

    props: {
        /**
         * The name of the resource to be edited when the user clicks on a table row.
         * Passed to the modal as a prop when the mode is 'edit'.
         */
        selected_resource_name: {
            type: String,
            default: ''
        },
        /**
         * The scopes of the resource to be edited when the user clicks on a table row.
         * Passed to the modal as a prop when the mode is 'edit'.
         */
        selected_resource_scopes: {
            type: Array,
            default: []
        }, 
        /**
         * The mode of the modal component. 
         * @values add, edit
         */
        mode: {
            type: String,
        }
    },

    components: {
        FulfillingBouncingCircleSpinner
    },

    data(){
        return{
            /**
             * The name of the resource to be added or edited.
             * @model
             */
            resource_name: '' as string,
            /**
             * The scopes of the resource to be added or edited.
             * @model
             */
            scopes: [] as string[],
            /**
             * A variable to temporarily store the scope entered by the user before adding it to the scopes array.
             * @model
             */
            tempScope: '' as string,
            /**
             * The original name of the resource to be edited.
             * Needed to update the resource name in the backend.
             * @model
             */
            originalResourceName: '' as string,
            /**
             * A boolean to check if the scopes have been changed,
             * to determine the type of request to be sent to the backend when editing a resource.
             * @model
             */
            scopesChanged: false as boolean,
            /**
             * A boolean to display a spinner when the resources are being fetched or updated
             * @model
             */
            isLoading: false as boolean,
        }
    },

    methods:{
        /**
         * Emits a close event to the parent component to close the modal.
         */
        closeModal(){
            /**
             * Triggered when anywhere outside the modal is clicked, 
             * when the cancel button is clicked or when the operation is done successfully
             * @event close
             */
            this.$emit('close')
        },
        /**
         * Gets called when the user presses a key while typing in the scope input field.
         * Adds the scope to the scopes array when the user presses the Enter key.
         * @param {KeyboardEvent} e The keyup event triggered when the user presses a key 
         * @public
         */
        addScope(e: KeyboardEvent){
            if(!this.scopes){
                this.scopes = []
            }
            if(this.tempScope && e.key == 'Enter'){
                if(!this.scopes.includes(this.tempScope)){
                    this.scopes.push(this.tempScope.trim())
                    this.scopesChanged = true
                }
                this.tempScope = ''
            }
        },
        /**
         * Removes the scope from the scopes array when the user clicks on the scope pill.
         * @param {string} scope The scope to be removed from the scopes array
         * @public
         */
        removeScope(scope: string){
            this.scopes = this.scopes.filter(s => s !== scope)
            this.scopesChanged = true
        },
        /**
         * Sends a POST request to the backend to add a new resource.
         * Emits an update event to the parent component to update the resources table.
         * @public
         */
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
                this.$notify({
                    title: 'Success',
                    text: 'Resource added successfully',
                    type: 'success'
                })
                /**
                 * Triggered when the resource is added or edited successfully to update the resources table.
                 * The update is done by fetching the resources from the backend.
                 * @event update
                 */
                this.$emit('update')
                this.closeModal()
            } catch(err: any){
                console.log(err)
                let message = ''
                if (err.response){
                    message = err.response.data.message
                } else {
                    message = "Something went wrong, please try again later"
                }
                this.$notify({
                    title: 'Error',
                    text: message,
                    type: 'error'
                })
            } finally{
                this.isLoading = false
            }
        },
        /**
         * Sends a DELETE request to the backend to delete a resource.
         * Emits an update event to the parent component to update the resources table.
         * @public
         */
        async deleteResource(){
            this.isLoading = true
            try{
                console.log('deleting resource...')
                const data = {
                    resource: this.resource_name,
                }
                console.log(data)
                const res = await axios.delete(resources_url, {data: data, headers: config.headers})
                console.log(res)
                this.$notify({
                    title: 'Success',
                    text: 'Resource deleted successfully',
                    type: 'success'
                })
                this.$emit('update')
                this.closeModal()
            } catch(err: any){
                console.log(err)
                let message = ''
                if (err.response){
                    message = err.response.data.message
                } else {
                    message = "Something went wrong, please try again later"
                }
                this.$notify({
                    title: 'Error',
                    text: message,
                    type: 'error'
                })
            } finally{
                this.isLoading = false
            }
        },
        /**
         * Sends a PUT request to the backend to edit a resource.
         * Checks if the resource name has been changed to determine the type of request to be sent to the backend.
         * Emits an update event to the parent component to update the resources table.
         * @public
         */
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
                const res = await axios.put(resources_url, data, config)
                console.log(res)
                this.$notify({
                    title: 'Success',
                    text: 'Resource edited successfully',
                    type: 'success'
                })
                this.$emit('update')
                this.closeModal()
            } catch(err: any){
                console.log(err)
                let message = ''
                if (err.response){
                    message = err.response.data.message
                } else {
                    message = "Something went wrong, please try again later"
                }
                this.$notify({
                    title: 'Error',
                    text: message,
                    type: 'error'
                })
            } finally{
                this.isLoading = false
            }
        },
    },

    mounted(){
        /**
         * Sets the resource name and scopes to the selected resource's name and scopes when the mode is 'edit'.
         * Also keeps a copy of the original resource name to check if the resource name has been changed.
         */
        if(this.mode === 'edit'){
            this.resource_name = this.selected_resource_name
            // deep copy selected_resource_scopes into scopes
            this.scopes = JSON.parse(JSON.stringify(this.selected_resource_scopes))
            if (this.scopes === null){
                this.scopes = []
            }
            this.originalResourceName = this.selected_resource_name
        }
    }
});
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
    background-color: #4361EE;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;
}

form button:hover{
    filter: brightness(1.3);
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