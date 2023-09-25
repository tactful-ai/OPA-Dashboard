<template>
    <div class="backdrop" @click.self="closeModal">

        <div class="spinner-container" v-show='isLoading'>
            <fulfilling-bouncing-circle-spinner
            :animation-duration="2000"
            :size="60"
            color="#0B3954"
            />
        </div>

        <div class="modal">
            <h1 v-if="mode === 'add'">Add a New Role</h1>
            <h1 v-else-if="mode === 'edit'">Edit Role</h1>
            <form class="actions" @submit.prevent="handleAdd">
                <label for="">Role Name: </label>
                <input type="text" v-model="role_name">
                <label for="">Role Description: </label>
                <textarea v-model="role_description"> </textarea>
                <div class="btns-container">
                    <button class="close" @click.prevent="closeModal">Cancel</button>
                    <button v-if="mode === 'add'">Add Role</button>
                    <div v-else-if="mode === 'edit'">
                        <button @click.prevent="handleDelete">Delete Role</button>
                        <button @click.prevent="handleEdit">Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang='ts'>
import axios from 'axios'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

const url = process.env.VUE_APP_BASE_URL + 'roles'
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

/**
 * A modal component that allows the user to add a new role or edit an existing role
 * @displayName Role Modal
 */
export default {
    name: 'RoleModal',
    
    props: {
        /**
         * The name of the role to be edited when the user click on a table row. 
         * Passed to the modal component as a prop when the mode is edit
         */
        selected_role_name: {
            type: String,
            default: ''
        }, 
        /**
         * The description of the role to be edited when the user click on a table row. 
         * Passed to the modal component as a prop when the mode is edit
         */
        selected_role_description: {
            type: String,
            default: ''
        }, 
        /**
         * The mode of the modal component. 
         * @values add, edit
         */
        mode:{
            type: String
        }
    },

    components: {
        FulfillingBouncingCircleSpinner
    },

    data(){
        return{
            /**
             * The name of the role to be added, data-bound to the input field
             * @model
             */
            role_name: '',
            /**
             * The description of the role to be added, data-bound to the input field
             * @model
             */
            role_description: '',
            /**
             * A boolean to display a spinner when the roles are being fetched or updated
             * @model
             */
            isLoading: false
        }
    },
    methods: {
        /**
         * Emits en event to the parent component to close the modal
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
         * Sends a POST request to the backend to add a new role. The new role object
         * uses the role_name and role_description v-models data-bound to the input fields
         * @public
         */
        async handleAdd(){
            this.isLoading = true
            try{
                console.log('adding a new role...')
                const data = {
                    "role": this.role_name,
                    "description": this.role_description
                }
                console.log(this.role_name)
                console.log(this.role_description)
                console.log(data)
                const response = await axios.post(url, data, config)
                console.log(response)
                this.$notify({
                    title: 'Success',
                    text: 'Role added successfully',
                    type: 'success'
                });
                /**
                 * Triggered when a new role is added,editted, or deleted successfully so the roles table can be updated.
                 * The update is done by fetching the roles from the backend
                 * @event add
                 */
                this.$emit('add')
                this.closeModal()
            } catch (err: any){
                console.log(err)
                this.$notify({
                    title: 'Error',
                    text: err.response.data.message,
                    type: 'error'
                });
                this.$emit('add')
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Sends a DELETE request to the backend to delete a role. The role to be deleted
         * uses the role_name v-model data-bound to the input field, which is populated through the selected_role_name prop
         * when the user clicks on a table row 
         * @public
         */
        async handleDelete(){
            this.isLoading = true
            try{
                console.log('deleting a role...')
                const data = {
                "role": this.role_name,
                // "description": this.role_description
                }
                console.log(data)
                const response = await axios.delete(url, {data: data, headers: config.headers})
                console.log(response)
                this.$notify({
                    title: 'Success',
                    text: 'Role deleted successfully',
                    type: 'success'
                });
                this.$emit('add')
                this.closeModal()
            } catch (err: any){
                console.log(err)
                this.$notify({
                    title: 'Error',
                    text: err.response.data.message,
                    type: 'error'
                });
                this.$emit('add')
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Sends a PUT request to the backend to edit a role. The role to be edited
         * uses the role_name and role_description v-models data-bound to the input fields, which are populated through the 
         * selected_role_name and selected_role_description props when the user clicks on a table row 
         * @public
         */
        async handleEdit(){
            this.isLoading = true
            try{
                console.log('editing a role...')
                const data = {
                    "role": this.selected_role_name,
                    "newRole":this.role_name,
                    "newRoleDescription": this.role_description
                }
                console.log(data)
                const response = await axios.put(url,data,config)
                console.log(response)
                this.$emit('add')
                this.closeModal()
            } catch (err: any){
                console.log(err)
                this.$notify({
                    title: 'Error',
                    text: err.response.data.message,
                    type: 'error'
                });
                this.$emit('add')
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted() {
        /**
         * Populates the input fields with the selected role data when the mode is edit
         */
        this.role_name = this.selected_role_name
        this.role_description = this.selected_role_description
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
    
    .modal h1 {
    color: black;
    border: none;
    padding: 0;
    margin: 0.5em;
    }

    .modal p {
        font-style: normal;
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
    color: #aaa;
    display: inline-block;
    margin: 1em 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }

  input, textarea {
    display: block;
    padding: 1em 0.6em;
    width: 100%;
    box-sizing: border-box;
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #5a5a5a;
    border-radius: 5px;
  }

  .btns-container{
        display: flex;
        justify-content: space-between;
        margin-top: 3em;   
  }

  button{
      padding: 1em;
      margin: 1em;
      border-radius: 5px;
      border: none;
      color: white;
      background-color: #4361EE;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
  }
  
  button:hover{
    filter: brightness(1.3);
  }

  .close{
    color: #4361EE;
      background-color: white;
      border: 1px solid #4361EE;
  }

    .close:hover{
        background-color: #4361EE;
        color: white;
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