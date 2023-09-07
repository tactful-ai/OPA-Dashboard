<template>
  <div class="permissions">
    <div class="page-heading">
      <img src="./../../assets/permissions.svg" alt="" />
      <span> Permissions </span>
    </div>

    <div class="top-container"></div>

    <div class="table-container" v-if="Object.keys(permissions).length">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="role in allRoles" :key="role">{{ role }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(actions, resource) in permissions" :key="resource">
            <tr class="resource-row">
              <td>{{ resource }}</td>
              <td v-for="role in allRoles" :key="role + resource"></td>
            </tr>
            <tr v-for="(roles, action) in actions" :key="action">
              <td>{{ action }}</td>
              <td v-for="role in allRoles" :key="role + action">
                <input
                  type="checkbox"
                  :checked="hasPermission(resource, action, role)"
                  @change="togglePermission(resource, action, role)"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="action-btns">
      <button class="reset" @click="resetChanges">Reset Changes</button>
      <button class="submit" @click="saveChanges">Save Changes</button>
    </div>

  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import axios from "axios";

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

export default defineComponent({
  name: "PermissionsView",

  data() {
    return {
      // permissions: {
      //   book: { order: ["user"], read: ["user", "guest"], review: ["user"] },
      //   document: {order: ["user"], read: ["user", "guest"], review: ["user"],},
      //   email: { read: ["user", "guest"], send: ["user"] },
      // } as Record<string, Permissions>,
      permissions: {} as Record<string, Permissions>,

      changes: [] as Change[],
    };
  },

  computed: {
    allRoles(): string[] {
      // Compute the list of all roles
      const roles = new Set<string>();
      if (Object.keys(this.permissions).length) {
        for (const actions of Object.values(this.permissions)) {
          for (const roleArray of Object.values(actions)) {
            for (const role of roleArray) {
              roles.add(role);
            }
          }
        }
      }
      console.log(Array.from(roles))
      return Array.from(roles);
    },

    permissionMatrix(): Record<
      string,
      Record<string, Record<string, boolean>>
    > {
      // Transform the permissions object into a multidimensional array of booleans
      const matrix: Record<
        string,
        Record<string, Record<string, boolean>>
      > = {};
      for (const [resource, actions] of Object.entries(this.permissions)) {
        matrix[resource] = {};
        for (const [action, roles] of Object.entries(actions)) {
          matrix[resource][action] = {};
          for (const role of this.allRoles) {
            matrix[resource][action][role] = roles.includes(role);
          }
        }
      }
      return matrix;
    },
  },
  methods: {
    hasPermission(resource: string, action: string, role: string): boolean {
      // Check if a permission exists using the permissionMatrix computed property
      return this.permissionMatrix[resource][action][role];
    },

    // a function that first checks the changes array, if the same change is already there, but with a different type,
    // then it removes the change from the changes array, otherwise it adds the change to the changes array
    pushToChanges (change: Change): void {
      const { resource, scope:action, role, type } = change;
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

    togglePermission(resource: string, action: string, role: string): void {
      // Update the permissionMatrix computed property when a checkbox is toggled
      if (this.hasPermission(resource, action, role)) {
        // Remove permission
        this.permissions[resource][action] = this.permissions[resource][action].filter((r) => r !== role);
        // this.changes.push({resource, scope: action, role, type: 'delete'});
        this.pushToChanges({resource, scope: action, role, type: 'delete'});
      } else {
        // Add permission
        this.permissions[resource][action].push(role);
        // this.changes.push({resource, scope: action, role, type: 'add'});
        this.pushToChanges({resource, scope: action, role, type: 'add'});
      }
      // this.cleanPermissions()
      // console.log(this.permissionMatrix);
      console.log(this.changes)
    },

    cleanPermissions(): void {
      for (const [resource, actions] of Object.entries(this.permissions)) {
        for (const [action, roles] of Object.entries(actions)) {
          if (roles.length === 0) {
            delete this.permissions[resource][action];
          }
        }
      }
    },

    async fetchPermissions(): Promise<void> {
      // Fetch the permissions from the API and update the permissions object
      try{
        const { data } = await axios.get(url, config);
        this.permissions = data.permissions;
        console.log(this.permissions)
      } catch (error) {
        console.log(error)
      }
    },

    // async saveChanges(): Promise<void> {
    //   // Map back from the permissionMatrix computed property to the permissions object
    //   // and send the requests to add or remove permissions
    //   //   constthis.cleanPermissions();
    //   // let permissionMatrixCopy: Record<
    //   //   string,
    //   //   Record<string, Record<string, boolean>>
    //   // >  = JSON.parse(
    //   //   JSON.stringify(this.permissionMatrix)
    //   // );
    //   // this.cleanPermissions(permissionMatrixCopy)
    //   for (const [resource, actions] of Object.entries(this.permissionMatrix)) {
    //     for (const [action, roles] of Object.entries(actions)) {
    //       for (const [role, hasPermission] of Object.entries(roles)) {
    //         const requestBody = { resource, scope: action, role };
    //         if (
    //           hasPermission &&
    //           !this.permissions[resource][action].includes(role)
    //         ) {
    //           // Add permission
    //           await axios.post("<API_URL>", requestBody);
    //           this.permissions[resource][action].push(role);
    //         } else if (
    //           !hasPermission &&
    //           this.permissions[resource][action].includes(role)
    //         ) {
    //           // Remove permission
    //           await axios.delete("<API_URL>", { data: requestBody });
    //           this.permissions[resource][action] = this.permissions[resource][
    //             action
    //           ].filter((r) => r !== role);
    //         }
    //       }
    //     }
    //   }
    // },
    async saveChanges(): Promise<void> {
      for (const change of this.changes) {
        const { resource, scope:action, role, type } = change;
        console.log({ resource, scope:action, role  })
        if (type === 'add') {
          // Send a request to add the permission
          await axios.post(url, { resource, scope:action, role }, config);
        } else if (type === 'delete') {
          // Send a request to delete the permission
          await axios.delete(url, { data: { resource, scope:action, role }, headers: config.headers });
        }
      }
      // Clear the changes array
      this.changes = [];
    },

    // resetChanges(): void {
    //   // Reset the changes by restoring the original state of the permissions object
    //   for (const [resource, actions] of Object.entries(this.permissionMatrix)) {
    //     for (const [action, roles] of Object.entries(actions)) {
    //       for (const [role, hasPermission] of Object.entries(roles)) {
    //         if (
    //           hasPermission &&
    //           !this.permissions[resource][action].includes(role)
    //         ) {
    //           // Restore added permission
    //           this.permissions[resource][action].push(role);
    //         } else if (
    //           !hasPermission &&
    //           this.permissions[resource][action].includes(role)
    //         ) {
    //           // Remove deleted permission
    //           this.permissions[resource][action] = this.permissions[resource][
    //             action
    //           ].filter((r) => r !== role);
    //         }
    //       }
    //     }
    //   }
    // },
    resetChanges(): void {
      // Reset the changes by restoring the original state of the permissions object
      for (const change of this.changes) {
        const { resource, scope:action, role, type } = change;
        if (type === 'add') {
          // Restore deleted permission
          this.permissions[resource][action] = this.permissions[resource][action].filter((r) => r !== role);
        } else if (type === 'delete') {
          // Restore added permission
          this.permissions[resource][action].push(role);
        }
      }
      // Clear the changes array
      this.changes = [];
    },

  },
  mounted(){
    this.fetchPermissions()
    // console.log(this.permissions)
    // this.permissions = {
    //     book: { order: ["user"], read: ["user", "guest"], review: ["user"] },
    //     document: {order: ["user"], read: ["user", "guest"], review: ["user"],},
    //     email: { read: ["user", "guest"], send: ["user"] },
    //   }
  }
});
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.permissions {
  top: 0;
  padding: 3em;
  width: 100vw;
  height: 100vh;
  font-size: 62.5%;
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
  overflow-y: scroll;
  height: 75%;
}

table {
  text-align: left;
  overflow: hidden;
  box-shadow: 0 5px 10px #e1e5ee;
  border-radius: 3px;
  border: 1px solid #f2f2f2;
  overflow-y: scroll;
  border-collapse: collapse;
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

tbody tr {
  transition: transform 0.2s;
}

tbody tr:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
  /* cursor: pointer; */
  z-index: 1;
}

.action-btns{
  margin: 2em auto;
}

.action-btns button {
  padding: 1em 2em;
  border-radius: 0.5em;
  color: black;
  font-weight: bold;
  cursor: pointer;
  margin: 0 1em;
}

.submit {
  background-color: #DBF9B8;
  border: 2px solid #DBF9B8;

}

.reset {
  background-color: white;
  border: 2px solid #DBF9B8;
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
}

/* tr td:nth-child(2) {
  width: 100%;
} */
</style>
