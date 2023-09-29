<template>
  <div v-if='isLoading' class="spinner-container">
    <fulfilling-bouncing-circle-spinner :animation-duration="2000" :size="60" color="#0B3954" />
  </div>

  <div class="permissions">
    <div class="page-heading">
      <img src="./../../assets/permissions.svg" alt="" />
      <span> Permissions </span>
    </div>

    <div class="top-container">
      <input v-model="searchTerm" type="text" placeholder="Search for a Permission">
      <div class="action-btns">
        <button class="reset" @click="resetChanges">Reset Changes</button>
        <button class="submit" @click="saveChanges">Save Changes</button>
      </div>
    </div>

    <div v-if="Object.keys(permissions).length" class="table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="role in allRoles" :key="role">{{ role }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- <template v-for="(actions, resource) in permissions" :key="resource"> -->
          <template v-for="(actions, resource) in filteredResources" :key="resource">
            <tr class="resource-row" @click="toggleScopes(resource)">
              <td>
                <span class="arrow" :class="{ 'arrow-down': showScopes[resource] }"></span>
                {{ resource }}
              </td>
              <td v-for="role in allRoles" :key="role + resource"></td>
            </tr>
            <!-- <tr v-for="(roles, action) in actions" :key="action"> -->
            <tr v-for="action in actions" v-show="showScopes[resource]" :key="action">
              <td>{{ action }}</td>
              <td v-for="role in allRoles" :key="role + action" class="checkbox-td">
                <input
type="checkbox" :checked="hasPermission(resource, action, role)"
                  @change="togglePermission(resource, action, role)" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import axios from "axios";
import { FulfillingBouncingCircleSpinner } from 'epic-spinners';

interface Permissions {
  [key: string]: string[];
}

interface Change {
  resource: string;
  scope: string;
  role: string;
  type: "add" | "delete";
}

const url = process.env.VUE_APP_BASE_URL + 'permissions'
const config = {
  headers: {
    "ngrok-skip-browser-warning": "true",
  }
}

interface Role {
  role: string;
  description: string;
}

interface Resource {
  [key: string]: string[];
}

/**
 * A component that displays the permissions available in the system and allows the user to edit them.
 * @displayName Permissions View
 */
