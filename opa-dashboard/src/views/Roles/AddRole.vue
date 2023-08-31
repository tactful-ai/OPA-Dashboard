<template>
    <div class="backdrop" @click.self="closeModal">
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
                        <button>Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const url = process.env.VUE_APP_BASE_URL + 'roles'
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

export default {
    name: 'Modal',
    props: ['selected_role_name', 'selected_role_description', 'mode'],
    data(){
        return{
            role_name: '',
            role_description: ''
        }
    },
    // computed: {
    //     role_name: {
    //         get() {
    //             return this.selected_role_name;
    //         },
    //         set(value) {
    //             this.$emit('update:selected_role_name', value);
    //         }
    //     },
    //     role_description: {
    //         get() {
    //             return this.selected_role_description;
    //         },
    //         set(value) {
    //             this.$emit('update:selected_role_description', value);
    //         }
    //     }
    // },
    // watch: {
    //     role_name(val) {
    //         console.log('role_name changed to: ' + val);
    //     },
    //     role_description(val) {
    //         console.log('role_description changed to: ' + val);
    //     }
    // },
    methods: {
        closeModal(){
            this.$emit('close')
        },

        async handleAdd(){
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
                this.closeModal()
                this.$emit('add')
            } catch (err){
                console.log(err)
                this.$emit('add')
            }
        },
        async handleDelete(){
            try{
                console.log('deleting a role...')
                const data = {
                "role": this.role_name,
                // "description": this.role_description
                }
                console.log(data)
                const response = await axios.delete(url, {data: data, headers: config.headers})
                console.log(response)
                this.$emit('add')
                this.closeModal()
            } catch (err){
                console.log(err)
                this.$emit('add')
            }
        }
    },
    mounted() {
        if (this.selected_role_name && this.selected_role_description){
            this.role_name = this.selected_role_name
            this.role_description = this.selected_role_description
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
      padding: 1em;
      margin: 1em;
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