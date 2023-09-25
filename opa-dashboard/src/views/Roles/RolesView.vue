<template>
    <transition name="fade">
        <RoleModal 
        v-if="showModal" 
        @close="toggleModal" 
        @add="displayRoles" 
        mode="add" />
    </transition>

    <div class="spinner-container" v-show='isLoading'>
        <fulfilling-bouncing-circle-spinner
        :animation-duration="2000"
        :size="60"
        color="#0B3954"
        />
    </div>
    
    <div class="roles">
        <div class="page-heading">
            <img src="./../../assets/roles.svg" alt="">
            <span> Roles </span>
        </div>
        <div class="btns-container">
            <input type="text" placeholder="Search for a Role" v-model="searchTerm">
            <button @click.exact="toggleModal" class='add-role'>Add +</button>
        </div>
        <div class="table-container" v-if="roles.length">
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody v-for="role in filteredRoles" :key='role.role'>
                    <RoleModal v-show="selectedRole === role" 
                    @close="selectedRole = null" 
                    @add="displayRoles" 
                    :selected_role_name="role.role" 
                    :selected_role_description="role.description"
                    mode="edit"/>
                    <tr @click= "selectedRole = role">
                        <td>{{ role.role }}</td>
                        <td>{{ role.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>Loading roles...</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import axios from 'axios'
import RoleModal from './RoleModal.vue'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

interface Role {
  role: string;
  description: string;
}

/**
 * A component to display all the roles in the system
 * @displayName Roles View
 */

export default defineComponent({
    name: 'RolesView',

    components: {
        /**
         * @see RoleModal
         */
        RoleModal,
        FulfillingBouncingCircleSpinner,
    },

    data(){
        return {
            /**
             * @model
             * An array of roles to be displayed
             */
            roles: [] as Role[],
            /**
             * @model 
             * A boolean to toggle the modal
             * @default false
             */
            showModal: false,
            /**
             * @model 
             * The role selected by the user to be edited or deleted when a table row is clicked.
             * @default null
             */
            selectedRole: null as Role | null,
            /**
             * @model
             * The search term entered by the user to filter the roles when using the search bar
             */
            searchTerm:'',
            /**
             * @model
             * A boolean to display a spinner when the roles are being fetched or updated
             */
            isLoading: true,
        }
    },

    computed: {
        /**
         * a computed property to filter the roles based on the search term entered by the user
         */
        filteredRoles(): Role[]{
            if (this.searchTerm === '') return this.roles
            return this.roles.filter((role: Role) => {
                return role.role.toLowerCase().includes(this.searchTerm.toLowerCase())
            })
        }
    },

    methods:{
        /**
         * Toggles the showModal property to display the modal, triggered when the add button is clicked,
         * ,when the user clicks on a table row to edit or delete a role, or when the user clicks on the close button
         * @public
         */
        toggleModal() {
            this.showModal = !this.showModal
        },

        /**
         * Fetches the roles from the backend and updates the roles array. Triggered when the component is mounted,
         * or when a role is added or edited
         * @public
         */
        async displayRoles(){

            this.isLoading = true
            console.log('displaying roles...')
            try {
                const url: string = process.env.VUE_APP_BASE_URL + 'roles'
                const config = {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    }
                }
                const response = await axios.get(url, config);
                this.roles = response.data.roles;
                console.log(response.data)
                this.$notify({
                    title: 'Success',
                    text: 'Roles fetched successfully',
                    type: 'success'
                });
            } catch (error) {
                console.error(error);
                this.roles = [
                    {
                        'role': "role1",
                        'description': "desc1",
                    },
                    {
                        'role': "role2",
                        'description': "desc2",
                    },
                    {
                        'role': "role3",
                        'description': "desc3",
                    },
                ]
                this.$notify({
                    title: 'Error',
                    text: 'Roles could not be fetched',
                    type: 'error'
                });
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted() {
        this.displayRoles()
    }
})
</script>

<style scoped>
*{
    box-sizing: border-box;
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

.roles{
    top: 0;
    padding: 3em;
    width: 100%;
    height: 100vh;
    font-size: 62.5%;
    /* display: grid; */
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

table td:nth-child(2),
table th:nth-child(2) {
  width: 100%;
}

.btns-container{
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

.add-role{
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

.add-role:hover{
    background-color: #4361EE;
    color: white;
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

span{
    font-size: 1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>