export default defineComponent({
  name: "PermissionsView",

  components: {
    FulfillingBouncingCircleSpinner
  },

  data() {
    return {
      /**
       * An object that contains the permissions for each resource and action.
       * The permissions object consists of a resource key, which is a string, and a value that is an object.
       * That object contains the actions as keys, and the value is an array of roles that have that permission.
       * @model
       */
      permissions: {} as Record<string, Permissions>,
      /**
       * An array that contains the changes made to the permissions object. Used to send a single request to the API.
       * @model
       */
      changes: [] as Change[],
      /**
       * A string that is used to filter the permissions object based on the resource name.
       * @model
       */
      searchTerm: '',
      /**
       * A boolean that is used to display a loading spinner when the permissions are being fetched from the API.
       * @model
       */
      isLoading: false,
      /**
       * An object that contains the resources and actions that are displayed in the table when the dropdown is opened
       * @model
       */
      showScopes: {} as Record<string, boolean>,
      /**
       * An array that contains the roles available in the system. Necessary to display the roles in the table.
       * @model
       */
      roles: [] as Role[],
      /**
       * An object that contains the resources and actions available in the system. Necessary to display the resources in the table.
       * @model
       */
      resources: {} as Resource,

    };
  },

  computed: {
    /**
     * A computed property that returns the resources that match the search term.
     */
    filteredResources(): Record<string, string[]> {
      if (!this.searchTerm) {
        return this.resources;
      }
      const search = this.searchTerm.toLowerCase();
      const filteredResources: Record<string, string[]> = {};
      for (const [resource, actions] of Object.entries(this.resources)) {
        if (resource.toLowerCase().includes(search)) {
          filteredResources[resource] = actions;
        }
      }
      return filteredResources;
    },
    /**
     * A computed property that returns an array of all the role names available in the system.
     */
    allRoles(): string[] {
      console.log(this.roles)
      return this.roles.map((role) => role.role);
    },
    /**
     * A computed property that returns a multidimensional array of booleans that represents the permissions object.
     * Necessary to display the checkboxes in the table.
     */
    permissionMatrix(): Record<
      string,
      Record<string, Record<string, boolean>>
    > {
      const matrix: Record<
        string,
        Record<string, Record<string, boolean>>
      > = {};
      for (const [resource, actions] of Object.entries(this.resources)) {
        matrix[resource] = {};
        for (const action of actions) {
          matrix[resource][action] = {};
          for (const role of this.allRoles) {
            matrix[resource][action][role] =
              this.permissions[resource] &&
              this.permissions[resource][action] &&
              this.permissions[resource][action].includes(role);
          }
        }
      }
      return matrix;
    },
  },
  mounted() {
    /**
     * Fetch the permissions, roles and resources when the component is mounted. If any roles or resources
     * are not present in the permissions retrieved from the backend, then they are added to the permissions table
     * after they are fetched from the backend. 
     */
    this.fetchPermissions()
    this.fetchRoles()
    this.fetchResources()
  },
  methods: {
    /**
     * A function that toggles the display of the actions when the arrow is clicked.
     * @param {string} resource the resource name whose scopes are to be displayed or hidden
     * @public
     */
    toggleScopes(resource: string): void {
      this.showScopes[resource] = !this.showScopes[resource];
    },
    /**
     * Check if a permission exists using the permissionMatrix computed property
     * @param {string} resource 
     * @param {string} action 
     * @param {string} role 
     * @public
     */
    hasPermission(resource: string, action: string, role: string): boolean {
      return this.permissionMatrix[resource][action][role];
    },
    /**
     * First checks the changes array, if the same change is already there, but with a different type,
     * then it removes the change from the changes array, otherwise it adds the change to the changes array
     * @param {Change} change
     * @public
     */
     pushToChanges(change: Change): void {
      const { resource, scope: action, role, type } = change;
      const index = this.changes.findIndex((change) => {
        return change.resource === resource && change.scope === action && change.role === role;
      });
      if (index !== -1) {
        if (this.changes[index].type !== type) {
          this.changes.splice(index, 1);
        }
      } else {
        this.changes.push(change);
      }
    },
    /**
     * A function that toggles the permission of a role for a specific resource and action in the permissions object.
     * @param {string} resource the resource name
     * @param {string} action the action name
     * @param {string} role the role name
     * @public
     */
    togglePermission(resource: string, action: string, role: string): void {
      // Check if the resource and action exist in the permissions object
      if (!this.permissions[resource]) {
        this.permissions[resource] = {};
      }
      if (!this.permissions[resource][action]) {
        this.permissions[resource][action] = [];
      }
      // Update the permissions object when a checkbox is toggled
      if (this.hasPermission(resource, action, role)) {
        // Remove permission
        this.permissions[resource][action] = this.permissions[resource][action].filter((r) => r !== role);
        this.pushToChanges({ resource, scope: action, role, type: "delete" });
      } else {
        // Add permission
        this.permissions[resource][action].push(role);
        this.pushToChanges({ resource, scope: action, role, type: "add" });
      }
    },
    /**
     * Fetches the permissions from the backend and updates the permissions object.
     * @public
     */
    async fetchPermissions(): Promise<void> {
      this.isLoading = true
      try {
        console.log('fetching permissions...')
        const { data } = await axios.get(url, config);
        this.permissions = data.permissions;
        console.log(this.permissions)
        this.$notify({
          title: 'Permissions',
          text: 'Permissions fetched successfully',
          type: 'success'
        })
      } catch (error: any) {
        console.log(error)
        let message = ''
        if (error.response) {
          message = error.response.data.message
        } else {
          message = 'Something went wrong. Please try again later.'
        }
        this.$notify({
          title: 'Permissions',
          text: message,
          type: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Sends a request to the backend to save the changes made to the permissions object.
     * @public
     */
    async saveChanges(): Promise<void> {
      this.isLoading = true
      // Convert the changes array to the format required by the API
      const changes = this.changes.map(change => {
        const { resource, scope: action, role, type } = change;
        return { resource, scope: action, role, type: type === 'delete' ? 'remove' : type };
      });
      // Send a single request with the changes array
      try {
        await axios.post(url + '/all', { permissions: changes }, config);
        console.log('permissions edited successfully')
        this.$notify({
          title: 'Permissions',
          text: 'Permissions edited successfully',
          type: 'success'
        })
        this.fetchPermissions();
      } catch (error: any) {
        console.log(error)
        let message = ''
        if (error.response) {
          message = error.response.data.message
        } else {
          message = 'Something went wrong. Please try again later.'
        }
        this.$notify({
          title: 'Permissions',
          text: message,
          type: 'error'
        })
      } finally {
        this.isLoading = false
        this.changes = [];
      }

    },
    /**
     * Resets the changes made to the permissions object by restoring the original state of the permissions object.
     * This function is called when the reset button is clicked before the changes are saved.
     * @public
     */
    resetChanges(): void {
      // Reset the changes by restoring the original state of the permissions object
      for (const change of this.changes) {
        const { resource, scope: action, role, type } = change;
        if (type === "add") {
          // Restore deleted permission
          this.permissions[resource][action] = this.permissions[resource][action].filter((r) => r !== role);
        } else if (type === "delete") {
          // Restore added permission
          this.permissions[resource][action].push(role);
        }
      }
      // Clear the changes array
      this.changes = [];
    },
    /**
     * Fetches the roles from the backend and updates the roles array.
     * Necessary to display all the roles in the system inside the permissions table.
     * @public
     */
    async fetchRoles() {
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
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * Fetches the resources from the backend and updates the resources object.
     * Necessary to display all the resources in the system inside the permissions table.
     * @public
     */
    async fetchResources() {
      console.log('displaying resources...')
      try {
        const url: string = process.env.VUE_APP_BASE_URL + 'resources'
        const response = await axios.get(url, config)
        this.resources = response.data.resources
      } catch (error) {
        console.log(error)
      }
    }
  }
});
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.permissions {
  top: 0;
  padding: 3em;
  font-size: 62.5%;
  width: 100vw;
}

.page-heading {
  display: flex;
  align-items: center;
  padding: 0.4em 0;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 1em;
}

.page-heading span {
  font-size: 2rem;
}

.page-heading img {
  width: 6em;
  height: 6em;
  margin: 0 3em;
}

.table-container {
  overflow-x: scroll;
  overflow-y: scroll;
  /* height: fit-content;
  width: fit-content; */
  max-height: 90%;
  max-width: 100%;
}

table {
  text-align: left;
  box-shadow: 0 5px 10px #e1e5ee;
  border-radius: 3px;
  border: 1px solid #f2f2f2;
  /* overflow-y: scroll;
  overflow-x: scroll; */
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  box-shadow: 0 5px 10px #e1e5ee;
  position: sticky;
  top: 0;
  background: #f2f8ff;
  z-index: 3;
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

td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  box-shadow:  5px 0 10px black;
  background-color: #f2f8ff;
}

/* tbody td { */
.checkbox-td {
  transition: transform 0.1s;
  /* center the content in td */
  text-align: center;
}

/* tbody td:hover { */
.checkbox-td:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  /* cursor: pointer; */
  z-index: 1;
  background-color: #CAE2BC;
}

.action-btns {
  margin: 2em 0;
}

.action-btns button {
  padding: 1em 2em;
  border-radius: 0.5em;
  font-weight: bold;
  cursor: pointer;
  margin: 0 1em;
}

.submit {
  background-color: #4361EE;
  border-color: transparent;
  color: white;
  transition: border 0.2s ease-in-out 0s, background-color 0.2s ease-in-out 0s;
}

.submit:hover {
  border: 2px solid white;
  /* make the background color brighter using filter*/
  filter: brightness(1.1);
}

.reset {
  background-color: white;
  color: #4361EE;
  border: 2px solid #4361EE;
  transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
}

.reset:hover {
  background-color: #4361EE;
  color: white;
}

/* select inputs of tyoe checkbox */
input[type="checkbox"] {
  width: 1.5em;
  height: 1.5em;
  margin: 0;
  padding: 0;
  vertical-align: bottom;
  position: relative;
  top: -0.2em;
}

.resource-row {
  text-align: center;
  background: #dbf9b8;
  z-index: 2;
  cursor: pointer;
}

.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;
}

input {
  padding: 1em;
  border-radius: 0.5em;
  border: 1px solid #f2f2f2;
  width: 30%;
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

.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid black;
  margin-right: 5px;
  transition: transform 0.2s ease-in-out;
}

.arrow-down {
  transform: rotate(90deg);
}


/* tr td:nth-child(2) {
  width: 100%;
} */
</style>

