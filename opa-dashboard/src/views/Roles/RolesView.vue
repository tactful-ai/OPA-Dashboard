<template>
    <transition name="fade">
        <!-- exit animation works, enter animation does not -->
        <!-- send selected role name and permission as empty -->
        <AddRole v-if="showModal" @close="toggleModal" @add="displayRoles" mode="add"/>
    </transition>
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
                <tbody v-for="role in filteredRoles" :key='role.id'>
                    <AddRole v-show="selectedRole === role" 
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
import AddRole from './AddRole.vue'

interface Role {
  role: string;
  description: string;
}

export default defineComponent({
    name: 'RolesView',

    components: {
        /**
         * @component
         * @see {@link AddRole}
         * @description A modal for adding a new role
         */
        AddRole
    },

    data(){
        return {
            roles: [] as Role[],
            showModal: false,
            selectedRole: null,
            searchTerm:'',
        }
    },

    computed: {
        filteredRoles(): Role[]{
            if (this.searchTerm === '') return this.roles
            return this.roles.filter((role: Role) => {
                return role.role.toLowerCase().includes(this.searchTerm.toLowerCase())
            })
        }
    },

    methods:{
        /**
         * @method toggleModal - Toggles the showModal property to display the AddRole modal
         */
        toggleModal() {
            this.showModal = !this.showModal
        },

        async displayRoles(){
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
    border: 1px solid #f2f2f2;
    background-color: #519E8A;
    color: black;
    font-weight: bold;
    cursor: pointer;
    /*  add a transition to make the border black */
    transition: border-color 0.2s;
}

.add-role:hover{
    border-color: black;
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