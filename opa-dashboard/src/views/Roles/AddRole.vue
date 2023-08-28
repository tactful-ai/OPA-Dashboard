<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <h1>Add a New Role</h1>
            <form class="actions" @submit.prevent="handleAdd">
                <label for="">Role Name: </label>
                <input type="text" v-model="role_name">
                <label for="">Role Description: </label>
                <textarea v-model="role_description"> </textarea>
                <div class="btns-container">
                    <button class="close" @click.prevent="closeModal">Cancel</button>
                    <button>Add Role</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Modal',
    props: ['selected_role', 'selected_description'],
    data(){
        return{
            role_name: '',
            role_description: ''
        }
    },
    watch: {
        selected_role(newRole) {
            this.role_name = newRole;
        },
        selected_description(newDescription) {
            this.role_description = newDescription;
        }
    },
    methods: {
        closeModal(){
            this.$emit('close')
        },
        async handleAdd(){
            console.log('adding a new role...')
            const url = 'https://39a3-197-133-57-78.ngrok-free.app/roles'
            const config = {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                }
            }
            const data = {
                "role": this.role_name,
                "description": this.role_description
            }
            console.log(this.role_name)
            console.log(this.role_description)
            console.log(data)
            const response = await axios.post(url, data, config)
            console.log(response)
            this.closeModal()
            this.$emit('add')
        },
        async handleDelete(){
            console.log('deleting a role...')
            const url = 'https://39a3-197-133-57-78.ngrok-free.app/roles'
            const headers = {
                "ngrok-skip-browser-warning": "true",
            }
            const data = {
                "role": this.role_name,
                "description": this.role_description
            }
            const response = await axios.delete(url, {data, headers})
            console.log(response)
            this.closeModal()
        }
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
      padding: 1em 2em;
      border-radius: 5px;
      border: none;
      background-color: #519E8A;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
  }

  .close{
      background-color: white;
      border: 1px solid #519E8A;
  }

</style>